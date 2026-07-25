"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { PageLoader } from "../../../../components/PageLoader";

// CKEditor touches window/document at import time, so it must never be
// imported during server rendering.
const RichTextEditor = dynamic(() => import("../../../../components/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[320px] rounded-2xl border border-[#E5E7EB] bg-gray-50 animate-pulse" />
  ),
});

const LEGAL_TYPE = "terms-of-service";

export default function TermsOfServiceCMS() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("Terms of Service");
  const [content, setContent] = useState("");

  useEffect(() => {
    let active = true;
    fetch(`/api/legal?type=${LEGAL_TYPE}`)
      .then((res) => res.json())
      .then((data) => {
        if (!active || !data) return;
        setTitle(data.title || "Terms of Service");
        setContent(data.content || "");
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/legal", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: LEGAL_TYPE, title, content }),
      });
      if (!res.ok) throw new Error("Save failed");
      alert("Terms of Service saved successfully!");
    } catch (e) {
      alert("Error saving Terms of Service");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-4">
        <div>
          <h2 className="font-playfair text-2xl font-extrabold text-[#0F9D6D]">Terms of Service</h2>
          <p className="text-xs text-gray-500 mt-1">Manage the content shown on the public Terms of Service page.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#0F9D6D] text-white hover:bg-[#12B886] font-bold px-6 py-2.5 rounded-full text-xs shadow-md disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm p-6 space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Page Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F9D6D]/30"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Content</label>
          <RichTextEditor value={content} onChange={setContent} placeholder="Write your terms of service..." />
        </div>
      </div>
    </div>
  );
}
