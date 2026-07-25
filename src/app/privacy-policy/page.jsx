"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PageLoader } from "../../components/PageLoader";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";

export default function PrivacyPolicyPage() {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(null);

  useEffect(() => {
    let active = true;
    fetch("/api/legal?type=privacy-policy")
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        setPage(data);
        if (data?.title) {
          document.title = `${data.title} | Chandan Valley Farms`;
        }
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="bg-[#F8FAF8] text-[#222222] min-h-screen overflow-x-hidden font-sans antialiased">
      <Header />

      <section className="py-16 sm:py-20 lg:py-24 bg-[#0F9D6D] text-white text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-playfair text-3xl sm:text-4xl md:text-5xl font-extrabold"
        >
          {page?.title || "Privacy Policy"}
        </motion.h1>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed [&_h2]:font-playfair [&_h2]:text-[#0F9D6D] [&_h2]:font-extrabold [&_h3]:font-playfair [&_h3]:text-[#0F9D6D] [&_h3]:font-bold [&_a]:text-[#D9A321]"
            dangerouslySetInnerHTML={{ __html: page?.content || "" }}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}
