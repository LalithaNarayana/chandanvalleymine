"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageLoader } from "../components/PageLoader";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ServiceIcon } from "../components/ServiceIcon";

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

const zoomIn = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
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

const fadeLeft = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const defaultViewport = {
  once: true,
  amount: 0.2,
};

// Fallbacks in case CMS is not populated yet or fetch fails
const FALLBACK_DATA = {
  hero: {
    bgImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop",
    bgImages: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2000&auto=format&fit=crop",
    ],
    smallHeading: "RERA & Town Planning Approved",
    mainHeading: "Own Your Premium Sandalwood Farm Plot",
    description: "Invest in nature with professionally managed sandalwood plantations that deliver long-term value, tax-free agricultural returns, and generational land security.",
    primaryBtnText: "Book Site Visit",
    primaryBtnUrl: "/contact",
    secondaryBtnText: "Explore Projects",
    secondaryBtnUrl: "/projects",
  },
  stats: [
    { title: "Sandalwood Saplings", value: "40+", icon: "Trees", sortOrder: 1 },
    { title: "Compounding Growth", value: "10-12x", icon: "TrendingUp", sortOrder: 2 },
    { title: "Tax-Free ROI Potential", value: "₹2-3 Cr", icon: "Coins", sortOrder: 3 },
  ],
  trustCards: [
    {
      title: "Premium Plantation",
      description: "High-yielding Mysore Sandalwood (Santalum Album) planted alongside host trees using automated precision agronomy.",
      icon: "Trees",
    },
    {
      title: "Secure Investment",
      description: "100% clear legal title, individual clear deed registration, fencing, and round-the-clock security monitoring.",
      icon: "ShieldCheck",
    },
    {
      title: "High ROI Potential",
      description: "Sandalwood is renowned as 'Liquid Gold', offering exponential capital growth and tax-free agricultural returns.",
      icon: "TrendingUp",
    },
  ],
  aboutPreview: {
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop",
    smallTitle: "Heritage & Excellence",
    heading: "Nurturing Valued Sandalwood Legacies Across Generations",
    description: "Chandan Valley Farms offers ultra-premium managed farmland that matches secure asset class attributes with ecological sustainability. Our botanists ensure optimal plantation conditions to guarantee premium heartwood yields.",
    mission: "To deliver transparent, high-yielding green investments that empower our clients while contributing to organic agro-forestry.",
    vision: "To become the gold standard of managed farmland in India, balancing ecology with wealth generation.",
    btnText: "Learn More About Us",
    btnUrl: "/about",
  },
  whyInvest: {
    smallTitle: "Sustainable Returns",
    heading: "Why Invest in Sandalwood?",
  },
  investmentBenefits: [
    {
      icon: "Leaf",
      title: "Nature Investment",
      description: "Own physical fertile land with lush green cover while reducing your carbon footprint through sustainable forestry."
    },
    {
      icon: "Coins",
      title: "Passive Income",
      description: "Enjoy inter-crop yields (sandalwood + timber/fruits) providing dual cash flows without day-to-day effort."
    },
    {
      icon: "Globe",
      title: "Eco Friendly",
      description: "Enrich soil biodiversity, create wildlife corridors, and promote organic agro-forestry for future generations."
    },
    {
      icon: "Lock",
      title: "Secure Asset",
      description: "Land ownership is an inflation-proof tangible asset backed by legal clear-title deed registrations."
    },
    {
      icon: "BarChart3",
      title: "Growing Demand",
      description: "Global demand for sandalwood oil and heartwood far exceeds supply, ensuring premium pricing at harvest."
    },
    {
      icon: "Sparkles",
      title: "Long-Term Appreciation",
      description: "Benefit from compounding asset growth: escalating land value combined with mature heartwood valuation."
    }
  ],
  featuredProject: {
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop",
    title: "Chandan Valley Farms - Phase 1",
    tagline: "Ultra-Premium Managed Sandalwood Estate",
    location: "Chikkaballapur Highway, Bengaluru North Extension",
    area: "28 Acres",
    plotSize: "5,000 sq. ft. to 10,000 sq. ft.",
    price: "₹24.99 Lakhs onwards",
    expectedRoi: "₹2 - 3 Cr in 10-12 Years",
    btnText: "Schedule Site Visit",
    btnUrl: "/contact",
  },
  highlightsSection: {
    smallTitle: "World-Class Amenities",
    heading: "Estate Highlights & Infrastructure",
  },
  highlights: [
    { icon: "Grid", title: "196 Premium Plots", subtitle: "RERA & Town Planning Compliant Layout", sortOrder: 1 },
    { icon: "Compass", title: "28 Acres Total Estate", subtitle: "Spacious Green Gated Sanctuary", sortOrder: 2 },
    { icon: "Droplets", title: "Drip Irrigation", subtitle: "Fully Automated Israeli Drip Networks", sortOrder: 3 },
    { icon: "Road", title: "Internal Roads", subtitle: "30ft Wide Blacktop Roads with Solar Lights", sortOrder: 4 },
    { icon: "Zap", title: "Electricity Network", subtitle: "Underground Power & Solar Streetlights", sortOrder: 5 },
    { icon: "GlassWater", title: "Water Supply", subtitle: "24/7 Borewell & Water Harvesting Tanks", sortOrder: 6 },
    { icon: "Footprints", title: "Walking Track", subtitle: "1.5 km Tree-Lined Nature Promenade", sortOrder: 7 },
    { icon: "UserCheck", title: "Professional Management", subtitle: "12-Year End-to-End Plantation Maintenance", sortOrder: 8 },
  ],
  processSection: {
    smallTitle: "Step-by-Step",
    heading: "Our Investment Process",
  },
  processSteps: [
    { step: "01", title: "Choose Plot", description: "Browse master plan layout, select your preferred plot size & direction.", details: "Choose from 5,000 to 10,000 sq. ft. prime units with optimal solar orientation." },
    { step: "02", title: "Site Visit", description: "Experience the pristine estate firsthand with our VIP luxury transport.", details: "Guided tour by senior agronomy experts and legal documentation officers." },
    { step: "03", title: "Documentation", description: "Transparent legal agreement with full title check and clear ownership deed.", details: "Government registered sale deed with 100% legal clearance & encapsulation." },
    { step: "04", title: "Ownership", description: "Receive your plot passbook, live updates, and relaxed passive ROI.", details: "Track tree growth via mobile updates, visit your farm anytime." },
  ],
  testimonials: [
    {
      name: "Rajesh V. Sharma",
      role: "Senior Tech Executive",
      location: "Bengaluru",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
      rating: 5,
      quote: "Investing in Chandan Valley Farms has been my best wealth decision. The site management is world-class, and seeing 40+ healthy sandalwood trees on my plot is deeply satisfying.",
      plotOwned: "Plot #42 (10,000 sq.ft)",
    },
    {
      name: "Dr. Ananya Hegde",
      role: "Cardiologist",
      location: "Mysore",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
      rating: 5,
      quote: "The legal clarity and transparent execution amazed me. Everything from drip lines to security fence is meticulously maintained. It's true peace of mind.",
      plotOwned: "Plot #18 (5,000 sq.ft)",
    },
    {
      name: "Vikram & Neha Reddy",
      role: "NRI Investors",
      location: "Singapore",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
      rating: 5,
      quote: "Living overseas, we needed a completely hands-off green asset. Chandan Valley's team provides periodic photo/video updates on tree health. Exceptional professionalism!",
      plotOwned: "Plot #88 (10,000 sq.ft)",
    },
  ],
  visibility: {
    showHero: true,
    showStats: true,
    showTrust: true,
    showAbout: true,
    showWhyInvest: true,
    showFeatured: true,
    showHighlights: true,
    showProcess: true,
    showTestimonials: true,
    showBlogs: true,
  }
};

export default function Home() {
  const [cmsData, setCmsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [heroSlide, setHeroSlide] = useState(0);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    async function loadCMS() {
      try {
        const res = await fetch("/api/home");
        if (res.ok) {
          const val = await res.json();
          setCmsData(val);
        }
      } catch (err) {
        console.error("CMS load failed, using fallbacks:", err);
      } finally {
        setLoading(false);
      }
    }
    async function loadBlogs() {
      try {
        const res = await fetch("/api/blogs?status=Published");
        if (res.ok) {
          const val = await res.json();
          setBlogs(Array.isArray(val) ? val.slice(0, 3) : []);
        }
      } catch (err) {
        console.error("Blogs load failed:", err);
      }
    }
    loadCMS();
    loadBlogs();
  }, []);

  const active = cmsData || FALLBACK_DATA;
  const currentTestimonial = active.testimonials?.[currentIndex] || FALLBACK_DATA.testimonials[0];

  const heroBgImages =
    active.hero?.bgImages && active.hero.bgImages.length > 0
      ? active.hero.bgImages
      : active.hero?.bgImage
      ? [active.hero.bgImage]
      : FALLBACK_DATA.hero.bgImages;

  useEffect(() => {
    if (heroBgImages.length <= 1) return;
    const timer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % heroBgImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroBgImages.length]);

  const handleNextTestimonial = () => {
    const total = active.testimonials?.length || 1;
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handlePrevTestimonial = () => {
    const total = active.testimonials?.length || 1;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  if (loading) return <PageLoader />;

  return (
    <main className="min-h-screen bg-white text-[#222222] overflow-x-hidden">
      <Header />

      {/* ==========================================================
          1. HERO SECTION
          ========================================================== */}
      {active.visibility?.showHero && (
        <section id="hero" className="relative w-full min-h-screen pt-28 pb-24 sm:pt-32 sm:pb-32 lg:pt-36 lg:pb-36 overflow-hidden flex items-center">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <AnimatePresence mode="sync">
              <motion.div
                key={heroSlide}
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: 1, scale: 1.08 }}
                exit={{ opacity: 0 }}
                transition={{ opacity: { duration: 1.5, ease: "easeInOut" }, scale: { duration: 8, ease: "linear" } }}
                className="absolute inset-0 w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url('${heroBgImages[heroSlide]}')`,
                }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-black/10" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-5 lg:px-6 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              
              {/* Left Column */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="lg:col-span-7 text-white space-y-6"
              >
                <motion.div variants={staggerItem} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#D9A321]/40 text-[#D9A321] text-xs sm:text-sm font-medium tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-[#D9A321] animate-ping" />
                  <span>{active.hero?.smallHeading}</span>
                </motion.div>

                <motion.h1 variants={fadeUp} className="font-playfair text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
                  {active.hero?.mainHeading}
                </motion.h1>

                <motion.p variants={fadeUp} className="text-gray-200 text-base sm:text-lg lg:text-xl max-w-2xl font-normal leading-relaxed">
                  {active.hero?.description}
                </motion.p>

                <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    href={active.hero?.primaryBtnUrl}
                    className="bg-[#D9A321] text-[#0F9D6D] hover:bg-amber-300 font-bold px-8 py-4 rounded-full text-center shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 group"
                  >
                    <span>{active.hero?.primaryBtnText}</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </motion.a>

                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    href={active.hero?.secondaryBtnUrl}
                    className="border-2 border-white/60 hover:border-[#D9A321] hover:text-[#D9A321] text-white font-semibold px-8 py-4 rounded-full text-center backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <span>{active.hero?.secondaryBtnText}</span>
                  </motion.a>
                </motion.div>
              </motion.div>

              {/* Right Column Glass Cards */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="lg:col-span-5 flex flex-col gap-4 sm:gap-5 justify-center"
              >
                {(active.stats || FALLBACK_DATA.stats).slice(0, 3).map((stat, i) => (
                  <motion.div
                    key={i}
                    variants={staggerItem}
                    whileHover={{ y: -6, scale: 1.01 }}
                    className={`glass-card rounded-2xl p-5 sm:p-6 text-white shadow-xl transition-all duration-300 border-l-4 ${
                      i === 0 ? "border-l-[#D9A321]" : i === 1 ? "border-l-emerald-400" : "border-l-amber-500"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#D9A321]">
                        {stat.title}
                      </span>
                      <span className="p-2 rounded-full bg-white/10 text-[#D9A321]">
                        <ServiceIcon name={stat.icon} className="w-5 h-5" />
                      </span>
                    </div>
                    <p className="font-playfair text-2xl sm:text-3xl font-bold">{stat.value}</p>
                    <p className="text-xs text-gray-200 mt-1">{stat.title}</p>
                  </motion.div>
                ))}
              </motion.div>

            </div>
          </div>

          {heroBgImages.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
              {heroBgImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setHeroSlide(idx)}
                  aria-label={`Show background ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    heroSlide === idx ? "bg-[#D9A321] w-8" : "bg-white/30 hover:bg-white/60 w-3"
                  }`}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ==========================================================
          2. TRUST SECTION
          ========================================================== */}
      {active.visibility?.showTrust && (
        <section className="relative z-20 -mt-10 sm:-mt-14 lg:-mt-16 max-w-7xl mx-auto px-4 sm:px-5 lg:px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
          >
            {(active.trustCards || FALLBACK_DATA.trustCards).map((item, idx) => (
              <motion.div
                key={idx}
                variants={zoomIn}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-[#E5E7EB] group flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#F8FAF8] border border-[#E5E7EB] flex items-center justify-center text-[#0F9D6D] mb-5 group-hover:bg-[#0F9D6D] group-hover:text-[#D9A321] group-hover:border-[#D9A321] transition-all duration-300 shadow-sm">
                    <ServiceIcon name={item.icon} className="w-7 h-7" />
                  </div>
                  <h3 className="font-playfair text-xl font-bold text-[#0F9D6D] mb-2 group-hover:text-[#12B886] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* ==========================================================
          3. ABOUT PREVIEW SECTION
          ========================================================== */}
      {active.visibility?.showAbout && (
        <section id="about" className="py-16 sm:py-20 lg:py-24 bg-[#F8FAF8] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Image */}
              <motion.div
                variants={fadeRight}
                initial="hidden"
                whileInView="visible"
                viewport={defaultViewport}
                className="lg:col-span-6 relative"
              >
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white group">
                  <img
                    src={active.aboutPreview?.image || FALLBACK_DATA.aboutPreview.image}
                    alt="Sandalwood Farm Estate Preview"
                    className="w-full h-[450px] sm:h-[540px] object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
              </motion.div>

              {/* Right Content */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={defaultViewport}
                className="lg:col-span-6 space-y-6"
              >
                <motion.div variants={fadeUp} className="space-y-3">
                  <span className="text-xs sm:text-sm font-bold tracking-widest text-[#D9A321] uppercase block">
                    {active.aboutPreview?.smallTitle}
                  </span>
                  <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F9D6D] leading-tight">
                    {active.aboutPreview?.heading}
                  </h2>
                </motion.div>

                <motion.p variants={fadeUp} className="text-gray-600 text-sm sm:text-base leading-relaxed font-normal">
                  {active.aboutPreview?.description}
                </motion.p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <motion.div variants={staggerItem} className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-2">
                    <h4 className="font-playfair font-bold text-[#0F9D6D] text-sm uppercase tracking-wide">Our Mission</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{active.aboutPreview?.mission}</p>
                  </motion.div>
                  <motion.div variants={staggerItem} className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-2">
                    <h4 className="font-playfair font-bold text-[#0F9D6D] text-sm uppercase tracking-wide">Our Vision</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{active.aboutPreview?.vision}</p>
                  </motion.div>
                </div>

                <motion.div variants={fadeUp} className="pt-2">
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    href={active.aboutPreview?.btnUrl}
                    className="inline-flex bg-[#0F9D6D] text-white hover:bg-[#12B886] font-bold px-8 py-3.5 rounded-full text-xs shadow-md uppercase tracking-wider transition-all duration-300"
                  >
                    {active.aboutPreview?.btnText}
                  </motion.a>
                </motion.div>
              </motion.div>

            </div>
          </div>
        </section>
      )}

      {/* ==========================================================
          4. INVESTMENT BENEFITS SECTION
          ========================================================== */}
      {active.visibility?.showWhyInvest && (
        <section id="why-invest" className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6">
            
            {/* Header */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="text-center max-w-2xl mx-auto mb-16 space-y-3"
            >
              <span className="text-xs sm:text-sm font-bold tracking-widest text-[#D9A321] uppercase block">
                {active.whyInvest?.smallTitle}
              </span>
              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F9D6D]">
                {active.whyInvest?.heading}
              </h2>
              <div className="w-12 h-1 bg-[#D9A321] mx-auto mt-4 rounded-full" />
            </motion.div>

            {/* Benefits Grid */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {(active.investmentBenefits || FALLBACK_DATA.investmentBenefits).map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={staggerItem}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="bg-[#F8FAF8] rounded-3xl p-8 border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-14 h-14 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#0F9D6D] mb-6 group-hover:bg-[#0F9D6D] group-hover:text-[#D9A321] group-hover:border-[#D9A321] transition-all duration-300 shadow-sm">
                      <ServiceIcon name={item.icon} className="w-6 h-6" />
                    </div>

                    <h3 className="font-playfair text-lg font-bold text-[#0F9D6D] mb-2 tracking-wide uppercase">
                      {item.title}
                    </h3>

                    <p className="text-gray-600 text-sm leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </section>
      )}

      {/* ==========================================================
          5. FEATURED PROJECT
          ========================================================== */}
      {active.visibility?.showFeatured && (
        <section id="featured-project" className="py-16 sm:py-20 lg:py-24 bg-[#0F9D6D] text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#12B886]/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D9A321]/5 rounded-full blur-3xl" />

          <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Column Image */}
              <motion.div
                variants={fadeRight}
                initial="hidden"
                whileInView="visible"
                viewport={defaultViewport}
                className="lg:col-span-6"
              >
                <div className="relative rounded-[32px] overflow-hidden shadow-2xl border-4 border-white/10 group aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3]">
                  <img
                    src={active.featuredProject?.image || FALLBACK_DATA.featuredProject.image}
                    alt="Chandan Valley Managed Farm Plot Phase 1 Layout"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
              </motion.div>

              {/* Right Column Content */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={defaultViewport}
                className="lg:col-span-6 space-y-6"
              >
                <div className="space-y-3">
                  <span className="inline-flex px-3 py-1 rounded-full bg-[#D9A321]/20 text-[#D9A321] text-xs font-bold uppercase tracking-wider">
                    Featured Project
                  </span>
                  <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                    {active.featuredProject?.title}
                  </h2>
                  <p className="text-gray-300 text-sm sm:text-base font-medium">
                    {active.featuredProject?.tagline}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 py-4 border-t border-b border-white/10 text-sm">
                  <div>
                    <span className="text-gray-400 block text-xs uppercase tracking-wider">Location</span>
                    <span className="font-semibold text-white mt-1 block">{active.featuredProject?.location}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-xs uppercase tracking-wider">Total Area</span>
                    <span className="font-semibold text-white mt-1 block">{active.featuredProject?.area}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-xs uppercase tracking-wider">Plot Sizes</span>
                    <span className="font-semibold text-[#D9A321] mt-1 block">{active.featuredProject?.plotSize}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-xs uppercase tracking-wider">Pricing</span>
                    <span className="font-semibold text-white mt-1 block">{active.featuredProject?.price}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    href={active.featuredProject?.btnUrl}
                    className="bg-[#D9A321] text-[#0F9D6D] hover:bg-amber-300 font-bold px-8 py-3.5 rounded-full text-center shadow-lg transition-colors duration-300 uppercase tracking-wider text-xs"
                  >
                    {active.featuredProject?.btnText}
                  </motion.a>
                  
                  <div className="flex items-center justify-center sm:justify-start gap-2 bg-white/5 border border-white/10 px-5 py-3 rounded-full">
                    <span className="text-xs text-gray-300 uppercase tracking-wider block">Estimated ROI:</span>
                    <span className="text-sm font-bold text-[#D9A321]">{active.featuredProject?.expectedRoi}</span>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>
      )}

      {/* ==========================================================
          6. PROJECT HIGHLIGHTS SECTION
          ========================================================== */}
      {active.visibility?.showHighlights && (
        <section className="py-16 sm:py-20 lg:py-24 bg-[#F8FAF8] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6">
            
            {/* Header */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="text-center max-w-2xl mx-auto mb-16 space-y-3"
            >
              <span className="text-xs sm:text-sm font-bold tracking-widest text-[#D9A321] uppercase block">
                {active.highlightsSection?.smallTitle}
              </span>
              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F9D6D]">
                {active.highlightsSection?.heading}
              </h2>
              <div className="w-12 h-1 bg-[#D9A321] mx-auto mt-4 rounded-full" />
            </motion.div>

            {/* Highlights Grid */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
            >
              {(active.highlights || FALLBACK_DATA.highlights).map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={staggerItem}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group text-center"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#F8FAF8] border border-[#E5E7EB] flex items-center justify-center text-[#0F9D6D] mx-auto mb-4 group-hover:bg-[#0F9D6D] group-hover:text-[#D9A321] group-hover:border-[#D9A321] transition-all duration-300 shadow-sm">
                    <ServiceIcon name={item.icon} className="w-6 h-6" />
                  </div>
                  <h4 className="font-playfair font-bold text-[#0F9D6D] text-sm uppercase tracking-wide mb-1">
                    {item.title}
                  </h4>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    {item.subtitle}
                  </p>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </section>
      )}

      {/* ==========================================================
          7. INVESTMENT PROCESS SECTION
          ========================================================== */}
      {active.visibility?.showProcess && (
        <section className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6">
            
            {/* Header */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="text-center max-w-2xl mx-auto mb-16 space-y-3"
            >
              <span className="text-xs sm:text-sm font-bold tracking-widest text-[#D9A321] uppercase block">
                {active.processSection?.smallTitle}
              </span>
              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F9D6D]">
                {active.processSection?.heading}
              </h2>
              <div className="w-12 h-1 bg-[#D9A321] mx-auto mt-4 rounded-full" />
            </motion.div>

            {/* Process Cards */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8"
            >
              {(active.processSteps || FALLBACK_DATA.processSteps).map((step, idx) => (
                <motion.div
                  key={idx}
                  variants={staggerItem}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                  className="relative group space-y-4 border-2 border-gray-100 hover:border-[#D9A321]/50 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <span className="font-playfair font-extrabold text-3xl text-[#D9A321]">{step.step}</span>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Step</span>
                  </div>
                  <h3 className="font-playfair text-lg font-bold text-[#0F9D6D]">{step.title}</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">{step.description}</p>
                  <p className="text-gray-400 text-[10px] leading-relaxed italic">{step.details}</p>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </section>
      )}

      {/* ==========================================================
          8. TESTIMONIALS SECTION
          ========================================================== */}
      {active.visibility?.showTestimonials && active.testimonials?.length > 0 && (
        <section className="py-16 sm:py-20 lg:py-24 bg-[#0F9D6D] text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#12B886]/15 rounded-full blur-3xl" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8"
              >
                <div className="flex justify-center text-[#D9A321] text-3xl font-playfair select-none leading-none h-4">“</div>
                <p className="font-playfair text-lg sm:text-2xl lg:text-3.5xl font-bold leading-relaxed italic max-w-3xl mx-auto">
                  {currentTestimonial.quote}
                </p>
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={currentTestimonial.avatar}
                    alt={currentTestimonial.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white/20"
                  />
                  <div className="text-center">
                    <h4 className="font-bold text-base">{currentTestimonial.name}</h4>
                    <p className="text-xs text-gray-300 font-medium">{currentTestimonial.role}, {currentTestimonial.location}</p>
                    {currentTestimonial.plotOwned && (
                      <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] text-[#D9A321] font-semibold border border-white/5">
                        {currentTestimonial.plotOwned}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2">
                {active.testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-3 rounded-full transition-all duration-300 ${
                      currentIndex === idx ? "bg-[#D9A321] w-8" : "bg-white/30 hover:bg-white/60 w-3"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                    suppressHydrationWarning
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handlePrevTestimonial}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors"
                  aria-label="Previous testimonial"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleNextTestimonial}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors"
                  aria-label="Next testimonial"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>
            </div>

          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
