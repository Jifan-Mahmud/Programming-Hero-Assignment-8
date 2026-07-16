"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ArrowRight, BookOpen, Star, ShieldCheck, Award, Zap, Sparkles } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedBooks() {
      try {
        const res = await fetch("/api/books");
        if (res.ok) {
          const data = await res.json();
          // Filter first 4 books as featured
          setBooks(data.slice(0, 4));
        }
      } catch (err) {
        console.error("Error fetching books:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeaturedBooks();
  }, []);

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* 1. HERO BANNER */}
      <section className="relative bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-base-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/15 text-secondary text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Digital Library</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Find Your Next <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Read</span>
            </h1>
            <p className="text-base-content/80 text-base sm:text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Unlock a universe of knowledge. Browse, search, and borrow hundreds of books instantly. Empower your learning journey with BookSphere today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <Link
                href="/books"
                className="btn btn-primary rounded-xl px-8 shadow-lg shadow-primary/20 gap-2 hover:scale-[1.02] transition-transform"
              >
                Browse Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#perks"
                className="btn btn-outline rounded-xl px-8 border-base-300 hover:bg-base-200"
              >
                Learn More
              </a>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-primary/25 rounded-full blur-[80px]"></div>
            {/* Styled Illustration Card */}
            <div className="relative card w-full max-w-md bg-base-100/40 backdrop-blur-xl border border-white/20 shadow-2xl p-6 rounded-2xl transform rotate-2 hover:rotate-0 transition-all duration-300">
              <div className="flex items-center justify-between pb-4 border-b border-base-200">
                <span className="font-bold text-sm text-base-content/60">Currently Trending</span>
                <span className="badge badge-primary badge-sm font-semibold">HOT</span>
              </div>
              <div className="flex gap-4 pt-4">
                <div className="w-24 h-36 bg-base-300 rounded-xl relative shadow-md overflow-hidden flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=200"
                    alt="Book Cover"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="font-bold text-lg leading-snug">Clean Code</h3>
                  <p className="text-sm text-base-content/70 mt-1">Robert C. Martin</p>
                  <div className="flex gap-1 items-center mt-2 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-xs font-semibold text-base-content/60 ml-1">(4.9)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SCROLLING MARQUEE */}
      <section className="bg-primary text-primary-content py-3 overflow-hidden font-medium relative z-10 shadow-md">
        <div className="flex animate-marquee whitespace-nowrap gap-8 text-sm sm:text-base">
          <span>New Arrivals: <b>Clean Code</b> by Robert C. Martin | Special 20% Discount on Scholar Memberships | Access 1000+ books online 24/7 | Borrow books with one click</span>
          <span>New Arrivals: <b>Clean Code</b> by Robert C. Martin | Special 20% Discount on Scholar Memberships | Access 1000+ books online 24/7 | Borrow books with one click</span>
        </div>
      </section>

      {/* 3. FEATURED BOOKS SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-base-100">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Featured Books
            </h2>
            <p className="text-base-content/75 max-w-lg mx-auto">
              Our top handpicked recommendations for you to start reading today.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="card bg-base-200 border border-base-300 shadow-md p-6 gap-4 animate-pulse">
                  <div className="w-full aspect-[2/3] bg-base-300 rounded-xl"></div>
                  <div className="h-4 bg-base-300 rounded-md w-3/4"></div>
                  <div className="h-4 bg-base-300 rounded-md w-1/2"></div>
                  <div className="h-10 bg-base-300 rounded-xl mt-2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true, dynamicBullets: true }}
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                  1280: { slidesPerView: 4 },
                }}
                className="pb-14"
              >
                {books.map((book) => (
                  <SwiperSlide key={book.id}>
                    <div className="card bg-base-100 border border-base-200 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 h-full flex flex-col justify-between overflow-hidden group">
                      {/* Image Frame */}
                      <div className="relative aspect-[2/3] bg-base-200 overflow-hidden">
                        <img
                          src={book.image_url}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute top-3 right-3">
                          <span className="badge badge-secondary shadow-sm font-semibold">{book.category}</span>
                        </div>
                      </div>

                      {/* Info & Action */}
                      <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                            {book.title}
                          </h3>
                          <p className="text-sm text-base-content/70 mt-1">by {book.author}</p>
                          <p className="text-xs text-base-content/65 mt-2 line-clamp-2 leading-relaxed">
                            {book.description}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2">
                          <div className="text-xs font-semibold text-base-content/80">
                            Available Copies: <span className="text-primary font-bold">{book.available_quantity}</span>
                          </div>
                          <Link
                            href={`/books/${book.id}`}
                            className="btn btn-primary btn-outline btn-sm rounded-lg mt-1 w-full"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>
      </section>

      {/* 4. EXTRA SECTION 1: INTERACTIVE STATS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-base-200 border-y border-base-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center p-6 bg-base-100 rounded-2xl shadow-sm border border-base-300/40">
            <div className="bg-primary/10 text-primary p-4 rounded-full mb-3">
              <BookOpen className="w-8 h-8" />
            </div>
            <span className="text-3xl font-extrabold">12+</span>
            <span className="text-sm font-semibold text-base-content/60 mt-1">Premium Genres</span>
          </div>

          <div className="flex flex-col items-center p-6 bg-base-100 rounded-2xl shadow-sm border border-base-300/40">
            <div className="bg-secondary/10 text-secondary p-4 rounded-full mb-3">
              <Star className="w-8 h-8" />
            </div>
            <span className="text-3xl font-extrabold">4.8k+</span>
            <span className="text-sm font-semibold text-base-content/60 mt-1">Active Borrowers</span>
          </div>

          <div className="flex flex-col items-center p-6 bg-base-100 rounded-2xl shadow-sm border border-base-300/40">
            <div className="bg-success/10 text-success p-4 rounded-full mb-3">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <span className="text-3xl font-extrabold">99.9%</span>
            <span className="text-sm font-semibold text-base-content/60 mt-1">Borrow Security</span>
          </div>

          <div className="flex flex-col items-center p-6 bg-base-100 rounded-2xl shadow-sm border border-base-300/40">
            <div className="bg-warning/10 text-warning p-4 rounded-full mb-3">
              <Award className="w-8 h-8" />
            </div>
            <span className="text-3xl font-extrabold">10k+</span>
            <span className="text-sm font-semibold text-base-content/60 mt-1">Digital Certificates</span>
          </div>
        </div>
      </section>

      {/* 5. EXTRA SECTION 2: MEMBERSHIP PLANS */}
      <section id="perks" className="py-20 px-4 sm:px-6 lg:px-8 bg-base-100">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Membership Perks
            </h2>
            <p className="text-base-content/75 max-w-lg mx-auto">
              Upgrade your account to support our digital collection and unlock extra borrowing limits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="card bg-base-200 border border-base-300 shadow-md hover:shadow-xl transition-all duration-300 p-8 rounded-2xl gap-6 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-xl">Free Reader</h3>
                <p className="text-sm text-base-content/75 mt-1">Perfect for casual reading.</p>
                <div className="text-3xl font-extrabold mt-4">$0 <span className="text-sm text-base-content/50">/ month</span></div>
                <div className="divider my-4"></div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span>Borrow up to 2 books concurrently</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span>Standard reading interface</span>
                  </li>
                </ul>
              </div>
              <button className="btn btn-outline btn-primary rounded-xl w-full">Current Plan</button>
            </div>

            {/* Scholar Plan (Featured) */}
            <div className="card bg-base-100 border-2 border-primary shadow-xl hover:shadow-2xl transition-all duration-300 p-8 rounded-2xl gap-6 flex flex-col justify-between relative transform scale-105">
              <div className="absolute top-0 right-8 -translate-y-1/2">
                <span className="badge badge-primary font-semibold text-xs py-2 px-3 shadow-md">POPULAR</span>
              </div>
              <div>
                <h3 className="font-extrabold text-xl text-primary">Library Scholar</h3>
                <p className="text-sm text-base-content/75 mt-1">Ideal for students & avid readers.</p>
                <div className="text-3xl font-extrabold mt-4">$4.99 <span className="text-sm text-base-content/50">/ month</span></div>
                <div className="divider my-4"></div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span>Borrow up to 8 books concurrently</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span>Ad-free distraction-free reader</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span>Early access to trending releases</span>
                  </li>
                </ul>
              </div>
              <button className="btn btn-primary rounded-xl w-full shadow-lg shadow-primary/20">Upgrade Now</button>
            </div>

            {/* Master Plan */}
            <div className="card bg-base-200 border border-base-300 shadow-md hover:shadow-xl transition-all duration-300 p-8 rounded-2xl gap-6 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-xl">Archive Master</h3>
                <p className="text-sm text-base-content/75 mt-1">For researchers & institutions.</p>
                <div className="text-3xl font-extrabold mt-4">$12.99 <span className="text-sm text-base-content/50">/ month</span></div>
                <div className="divider my-4"></div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span>Unlimited concurrent borrowing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span>Priority academic research support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span>Export notes and highlights in PDF/TXT</span>
                  </li>
                </ul>
              </div>
              <button className="btn btn-outline btn-primary rounded-xl w-full">Upgrade Now</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
