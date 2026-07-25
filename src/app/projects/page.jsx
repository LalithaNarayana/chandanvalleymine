"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PageLoader } from "../../components/PageLoader";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { fadeUp, staggerContainer, staggerItem, defaultViewport } from "../../lib/animations";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop";

export default function ProjectsPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [projRes, catRes] = await Promise.all([
          fetch(`/api/projects?status=Published`),
          fetch(`/api/project-categories`),
        ]);
        if (projRes.ok) {
          const data = await projRes.json();
          setProjects(Array.isArray(data) ? data : []);
        }
        if (catRes.ok) {
          const data = await catRes.json();
          setCategories(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to load projects:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredProjects = projects.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      p.title?.toLowerCase().includes(q) ||
      p.location?.toLowerCase().includes(q) ||
      p.tagline?.toLowerCase().includes(q);

    const matchesCategory =
      activeCategory === "all" ||
      (p.category && (p.category._id === activeCategory || p.category.slug === activeCategory));

    return matchesSearch && matchesCategory;
  });

  if (loading) return <PageLoader />;

  return (
    <div className="bg-[#F8FAF8] text-[#222222] min-h-screen overflow-x-hidden font-sans antialiased selection:bg-[#D9A321]/30 selection:text-[#0F9D6D]">
      <Header />

      {/* HERO */}
      <section className="relative h-[55vh] min-h-[420px] flex items-center justify-center text-white overflow-hidden px-6 pt-20 text-center">
        <div className="absolute inset-0 z-0">
          <img
            src={FALLBACK_IMAGE}
            alt="Chandan Valley Farm Plots"
            className="w-full h-full object-cover filter brightness-[0.4]"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl space-y-5"
        >
          <span className="inline-block bg-white/10 border border-white/30 text-white text-xs font-bold tracking-[0.25em] px-5 py-2 rounded-full uppercase">
            Our Projects
          </span>
          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1]">
            Sandalwood Farm Plots
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-light">
            Explore our gated, legally-clear sandalwood farm plot developments across Chandan Valley.
          </p>
        </motion.div>
      </section>

      {/* SEARCH + CATEGORY FILTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-5 space-y-4">
          <input
            type="text"
            placeholder="Search by project name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F9D6D]/40"
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-colors ${
                activeCategory === "all"
                  ? "bg-[#0F9D6D] text-white shadow-md"
                  : "bg-[#F8FAF8] text-[#0F9D6D] hover:bg-[#0F9D6D]/10"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setActiveCategory(cat._id)}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-colors ${
                  activeCategory === cat._id
                    ? "bg-[#0F9D6D] text-white shadow-md"
                    : "bg-[#F8FAF8] text-[#0F9D6D] hover:bg-[#0F9D6D]/10"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS GRID */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-gray-500 text-sm">
                {projects.length === 0
                  ? "No projects have been published yet. Please check back soon."
                  : "No projects match your search."}
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
              {filteredProjects.map((project) => (
                <motion.div
                  key={project._id}
                  variants={staggerItem}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <a href={`/projects/${project.slug}`} className="relative aspect-[4/3] overflow-hidden block">
                    <img
                      src={project.image || FALLBACK_IMAGE}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                    />
                    {project.featured && (
                      <span className="absolute top-4 left-4 bg-[#D9A321] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                    {project.category?.name && (
                      <span className="absolute top-4 right-4 bg-white/90 text-[#0F9D6D] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                        {project.category.name}
                      </span>
                    )}
                  </a>

                  <div className="p-6 flex flex-col flex-1 space-y-4">
                    <div className="space-y-1">
                      <a href={`/projects/${project.slug}`}>
                        <h3 className="font-playfair text-xl font-extrabold text-[#0F9D6D] hover:text-[#12B886] transition-colors">
                          {project.title}
                        </h3>
                      </a>
                      {project.tagline && (
                        <p className="text-xs text-gray-500">{project.tagline}</p>
                      )}
                    </div>

                    {project.location && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <svg className="w-4 h-4 text-[#D9A321]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {project.location}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 text-xs border-t border-gray-100 pt-4">
                      {project.plotSize && (
                        <div>
                          <p className="text-gray-400 uppercase tracking-wide text-[10px] font-bold">Plot Size</p>
                          <p className="font-semibold text-[#0F9D6D]">{project.plotSize}</p>
                        </div>
                      )}
                      {project.price && (
                        <div>
                          <p className="text-gray-400 uppercase tracking-wide text-[10px] font-bold">Price</p>
                          <p className="font-semibold text-[#0F9D6D]">{project.price}</p>
                        </div>
                      )}
                      {project.area && (
                        <div>
                          <p className="text-gray-400 uppercase tracking-wide text-[10px] font-bold">Area</p>
                          <p className="font-semibold text-[#0F9D6D]">{project.area}</p>
                        </div>
                      )}
                      {project.expectedRoi && (
                        <div>
                          <p className="text-gray-400 uppercase tracking-wide text-[10px] font-bold">Expected ROI</p>
                          <p className="font-semibold text-[#0F9D6D]">{project.expectedRoi}</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-auto flex gap-2">
                      <a
                        href={`/projects/${project.slug}`}
                        className="flex-1 text-center bg-[#F8FAF8] border border-[#0F9D6D]/30 text-[#0F9D6D] hover:bg-[#0F9D6D]/10 font-bold px-4 py-3 rounded-full text-xs uppercase tracking-wider transition-colors"
                      >
                        View Details
                      </a>
                      <a
                        href={project.btnUrl || "/contact"}
                        className="flex-1 text-center bg-[#0F9D6D] text-white hover:bg-[#12B886] font-bold px-4 py-3 rounded-full text-xs uppercase tracking-wider shadow-md transition-colors"
                      >
                        {project.btnText || "Schedule Site Visit"}
                      </a>
                    </div>
                  </div>
                </motion.div>
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
          Ready to Own Your Sandalwood Legacy?
        </h2>
        <p className="text-white/70 text-sm max-w-xl mx-auto mb-8">
          Schedule a site visit or speak to our investment advisors to find the right plot for you.
        </p>
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
