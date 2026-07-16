"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Library, BookOpen, Layers, Star } from "lucide-react";

export default function AllBooksPage() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // Fetch books on mount
  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await fetch("/api/books");
        if (res.ok) {
          const data = await res.json();
          setBooks(data);
          setFilteredBooks(data);
        }
      } catch (err) {
        console.error("Error fetching books:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  // Filter books dynamically based on search query and category selection
  useEffect(() => {
    let result = books;

    // Apply category filter
    if (selectedCategory !== "All") {
      result = result.filter(
        (book) => book.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Apply search filter
    if (searchQuery.trim() !== "") {
      result = result.filter((book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBooks(result);
  }, [searchQuery, selectedCategory, books]);

  const categories = ["All", "Story", "Tech", "Science"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow flex flex-col gap-8">
      {/* Header Info */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-sans">
          Library Catalog
        </h1>
        <p className="text-sm sm:text-base text-base-content/70">
          Discover new releases, research journals, and your favorite literature.
        </p>
      </div>

      {/* Large Search Bar */}
      <div className="form-control w-full relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/50">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Search books by title..."
          className="input input-bordered w-full pl-12 py-6 rounded-2xl shadow-sm focus:shadow-md text-base transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Category Filter Sidebar (Desktop) and Pill Selector (Mobile) */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="hidden lg:flex flex-col bg-base-200 border border-base-300 rounded-2xl p-5 space-y-4">
            <h2 className="font-extrabold text-lg flex items-center gap-2 border-b border-base-300 pb-3">
              <Layers className="w-5 h-5 text-primary" />
              Categories
            </h2>
            <div className="flex flex-col gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`btn btn-sm justify-start rounded-xl py-2.5 h-auto text-left font-medium transition-all ${
                    selectedCategory === cat
                      ? "btn-primary shadow-sm text-primary-content"
                      : "btn-ghost hover:bg-base-300"
                  }`}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Category Horizontal Scrollbar */}
          <div className="flex lg:hidden overflow-x-auto gap-2 pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn btn-sm rounded-full whitespace-nowrap font-semibold ${
                  selectedCategory === cat
                    ? "btn-primary text-primary-content"
                    : "btn-outline border-base-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Book Cards Grid */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="card bg-base-200 border border-base-300 shadow-md p-6 gap-4 animate-pulse"
                >
                  <div className="w-full aspect-[2/3] bg-base-300 rounded-xl"></div>
                  <div className="h-4 bg-base-300 rounded-md w-3/4"></div>
                  <div className="h-4 bg-base-300 rounded-md w-1/2"></div>
                  <div className="h-10 bg-base-300 rounded-xl mt-2"></div>
                </div>
              ))}
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-base-300 rounded-3xl p-6 bg-base-200/50">
              <Library className="w-16 h-16 text-base-content/40 mb-3" />
              <h3 className="text-xl font-bold">No books found</h3>
              <p className="text-sm text-base-content/75 max-w-sm mt-1">
                We couldn&apos;t find any books matching &quot;{searchQuery}&quot; in the &quot;{selectedCategory}&quot; category.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="btn btn-primary rounded-xl btn-sm mt-4"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="card bg-base-100 border border-base-200 shadow-md hover:shadow-lg hover:scale-[1.01] transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div className="relative aspect-[2/3] bg-base-200 overflow-hidden">
                    <img
                      src={book.image_url}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="badge badge-secondary shadow-sm font-semibold">
                        {book.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-lg leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-sm text-base-content/70">by {book.author}</p>
                      <p className="text-xs text-base-content/65 line-clamp-2 mt-2 leading-relaxed">
                        {book.description}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="text-xs font-semibold text-base-content/85">
                        Available Stock:{" "}
                        <span
                          className={`font-bold ${
                            book.available_quantity > 0
                              ? "text-primary"
                              : "text-error"
                          }`}
                        >
                          {book.available_quantity > 0
                            ? `${book.available_quantity} copies left`
                            : "Out of Stock"}
                        </span>
                      </div>
                      <Link
                        href={`/books/${book.id}`}
                        className="btn btn-primary btn-sm rounded-lg mt-1 w-full"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
