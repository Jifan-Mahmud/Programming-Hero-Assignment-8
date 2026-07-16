"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { User, Mail, Calendar, Edit3, Library, BookOpen, Clock } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loadingBorrows, setLoadingBorrows] = useState(true);
  const [returnPending, setReturnPending] = useState(false);

  // Private Route check
  useEffect(() => {
    if (!sessionPending && !session) {
      toast.error("Access Denied: Please log in to view your profile.");
      router.push("/login?redirect=/profile");
    }
  }, [session, sessionPending, router]);

  // Fetch user's borrowed books
  useEffect(() => {
    if (!session) return;

    async function fetchBorrowedBooks() {
      try {
        const res = await fetch("/api/books/borrowed");
        if (res.ok) {
          const data = await res.json();
          setBorrowedBooks(data);
        }
      } catch (err) {
        console.error("Error fetching borrowed books:", err);
      } finally {
        setLoadingBorrows(false);
      }
    }

    fetchBorrowedBooks();
  }, [session]);

  if (sessionPending || !session) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24 gap-4 bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-sm font-semibold text-base-content/60">Securing environment & loading profile...</p>
      </div>
    );
  }

  const handleReturn = async (bookId, bookTitle) => {
    setReturnPending(true);
    const loadToast = toast.loading(`Returning "${bookTitle}"...`);

    try {
      const res = await fetch("/api/books/return", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookId }),
      });

      const data = await res.json();
      toast.dismiss(loadToast);

      if (res.ok) {
        toast.success(`Successfully returned "${bookTitle}"!`);
        // Remove book from active list
        setBorrowedBooks((prev) => prev.filter((b) => b.bookId !== bookId));
      } else {
        toast.error(data.error || "Failed to return book.");
      }
    } catch (err) {
      toast.dismiss(loadToast);
      console.error(err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setReturnPending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow flex flex-col gap-10">
      {/* 1. Profile User Card */}
      <div className="card bg-gradient-to-br from-base-200 via-base-100 to-base-200 border border-base-200 shadow-xl overflow-hidden rounded-3xl">
        <div className="card-body p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 justify-between">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            {/* Avatar Frame */}
            <div className="avatar">
              <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden bg-base-300">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${session.user.name}`;
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-primary text-primary-content flex items-center justify-center text-3xl font-bold">
                    {session.user.name ? session.user.name[0].toUpperCase() : "U"}
                  </div>
                )}
              </div>
            </div>

            {/* Info Fields */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">
                {session.user.name}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-base-content/75">
                <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>{session.user.email}</span>
                </div>
                <div className="hidden sm:block text-base-content/30">|</div>
                <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                  <Calendar className="w-4 h-4 text-secondary" />
                  <span>Member since {new Date(session.user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <Link
            href="/profile/update"
            className="btn btn-primary btn-sm sm:btn-md rounded-xl gap-2 shadow-md shadow-primary/20 flex-shrink-0"
          >
            <Edit3 className="w-4 h-4" />
            Update Information
          </Link>
        </div>
      </div>

      {/* 2. Borrowed Books List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-extrabold flex items-center gap-2 border-b border-base-200 pb-3 font-sans">
          <Clock className="w-6 h-6 text-primary" />
          My Borrowed Books
        </h2>

        {loadingBorrows ? (
          <div className="flex justify-center items-center py-12">
            <span className="loading loading-spinner loading-md text-primary"></span>
          </div>
        ) : borrowedBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-base-300 rounded-3xl p-6 bg-base-200/50">
            <Library className="w-16 h-16 text-base-content/40 mb-3" />
            <h3 className="text-xl font-bold">No borrowed books</h3>
            <p className="text-sm text-base-content/70 max-w-sm mt-1">
              You haven&apos;t borrowed any titles yet. Explore our digital collection to find your next favorite read!
            </p>
            <Link href="/books" className="btn btn-primary rounded-xl btn-sm mt-4">
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {borrowedBooks.map((borrow) => (
              <div
                key={borrow.bookId}
                className="card card-side bg-base-100 border border-base-200 shadow-md hover:shadow-lg transition-all rounded-2xl overflow-hidden h-40"
              >
                {/* Book Cover Cover */}
                <figure className="w-[30%] bg-base-200 h-full flex-shrink-0 relative">
                  <img
                    src={borrow.image_url}
                    alt={borrow.bookTitle}
                    className="w-full h-full object-cover"
                  />
                </figure>

                {/* Details and return action */}
                <div className="p-4 w-[70%] flex flex-col justify-between h-full">
                  <div className="space-y-1">
                    <span className="badge badge-secondary badge-xs font-semibold">{borrow.category}</span>
                    <h3 className="font-bold text-sm sm:text-base line-clamp-1 leading-snug">
                      {borrow.bookTitle}
                    </h3>
                    <p className="text-xs text-base-content/70">by {borrow.author}</p>
                    <p className="text-[10px] text-base-content/50 pt-1 leading-none">
                      Borrowed: {new Date(borrow.borrowedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/books/${borrow.bookId}`}
                      className="btn btn-outline btn-xs rounded-md flex-1 text-center font-medium"
                    >
                      Details
                    </Link>
                    <button
                      onClick={() => handleReturn(borrow.bookId, borrow.bookTitle)}
                      className="btn btn-error btn-xs rounded-md flex-1 text-center text-white"
                      disabled={returnPending}
                    >
                      Return
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
