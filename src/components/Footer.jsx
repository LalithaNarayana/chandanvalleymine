"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { NAV_LINKS } from "../constants/homeData";
import { fadeUp, defaultViewport } from "../lib/animations";

const defaultSettings = {
  companyName: "Chandan Valley Farms",
  logo: "/logo.png",
  footerDescription:
    "South India's premier managed sandalwood farm plot community. Engineered for maximum heartwood growth, clear title legal protection, and long-term generational wealth.",
  phone: "+91 98765 43210",
  phone2: "+91 80 2345 6789",
  email: "invest@chandanvalleyfarms.com",
  address: "Chikkaballapur Highway, Bengaluru North Extension, Karnataka 562101",
  socialLinks: { facebook: "", instagram: "", linkedin: "", whatsapp: "" },
  navLinks: [],
};

const SOCIAL_ICONS = {
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M22 12a10 10 0 10-11.5 9.9v-7H7.9V12h2.6V9.8c0-2.6 1.5-4 3.9-4 1.1 0 2.3.2 2.3.2v2.5h-1.3c-1.3 0-1.7.8-1.7 1.6V12h2.9l-.5 2.9h-2.4v7A10 10 0 0022 12z"/></svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2c2.7 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.22.6 1.77 1.15.55.55.89 1.11 1.15 1.77.25.64.42 1.37.47 2.43.05 1.06.06 1.42.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 01-1.15 1.77 4.9 4.9 0 01-1.77 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.42.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 01-1.77-1.15 4.9 4.9 0 01-1.15-1.77c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.7 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.22 1.15-1.77a4.9 4.9 0 011.77-1.15c.64-.25 1.37-.42 2.43-.47C8.94 2.01 9.3 2 12 2zm0 1.8c-2.66 0-2.99.01-4.04.06-.86.04-1.33.18-1.64.3-.41.16-.71.35-1.02.66-.31.31-.5.61-.66 1.02-.12.31-.26.78-.3 1.64C4.29 9.01 4.28 9.34 4.28 12s.01 2.99.06 4.04c.04.86.18 1.33.3 1.64.16.41.35.71.66 1.02.31.31.61.5 1.02.66.31.12.78.26 1.64.3 1.05.05 1.38.06 4.04.06s2.99-.01 4.04-.06c.86-.04 1.33-.18 1.64-.3.41-.16.71-.35 1.02-.66.31-.31.5-.61.66-1.02.12-.31.26-.78.3-1.64.05-1.05.06-1.38.06-4.04s-.01-2.99-.06-4.04c-.04-.86-.18-1.33-.3-1.64-.16-.41-.35-.71-.66-1.02a2.7 2.7 0 00-1.02-.66c-.31-.12-.78-.26-1.64-.3C14.99 3.81 14.66 3.8 12 3.8zm0 3.05a5.15 5.15 0 110 10.3 5.15 5.15 0 010-10.3zm0 1.8a3.35 3.35 0 100 6.7 3.35 3.35 0 000-6.7zm5.35-1.99a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z"/></svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M6.94 6.5A1.94 1.94 0 105.06 6.5a1.94 1.94 0 001.88 0zM5.34 8.75h3.2V20h-3.2V8.75zM12.55 8.75h3.07v1.54h.04c.43-.8 1.47-1.65 3.02-1.65 3.23 0 3.83 2.12 3.83 4.88V20h-3.2v-5.87c0-1.4-.03-3.2-1.95-3.2-1.96 0-2.26 1.53-2.26 3.1V20h-3.2V8.75z"/></svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.5 14.4c-.3-.1-1.6-.8-1.9-.9-.2-.1-.4-.1-.6.1s-.7.9-.9 1.1c-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.6-1.5-.8-2-.2-.5-.4-.4-.6-.5h-.5c-.2 0-.5.1-.7.3-.2.2-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.6-.7 1.9-1.3.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 00-8.5 15.2L2 22l4.9-1.3A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2z"/></svg>
  ),
};

export const Footer = () => {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    let active = true;
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (active && data) {
          setSettings({
            ...defaultSettings,
            ...data,
            socialLinks: { ...defaultSettings.socialLinks, ...(data.socialLinks || {}) },
          });
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const socialEntries = Object.entries(settings.socialLinks || {}).filter(([, url]) => url);
  const quickLinks =
    Array.isArray(settings.navLinks) && settings.navLinks.length > 0
      ? [...settings.navLinks].sort((a, b) => (a.order || 0) - (b.order || 0))
      : NAV_LINKS;

  return (
    <footer id="footer" className="bg-[#052111] text-white pt-16 pb-12 border-t border-white/10">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-white/10">

          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <img
                src={settings.logo || "/logo.png"}
                alt={`${settings.companyName} Logo`}
                className="h-10 sm:h-12 w-auto object-contain"
              />
              <div className="flex flex-col">
                <span className="font-playfair font-bold text-xl tracking-tight leading-none text-white">
                  {settings.companyName || "Chandan Valley Farms"}
                </span>
              </div>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
              {settings.footerDescription}
            </p>

            {socialEntries.length > 0 && (
              <div className="flex items-center gap-3 pt-2">
                {socialEntries.map(([social, url]) => (
                  <motion.a
                    key={social}
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href={social === "whatsapp" && !url.startsWith("http") ? `https://wa.me/${url.replace(/[^0-9]/g, "")}` : url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#D9A321] hover:text-[#0F9D6D] flex items-center justify-center transition-colors text-white"
                    aria-label={social}
                  >
                    {SOCIAL_ICONS[social]}
                  </motion.a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-playfair font-bold text-lg text-[#D9A321]">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-[#D9A321] transition-colors flex items-center gap-2">
                    <span className="text-[#D9A321] text-xs">›</span>
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="font-playfair font-bold text-lg text-[#D9A321]">Corporate & Site Address</h4>

            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#D9A321] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <span className="font-semibold text-white block">Site Location:</span>
                  <span>{settings.address}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[#D9A321] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 00.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <span>{[settings.phone, settings.phone2].filter(Boolean).join(" / ")}</span>
              </div>

              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[#D9A321] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{settings.email}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-400">
              <span className="text-[#D9A321] font-semibold block mb-0.5">Legal Disclaimer:</span>
              Land values and tree yield forecasts are based on agricultural growth studies & historical market trends. Actual yields depend on environmental factors.
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4 text-center sm:text-left">
          <p>© {new Date().getFullYear()} {settings.companyName || "Chandan Valley Farms"}. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>

      </motion.div>
    </footer>
  );
};
