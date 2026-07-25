"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { PageLoader } from "../../components/PageLoader";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { ServiceIcon } from "../../components/ServiceIcon";

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 1.5 }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  const numericValue = parseInt(value.replace(/[^0-9]/g, "")) || 0;
  const suffix = value.replace(/[0-9]/g, "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );
    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime = null;
    const totalDuration = duration * 1000;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / totalDuration, 1);
      
      setCount(Math.floor(progress * numericValue));

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [hasStarted, numericValue, duration]);

  return (
    <span ref={elementRef} className="font-playfair text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#D4AF37]">
      {hasStarted ? `${count}${suffix}` : `0${suffix}`}
    </span>
  );
};

// Horizontal scroll-linked Journey Timeline
const JourneyTimeline = ({ steps }) => {
  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end center"]
  });

  const widthScale = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]);

  return (
    <div ref={timelineRef} className="relative py-12">
      {/* Horizontal Line (Desktop) */}
      <div className="hidden lg:block absolute left-0 right-0 top-16 -translate-y-1/2 h-[2px] bg-gray-200">
        <motion.div
          style={{ width: widthScale }}
          className="h-full bg-gradient-to-r from-[#0B5D38] to-[#98FB98]"
        />
      </div>

      {/* Vertical Line (Mobile/Tablet) */}
      <div className="lg:hidden absolute left-6 top-0 bottom-0 w-[2px] bg-gray-200">
        <motion.div
          style={{ height: widthScale }}
          className="w-full bg-gradient-to-b from-[#0B5D38] to-[#98FB98]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-12 lg:gap-4 relative z-10 pl-16 lg:pl-0">
        {steps.map((step, idx) => (
          <motion.div
            key={step._id || idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="flex flex-col items-start lg:items-center text-left lg:text-center space-y-4 group relative"
          >
            {/* Step circle node */}
            <div className="absolute -left-16 lg:left-1/2 lg:-translate-x-1/2 top-0 lg:top-0 h-12 w-12 rounded-full border-4 border-[#F8F8F8] bg-[#0B5D38] text-white flex items-center justify-center text-sm font-extrabold shadow-md group-hover:bg-[#98FB98] group-hover:text-[#0B5D3B] group-hover:border-[#98FB98] group-hover:scale-110 transition duration-300">
              {step.stepNumber || String(idx + 1).padStart(2, "0")}
            </div>

            <div className="pt-2 lg:pt-16 space-y-3">
              <div className="flex justify-start lg:justify-center text-[#1E7A4D] group-hover:scale-110 transition duration-300">
                <ServiceIcon name={step.icon} className="w-5 h-5" />
              </div>
              <h4 className="font-playfair text-lg font-extrabold text-[#0B5D38]">
                {step.title}
              </h4>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-[200px]">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default function UnifiedServicesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState(null);

  // Parallax Scroll logic
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const heroBgScale = useTransform(scrollY, [0, 500], [1, 1.12]);
  const heroTextY = useTransform(scrollY, [0, 500], [0, 60]);

  // Storytelling scroll variants
  const imageLeftVariants = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const imageRightVariants = {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  useEffect(() => {
    async function loadCMSData() {
      try {
        setLoading(true);
        const res = await fetch("/api/services");
        if (res.ok) {
          const val = await res.json();
          setPageData(val);
          if (val?.seo?.metaTitle) {
            document.title = val.seo.metaTitle;
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) metaDesc.setAttribute("content", val.seo.metaDescription || "");
            const metaKeywords = document.querySelector('meta[name="keywords"]');
            if (metaKeywords) metaKeywords.setAttribute("content", val.seo.keywords || "");
          }
        }
      } catch (err) {
        console.error("Unified services fetch failed:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCMSData();
  }, []);

  if (loading) return <PageLoader />;
  if (!pageData) return <div className="p-8 text-center text-gray-500">Failed to load Services.</div>;

  const { hero, statistics, coreServices, additionalServices, investmentProcess, ctaSection, visibility } = pageData;

  return (
    <div ref={containerRef} className="bg-[#F8F8F8] text-[#222222] min-h-screen overflow-x-hidden font-sans antialiased selection:bg-[#98FB98] selection:text-[#0B5D3B]">
      <Header />

      {/* SECTION 1: HERO */}
      {visibility?.showHero && hero && (
        <section className="relative h-[90vh] flex items-center justify-center text-white overflow-hidden px-6 sm:px-12 md:px-20 pt-20 text-center">
          {/* Parallax Background */}
          <motion.div style={{ scale: heroBgScale }} className="absolute inset-0 z-0">
            <img
              src={hero.backgroundImage}
              alt="Premium Sandalwood Plantation"
              className="w-full h-full object-cover filter brightness-[0.4]"
            />
          </motion.div>

          {/* Centered Content Container */}
          <motion.div
            style={{ y: heroTextY }}
            className="max-w-4xl z-10 space-y-6 sm:space-y-8 flex flex-col items-center"
          >
            {hero.badge && (
              <motion.span
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-block bg-[#98FB98]/20 border border-[#98FB98]/40 text-[#98FB98] text-xs font-bold tracking-[0.25em] px-5 py-2 rounded-full uppercase"
              >
                {hero.badge}
              </motion.span>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-white"
            >
              {hero.heading}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white/80 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed font-light"
            >
              {hero.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-2"
            >
              {hero.primaryButton?.text && (
                <a
                  href={hero.primaryButton.url}
                  className="w-full sm:w-auto text-center bg-[#0B5D3B] text-white hover:bg-[#98FB98] hover:text-[#0B5D38] border border-[#0B5D3B] hover:border-[#98FB98] font-bold px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-all duration-300 text-xs uppercase tracking-wider"
                >
                  {hero.primaryButton.text}
                </a>
              )}
              {hero.secondaryButton?.text && (
                <a
                  href={hero.secondaryButton.url}
                  className="w-full sm:w-auto text-center bg-transparent border border-white hover:bg-[#98FB98] hover:border-[#98FB98] hover:text-[#0B5D38] font-bold px-8 py-4 rounded-full hover:scale-105 transition-all duration-300 text-xs uppercase tracking-wider"
                >
                  {hero.secondaryButton.text}
                </a>
              )}
            </motion.div>
          </motion.div>
        </section>
      )}

      {/* SECTION 2: STATISTICS STRIP */}
      {visibility?.showStats && statistics && statistics.length > 0 && (
        <section className="bg-[#0B5D38] text-white py-12 px-6 sm:px-12 relative z-10 border-b border-white/5 shadow-2xl">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
            {statistics.map((stat, idx) => (
              <div key={stat._id || idx} className="space-y-3 group first:divide-x-0">
                <div className="flex justify-center text-[#98FB98] group-hover:scale-110 transition duration-300">
                  <ServiceIcon name={stat.icon} className="w-8 h-8" />
                </div>
                <div>
                  <AnimatedCounter value={stat.value} />
                </div>
                <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">
                  {stat.title}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 3: CORE SERVICES (Alternating Storytelling Layout) */}
      {visibility?.showCoreServices && coreServices && coreServices.length > 0 && (
        <section id="core-services" className="w-full bg-white py-28 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 space-y-28">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-xs font-bold text-[#1E7A4D] uppercase tracking-[0.25em]">OUR CORE SERVICES</span>
              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B5D38]">
                Professional Plantation Solutions
              </h2>
              <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto">
                From plantation setup to harvesting and long-term asset management, we handle everything professionally.
              </p>
            </div>

            <div className="space-y-24">
              {coreServices.map((service, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div
                    key={service._id || index}
                    className={`flex flex-col ${
                      isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                    } items-center gap-12 lg:gap-16`}
                  >
                    {/* Image Block */}
                    <motion.div
                      variants={isEven ? imageLeftVariants : imageRightVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.2 }}
                      className="w-full lg:w-1/2"
                    >
                      <div className="relative group overflow-hidden rounded-[2rem] shadow-xl border border-gray-100/50">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-[380px] sm:h-[420px] object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                        />
                        {service.highlight && (
                          <div className="absolute top-6 left-6 bg-[#0B5D38] text-[#98FB98] text-xs font-bold px-4 py-2 rounded-full shadow-lg border border-[#98FB98]/40 uppercase tracking-wider">
                            {service.highlight}
                          </div>
                        )}
                      </div>
                    </motion.div>

                    {/* Content Block */}
                    <motion.div
                      variants={contentVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.2 }}
                      className="w-full lg:w-1/2 space-y-6"
                    >
                      <div className="flex items-center gap-3 text-[#1E7A4D]">
                        <ServiceIcon name={service.icon} className="w-5 h-5" />
                        <span className="text-xs font-bold tracking-[0.25em] uppercase">PROGRAM 0{index + 1}</span>
                      </div>

                      <h3 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B5D38] leading-tight">
                        {service.title}
                      </h3>

                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                        {service.description}
                      </p>

                      {/* Features checklist */}
                      {service.features && service.features.length > 0 && (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          {service.features.map((feat, fidx) => (
                            <li key={fidx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                              <span className="h-5 w-5 bg-[#98FB98]/20 border border-[#98FB98]/40 text-[#0B5D38] rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                ✓
                              </span>
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 4: ADDITIONAL SERVICES */}
      {visibility?.showAdditionalServices && additionalServices && additionalServices.length > 0 && (
        <section className="bg-[#EFFFF0] py-28 px-6 border-t border-gray-100">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-xs font-bold text-[#1E7A4D] uppercase tracking-[0.25em]">ADDITIONAL SERVICES</span>
              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B5D38]">
                More Ways We Add Value
              </h2>
              <p className="text-sm text-gray-500 max-w-2xl mx-auto">
                Comprehensive support channels to ensure a complete, compliant, and transparent investment workflow.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {additionalServices.map((service, idx) => (
                <motion.div
                  key={service._id || idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.08 }}
                  className="bg-white border border-gray-100 hover:border-[#98FB98] p-8 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between gap-6 cursor-pointer group"
                >
                  <div className="space-y-4">
                    <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-[#1E7A4D] group-hover:bg-[#98FB98] group-hover:text-[#0B5D3B] group-hover:rotate-12 transition-all duration-300 shadow-sm border">
                      <ServiceIcon name={service.icon} className="w-5 h-5" />
                    </div>
                    <h4 className="font-playfair text-lg font-bold text-[#0B5D38]">
                      {service.title}
                    </h4>
                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 5: INVESTMENT PROCESS */}
      {visibility?.showProcess && investmentProcess && investmentProcess.length > 0 && (
        <section className="bg-gradient-to-b from-[#F8F8F8] to-white border-y border-gray-150/40 py-28 px-6">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-xs font-bold text-[#1E7A4D] uppercase tracking-[0.25em]">OUR PROCESS WORKFLOW</span>
              <h2 className="font-playfair text-3xl sm:text-4xl font-extrabold text-[#0B5D38]">
                Your Investment Journey
              </h2>
              <p className="text-sm text-gray-500 max-w-2xl mx-auto">
                Discover the phased approach to sandalwood managed farming, growth tracking, and harvest yields.
              </p>
            </div>

            <JourneyTimeline steps={investmentProcess} />
          </div>
        </section>
      )}

      {/* SECTION 6: PREMIUM CALL TO ACTION */}
      {visibility?.showCTA && ctaSection && (
        <section
          className="relative py-28 px-6 text-white text-center bg-[#0B5D38] bg-cover bg-center overflow-hidden"
          style={ctaSection.backgroundImage ? { backgroundImage: `url(${ctaSection.backgroundImage})` } : undefined}
        >
          {/* Dark overlay for text readability over the background image */}
          {ctaSection.backgroundImage && (
            <div className="absolute inset-0 bg-[#0B5D38]/85 z-0" />
          )}

          {/* Subtle SVG Leaf Overlay */}
          <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none">
            <svg className="w-full h-full" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M10,10 Q20,30 10,50 T30,90" stroke="white" strokeWidth="2" fill="none" />
              <path d="M90,10 Q80,45 90,60 T70,95" stroke="white" strokeWidth="2" fill="none" />
            </svg>
          </div>

          <div className="max-w-4xl mx-auto z-10 relative space-y-8 flex flex-col items-center">
            <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.2]">
              {ctaSection.heading}
            </h2>
            <p className="text-white/80 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-light">
              {ctaSection.description}
            </p>
            <div className="pt-4">
              <a
                href={ctaSection.buttonUrl}
                className="bg-[#D4AF37] hover:bg-[#98FB98] text-[#0B5D38] font-bold px-10 py-5 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 text-xs uppercase tracking-wider"
              >
                {ctaSection.buttonText}
              </a>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
export const dynamic = "force-dynamic";
