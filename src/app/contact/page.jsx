"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PageLoader } from "../../components/PageLoader";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { SocialIcon } from "../../components/SocialIcon";
import { fadeUp, fadeRight, defaultViewport } from "../../lib/animations";

export default function ContactPage() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const [projects, setProjects] = useState([]);

  const [form, setForm] = useState({ name: "", phone: "", email: "", project: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [settingsRes, projectsRes] = await Promise.all([
          fetch("/api/settings"),
          fetch("/api/projects?status=Published"),
        ]);
        if (settingsRes.ok) {
          const data = await settingsRes.json();
          setSettings(data);
        }
        if (projectsRes.ok) {
          const data = await projectsRes.json();
          setProjects(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to load contact page data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.phone) {
      setError("Please fill in your name and phone number.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "Contact Us" }),
      });
      if (res.ok) {
        setSubmitted(true);
        setForm({ name: "", phone: "", email: "", project: "", message: "" });
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;

  const s = settings || {};

  return (
    <div className="bg-[#F8FAF8] text-[#222222] min-h-screen overflow-x-hidden font-sans antialiased">
      <Header />

      {/* HERO */}
      <section className="relative pt-40 pb-20 sm:pt-44 sm:pb-24 bg-[#0F9D6D] text-white text-center px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top,white,transparent_60%)]" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl mx-auto space-y-5"
        >
          <span className="inline-block bg-white/10 border border-white/30 text-white text-xs font-bold tracking-[0.25em] px-5 py-2 rounded-full uppercase">
            Get in Touch
          </span>
          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1]">
            Contact Us
          </h1>
          <p className="text-white/70 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-light">
            Have a question about our sandalwood farm plots? Reach out and our team will get back to you.
          </p>
        </motion.div>
      </section>

      {/* CONTACT DETAILS + FORM */}
      <section className="py-16 sm:py-20 -mt-10 relative z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
            {/* Left: Info */}
            <motion.div
              variants={fadeRight}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="lg:col-span-2 bg-[#0F9D6D] text-white rounded-3xl p-8 sm:p-10 space-y-8 shadow-xl"
            >
              <div>
                <h2 className="font-playfair text-2xl font-extrabold mb-2">{s.companyName || "Chandan Valley Farms"}</h2>
                <p className="text-white/60 text-sm leading-relaxed">
                  We're here to help you with any questions about our plantations, plot ownership, and investment process.
                </p>
              </div>

              <div className="space-y-6">
                {s.address && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-[#D9A321]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-white/50 font-bold mb-1">Address</p>
                      <p className="text-sm text-white/90 leading-relaxed">{s.address}</p>
                    </div>
                  </div>
                )}

                {s.phone && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-[#D9A321]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-white/50 font-bold mb-1">Phone</p>
                      <a href={`tel:${s.phone}`} className="text-sm text-white/90 hover:text-[#D9A321] transition-colors">{s.phone}</a>
                    </div>
                  </div>
                )}

                {s.email && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-[#D9A321]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-white/50 font-bold mb-1">Email</p>
                      <a href={`mailto:${s.email}`} className="text-sm text-white/90 hover:text-[#D9A321] transition-colors">{s.email}</a>
                    </div>
                  </div>
                )}
              </div>

              {s.socialLinks && (s.socialLinks.facebook || s.socialLinks.instagram || s.socialLinks.whatsapp || s.socialLinks.linkedin) && (
                <div className="pt-6 border-t border-white/10">
                  <p className="text-xs uppercase tracking-wide text-white/50 font-bold mb-3">Follow Us</p>
                  <div className="flex gap-3">
                    {s.socialLinks.facebook && (
                      <a href={s.socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#D9A321] hover:text-[#0F9D6D] flex items-center justify-center transition-colors">
                        <SocialIcon network="facebook" />
                      </a>
                    )}
                    {s.socialLinks.instagram && (
                      <a href={s.socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#D9A321] hover:text-[#0F9D6D] flex items-center justify-center transition-colors">
                        <SocialIcon network="instagram" />
                      </a>
                    )}
                    {s.socialLinks.whatsapp && (
                      <a
                        href={s.socialLinks.whatsapp.startsWith("http") ? s.socialLinks.whatsapp : `https://wa.me/${s.socialLinks.whatsapp.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="WhatsApp"
                        className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#D9A321] hover:text-[#0F9D6D] flex items-center justify-center transition-colors"
                      >
                        <SocialIcon network="whatsapp" />
                      </a>
                    )}
                    {s.socialLinks.linkedin && (
                      <a href={s.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#D9A321] hover:text-[#0F9D6D] flex items-center justify-center transition-colors">
                        <SocialIcon network="linkedin" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Right: Form */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="lg:col-span-3 bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-gray-100"
            >
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-playfair text-2xl font-extrabold text-[#0F9D6D]">Message Sent!</h3>
                  <p className="text-gray-500 text-sm max-w-sm">
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-bold text-[#D9A321] hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="font-playfair text-2xl font-extrabold text-[#0F9D6D] mb-1">Send us a Message</h2>
                  <p className="text-sm text-gray-500 mb-6">Fill in the form below and we'll respond as soon as possible.</p>

                  {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-semibold rounded-xl px-4 py-3">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D9A321]/40"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D9A321]/40"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D9A321]/40"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Project Interested</label>
                    <select
                      name="project"
                      value={form.project}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D9A321]/40"
                    >
                      <option value="">Select a project</option>
                      {projects.map((p) => (
                        <option key={p._id} value={`${p.title}${p.location ? " — " + p.location : ""}`}>
                          {p.title}{p.location ? ` — ${p.location}` : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D9A321]/40 resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#0F9D6D] text-white hover:bg-[#12B886] disabled:bg-gray-300 font-bold px-6 py-4 rounded-full text-xs uppercase tracking-wider shadow-md transition-colors"
                  >
                    {submitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </motion.div>
          </div>

          {/* Map */}
          {s.googleMap && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="mt-10 rounded-3xl overflow-hidden shadow-xl border border-gray-100 aspect-[16/6]"
            >
              <iframe
                src={s.googleMap}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location Map"
              />
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
