"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { PageLoader } from "../../../components/PageLoader";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { fadeUp, defaultViewport } from "../../../lib/animations";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop";

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params?.slug;

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (!slug) return;
    async function loadBlog() {
      try {
        setLoading(true);
        setNotFound(false);
        const res = await fetch(`/api/blogs/${slug}`);
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setBlog(data.blog);
          setRelated(data.related || []);
          if (data.blog?.title) {
            document.title = `${data.blog.title} | Chandan Valley Farms`;
          }
        }
      } catch (err) {
        console.error("Failed to load blog:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    loadBlog();
  }, [slug]);

  if (loading) return <PageLoader />;

  if (notFound || !blog) {
    return (
      <div className="bg-[#F8FAF8] min-h-screen font-sans">
        <Header />
        <div className="max-w-3xl mx-auto px-6 py-32 text-center space-y-6">
          <h1 className="font-playfair text-3xl sm:text-4xl font-extrabold text-[#0F9D6D]">
            Article Not Found
          </h1>
          <p className="text-gray-500 text-sm">
            The article you're looking for doesn't exist or may have been unpublished.
          </p>
          <a
            href="/blogs"
            className="inline-block bg-[#0F9D6D] text-white hover:bg-[#12B886] font-bold px-6 py-3 rounded-full text-xs uppercase tracking-wider"
          >
            Back to Blogs
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAF8] text-[#222222] min-h-screen overflow-x-hidden font-sans antialiased">
      <Header />

      {/* HERO */}
      <section className="relative h-[50vh] min-h-[380px] flex items-end text-white overflow-hidden px-6 pt-20 pb-12">
        <div className="absolute inset-0 z-0">
          <img
            src={blog.image || FALLBACK_IMAGE}
            alt={blog.title}
            className="w-full h-full object-cover filter brightness-[0.4]"
            onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto w-full space-y-4"
        >
          {blog.category && (
            <span className="inline-block bg-[#D9A321] text-[#0F9D6D] text-xs font-bold tracking-widest px-4 py-1.5 rounded-full uppercase">
              {blog.category}
            </span>
          )}
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            {blog.title}
          </h1>
          <div className="flex items-center gap-3 text-xs text-white/70 font-semibold">
            {blog.date && <span>{blog.date}</span>}
            {blog.date && blog.readTime && <span>•</span>}
            {blog.readTime && <span>{blog.readTime}</span>}
          </div>
        </motion.div>
      </section>

      {/* CONTENT */}
      <section className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-lg mb-10"
          >
            <img
              src={blog.image || FALLBACK_IMAGE}
              alt={blog.title}
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
            />
          </motion.div>

          {blog.excerpt && (
            <p className="text-lg text-gray-600 font-medium leading-relaxed mb-8 italic border-l-4 border-[#D9A321] pl-5">
              {blog.excerpt}
            </p>
          )}

          <div
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed [&_h2]:font-playfair [&_h2]:text-[#0F9D6D] [&_h2]:font-extrabold [&_h3]:font-playfair [&_h3]:text-[#0F9D6D] [&_h3]:font-bold [&_a]:text-[#D9A321]"
            dangerouslySetInnerHTML={{ __html: blog.content || "" }}
          />

          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-gray-200">
              {blog.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs font-semibold text-[#0F9D6D] bg-[#F8FAF8] border border-gray-200 px-3 py-1.5 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-10 pt-8 border-t border-gray-200">
            <a
              href="/blogs"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#0F9D6D] hover:text-[#D9A321] transition-colors"
            >
              ← Back to all articles
            </a>
          </div>
        </div>
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="py-16 sm:py-20 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6">
            <h2 className="font-playfair text-2xl sm:text-3xl font-extrabold text-[#0F9D6D] mb-10 text-center">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((post) => (
                <a
                  key={post._id}
                  href={`/blogs/${post.slug}`}
                  className="bg-[#F8FAF8] rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={post.image || FALLBACK_IMAGE}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                    />
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-playfair text-base font-extrabold text-[#0F9D6D] leading-snug">
                      {post.title}
                    </h3>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        className="bg-[#0F9D6D] py-16 sm:py-20 text-center text-white px-4"
      >
        <h2 className="font-playfair text-3xl sm:text-4xl font-extrabold mb-4">
          Ready to Own Your Sandalwood Legacy?
        </h2>
        <a
          href="/contact"
          className="inline-block bg-[#D9A321] text-[#0F9D6D] hover:bg-white font-bold px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-all duration-300 text-xs uppercase tracking-wider"
        >
          Schedule Site Visit
        </a>
      </motion.section>

      <Footer />
    </div>
  );
}
