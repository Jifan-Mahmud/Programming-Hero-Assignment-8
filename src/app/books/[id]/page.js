"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { ArrowLeft, BookOpen, User, Tag, Calendar, AlertTriangle, CheckCircle } from "lucide-react";

export default function BookDetailsPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();

  const [book, setBook] = useState(null);
  const [bookLoading, setBookLoading] = useState(true);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [borrowPending, setBorrowPending] = useState(false);

  // Private Route check
  useEffect(() => {
    if (!sessionPending && !session) {
      toast.error("Access Denied: Please log in to view book details.");
      router.push(`/login?redirect=/books/${id}`);
    }
  }, [session, sessionPending, router, id]);

  // Fetch book details & user's current borrows
  useEffect(() => {
    if (!session) return;

    async function loadBookData() {
      try {
        const [bookRes, borrowsRes] = await Promise.all([
          fetch(`/api/books/${id}`),
          fetch("/api/books/borrowed"),
        ]);

        if (bookRes.ok) {
          const bookData = await bookRes.json();
          setBook(bookData);
        } else {
          toast.error("Book not found.");
          router.push("/books");
        }

        if (borrowsRes.ok) {
          const borrowsData = await borrowsRes.json();
          setBorrowedBooks(borrowsData);
        }
      } catch (err) {
        console.error("Error loading details:", err);
        toast.error("Failed to load details.");
      } finally {
        setBookLoading(false);
      }
    }

    loadBookData();
  }, [id, session, router]);

  if (sessionPending || !session || bookLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24 gap-4 bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-sm font-semibold text-base-content/60">Securing environment & loading title...</p>
      </div>
    );
  }

  if (!book) return null;

  const isAlreadyBorrowed = borrowedBooks.some((b) => b.bookId === book.id);
  const isOutOfStock = book.available_quantity <= 0;

  const handleBorrow = async () => {
    setBorrowPending(true);
    const loadToast = toast.loading("Processing your borrow request...");

    try {
      const res = await fetch("/api/books/borrow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookId: book.id }),
      });

      const data = await res.json();
      toast.dismiss(loadToast);

      if (res.ok) {
        toast.success(`Successfully borrowed "${book.title}"! Enjoy reading.`);
        // Update local states
        setBook((prev) => ({
          ...prev,
          available_quantity: prev.available_quantity - 1,
        }));
        setBorrowedBooks((prev) => [...prev, { bookId: book.id }]);
      } else {
        toast.error(data.error || "Failed to borrow book.");
      }
    } catch (err) {
      toast.dismiss(loadToast);
      console.error(err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setBorrowPending(false);
    }
  };

  const handleReturn = async () => {
    setBorrowPending(true);
    const loadToast = toast.loading("Processing your return request...");

    try {
      const res = await fetch("/api/books/return", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookId: book.id }),
      });

      const data = await res.json();
      toast.dismiss(loadToast);

      if (res.ok) {
        toast.success(`Successfully returned "${book.title}"!`);
        // Update local states
        setBook((prev) => ({
          ...prev,
          available_quantity: prev.available_quantity + 1,
        }));
        setBorrowedBooks((prev) => prev.filter((b) => b.bookId !== book.id));
      } else {
        toast.error(data.error || "Failed to return book.");
      }
    } catch (err) {
      toast.dismiss(loadToast);
      console.error(err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setBorrowPending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow flex flex-col gap-6">
      {/* Back Button */}
      <div>
        <Link
          href="/books"
          className="btn btn-ghost btn-sm rounded-xl gap-1 hover:bg-base-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Link>
      </div>

      {/* Main Details Card */}
      <div className="card lg:card-side bg-base-100 border border-base-200 shadow-2xl overflow-hidden rounded-3xl">
        {/* Left Column: Large Book Cover */}
        <figure className="lg:w-[40%] bg-base-200 aspect-[3/4] relative flex-shrink-0">
          <img
            src={book.image_url}
            alt={book.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4">
            <span className="badge badge-secondary badge-lg shadow-md font-semibold px-4 py-3">
              {book.category}
            </span>
          </div>
        </figure>

        {/* Right Column: Book Details */}
        <div className="card-body lg:w-[60%] p-8 justify-between gap-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-sans leading-tight">
                {book.title}
              </h1>
              <p className="text-lg font-medium text-base-content/80 mt-1 flex items-center gap-1.5">
                <User className="w-5 h-5 text-primary" />
                by {book.author}
              </p>
            </div>

            {/* Badges / Stats row */}
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="badge badge-outline border-base-300 py-3.5 px-4 rounded-xl gap-1.5">
                <Tag className="w-4 h-4 text-secondary" />
                <span className="text-xs font-semibold text-base-content/85">Genre: {book.category}</span>
              </div>
              <div className="badge badge-outline border-base-300 py-3.5 px-4 rounded-xl gap-1.5">
                <Calendar className="w-4 h-4 text-accent" />
                <span className="text-xs font-semibold text-base-content/85">Digital Copy</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-lg text-base-content/90 border-b border-base-200 pb-2">
                Synopsis
              </h3>
              <p className="text-base-content/80 text-sm sm:text-base leading-relaxed">
                {book.description}
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-base-200">
            {/* Availability Indicator */}
            <div className="flex items-center gap-2">
              {isOutOfStock ? (
                <div className="flex items-center gap-1.5 text-error font-semibold text-sm">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Out of stock - Check back later</span>
                </div>
              ) : isAlreadyBorrowed ? (
                <div className="flex items-center gap-1.5 text-success font-semibold text-sm">
                  <CheckCircle className="w-5 h-5" />
                  <span>Currently borrowed (You have this book)</span>
                </div>
              ) : (
                <div className="text-sm font-semibold text-base-content/85">
                  Available Quantity:{" "}
                  <span className="text-primary font-bold text-base">
                    {book.available_quantity} copies left
                  </span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              {isAlreadyBorrowed ? (
                <button
                  onClick={handleReturn}
                  className="btn btn-error rounded-xl flex-1 gap-2 shadow-lg shadow-error/20"
                  disabled={borrowPending}
                >
                  Return This Book
                </button>
              ) : (
                <button
                  onClick={handleBorrow}
                  className={`btn btn-primary rounded-xl flex-1 gap-2 shadow-lg shadow-primary/20`}
                  disabled={isOutOfStock || borrowPending}
                >
                  {isOutOfStock ? "Out of Stock" : "Borrow This Book"}
                </button>
              )}
              <Link
                href="/books"
                className="btn btn-outline border-base-300 rounded-xl px-6"
              >
                Back to Catalog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
