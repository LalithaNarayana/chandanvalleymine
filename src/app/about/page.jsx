"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageLoader } from "../../components/PageLoader";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { normalizeLink } from "../../lib/utils";
import { ServiceIcon } from "../../components/ServiceIcon";

// ==========================================================
// ANIMATION VARIANTS (Inlined)
// ==========================================================
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const fadeDown = {
  hidden: { opacity: 0, y: -40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const fadeLeft = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const zoomIn = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const scaleHover = {
  hover: {
    scale: 1.05,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  tap: { scale: 0.98 },
};

const defaultViewport = {
  once: true,
  amount: 0.2,
};

export default function AboutPage() {
  const [cmsData, setCmsData] = useState(null);
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCMS() {
      try {
        const [aboutRes, homeRes] = await Promise.all([
          fetch("/api/about"),
          fetch("/api/home"),
        ]);
        if (aboutRes.ok) {
          const val = await aboutRes.json();
          setCmsData(val);
        }
        if (homeRes.ok) {
          const val = await homeRes.json();
          setHomeData(val);
        }
      } catch (err) {
        console.error("CMS load failed, using fallbacks:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCMS();
  }, []);

  const active = cmsData || {};
  const activeHome = homeData || {};

  if (loading) return <PageLoader />;

  return (
    <main className="min-h-screen bg-white text-[#222222] overflow-x-hidden">
      <Header />

      {/* Main Container padding for Fixed Header offset */}
      <div className="pt-[76px] lg:pt-[88px]">

        {/* ==========================================================
            1. HERO SECTION
            ========================================================== */}
        {active.visibility?.showHero && (
          <section className="relative w-full h-[45vh] sm:h-[55vh] lg:h-[65vh] overflow-hidden flex items-center bg-black">
            {/* Background image with slow zoom effect */}
            <motion.div
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.55 }}
              transition={{ duration: 2.5, ease: "easeOut" }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${active.hero?.bgImage || ""}')` }}
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />

            {/* Content Container */}
            <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-5 lg:px-6">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="max-w-3xl space-y-4 sm:space-y-6"
              >
                <motion.span
                  variants={staggerItem}
                  className="text-[#D9A321] text-xs sm:text-sm font-bold tracking-[0.2em] uppercase font-inter block"
                >
                  ABOUT CHANDAN VALLEY FARMS
                </motion.span>

                <motion.h1
                  variants={fadeUp}
                  className="font-playfair text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight"
                >
                  {active.hero?.heading}
                </motion.h1>

                <motion.p
                  variants={fadeUp}
                  className="font-inter text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed font-normal max-w-2xl"
                >
                  {active.hero?.description}
                </motion.p>

                <motion.div
                  variants={staggerItem}
                  className="flex flex-wrap items-center gap-4 pt-2"
                >

                  {active.hero?.secondaryBtnText && (
                    <motion.a
                      href={normalizeLink(active.hero?.secondaryBtnUrl) || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center justify-center gap-2 border border-white/30 text-white hover:bg-white/10 px-6 sm:px-8 py-3 rounded-full font-semibold text-sm transition-all duration-300"
                    >
                      <svg className="w-4 h-4 text-[#D9A321]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      <span>{active.hero?.secondaryBtnText}</span>
                    </motion.a>
                  )}
                </motion.div>
              </motion.div>
            </div>
          </section>
        )}

        {/* ==========================================================
            2. OUR STORY SECTION
            ========================================================== */}
        {active.visibility?.showStory && (
          <section id="story" className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                
                {/* Left Content Column */}
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={defaultViewport}
                  className="lg:col-span-6 space-y-6"
                >
                  <motion.div variants={fadeUp} className="space-y-2">
                    <span className="text-xs sm:text-sm font-bold tracking-widest text-[#D9A321] uppercase block">
                      {active.ourStory?.smallTitle}
                    </span>
                    <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F9D6D] leading-tight">
                      {active.ourStory?.heading}
                    </h2>
                  </motion.div>

                  <div className="text-gray-600 text-sm sm:text-base leading-relaxed font-normal space-y-4 whitespace-pre-wrap">
                    {active.ourStory?.description}
                  </div>
                </motion.div>

                {/* Right Image Column */}
                <div className="lg:col-span-6 relative">
                  <motion.div
                    variants={fadeRight}
                    initial="hidden"
                    whileInView="visible"
                    viewport={defaultViewport}
                    className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white group"
                  >
                    <img
                      src={active.ourStory?.image}
                      alt="Sandalwood wood slice premium raw harvest"
                      className="w-full h-[320px] sm:h-[450px] object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                  </motion.div>

                  {/* Bottom Floating Badge */}
                  <motion.div
                    variants={zoomIn}
                    initial="hidden"
                    whileInView="visible"
                    viewport={defaultViewport}
                    className="absolute -bottom-6 -left-2 sm:-left-6 bg-white text-[#0F9D6D] p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-2xl flex flex-col items-start justify-center max-w-[220px]"
                  >
                    <span className="font-playfair text-2xl sm:text-3xl font-extrabold text-[#D9A321]">
                      {active.ourStory?.badgeTitle}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">
                      {active.ourStory?.badgeSubtitle}
                    </span>
                  </motion.div>
                </div>

              </div>
            </div>
          </section>
        )}

        {/* ==========================================================
            3. MISSION & VISION SECTION
            ========================================================== */}
        {active.visibility?.showMissionVision && (
          <section id="mission-vision" className="py-16 sm:py-20 lg:py-24 bg-[#0F9D6D] text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#12B886]/15 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D9A321]/5 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6 relative z-10">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={defaultViewport}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
              >
                {/* Card One: Mission */}
                <motion.div
                  variants={zoomIn}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="bg-[#C7F5DE]/15 backdrop-blur-md rounded-3xl p-8 sm:p-10 border border-[#C7F5DE]/20 shadow-2xl hover:bg-[#C7F5DE]/25 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-black/20 flex items-center justify-center text-[#D9A321] mb-6 border border-white/10">
                      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-[#D9A321] mb-4">
                      Our Mission
                    </h3>
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-normal">
                      {activeHome.aboutPreview?.mission}
                    </p>
                  </div>
                </motion.div>

                {/* Card Two: Vision */}
                <motion.div
                  variants={zoomIn}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="bg-[#C7F5DE]/15 backdrop-blur-md rounded-3xl p-8 sm:p-10 border border-[#C7F5DE]/20 shadow-2xl hover:bg-[#C7F5DE]/25 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-black/20 flex items-center justify-center text-[#D9A321] mb-6 border border-white/10">
                      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-[#D9A321] mb-4">
                      Our Vision
                    </h3>
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-normal">
                      {activeHome.aboutPreview?.vision}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </section>
        )}

        {/* ==========================================================
            4. FOUNDER MESSAGE SECTION
            ========================================================== */}
        {active.visibility?.showFounder && (
          <section id="founder" className="py-16 sm:py-20 lg:py-24 bg-[#F8FAF8] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                
                {/* Left Column - Founder Image */}
                <motion.div
                  variants={fadeRight}
                  initial="hidden"
                  whileInView="visible"
                  viewport={defaultViewport}
                  className="lg:col-span-5 relative"
                >
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white group">
                    <img
                      src={active.founder?.image}
                      alt={`Founder ${active.founder?.name}`}
                      className="w-full h-[400px] sm:h-[500px] object-cover filter grayscale contrast-125 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F9D6D]/40 via-transparent to-transparent" />
                  </div>
                </motion.div>

                {/* Right Column - Founder Quote */}
                <motion.div
                  variants={fadeLeft}
                  initial="hidden"
                  whileInView="visible"
                  viewport={defaultViewport}
                  className="lg:col-span-7 space-y-6 flex flex-col justify-center"
                >
                  <div className="text-[#D9A321]/30 font-playfair text-[8rem] leading-none select-none h-12 -mt-6">
                    “
                  </div>

                  <h3 className="font-playfair text-xl sm:text-2xl lg:text-3.5xl font-bold text-[#0F9D6D] italic leading-relaxed">
                    {active.founder?.quote}
                  </h3>

                  <div className="pt-4 border-t border-[#E5E7EB] space-y-1">
                    <h4 className="font-playfair text-lg font-bold text-[#0F9D6D]">
                      {active.founder?.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-widest font-semibold font-inter">
                      {active.founder?.designation}
                    </p>
                  </div>
                </motion.div>

              </div>
            </div>
          </section>
        )}

        {/* ==========================================================
            5. OUR CORE VALUES SECTION
            ========================================================== */}
        {active.visibility?.showCoreValues && (
          <section id="values" className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6">
              
              {/* Header */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={defaultViewport}
                className="text-center max-w-2xl mx-auto mb-16 space-y-3"
              >
                <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F9D6D]">
                  {active.coreValuesSection?.title}
                </h2>
                <div className="w-12 h-1 bg-[#D9A321] mx-auto mt-4 rounded-full" />
              </motion.div>

              {/* Core Values Grid */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={defaultViewport}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {(active.coreValues || []).map((val, idx) => (
                  <motion.div
                    key={idx}
                    variants={staggerItem}
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    className="bg-[#F8FAF8] rounded-2xl p-8 border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-14 h-14 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#0F9D6D] mb-6 group-hover:bg-[#0F9D6D] group-hover:text-[#D9A321] group-hover:border-[#D9A321] transition-all duration-300 shadow-sm">
                        <ServiceIcon name={val.icon} className="w-6 h-6" />
                      </div>

                      <h3 className="font-playfair text-lg font-bold text-[#0F9D6D] mb-2 tracking-wide uppercase">
                        {val.title}
                      </h3>

                      <p className="text-gray-600 text-sm leading-relaxed font-normal">
                        {val.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

            </div>
          </section>
        )}

        {/* ==========================================================
            6. COMPANY JOURNEY TIMELINE
            ========================================================== */}
        {active.visibility?.showTimeline && (
          <section id="journey" className="py-16 sm:py-20 lg:py-24 bg-[#F8FAF8] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6">
              
              {/* Header */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={defaultViewport}
                className="text-center max-w-2xl mx-auto mb-16 sm:mb-20 space-y-3"
              >
                <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F9D6D]">
                  {active.journeySection?.title}
                </h2>
                <p className="text-gray-500 font-medium text-xs sm:text-sm tracking-widest uppercase">
                  {active.journeySection?.subtitle}
                </p>
                <div className="w-12 h-1 bg-[#D9A321] mx-auto mt-4 rounded-full" />
              </motion.div>

              {/* Timeline Wrapper */}
              <div className="relative">
                {/* Center Line for Desktop */}
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#0F9D6D]/10 via-[#D9A321]/30 to-[#0F9D6D]/10 hidden md:block" />

                <div className="space-y-12 md:space-y-24 relative z-10">
                  {(active.journeyTimeline || []).map((milestone, idx) => {
                    const isEven = idx % 2 === 0;
                    return (
                      <div key={idx} className="flex flex-col md:flex-row items-stretch">
                        {/* Left Block */}
                        <div className={`w-full md:w-1/2 flex ${isEven ? "md:justify-end md:pr-12 lg:pr-16" : "md:order-2 md:justify-start md:pl-12 lg:pl-16"} items-center`}>
                          <motion.div
                            variants={isEven ? fadeLeft : fadeRight}
                            initial="hidden"
                            whileInView="visible"
                            viewport={defaultViewport}
                            className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 w-full max-w-lg space-y-4"
                          >
                            <span className="text-[#D9A321] font-bold text-sm tracking-wider uppercase font-inter block">
                              Year {milestone.year}
                            </span>
                            <h4 className="font-playfair text-xl sm:text-2xl font-bold text-[#0F9D6D]">
                              {milestone.title}
                            </h4>
                            <p className="text-gray-600 text-sm leading-relaxed font-normal">
                              {milestone.description}
                            </p>
                          </motion.div>
                        </div>

                        {/* Timeline Node in Center */}
                        <div className="hidden md:flex items-center justify-center relative w-0">
                          <div className="absolute w-8 h-8 rounded-full bg-white border-4 border-[#0F9D6D] shadow-md z-20 flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#D9A321]" />
                          </div>
                        </div>

                        {/* Right Block (Image) */}
                        <div className={`w-full md:w-1/2 mt-6 md:mt-0 flex ${isEven ? "md:order-2 md:justify-start md:pl-12 lg:pl-16" : "md:justify-end md:pr-12 lg:pr-16"} items-center`}>
                          <motion.div
                            variants={isEven ? fadeRight : fadeLeft}
                            initial="hidden"
                            whileInView="visible"
                            viewport={defaultViewport}
                            className="w-full max-w-lg rounded-3xl overflow-hidden shadow-lg border border-gray-100 relative group aspect-[16/9]"
                          >
                            <img
                              src={milestone.image}
                              alt={milestone.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                          </motion.div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </section>
        )}

        {/* ==========================================================
            7. WHY CHOOSE US SECTION
            ========================================================== */}
        {active.visibility?.showWhyChooseUs && (
          <section id="why-choose-us" className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                
                {/* Left Column Checklist */}
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={defaultViewport}
                  className="lg:col-span-6 space-y-8"
                >
                  <motion.div variants={fadeUp} className="space-y-3">
                    <span className="text-xs sm:text-sm font-bold tracking-widest text-[#D9A321] uppercase block">
                      {active.whyChooseUs?.smallTitle}
                    </span>
                    <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F9D6D] leading-tight">
                      {active.whyChooseUs?.heading}
                    </h2>
                  </motion.div>

                  <div className="space-y-6">
                    {(active.whyChooseUs?.checklist || []).map((item, idx) => (
                      <motion.div
                        key={idx}
                        variants={fadeLeft}
                        className="flex items-start gap-4"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#0F9D6D]/10 text-[#0F9D6D] flex items-center justify-center shrink-0 font-bold text-sm">
                          ✓
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-[#0F9D6D] text-base font-playfair tracking-wide">
                            {item.title}
                          </h4>
                          <p className="text-gray-500 text-sm leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Right Column Image Collage */}
                <motion.div
                  variants={zoomIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={defaultViewport}
                  className="lg:col-span-6 grid grid-cols-2 gap-4"
                >
                  <div className="space-y-4">
                    <div className="rounded-2xl overflow-hidden aspect-[4/5] shadow-lg group">
                      <img
                        src={(active.whyChooseUs?.images || [])[0]}
                        alt="Farmland close up"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="rounded-2xl overflow-hidden aspect-square shadow-lg group">
                      <img
                        src={(active.whyChooseUs?.images || [])[1]}
                        alt="Sandalwood essential oils premium sample bottles"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="rounded-2xl overflow-hidden aspect-square shadow-lg group">
                      <img
                        src={(active.whyChooseUs?.images || [])[2]}
                        alt="Scientific botany testing"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="rounded-2xl overflow-hidden aspect-[4/5] shadow-lg group">
                      <img
                        src={(active.whyChooseUs?.images || [])[3]}
                        alt="Sandalwood young green leaves"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>
                </motion.div>

              </div>
            </div>
          </section>
        )}

        {/* ==========================================================
            8. CALL TO ACTION SECTION
            ========================================================== */}
        {active.visibility?.showCTA && (
          <section id="cta-section" className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={defaultViewport}
                className="bg-[#052111] text-white rounded-[32px] p-8 sm:p-12 lg:p-16 relative overflow-hidden border border-white/10 shadow-2xl text-center space-y-6"
              >
                {/* Background elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#12B886]/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D9A321]/5 rounded-full blur-3xl" />

                <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
                  <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                    {active.cta?.heading}
                  </h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                    {active.cta?.description}
                  </p>
                </div>

                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-md mx-auto">
                  <motion.a
                    variants={scaleHover}
                    whileHover="hover"
                    whileTap="tap"
                    href={normalizeLink(active.cta?.primaryBtnUrl) || "/contact"}
                    className="w-full sm:w-auto bg-[#F8FAF8] text-[#0F9D6D] hover:bg-[#D9A321] hover:text-[#0F9D6D] font-bold px-8 py-3.5 rounded-full text-sm shadow-md transition-colors duration-300 text-center uppercase tracking-wider"
                  >
                    {active.cta?.primaryBtnText}
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </section>
        )}

      </div>

      <Footer />
    </main>
  );
}
