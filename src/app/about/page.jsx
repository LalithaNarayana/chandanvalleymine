"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageLoader } from "../../components/PageLoader";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
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

const FALLBACK_DATA = {
  hero: {
    bgImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop",
    heading: "The Legacy of Sandalwood",
    description: "We are committed to creating sustainable investment opportunities through professionally managed sandalwood plantations that combine nature, long-term value, and responsible growth.",
    btnText: "Explore Projects",
    btnUrl: "#story",
    secondaryBtnText: "Watch Video",
    secondaryBtnUrl: "",
  },
  ourStory: {
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop",
    smallTitle: "HERITAGE & EXCELLENCE",
    heading: "Our Story",
    description: "Chandan Valley Farms was founded to bridge the gap between premium land ownership and high-yielding sustainable forestry. Sandalwood has been revered for centuries as one of India's most prized natural treasures. We provide a transparent, fully-managed pathway to co-owning land that secures your financial legacy while actively restoring regional green cover.\n\nBy blending traditional farming wisdom with modern agricultural science, our expert agronomists select certified Santalum Album saplings and cultivate them alongside host trees for optimum growth. With 24/7 smart security, drip-network controls, and transparent legal packaging, your farm plot is safe and compounding in value.",
    badgeTitle: "15+ Years",
    badgeSubtitle: "OF AGRICULTURAL EXCELLENCE",
  },
  founder: {
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
    quote: "At Chandan Valley Farms, we don't just plant trees; we cultivate a legacy. Our focus is on the long-term health of our soil and the enduring prosperity of our partners. We invite you to be part of an investment that lives and breathes.",
    name: "Mr. Aditya Pardhan",
    designation: "Founder & Managing Director",
  },
  coreValuesSection: {
    title: "Our Core Values",
  },
  coreValues: [
    {
      title: "Integrity",
      description: "We uphold absolute transparency and clarity in land titles, registry, and contracts.",
      icon: "ShieldCheck",
    },
    {
      title: "Sustainability",
      description: "We employ eco-friendly farming practices to conserve biodiversity and soil health.",
      icon: "Leaf",
    },
    {
      title: "Excellence",
      description: "Our botany and agronomy experts ensure unmatched quality in plantation management.",
      icon: "Award",
    },
    {
      title: "Transparency",
      description: "Periodic digital growth updates and real-time support ensure complete peace of mind.",
      icon: "Eye",
    },
  ],
  journeySection: {
    title: "The Journey",
    subtitle: "SANDALWOOD OF GROWTH",
  },
  journeyTimeline: [
    {
      year: "2015",
      title: "Inception",
      description: "Founded with the acquisition of our first 50 acres. Laid the foundation for professional sandalwood farming.",
      image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=800&auto=format&fit=crop",
    },
    {
      year: "2018",
      title: "Expansion & Tech Integration",
      description: "Expanded our plantation footprint to 150 acres and introduced automated drip irrigation systems.",
      image: "https://images.unsplash.com/photo-1463123081488-729f99c905b4?q=80&w=800&auto=format&fit=crop",
    },
    {
      year: "2021",
      title: "Advanced Agronomy",
      description: "Collaborated with leading forestry institutes to implement scientific host-tree management protocols.",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=800&auto=format&fit=crop",
    },
    {
      year: "2024",
      title: "A Modern Legacy",
      description: "Managing over 300+ acres of sandalwood plots, catering to a growing community of 500+ satisfied co-owners.",
      image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=800&auto=format&fit=crop",
    },
  ],
  whyChooseUs: {
    smallTitle: "INVESTOR BENEFITS",
    heading: "Why Choose Us?",
    checklist: [
      { title: "100% Legal Documentation", description: "Individual registration with clear title deed, RERA, and town planning compliance." },
      { title: "Expert Plantation Management", description: "12-year end-to-end management by qualified agronomists and botanists." },
      { title: "High ROI Potential", description: "Mysore Sandalwood offers compounding long-term tax-free agricultural returns." },
      { title: "Eco-Friendly Investment", description: "Promoting biodiversity, local employment, and reducing the environmental footprint." },
      { title: "Professional Maintenance", description: "24/7 security surveillance, automated Israeli drip irrigation, and fencing." },
      { title: "Transparent Process", description: "Detailed progress tracking and periodic video/photo updates of your farm plot." },
    ],
    images: [
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1463123081488-729f99c905b4?q=60&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=600&auto=format&fit=crop"
    ]
  },
  cta: {
    heading: "Join the Verdant Legacy",
    description: "Book your premium sandalwood farm plot today and secure a beautiful, sustainable investment for generations.",
    primaryBtnText: "Book Site Visit",
  },
  visibility: {
    showHero: true,
    showStory: true,
    showMissionVision: true,
    showFounder: true,
    showCoreValues: true,
    showTimeline: true,
    showWhyChooseUs: true,
    showCTA: true,
  }
};

// Fallback used only for the Mission/Vision descriptions, which are sourced
// from the Home Page CMS "Heritage & Excellence" section so admins only
// have to maintain that copy in one place.
const HOME_FALLBACK = {
  aboutPreview: {
    mission: "To engineer secure, high-yield, and professionally managed sandalwood plantations that empower our clients to build sustainable, generational wealth while driving positive ecological conservation.",
    vision: "To establish Chandan Valley Farms as the undisputed benchmark for luxury managed agricultural investments, recognized globally for unyielding trust, botanical innovation, and environmental stewardship.",
  },
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

  const active = cmsData || FALLBACK_DATA;
  const activeHome = homeData || HOME_FALLBACK;

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
              style={{ backgroundImage: `url('${active.hero?.bgImage || FALLBACK_DATA.hero.bgImage}')` }}
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
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    href={active.hero?.btnUrl}
                    className="bg-[#0F9D6D] text-white hover:bg-[#12B886] border border-[#D9A321]/40 px-6 sm:px-8 py-3 rounded-full font-semibold text-sm shadow-md hover:shadow-xl text-center transition-all duration-300"
                  >
                    {active.hero?.btnText}
                  </motion.a>

                  {active.hero?.secondaryBtnText && (
                    <motion.a
                      href={active.hero?.secondaryBtnUrl || "#"}
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
                      src={active.ourStory?.image || FALLBACK_DATA.ourStory.image}
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
                      {active.ourStory?.badgeTitle || FALLBACK_DATA.ourStory.badgeTitle}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">
                      {active.ourStory?.badgeSubtitle || FALLBACK_DATA.ourStory.badgeSubtitle}
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
                      {activeHome.aboutPreview?.mission || HOME_FALLBACK.aboutPreview.mission}
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
                      {activeHome.aboutPreview?.vision || HOME_FALLBACK.aboutPreview.vision}
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
                      src={active.founder?.image || FALLBACK_DATA.founder.image}
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
                  {active.coreValuesSection?.title || FALLBACK_DATA.coreValuesSection.title}
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
                {(active.coreValues || FALLBACK_DATA.coreValues).map((val, idx) => (
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
                  {active.journeySection?.title || FALLBACK_DATA.journeySection.title}
                </h2>
                <p className="text-gray-500 font-medium text-xs sm:text-sm tracking-widest uppercase">
                  {active.journeySection?.subtitle || FALLBACK_DATA.journeySection.subtitle}
                </p>
                <div className="w-12 h-1 bg-[#D9A321] mx-auto mt-4 rounded-full" />
              </motion.div>

              {/* Timeline Wrapper */}
              <div className="relative">
                {/* Center Line for Desktop */}
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#0F9D6D]/10 via-[#D9A321]/30 to-[#0F9D6D]/10 hidden md:block" />

                <div className="space-y-12 md:space-y-24 relative z-10">
                  {(active.journeyTimeline || FALLBACK_DATA.journeyTimeline).map((milestone, idx) => {
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
                      {active.whyChooseUs?.smallTitle || FALLBACK_DATA.whyChooseUs.smallTitle}
                    </span>
                    <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F9D6D] leading-tight">
                      {active.whyChooseUs?.heading || FALLBACK_DATA.whyChooseUs.heading}
                    </h2>
                  </motion.div>

                  <div className="space-y-6">
                    {(active.whyChooseUs?.checklist || FALLBACK_DATA.whyChooseUs.checklist).map((item, idx) => (
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
                        src={(active.whyChooseUs?.images || FALLBACK_DATA.whyChooseUs.images)[0]}
                        alt="Farmland close up"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="rounded-2xl overflow-hidden aspect-square shadow-lg group">
                      <img
                        src={(active.whyChooseUs?.images || FALLBACK_DATA.whyChooseUs.images)[1]}
                        alt="Sandalwood essential oils premium sample bottles"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="rounded-2xl overflow-hidden aspect-square shadow-lg group">
                      <img
                        src={(active.whyChooseUs?.images || FALLBACK_DATA.whyChooseUs.images)[2]}
                        alt="Scientific botany testing"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="rounded-2xl overflow-hidden aspect-[4/5] shadow-lg group">
                      <img
                        src={(active.whyChooseUs?.images || FALLBACK_DATA.whyChooseUs.images)[3]}
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
                    href={active.cta?.primaryBtnUrl || "/contact"}
                    className="w-full sm:w-auto bg-[#F8FAF8] text-[#0F9D6D] hover:bg-[#D9A321] hover:text-[#0F9D6D] font-bold px-8 py-3.5 rounded-full text-sm shadow-md transition-colors duration-300 text-center uppercase tracking-wider"
                  >
                    {active.cta?.primaryBtnText || FALLBACK_DATA.cta.primaryBtnText}
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
