import Link from "next/link";
import { BookOpen, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral text-neutral-content pt-16 pb-8 border-t border-base-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Info Column */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-content p-2 rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold font-sans text-white">BookSphere</span>
          </div>
          <p className="text-neutral-content/75 max-w-sm text-sm leading-relaxed">
            BookSphere is a digital library platform dedicated to making reading accessible, secure, and modern. Explore thousands of fiction, tech, and science books from anywhere in the world.
          </p>
          <div className="flex gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-neutral-focus hover:bg-primary hover:text-primary-content transition-all"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="w-5 h-5">
                <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-neutral-focus hover:bg-primary hover:text-primary-content transition-all"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="w-5 h-5">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-neutral-focus hover:bg-primary hover:text-primary-content transition-all"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="w-5 h-5">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Links Column */}
        <div className="space-y-4">
          <h3 className="text-white font-bold text-lg">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            </li>
            <li>
              <Link href="/books" className="hover:text-primary transition-colors">All Books</Link>
            </li>
            <li>
              <Link href="/profile" className="hover:text-primary transition-colors">My Profile</Link>
            </li>
          </ul>
        </div>

        {/* Contact Us Column */}
        <div className="space-y-4">
          <h3 className="text-white font-bold text-lg" id="contact">Contact Us</h3>
          <ul className="space-y-3 text-sm text-neutral-content/90">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              <span>support@booksphere.com</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              <span>+1 (555) 019-2834</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span>100 Library Plaza, NY 10001</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-neutral-focus text-center text-xs text-neutral-content/50">
        <p>&copy; {new Date().getFullYear()} BookSphere. All rights reserved. Digitizing reading, page by page.</p>
      </div>
    </footer>
  );
}

