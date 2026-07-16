"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { User, Image as ImageIcon, Save, ArrowLeft } from "lucide-react";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [updating, setUpdating] = useState(false);

  // Private Route check
  useEffect(() => {
    if (!sessionPending && !session) {
      toast.error("Access Denied: Please log in to edit profile info.");
      router.push("/login?redirect=/profile/update");
    }
  }, [session, sessionPending, router]);

  // Pre-fill user data
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setImage(session.user.image || "");
    }
  }, [session]);

  if (sessionPending || !session) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24 gap-4 bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-sm font-semibold text-base-content/60">Securing environment & loading data...</p>
      </div>
    );
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Full Name cannot be empty.");
      return;
    }

    setUpdating(true);
    const loadToast = toast.loading("Updating your profile information...");

    await authClient.updateUser(
      {
        name: name.trim(),
        image: image.trim(),
      },
      {
        onSuccess: () => {
          toast.dismiss(loadToast);
          toast.success("Profile updated successfully!");
          router.push("/profile");
          router.refresh();
        },
        onError: (ctx) => {
          toast.dismiss(loadToast);
          toast.error(ctx.error.message || "Failed to update profile. Please try again.");
          setUpdating(false);
        },
      }
    );
  };

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-base-200 via-base-100 to-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-200">
        <div className="card-body gap-6">
          {/* Back button */}
          <div>
            <Link
              href="/profile"
              className="btn btn-ghost btn-xs rounded-lg gap-1 hover:bg-base-200 pl-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Profile
            </Link>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight font-sans">
              Update Profile
            </h2>
            <p className="mt-2 text-sm text-base-content/70">
              Modify your screen name and profile avatar URL.
            </p>
          </div>

          <form onSubmit={handleUpdate} className="form-control gap-4">
            {/* Name Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Full Name *</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Full name"
                  className="input input-bordered w-full pl-10 rounded-xl"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={updating}
                  required
                />
              </div>
            </div>

            {/* Image URL Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Avatar Image URL</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <input
                  type="url"
                  placeholder="https://example.com/image.png"
                  className="input input-bordered w-full pl-10 rounded-xl"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  disabled={updating}
                />
              </div>
            </div>

            {/* Preview Section */}
            {image && (
              <div className="flex flex-col items-center gap-2 pt-2">
                <span className="text-xs font-semibold text-base-content/50">Avatar Preview</span>
                <div className="avatar">
                  <div className="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden bg-base-300">
                    <img
                      src={image}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              className={`btn btn-primary rounded-xl mt-4 gap-2 shadow-md shadow-primary/20 ${
                updating ? "loading" : ""
              }`}
              disabled={updating}
            >
              {!updating && <Save className="w-5 h-5" />}
              Update Information
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
