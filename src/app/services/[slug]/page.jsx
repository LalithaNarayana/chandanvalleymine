"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PageLoader } from "../../../components/PageLoader";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { ServiceIcon } from "../../../components/ServiceIcon";

// Animations
const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const zoomIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function ServiceSlugPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Database results
  const [service, setService] = useState(null);
  const [sections, setSections] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [seo, setSeo] = useState(null);

  // Accordion active index tracking
  const [openAccordions, setOpenAccordions] = useState({});

  // Calculator states
  const [calcInvestment, setCalcInvestment] = useState(2500000);
  const [calcYears, setCalcYears] = useState(10);
  const [calcRate, setCalcRate] = useState(15);

  useEffect(() => {
    if (!slug) return;

    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/services/${slug}`);
        if (!res.ok) {
          setError("Service not found");
          return;
        }

        const data = await res.json();
        setService(data.service);
        setSections(data.sections || []);
        setFaqs(data.faqs || []);
        setBenefits(data.benefits || []);
        setTestimonials(data.testimonials || []);
        setTimeline(data.timeline || []);
        setStatistics(data.statistics || []);
        setGallery(data.gallery || []);
        setSeo(data.seo);

        // Apply SEO meta dynamically
        if (data.seo && data.seo.metaTitle) {
          document.title = `${data.seo.metaTitle} | Chandan Valley Farms`;
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) metaDesc.setAttribute("content", data.seo.metaDescription || "");
          const metaKeywords = document.querySelector('meta[name="keywords"]');
          if (metaKeywords) metaKeywords.setAttribute("content", data.seo.keywords || "");
        } else {
          document.title = `${data.service.name} | Chandan Valley Farms`;
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  // Formulate compounding calculation
  const calculateROI = () => {
    const P = calcInvestment;
    const r = calcRate / 100;
    const t = calcYears;
    const A = P * Math.pow(1 + r, t);
    return Math.round(A);
  };

  const toggleAccordion = (sectionId, idx) => {
    setOpenAccordions(prev => {
      const current = prev[sectionId] === idx ? null : idx;
      return { ...prev, [sectionId]: current };
    });
  };

  if (loading) return <PageLoader />;
  if (error || !service) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-white">
        <Header />
        <div className="text-center py-40 space-y-4">
          <h2 className="font-playfair text-3xl font-extrabold text-[#0F9D6D]">Service Not Found</h2>
          <p className="text-sm text-gray-500">The service slug you requested does not exist or has been disabled.</p>
          <a href="/services" className="inline-block bg-[#0F9D6D] text-white px-6 py-3 rounded-xl text-xs font-bold">Back to Services</a>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAF8] text-[#222222] min-h-screen overflow-x-hidden font-sans">
      <Header />

      {/* Render Dynamic Layout Sections */}
      {sections.map((section, idx) => {
        const content = section.content || {};

        switch (section.type) {
          case "Hero":
            return (
              <section key={section._id} className="relative min-h-[75vh] flex items-center justify-center text-white px-4 pt-24 pb-16">
                <div className="absolute inset-0 z-0">
                  <img src={content.bgImage} alt="Hero Banner" className="w-full h-full object-cover filter brightness-[0.35]" />
                </div>
                <div className="max-w-4xl mx-auto text-center z-10 space-y-6">
                  {content.subtitle && (
                    <span className="inline-block bg-[#D9A321]/20 border border-[#D9A321]/40 text-[#D9A321] text-xs font-bold tracking-[0.2em] px-4 py-1 rounded-full uppercase">
                      {content.subtitle}
                    </span>
                  )}
                  <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
                    {content.title}
                  </h1>
                  {content.btnText && (
                    <div className="pt-4">
                      <a href={content.btnLink || "/contact"} className="bg-[#D9A321] text-[#0F9D6D] font-bold px-8 py-3.5 rounded-full hover:bg-white transition shadow-lg text-xs">
                        {content.btnText}
                      </a>
                    </div>
                  )}
                </div>
              </section>
            );

          case "Text Block":
            return (
              <section key={section._id} className="max-w-4xl mx-auto px-4 py-16 space-y-6 text-center">
                {content.title && <h2 className="font-playfair text-3xl font-bold text-[#0F9D6D]">{content.title}</h2>}
                {content.body && <p className="text-gray-600 text-sm sm:text-base leading-relaxed whitespace-pre-line max-w-3xl mx-auto">{content.body}</p>}
              </section>
            );

          case "Image":
            return (
              <section key={section._id} className="max-w-5xl mx-auto px-4 py-12 text-center">
                <div className="rounded-3xl overflow-hidden shadow-lg">
                  <img src={content.imageUrl} alt={content.caption || "Service Image"} className="w-full h-auto object-cover max-h-[70vh]" />
                </div>
                {content.caption && <p className="text-xs text-gray-500 mt-3 font-semibold">{content.caption}</p>}
              </section>
            );

          case "Video":
            return (
              <section key={section._id} className="max-w-5xl mx-auto px-4 py-12 text-center">
                <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-video bg-black">
                  <iframe
                    src={content.videoUrl}
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                    title="Video Player"
                  />
                </div>
              </section>
            );

          case "Gallery":
            return gallery.length > 0 ? (
              <section key={section._id} className="max-w-7xl mx-auto px-4 py-16 space-y-10">
                <h3 className="font-playfair text-2xl sm:text-3xl font-extrabold text-[#0F9D6D] text-center">Project Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {gallery.map((item) => (
                    <div key={item._id} className="rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 bg-white group">
                      <div className="h-48 overflow-hidden relative">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      </div>
                      {item.title && <p className="p-3 text-center text-xs font-bold text-[#0F9D6D] truncate">{item.title}</p>}
                    </div>
                  ))}
                </div>
              </section>
            ) : null;

          case "Timeline":
            return timeline.length > 0 ? (
              <section key={section._id} className="max-w-5xl mx-auto px-4 py-16 space-y-12">
                <h3 className="font-playfair text-2xl sm:text-3xl font-extrabold text-[#0F9D6D] text-center">Development Process</h3>
                <div className="relative border-l-2 border-gray-100 ml-4 space-y-10 py-4 pl-8">
                  {timeline.map((step, sIdx) => (
                    <div key={step._id} className="relative group">
                      <div className="absolute -left-12 top-1.5 h-8 w-8 rounded-full border-4 border-white bg-[#0F9D6D] text-white flex items-center justify-center font-bold text-xs shadow-md">
                        {step.stepNumber || sIdx + 1}
                      </div>
                      <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow transition">
                        <h4 className="font-playfair text-base font-bold text-[#0F9D6D] flex items-center gap-2">
                          <ServiceIcon name={step.icon} className="w-4 h-4 text-[#D9A321]" />
                          <span>{step.title}</span>
                        </h4>
                        <p className="text-gray-600 text-xs sm:text-sm mt-2 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null;

          case "Feature Cards":
            return (
              <section key={section._id} className="max-w-7xl mx-auto px-4 py-16 space-y-10">
                {content.title && <h3 className="font-playfair text-2xl sm:text-3xl font-extrabold text-[#0F9D6D] text-center">{content.title}</h3>}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(content.cards || []).map((card, cIdx) => (
                    <div key={cIdx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3 hover:shadow-md transition duration-300">
                      <div className="h-10 w-10 bg-[#F8FAF8] rounded-xl flex items-center justify-center text-[#0F9D6D]">
                        <ServiceIcon name={card.icon} className="w-5 h-5" />
                      </div>
                      <h4 className="font-playfair text-base font-bold text-[#0F9D6D]">{card.title}</h4>
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{card.desc}</p>
                    </div>
                  ))}
                </div>
              </section>
            );

          case "Statistics":
            return statistics.length > 0 ? (
              <section key={section._id} className="max-w-6xl mx-auto px-4 py-12">
                <div className="bg-white rounded-3xl p-8 shadow-md border grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  {statistics.map((stat) => (
                    <div key={stat._id} className="space-y-2">
                      <div className="flex justify-center text-[#0F9D6D] mb-1">
                        <ServiceIcon name={stat.icon} className="w-6 h-6" />
                      </div>
                      <h4 className="font-playfair text-2xl sm:text-3xl font-extrabold text-[#0F9D6D]">{stat.value}</h4>
                      <p className="text-gray-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">{stat.title}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null;

          case "Benefits":
            return benefits.length > 0 ? (
              <section key={section._id} className="max-w-7xl mx-auto px-4 py-16 space-y-12">
                <h3 className="font-playfair text-2xl sm:text-3xl font-extrabold text-[#0F9D6D] text-center">Investment Benefits</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {benefits.map((b) => (
                    <div key={b._id} className="bg-white p-6 rounded-2xl border hover:border-[#D9A321]/30 shadow-sm space-y-3 hover:shadow-lg transition duration-300">
                      <div className="h-10 w-10 bg-[#0F9D6D]/5 rounded-xl flex items-center justify-center text-[#0F9D6D]">
                        <ServiceIcon name={b.icon} className="w-5 h-5" />
                      </div>
                      <h4 className="font-playfair text-base font-bold text-[#0F9D6D]">{b.title}</h4>
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{b.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null;

          case "Accordion":
            return (
              <section key={section._id} className="max-w-3xl mx-auto px-4 py-16 space-y-8">
                {content.title && <h3 className="font-playfair text-2xl font-bold text-[#0F9D6D] text-center">{content.title}</h3>}
                <div className="space-y-3">
                  {(content.items || []).map((item, itemIdx) => {
                    const isOpen = openAccordions[section._id] === itemIdx;
                    return (
                      <div key={itemIdx} className="bg-white border rounded-xl overflow-hidden shadow-sm">
                        <button
                          onClick={() => toggleAccordion(section._id, itemIdx)}
                          className="w-full flex justify-between items-center px-5 py-4 text-left font-semibold text-[#0F9D6D] text-sm"
                        >
                          <span>{item.title}</span>
                          <span className="text-[#D9A321]">{isOpen ? "−" : "+"}</span>
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                              <p className="px-5 pb-4 pt-1 text-gray-600 text-xs sm:text-sm border-t border-gray-50 whitespace-pre-line leading-relaxed">{item.content}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </section>
            );

          case "Testimonials":
            return testimonials.length > 0 ? (
              <section key={section._id} className="bg-[#0F9D6D] text-white py-20 px-4">
                <div className="max-w-7xl mx-auto space-y-12">
                  <h3 className="font-playfair text-2xl sm:text-3xl font-extrabold text-center">What Clients Say About {service.name}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t) => (
                      <div key={t._id} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:bg-white/10 transition">
                        <p className="text-white/80 text-xs sm:text-sm italic">"{t.review}"</p>
                        <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                          <img src={t.photo} alt={t.name} className="h-9 w-9 rounded-full object-cover" />
                          <div>
                            <h4 className="text-xs font-bold text-white">{t.name}</h4>
                            <p className="text-[10px] text-[#D9A321] font-medium">{t.designation} ({t.company})</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ) : null;

          case "CTA":
            return (
              <section key={section._id} className="relative py-20 px-4 text-white text-center">
                <div className="absolute inset-0 z-0">
                  <img src={content.bgImage} alt="CTA Bg" className="w-full h-full object-cover filter brightness-[0.35]" />
                </div>
                <div className="max-w-3xl mx-auto relative z-10 space-y-6">
                  <h3 className="font-playfair text-2xl sm:text-4xl font-extrabold">{content.title}</h3>
                  <p className="text-white/80 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">{content.desc}</p>
                  {content.btnText && (
                    <div className="pt-2">
                      <a href={content.btnLink || "/contact"} className="bg-[#D9A321] text-[#0F9D6D] px-7 py-3 rounded-full font-bold hover:bg-white transition text-xs shadow-md">
                        {content.btnText}
                      </a>
                    </div>
                  )}
                </div>
              </section>
            );

          case "Custom Rich Text":
            return (
              <section key={section._id} className="max-w-4xl mx-auto px-4 py-12">
                <div dangerouslySetInnerHTML={{ __html: content.htmlContent }} className="text-xs sm:text-sm text-gray-600 leading-relaxed space-y-4" />
              </section>
            );

          case "Image + Content":
            const isRight = content.imagePosition === "right";
            return (
              <section key={section._id} className="max-w-7xl mx-auto px-4 py-16">
                <div className={`flex flex-col md:flex-row items-center gap-8 ${isRight ? "md:flex-row-reverse" : ""}`}>
                  <div className="w-full md:w-1/2 rounded-2xl overflow-hidden shadow-md">
                    <img src={content.imageUrl} alt={content.title} className="w-full h-auto object-cover max-h-[50vh]" />
                  </div>
                  <div className="w-full md:w-1/2 space-y-4">
                    <h3 className="font-playfair text-2xl font-bold text-[#0F9D6D]">{content.title}</h3>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">{content.body}</p>
                  </div>
                </div>
              </section>
            );

          case "Two Column Layout":
            return (
              <section key={section._id} className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div dangerouslySetInnerHTML={{ __html: content.col1Html }} className="text-xs sm:text-sm text-gray-600 space-y-3" />
                  <div dangerouslySetInnerHTML={{ __html: content.col2Html }} className="text-xs sm:text-sm text-gray-600 space-y-3" />
                </div>
              </section>
            );

          case "Three Column Layout":
            return (
              <section key={section._id} className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div dangerouslySetInnerHTML={{ __html: content.col1Html }} className="text-xs sm:text-sm text-gray-600 space-y-3" />
                  <div dangerouslySetInnerHTML={{ __html: content.col2Html }} className="text-xs sm:text-sm text-gray-600 space-y-3" />
                  <div dangerouslySetInnerHTML={{ __html: content.col3Html }} className="text-xs sm:text-sm text-gray-600 space-y-3" />
                </div>
              </section>
            );

          case "Table":
            return (
              <section key={section._id} className="max-w-5xl mx-auto px-4 py-12 overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-2xl overflow-hidden shadow-sm border text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#0F9D6D] text-white">
                      {(content.headers || []).map((header, hIdx) => (
                        <th key={hIdx} className="px-6 py-4 text-left font-bold uppercase tracking-wider">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(content.rows || []).map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-gray-50 transition">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-6 py-4 text-gray-600 font-medium">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            );

          case "Download Brochure":
            return (
              <section key={section._id} className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-[#0F9D6D]/5 border border-[#0F9D6D]/10 p-8 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="space-y-2 text-center md:text-left">
                    <h3 className="font-playfair text-xl font-bold text-[#0F9D6D]">{content.title || "Request Page Brochure"}</h3>
                    <p className="text-gray-500 text-xs sm:text-sm max-w-md">{content.desc || "Download full brochure PDF to examine pricing plans and blueprints."}</p>
                  </div>
                  <a
                    href={content.fileUrl}
                    download
                    className="bg-[#0F9D6D] hover:bg-[#12B886] text-white px-8 py-3.5 rounded-full font-bold text-xs shadow shrink-0"
                  >
                    {content.btnText || "Download Brochure"}
                  </a>
                </div>
              </section>
            );

          case "Investment Calculator":
            const futureValue = calculateROI();
            const earnings = futureValue - calcInvestment;

            return (
              <section key={section._id} className="max-w-4xl mx-auto px-4 py-16">
                <div className="bg-white border rounded-3xl p-6 sm:p-8 shadow-xl space-y-8">
                  <div className="text-center space-y-2 border-b pb-4">
                    <h3 className="font-playfair text-2xl font-bold text-[#0F9D6D]">{content.title || "Investment Calculator"}</h3>
                    <p className="text-gray-500 text-xs sm:text-sm">Compound return simulation based on customized farmland parameters.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Controls */}
                    <div className="space-y-6 text-xs font-bold text-gray-600">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Base Investment</span>
                          <span className="text-[#0F9D6D]">₹{calcInvestment.toLocaleString("en-IN")}</span>
                        </div>
                        <input
                          type="range"
                          min={content.basePrice ? content.basePrice / 5 : 500000}
                          max={content.basePrice ? content.basePrice * 3 : 10000000}
                          step="100000"
                          value={calcInvestment}
                          onChange={(e) => setCalcInvestment(parseFloat(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0F9D6D]"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Compounding Rate (CAGR)</span>
                          <span className="text-[#0F9D6D]">{calcRate}%</span>
                        </div>
                        <input
                          type="range"
                          min="8"
                          max="22"
                          value={calcRate}
                          onChange={(e) => setCalcRate(parseFloat(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0F9D6D]"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Period (Years)</span>
                          <span className="text-[#0F9D6D]">{calcYears} Years</span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max={content.years ? content.years * 1.5 : 20}
                          value={calcYears}
                          onChange={(e) => setCalcYears(parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0F9D6D]"
                        />
                      </div>
                    </div>

                    {/* Results Display */}
                    <div className="bg-[#0F9D6D]/5 p-6 rounded-2xl border flex flex-col justify-around text-center">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Total Projected ROI</span>
                        <h4 className="font-playfair text-3xl font-extrabold text-[#0F9D6D] mt-1">₹{futureValue.toLocaleString("en-IN")}</h4>
                      </div>
                      <div className="border-t pt-4">
                        <div className="flex justify-between text-xs font-semibold text-gray-500">
                          <span>Principal:</span>
                          <span className="font-bold text-gray-700">₹{calcInvestment.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between text-xs font-semibold text-gray-500 mt-1">
                          <span>Estimated Return:</span>
                          <span className="font-bold text-green-700">₹{earnings.toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );

          case "Custom HTML":
            return (
              <section key={section._id} className="max-w-7xl mx-auto px-4 py-6">
                <div dangerouslySetInnerHTML={{ __html: content.html }} />
              </section>
            );

          default:
            return null;
        }
      })}

      {/* Dynamic FAQs Accordion específicos de esta página */}
      {faqs.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 py-20 space-y-12">
          <h3 className="font-playfair text-2xl sm:text-3xl font-extrabold text-[#0F9D6D] text-center">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openAccordions[`faq-${faq._id}`] === true;
              return (
                <div key={faq._id} className="bg-white border rounded-2xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setOpenAccordions(prev => ({ ...prev, [`faq-${faq._id}`]: !isOpen }))}
                    className="w-full flex justify-between items-center px-6 py-5 text-left font-semibold text-[#0F9D6D] text-sm sm:text-base"
                  >
                    <span>{faq.question}</span>
                    <span className="text-[#D9A321]">{isOpen ? "−" : "+"}</span>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                        <p className="px-6 pb-5 pt-1 text-gray-600 text-xs sm:text-sm leading-relaxed border-t">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
export const dynamic = "force-dynamic";
