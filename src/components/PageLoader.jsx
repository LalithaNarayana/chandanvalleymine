"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const PageLoader = () => {
  const [loading, setLoading] = useState(true);
  const [logo, setLogo] = useState("/logo.png");

  useEffect(() => {
    let active = true;
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (active && data?.logo) {
          setLogo(data.logo);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    // Prevent scrolling while loader is active
    document.body.style.overflow = "hidden";

    // Simulate initial page load completion
    const timer = setTimeout(() => {
      setLoading(false);
      document.body.style.overflow = "unset";
    }, 1500);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed top-0 left-0 w-full h-screen z-[9999] bg-[#FFFFFF] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-[#F8FAF8] to-emerald-50/20 flex flex-col items-center justify-center select-none"
        >
          <div className="relative flex flex-col items-center justify-center">
            {/* Animated Bouncing Logo */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                scaleY: [1, 1.05, 0.95, 1],
                rotate: [0, -1.5, 1.5, 0],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-10 flex flex-col items-center"
            >
              <img
                src={logo}
                alt="Chandan Valley Farms Logo"
                className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-md"
              />
            </motion.div>

            {/* Soft Dynamic Shadow underneath logo */}
            <motion.div
              animate={{
                scale: [1, 0.7, 1],
                opacity: [0.35, 0.15, 0.35],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-20 h-3 bg-[#0F9D6D]/20 rounded-full blur-sm mt-3"
            />

            {/* Loading text with soft opacity pulse */}
            <motion.p
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="mt-6 text-[#0F9D6D] font-inter font-medium text-xs sm:text-sm tracking-[0.2em] uppercase"
            >
              Loading...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
