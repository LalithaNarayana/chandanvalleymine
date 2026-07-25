"use client";

import React from "react";
import { ServiceIcon } from "./ServiceIcon";

// Master list of icons available across the site. Keep in sync with the
// switch statement inside ServiceIcon.jsx so admins always pick a valid icon.
export const ICON_OPTIONS = [
  "Trees",
  "ShieldCheck",
  "TrendingUp",
  "Coins",
  "Leaf",
  "Globe",
  "Lock",
  "BarChart3",
  "Sparkles",
  "Grid",
  "Compass",
  "Droplets",
  "Road",
  "Zap",
  "GlassWater",
  "Footprints",
  "UserCheck",
  "Award",
  "Eye",
];

export const IconPicker = ({ value, onChange, label = "Icon" }) => {
  return (
    <div>
      {label && (
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{label}</label>
      )}
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 shrink-0 rounded-lg bg-[#F8FAF8] border border-[#E5E7EB] flex items-center justify-center text-[#0F9D6D]">
          <ServiceIcon name={value} className="w-5 h-5" />
        </div>
        <select
          value={value || "Trees"}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-xl text-sm bg-white"
        >
          {ICON_OPTIONS.map((icon) => (
            <option key={icon} value={icon}>
              {icon}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
