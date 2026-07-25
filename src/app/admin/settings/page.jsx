"use client";

import React, { useState, useEffect } from "react";
import { PageLoader } from "../../../components/PageLoader";

const emptySettings = {
  companyName: "",
  logo: "",
  favicon: "",
  footerDescription: "",
  phone: "",
  phone2: "",
  email: "",
  address: "",
  googleMap: "",
  socialLinks: { facebook: "", instagram: "", linkedin: "", whatsapp: "" },
  seo: { metaTitle: "", metaDescription: "", metaKeywords: "" },
  analyticsId: "",
  navLinks: [],
};

export default function SettingsModule() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [settings, setSettings] = useState(emptySettings);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        setSettings({
          ...emptySettings,
          ...data,
          socialLinks: { ...emptySettings.socialLinks, ...(data.socialLinks || {}) },
          seo: { ...emptySettings.seo, ...(data.seo || {}) },
          navLinks: Array.isArray(data.navLinks)
            ? [...data.navLinks].sort((a, b) => (a.order || 0) - (b.order || 0))
            : [],
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const normalizedNavLinks = settings.navLinks.map((link, idx) => ({ ...link, order: idx + 1 }));
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...settings, navLinks: normalizedNavLinks }),
      });
      if (res.ok) {
        alert("Global configuration settings updated!");
      }
    } catch (err) {
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const updateNested = (path, value) => {
    setSettings((prev) => {
      const copy = { ...prev, socialLinks: { ...prev.socialLinks }, seo: { ...prev.seo } };
      const keys = path.split(".");
      let current = copy;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      setUploading(true);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const val = await res.json();
      if (val.url) {
        setSettings((prev) => ({ ...prev, [field]: val.url }));
      }
    } catch (err) {
      alert("Asset upload failed");
    } finally {
      setUploading(false);
    }
  };

  const addNavLink = () => {
    setSettings((prev) => ({
      ...prev,
      navLinks: [
        ...prev.navLinks,
        { label: "", href: "", order: prev.navLinks.length + 1 },
      ],
    }));
  };

  const updateNavLink = (idx, field, value) => {
    setSettings((prev) => {
      const navLinks = [...prev.navLinks];
      navLinks[idx] = { ...navLinks[idx], [field]: field === "order" ? Number(value) : value };
      return { ...prev, navLinks };
    });
  };

  const removeNavLink = (idx) => {
    setSettings((prev) => ({
      ...prev,
      navLinks: prev.navLinks.filter((_, i) => i !== idx),
    }));
  };

  const moveNavLink = (idx, direction) => {
    setSettings((prev) => {
      const navLinks = [...prev.navLinks];
      const targetIdx = idx + direction;
      if (targetIdx < 0 || targetIdx >= navLinks.length) return prev;
      [navLinks[idx], navLinks[targetIdx]] = [navLinks[targetIdx], navLinks[idx]];
      navLinks.forEach((link, i) => { link.order = i + 1; });
      return { ...prev, navLinks };
    });
  };

  if (loading) return <PageLoader />;

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-4">
        <div>
          <h2 className="font-playfair text-2xl font-extrabold text-[#0F9D6D]">Global Settings</h2>
          <p className="text-xs text-gray-500 mt-1">
            Configure site branding, contacts, footer, and social media details. These values are shown live on the website.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-[#0F9D6D] text-white hover:bg-[#12B886] font-bold px-6 py-2.5 rounded-full text-xs shadow-md disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {uploading && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-xl flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#0F9D6D] border-t-transparent" />
            <span className="font-semibold text-sm">Uploading asset...</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Box 1: Branding */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-sm space-y-4">
          <h3 className="font-playfair text-sm font-bold text-[#0F9D6D] uppercase tracking-wider border-b pb-2">Site Branding</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500">Site Title</label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-xs mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500">Logo</label>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-12 w-12 rounded-lg border border-[#E5E7EB] bg-[#F8FAF8] flex items-center justify-center overflow-hidden shrink-0">
                    {settings.logo ? (
                      <img src={settings.logo} alt="Logo" className="h-full w-full object-contain" />
                    ) : (
                      <span className="text-[9px] text-gray-400">Logo</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <input type="file" id="logoUpload" onChange={(e) => handleImageUpload(e, "logo")} className="hidden" accept="image/*" />
                    <label
                      htmlFor="logoUpload"
                      className="block text-center bg-[#0F9D6D]/10 text-[#0F9D6D] hover:bg-[#0F9D6D]/20 px-2 py-2 rounded-lg text-[10px] font-bold cursor-pointer"
                    >
                      Upload Logo
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500">Favicon</label>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-12 w-12 rounded-lg border border-[#E5E7EB] bg-[#F8FAF8] flex items-center justify-center overflow-hidden shrink-0">
                    {settings.favicon ? (
                      <img src={settings.favicon} alt="Favicon" className="h-full w-full object-contain" />
                    ) : (
                      <span className="text-[9px] text-gray-400">Icon</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <input type="file" id="faviconUpload" onChange={(e) => handleImageUpload(e, "favicon")} className="hidden" accept="image/*" />
                    <label
                      htmlFor="faviconUpload"
                      className="block text-center bg-[#0F9D6D]/10 text-[#0F9D6D] hover:bg-[#0F9D6D]/20 px-2 py-2 rounded-lg text-[10px] font-bold cursor-pointer"
                    >
                      Upload Favicon
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500">Footer Description</label>
              <textarea
                value={settings.footerDescription}
                onChange={(e) => setSettings({ ...settings, footerDescription: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-xs mt-1 h-20"
                placeholder="Short description shown in the website footer"
              />
            </div>
          </div>
        </div>

        {/* Box 2: Contacts */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-sm space-y-4">
          <h3 className="font-playfair text-sm font-bold text-[#0F9D6D] uppercase tracking-wider border-b pb-2">Contact Details</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500">Location</label>
              <textarea
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-xs mt-1 h-14"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500">Contact Number 1</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs mt-1"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500">Contact Number 2</label>
                <input
                  type="text"
                  value={settings.phone2}
                  onChange={(e) => setSettings({ ...settings, phone2: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs mt-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500">Contact Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-xs mt-1"
              />
            </div>
          </div>
        </div>

        {/* Box 3: Social Media */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-sm space-y-4">
          <h3 className="font-playfair text-sm font-bold text-[#0F9D6D] uppercase tracking-wider border-b pb-2">Social Media</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500">WhatsApp Number / Link</label>
              <input
                type="text"
                placeholder="+91 98765 43210 or https://wa.me/..."
                value={settings.socialLinks.whatsapp}
                onChange={(e) => updateNested("socialLinks.whatsapp", e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-xs mt-1"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500">Instagram URL</label>
              <input
                type="text"
                value={settings.socialLinks.instagram}
                onChange={(e) => updateNested("socialLinks.instagram", e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-xs mt-1"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500">Facebook URL</label>
              <input
                type="text"
                value={settings.socialLinks.facebook}
                onChange={(e) => updateNested("socialLinks.facebook", e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-xs mt-1"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500">LinkedIn URL</label>
              <input
                type="text"
                value={settings.socialLinks.linkedin}
                onChange={(e) => updateNested("socialLinks.linkedin", e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-xs mt-1"
              />
            </div>
          </div>
        </div>

        {/* Box 4: SEO Details */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-sm space-y-4">
          <h3 className="font-playfair text-sm font-bold text-[#0F9D6D] uppercase tracking-wider border-b pb-2">Global SEO Configuration</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500">Default Meta Title</label>
              <input
                type="text"
                value={settings.seo.metaTitle}
                onChange={(e) => updateNested("seo.metaTitle", e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-xs mt-1"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500">Default Meta Description</label>
              <textarea
                value={settings.seo.metaDescription}
                onChange={(e) => updateNested("seo.metaDescription", e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-xs mt-1 h-14"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500">Google Analytics Tracking ID</label>
              <input
                type="text"
                placeholder="UA-XXXXXXXXX-X / G-XXXXXXXXXX"
                value={settings.analyticsId}
                onChange={(e) => setSettings({ ...settings, analyticsId: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-xs mt-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Box 5: Navigation Menu (Header + Footer) */}
      <div className="bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <div>
            <h3 className="font-playfair text-sm font-bold text-[#0F9D6D] uppercase tracking-wider">
              Navigation Menu
            </h3>
            <p className="text-[10px] text-gray-400 mt-1">
              These links power the header navigation and the footer quick links across the site.
            </p>
          </div>
          <button
            type="button"
            onClick={addNavLink}
            className="bg-[#0F9D6D]/10 text-[#0F9D6D] hover:bg-[#0F9D6D]/20 px-4 py-2 rounded-full text-[10px] font-bold"
          >
            + Add Menu Item
          </button>
        </div>

        {settings.navLinks.length === 0 ? (
          <p className="text-xs text-gray-400 py-4 text-center">
            No custom menu items yet. Add items or leave empty to use the default menu.
          </p>
        ) : (
          <div className="space-y-2">
            {settings.navLinks.map((link, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center bg-[#F8FAF8] p-3 rounded-xl border border-gray-100">
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => moveNavLink(idx, -1)}
                    disabled={idx === 0}
                    className="text-gray-400 hover:text-[#0F9D6D] disabled:opacity-30 text-xs"
                    aria-label="Move up"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => moveNavLink(idx, 1)}
                    disabled={idx === settings.navLinks.length - 1}
                    className="text-gray-400 hover:text-[#0F9D6D] disabled:opacity-30 text-xs"
                    aria-label="Move down"
                  >
                    ▼
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Label (e.g. About Us)"
                  value={link.label}
                  onChange={(e) => updateNavLink(idx, "label", e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-xl text-xs"
                />
                <input
                  type="text"
                  placeholder="Link (e.g. /about)"
                  value={link.href}
                  onChange={(e) => updateNavLink(idx, "href", e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-xl text-xs"
                />
                <button
                  type="button"
                  onClick={() => removeNavLink(idx)}
                  className="text-red-600 hover:underline text-xs font-bold px-2 shrink-0"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
}
