"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BookOpen, User, LogOut, LogIn, Menu, X, Sun, Moon } from "lucide-react";

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState("cupcake");

  // Load and apply theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "cupcake";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "cupcake" ? "dim" : "cupcake";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    toast.success(`Switched to ${nextTheme === "cupcake" ? "Light" : "Dark"} Mode!`, {
      id: "theme-toggle",
    });
  };

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Successfully logged out!");
          router.push("/");
          router.refresh();
        },
        onError: () => {
          toast.error("Logout failed. Please try again.");
        },
      },
    });
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "All Books", href: "/books" },
    { name: "My Profile", href: "/profile" },
  ];

  return (
    <div className="sticky top-0 z-50 backdrop-blur-md bg-base-100/80 border-b border-base-200">
      <div className="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[4rem]">
        {/* Left: Logo */}
        <div className="navbar-start">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight hover:opacity-90">
            <div className="bg-primary text-primary-content p-2 rounded-xl shadow-md shadow-primary/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-extrabold font-sans">
              BookSphere
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <div className="navbar-center hidden md:flex">
          <ul className="menu menu-horizontal px-1 gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      isActive
                        ? "bg-primary text-primary-content shadow-sm hover:text-primary-content"
                        : "hover:bg-base-200"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right: Actions */}
        <div className="navbar-end gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle text-base-content/80 hover:text-base-content"
            aria-label="Toggle Theme"
          >
            {theme === "cupcake" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          {/* Session logic */}
          {isPending ? (
            <div className="h-10 w-24 bg-base-300 animate-pulse rounded-lg hidden sm:block"></div>
          ) : session?.user ? (
            <div className="flex items-center gap-3">
              {/* User badge */}
              <div className="flex items-center gap-2 bg-base-200 px-3 py-1.5 rounded-full border border-base-300">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name}
                    className="w-6 h-6 rounded-full object-cover border border-primary/20"
                    onError={(e) => {
                      e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${session.user.name}`;
                    }}
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-content flex items-center justify-center text-xs font-bold">
                    {session.user.name ? session.user.name[0].toUpperCase() : "U"}
                  </div>
                )}
                <span className="text-sm font-semibold hidden md:inline truncate max-w-[100px]">
                  {session.user.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-outline btn-error btn-sm rounded-lg flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="btn btn-primary btn-sm md:btn-md rounded-lg flex items-center gap-1.5 shadow-md shadow-primary/20"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="btn btn-ghost btn-circle md:hidden"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden border-t border-base-200 bg-base-100 shadow-xl py-4 px-6 absolute left-0 right-0 top-[4rem] flex flex-col gap-4 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`py-3 px-4 rounded-xl font-medium transition-all ${
                  isActive ? "bg-primary text-primary-content" : "hover:bg-base-200"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
