"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS } from "../constants/homeData";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [siteSettings, setSiteSettings] = useState({ companyName: "Chandan Valley Farms", logo: "/logo.png" });
  const [dbNavLinks, setDbNavLinks] = useState(null);
  const [projectLinks, setProjectLinks] = useState([]);
  const pathname = usePathname();

  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (active && data) {
          setSiteSettings((prev) => ({
            companyName: data.companyName || prev.companyName,
            logo: data.logo || prev.logo,
          }));
          if (Array.isArray(data.navLinks) && data.navLinks.length > 0) {
            setDbNavLinks(
              [...data.navLinks].sort((a, b) => (a.order || 0) - (b.order || 0))
            );
          }
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/projects?status=Published&limit=6")
      .then((res) => res.json())
      .then((data) => {
        if (active && Array.isArray(data)) {
          setProjectLinks(
            data
              .filter((p) => p.slug)
              .map((p) => ({
                label: p.title,
                href: `/projects/${p.slug}`,
                description: p.location || p.tagline || "",
              }))
          );
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const baseNavLinks = dbNavLinks || NAV_LINKS;

  const navLinks = baseNavLinks.map((link) =>
    link.label === "Projects" || link.href === "/projects"
      ? { ...link, dropdown: projectLinks.length > 0 ? projectLinks : undefined }
      : link
  );

  // Solid header for inner pages, dynamic scroll header for home page
  const headerBg = !isHome || isScrolled
    ? "bg-white text-[#222222] shadow-md py-3.5 border-b border-[#E5E7EB]"
    : "bg-transparent text-white py-5";

  const logoColor = !isHome || isScrolled ? "text-[#0F9D6D]" : "text-white";
  const navLinkColor = !isHome || isScrolled
    ? "text-[#1F2937] hover:text-[#0F9D6D]"
    : "text-white/90 hover:text-[#D9A321]";

  const mobileToggleColor = !isHome || isScrolled ? "text-[#0F9D6D]" : "text-white";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group focus:outline-none">
            <img
              src={siteSettings.logo || "/logo.png"}
              alt={`${siteSettings.companyName} Logo`}
              className="h-14 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
            />
            <div className="flex flex-col">
              <span
                className={`font-playfair font-bold text-lg sm:text-xl tracking-tight leading-none transition-colors duration-300 ${logoColor}`}
              >
                {siteSettings.companyName || "Chandan Valley Farms"}
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const hasDropdown = Boolean(link.dropdown && link.dropdown.length > 0);
              const isActive = pathname === link.href;

              return (
                <div
                  key={link.label}
                  className="relative group px-3 py-2"
                  onMouseEnter={() => hasDropdown && setActiveDropdown(link.label)}
                  onMouseLeave={() => hasDropdown && setActiveDropdown(null)}
                >
                  <a
                    href={link.href}
                    className={`text-sm font-medium transition-colors relative flex items-center gap-1 py-1 group/link ${
                      isActive
                        ? isHome
                          ? "text-[#98FB98] font-semibold"
                          : "text-[#0B5D3B] font-semibold"
                        : navLinkColor
                    }`}
                  >
                    <span>{link.label}</span>
                    <span className={`absolute bottom-0 left-0 h-0.5 bg-[#98FB98] transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover/link:w-full"
                    }`} />
                    {hasDropdown && (
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          activeDropdown === link.label ? "rotate-180 text-[#D9A321]" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </a>

                  {/* Dropdown Menu with Framer Motion */}
                  <AnimatePresence>
                    {hasDropdown && activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-2xl border border-[#E5E7EB] p-2 z-50"
                      >
                        {link.dropdown.map((sub) => (
                          <a
                            key={sub.label}
                            href={sub.href}
                            className="block px-3 py-2.5 rounded-lg hover:bg-[#F8FAF8] transition-colors group/sub"
                          >
                            <div className="text-sm font-semibold text-[#0B5D3B] group-hover/sub:text-[#1E7A4D] transition-colors">
                              {sub.label}
                            </div>
                            {sub.description && (
                              <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                                {sub.description}
                              </div>
                            )}
                          </a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* Right CTA Button */}
          <div className="hidden sm:flex items-center gap-4">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              href="/contact"
              className="bg-gradient-to-r from-[#0F9D6D] to-[#12B886] text-white hover:from-[#12B886] hover:to-[#0F9D6D] border border-[#D9A321]/40 px-5 py-2.5 rounded-full font-semibold text-sm shadow-md hover:shadow-xl transition-all duration-300 flex items-center gap-2 group"
            >
              <span>Book Site Visit</span>
              <svg
                className="w-4 h-4 text-[#D9A321] group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </motion.a>
          </div>

          {/* Mobile Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors focus:outline-none ${
                mobileToggleColor === "text-[#0F9D6D]" ? "text-[#0F9D6D] hover:bg-gray-100" : "text-white hover:bg-white/10"
              }`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden bg-white text-[#222222] border-b border-[#E5E7EB] px-4 pt-3 pb-6 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <div key={link.label} className="border-b border-gray-100 last:border-0 pb-2 pt-1">
                  <a
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-base font-semibold text-[#0F9D6D] hover:text-[#D9A321] transition-colors py-1"
                  >
                    {link.label}
                  </a>
                  {link.dropdown && (
                    <div className="pl-4 mt-1 space-y-1">
                      {link.dropdown.map((sub) => (
                        <a
                          key={sub.label}
                          href={sub.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block text-xs font-medium text-gray-600 hover:text-[#0F9D6D] py-1"
                        >
                          • {sub.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4">
                <a
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-[#0F9D6D] text-white hover:bg-[#12B886] font-semibold py-3 rounded-xl block shadow-md text-sm"
                >
                  Book Site Visit
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
