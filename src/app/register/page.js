"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { User, Mail, Link as LinkIcon, Lock, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Listen for the successful google sign in message from popup
    const handleGoogleMessage = (event) => {
      if (event.data?.type === "GOOGLE_SIGNIN_SUCCESS") {
        toast.success("Signed in with Google successfully!");
        router.push("/");
        router.refresh();
      }
    };

    window.addEventListener("message", handleGoogleMessage);
    return () => {
      window.removeEventListener("message", handleGoogleMessage);
    };
  }, [router]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    const loadToast = toast.loading("Creating your account...");

    await authClient.signUp.email(
      {
        email,
        password,
        name,
        image: photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
      },
      {
        onSuccess: () => {
          toast.dismiss(loadToast);
          toast.success("Account created successfully! Please sign in.");
          router.push("/login");
        },
        onError: (ctx) => {
          toast.dismiss(loadToast);
          toast.error(ctx.error.message || "Failed to create account. Email may already exist.");
          setLoading(false);
        },
      }
    );
  };

  const handleGoogleSignIn = () => {
    // Open the customized Google oauth popup window
    const width = 900;
    const height = 620;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      "/auth/google-sim",
      "Google Sign In",
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
    );
  };

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-base-200 via-base-100 to-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-200">
        <div className="card-body gap-6">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight font-sans">
              Create Account
            </h2>
            <p className="mt-2 text-sm text-base-content/70">
              Join BookSphere to start borrowing books.
            </p>
          </div>

          <form onSubmit={handleRegister} className="form-control gap-4">
            {/* Name */}
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
                  placeholder="John Doe"
                  className="input input-bordered w-full pl-10 rounded-xl"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email Address *</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="input input-bordered w-full pl-10 rounded-xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Photo URL */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Photo URL (Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <LinkIcon className="w-5 h-5" />
                </div>
                <input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  className="input input-bordered w-full pl-10 rounded-xl"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Password *</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input input-bordered w-full pl-10 rounded-xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className={`btn btn-primary rounded-xl mt-4 gap-2 shadow-md shadow-primary/20 ${
                loading ? "loading" : ""
              }`}
              disabled={loading}
            >
              {!loading && <UserPlus className="w-5 h-5" />}
              Register
            </button>
          </form>

          <div className="divider text-xs text-base-content/40">OR</div>

          {/* Social login */}
          <button
            onClick={handleGoogleSignIn}
            className="btn btn-outline rounded-xl flex items-center gap-2 border-base-300 hover:bg-base-200"
            disabled={loading}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" className="w-5 h-5 flex-shrink-0">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.87-2.6-2.3-4.53 0-6.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            SignUp with Google
          </button>

          <p className="text-center text-sm text-base-content/75 mt-2">
            Already have an account?{" "}
            <Link
              href="/login"
              className="link link-primary font-semibold hover:opacity-80"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
