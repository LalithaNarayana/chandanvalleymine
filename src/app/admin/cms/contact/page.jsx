"use client";

import React from "react";

export default function ContactCMS() {
  return (
    <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 shadow-sm max-w-2xl">
      <h2 className="font-playfair text-2xl font-extrabold text-[#0F9D6D] mb-2">Contact Page CMS</h2>
      <p className="text-xs text-gray-500 mb-6">Manage global office locations, hotlines, and Google Map details.</p>
      
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-emerald-800 space-y-2">
        <h4 className="font-bold text-sm">Contact Details & Map Coordinates</h4>
        <p className="text-xs leading-relaxed">
          Global contact links, emails, and SMTP parameters are controlled inside the global <a href="/admin/settings" className="font-bold underline">Settings panel</a>.
        </p>
      </div>
    </div>
  );
}
