"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PageLoader } from "../../components/PageLoader";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { fadeUp, staggerContainer, staggerItem, defaultViewport } from "../../lib/animations";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop";

export default function BlogsPage() {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    async function loadBlogs() {
      try {
        setLoading(true);
        const res = await fetch(`/api/blogs?status=Published`);
        if (res.ok) {
          const data = await res.json();
          setBlogs(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to load blogs:", err);
      } finally {
        setLoading(false);
      }
    }
    loadBlogs();
  }, []);

  const categories = ["All", ...Array.from(new Set(blogs.map((b) => b.category).filter(Boolean)))];

  const filteredBlogs = blogs.filter((b) => {
    const q = search.toLowerCase();
    const matchesSearch =
      b.title?.toLowerCase().includes(q) ||
      b.excerpt?.toLowerCase().includes(q) ||
      (b.tags || []).some((t) => t.toLowerCase().includes(q));
    const matchesCategory = activeCategory === "All" || b.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <PageLoader />;

  return (
    <div className="bg-[#F8FAF8] text-[#222222] min-h-screen overflow-x-hidden font-sans antialiased selection:bg-[#D9A321]/30 selection:text-[#0F9D6D]">
      <Header />

      {/* HERO */}
      <section className="relative pt-40 pb-16 sm:pt-44 sm:pb-20 bg-[#0F9D6D] text-white text-center px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top,white,transparent_60%)]" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl mx-auto space-y-5"
        >
          <span className="inline-block bg-white/10 border border-white/30 text-white text-xs font-bold tracking-[0.25em] px-5 py-2 rounded-full uppercase">
            Knowledge & News
          </span>
          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1]">
            Insights from Our Blog
          </h1>
          <p className="text-white/70 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-light">
            Guides, updates, and expert perspective on sandalwood farming, land investment, and sustainable agriculture.
          </p>
        </motion.div>
      </section>

      {/* FILTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D9A321]/40"
          />
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-colors ${
                  activeCategory === cat
                    ? "bg-[#0F9D6D] text-white"
                    : "bg-[#F8FAF8] text-gray-600 hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* BLOGS GRID */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6">
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-gray-500 text-sm">
                {blogs.length === 0
                  ? "No articles have been published yet. Please check back soon."
                  : "No articles match your search."}
              </p>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredBlogs.map((post) => (
                <motion.a
                  key={post._id}
                  href={`/blogs/${post.slug}`}
                  variants={staggerItem}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={post.image || FALLBACK_IMAGE}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                    />
                    {post.category && (
                      <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-[#0F9D6D] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-gray-100">
                        {post.category}
                      </span>
                    )}
                  </div>

                  <div className="p-6 space-y-3 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-[10px] text-gray-400 font-semibold tracking-wide">
                      {post.date && <span>{post.date}</span>}
                      {post.date && post.readTime && <span>•</span>}
                      {post.readTime && <span>{post.readTime}</span>}
                    </div>
                    <h3 className="font-playfair text-lg font-extrabold text-[#0F9D6D] leading-snug">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    <span className="mt-auto pt-3 text-xs font-bold text-[#D9A321] uppercase tracking-wider">
                      Read Blog →
                    </span>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        className="bg-[#0F9D6D] py-16 sm:py-20 text-center text-white px-4"
      >
        <h2 className="font-playfair text-3xl sm:text-4xl font-extrabold mb-4">
          Have Questions About Investing?
        </h2>
        <p className="text-white/70 text-sm max-w-xl mx-auto mb-8">
          Talk to our team or send us an enquiry and we'll get back to you shortly.
        </p>
        <a
          href="/contact"
          className="inline-block bg-[#D9A321] text-[#0F9D6D] hover:bg-white font-bold px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-all duration-300 text-xs uppercase tracking-wider"
        >
          Contact Us
        </a>
      </motion.section>

      <Footer />
    </div>
  );
}
