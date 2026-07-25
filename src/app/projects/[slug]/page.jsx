"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PageLoader } from "../../../components/PageLoader";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { fadeUp, defaultViewport } from "../../../lib/animations";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop";

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params?.slug;

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [project, setProject] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    if (!slug) return;
    async function loadProject() {
      try {
        setLoading(true);
        setNotFound(false);
        const res = await fetch(`/api/projects/${slug}`);
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setProject(data);
          if (data?.title) {
            document.title = `${data.title} | Chandan Valley Farms`;
          }
        }
      } catch (err) {
        console.error("Failed to load project:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [slug]);

  if (loading) return <PageLoader />;

  if (notFound || !project) {
    return (
      <div className="bg-[#F8FAF8] min-h-screen font-sans">
        <Header />
        <div className="max-w-3xl mx-auto px-6 py-32 text-center space-y-6">
          <h1 className="font-playfair text-3xl sm:text-4xl font-extrabold text-[#0F9D6D]">
            Project Not Found
          </h1>
          <p className="text-gray-500 text-sm">The project you're looking for doesn't exist or may have been removed.</p>
          <a
            href="/projects"
            className="inline-block bg-[#0F9D6D] text-white hover:bg-[#12B886] font-bold px-6 py-3 rounded-full text-xs uppercase tracking-wider"
          >
            Back to Projects
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  const gallery = project.images && project.images.length > 0 ? project.images : (project.image ? [project.image] : []);

  const showPrev = () => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + gallery.length) % gallery.length));
  };
  const showNext = () => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % gallery.length));
  };

  return (
    <div className="bg-[#F8FAF8] text-[#222222] min-h-screen overflow-x-hidden font-sans antialiased">
      <Header />

      {/* HERO */}
      <section className="relative h-[55vh] min-h-[420px] flex items-end text-white overflow-hidden px-6 pt-20 pb-12">
        <div className="absolute inset-0 z-0">
          <img
            src={project.image || FALLBACK_IMAGE}
            alt={project.title}
            className="w-full h-full object-cover filter brightness-[0.45]"
            onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto w-full space-y-3"
        >
          <div className="flex items-center gap-3">
            {project.category?.name && (
              <span className="inline-block bg-[#D9A321] text-[#0F9D6D] text-xs font-bold tracking-[0.15em] px-4 py-1.5 rounded-full uppercase">
                {project.category.name}
              </span>
            )}
            {project.featured && (
              <span className="inline-block bg-white/15 border border-white/30 text-white text-xs font-bold tracking-[0.15em] px-4 py-1.5 rounded-full uppercase">
                Featured
              </span>
            )}
          </div>
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.1]">
            {project.title}
          </h1>
          {project.tagline && (
            <p className="text-white/80 text-sm sm:text-base max-w-2xl leading-relaxed font-light">
              {project.tagline}
            </p>
          )}
          {project.location && (
            <div className="flex items-center gap-2 text-sm text-white/80 pt-1">
              <svg className="w-4 h-4 text-[#D9A321]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {project.location}
            </div>
          )}
        </motion.div>
      </section>

      {/* SPECS STRIP */}
      <section className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { label: "Plot Size", value: project.plotSize },
            { label: "Starting Price", value: project.price },
            { label: "Total Area", value: project.area },
            { label: "Expected ROI", value: project.expectedRoi },
          ].filter((s) => s.value).map((spec) => (
            <div key={spec.label} className="text-center sm:text-left">
              <p className="text-gray-400 uppercase tracking-wide text-[10px] font-bold mb-1">{spec.label}</p>
              <p className="font-playfair font-extrabold text-lg text-[#0F9D6D]">{spec.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DESCRIPTION + GALLERY */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-lg"
            >
              <img
                src={project.image || FALLBACK_IMAGE}
                alt={project.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
              />
            </motion.div>

            {project.description && (
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={defaultViewport}>
                <h2 className="font-playfair text-2xl font-extrabold text-[#0F9D6D] mb-4">About This Project</h2>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{project.description}</p>
              </motion.div>
            )}

            {gallery.length > 0 && (
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={defaultViewport}>
                <h2 className="font-playfair text-2xl font-extrabold text-[#0F9D6D] mb-4">Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {gallery.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setLightboxIndex(idx)}
                      className="relative aspect-square overflow-hidden rounded-2xl border border-gray-100 shadow-sm group"
                    >
                      <img
                        src={img}
                        alt={`${project.title} image ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5v4m0-4h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="space-y-5">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4 sticky top-24">
              <h3 className="font-playfair text-lg font-extrabold text-[#0F9D6D]">Interested in this project?</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Schedule a private guided visit or download the brochure for full plot details.
              </p>
              <a
                href={project.btnUrl || "/contact"}
                className="block w-full text-center bg-[#0F9D6D] text-white hover:bg-[#12B886] font-bold px-6 py-3.5 rounded-full text-xs uppercase tracking-wider shadow-md transition-colors"
              >
                {project.btnText || "Schedule Site Visit"}
              </a>
              {project.brochure && (
                <a
                  href={project.brochure}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full text-center bg-[#F8FAF8] border border-[#0F9D6D]/30 text-[#0F9D6D] hover:bg-[#0F9D6D]/10 font-bold px-6 py-3.5 rounded-full text-xs uppercase tracking-wider transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H8a2 2 0 01-2-2V5a2 2 0 012-2h6l6 6v11a2 2 0 01-2 2z" />
                  </svg>
                  Download Brochure
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightboxIndex !== null && gallery[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 sm:p-8"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {gallery.length > 1 && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); showPrev(); }}
                className="absolute left-3 sm:left-6 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Previous image"
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            <motion.img
              key={lightboxIndex}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              src={gallery[lightboxIndex]}
              alt={`${project.title} full view`}
              className="max-h-[85vh] max-w-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {gallery.length > 1 && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); showNext(); }}
                className="absolute right-3 sm:right-6 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Next image"
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {gallery.length > 1 && (
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/70 text-xs font-semibold tracking-wide">
                {lightboxIndex + 1} / {gallery.length}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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
