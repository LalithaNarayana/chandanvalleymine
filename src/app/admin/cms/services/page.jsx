"use client";

import React, { useState, useEffect } from "react";
import { PageLoader } from "../../../../components/PageLoader";

const COMMON_ICONS = [
  "Trees", "ShieldCheck", "TrendingUp", "Coins", "Leaf", "Globe", "Lock",
  "BarChart3", "Sparkles", "Grid", "Compass", "Droplets", "Road", "Zap",
  "GlassWater", "Footprints", "UserCheck"
];

export default function ServicePageCMS() {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [pageData, setPageData] = useState(null);

  // Active Collapsible Accordion sections
  const [openSections, setOpenSections] = useState({
    hero: true,
    stats: false,
    core: false,
    additional: false,
    process: false,
    cta: false,
    visibility: false,
    seo: false
  });

  const toggleSection = (sec) => {
    setOpenSections(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  useEffect(() => {
    async function loadCMSData() {
      try {
        setLoading(true);
        // Call the admin GET endpoint
        const res = await fetch("/api/admin/services");
        if (res.ok) {
          const val = await res.json();
          // If the page doesn't exist yet, seed it by hitting public GET (which auto-creates it)
          if (!val || !val.hero) {
            const resPublic = await fetch("/api/services");
            if (resPublic.ok) {
              setPageData(await resPublic.json());
            }
          } else {
            setPageData(val);
          }
        }
      } catch (err) {
        console.error("Failed to load ServicePage config:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCMSData();
  }, []);

  const triggerUpload = async (e, callback) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        callback(data.url);
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      alert("S3 upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pageData)
      });
      if (res.ok) {
        alert("Services page configuration updated successfully!");
        const updated = await res.json();
        setPageData(updated);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update configuration");
      }
    } catch (err) {
      alert("Error saving configuration");
    } finally {
      setLoading(false);
    }
  };

  // Helper arrays update functions
  const addStat = () => {
    const newStats = [...(pageData.statistics || []), { title: "", value: "", icon: "Trees" }];
    setPageData({ ...pageData, statistics: newStats });
  };
  const removeStat = (idx) => {
    const newStats = pageData.statistics.filter((_, i) => i !== idx);
    setPageData({ ...pageData, statistics: newStats });
  };
  const moveStat = (idx, dir) => {
    const newStats = [...pageData.statistics];
    const target = idx + dir;
    if (target < 0 || target >= newStats.length) return;
    const temp = newStats[idx];
    newStats[idx] = newStats[target];
    newStats[target] = temp;
    setPageData({ ...pageData, statistics: newStats });
  };

  // Core Services
  const addCore = () => {
    const newCore = [...(pageData.coreServices || []), { image: "", icon: "Trees", title: "", description: "", displayOrder: (pageData.coreServices || []).length + 1 }];
    setPageData({ ...pageData, coreServices: newCore });
  };
  const removeCore = (idx) => {
    const newCore = pageData.coreServices.filter((_, i) => i !== idx);
    setPageData({ ...pageData, coreServices: newCore });
  };
  const moveCore = (idx, dir) => {
    const newCore = [...pageData.coreServices];
    const target = idx + dir;
    if (target < 0 || target >= newCore.length) return;
    const temp = newCore[idx];
    newCore[idx] = newCore[target];
    newCore[target] = temp;
    setPageData({ ...pageData, coreServices: newCore });
  };

  // Additional Services
  const addAdditional = () => {
    const newAdd = [...(pageData.additionalServices || []), { icon: "Sparkles", title: "", description: "", displayOrder: (pageData.additionalServices || []).length + 1 }];
    setPageData({ ...pageData, additionalServices: newAdd });
  };
  const removeAdditional = (idx) => {
    const newAdd = pageData.additionalServices.filter((_, i) => i !== idx);
    setPageData({ ...pageData, additionalServices: newAdd });
  };
  const moveAdditional = (idx, dir) => {
    const newAdd = [...pageData.additionalServices];
    const target = idx + dir;
    if (target < 0 || target >= newAdd.length) return;
    const temp = newAdd[idx];
    newAdd[idx] = newAdd[target];
    newAdd[target] = temp;
    setPageData({ ...pageData, additionalServices: newAdd });
  };

  // Journey Process
  const addProcess = () => {
    const newSteps = [...(pageData.investmentProcess || []), { stepNumber: String((pageData.investmentProcess || []).length + 1).padStart(2, "0"), icon: "Trees", title: "", description: "", displayOrder: (pageData.investmentProcess || []).length + 1 }];
    setPageData({ ...pageData, investmentProcess: newSteps });
  };
  const removeProcess = (idx) => {
    const newSteps = pageData.investmentProcess.filter((_, i) => i !== idx);
    setPageData({ ...pageData, investmentProcess: newSteps });
  };
  const moveProcess = (idx, dir) => {
    const newSteps = [...pageData.investmentProcess];
    const target = idx + dir;
    if (target < 0 || target >= newSteps.length) return;
    const temp = newSteps[idx];
    newSteps[idx] = newSteps[target];
    newSteps[target] = temp;
    setPageData({ ...pageData, investmentProcess: newSteps });
  };

  if (loading) return <PageLoader />;
  if (!pageData) return <div className="p-8 text-center text-gray-500">Failed to load CMS panel.</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 text-[#222222]">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border shadow-sm">
        <div>
          <h1 className="font-playfair text-2xl font-extrabold text-[#0B5D38]">Services Page Layout Manager</h1>
          <p className="text-xs text-gray-500 mt-1">Configure sections, visibility options, cards, and SEO metadata.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={uploading}
          className="bg-[#0B5D38] hover:bg-[#073D24] text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow disabled:opacity-50 transition"
        >
          {uploading ? "Uploading Image..." : "Save Settings"}
        </button>
      </div>

      {/* 1. HERO ACCORDION */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <button
          onClick={() => toggleSection("hero")}
          className="w-full flex justify-between items-center px-6 py-4 bg-gray-50/50 font-bold text-sm text-[#0B5D38] border-b"
        >
          <span>1. Hero Banner settings</span>
          <span>{openSections.hero ? "▲" : "▼"}</span>
        </button>
        {openSections.hero && (
          <div className="p-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-500 uppercase mb-1">Badge Text</label>
                <input
                  type="text"
                  value={pageData.hero?.badge || ""}
                  onChange={(e) => setPageData({ ...pageData, hero: { ...pageData.hero, badge: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-500 uppercase mb-1">Heading</label>
                <input
                  type="text"
                  value={pageData.hero?.heading || ""}
                  onChange={(e) => setPageData({ ...pageData, hero: { ...pageData.hero, heading: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-xl"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold text-gray-500 uppercase mb-1">Description</label>
              <textarea
                value={pageData.hero?.description || ""}
                onChange={(e) => setPageData({ ...pageData, hero: { ...pageData.hero, description: e.target.value } })}
                className="w-full px-4 py-2 border rounded-xl h-20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 border p-4 rounded-xl bg-gray-50/30">
              <h5 className="col-span-2 font-bold text-gray-500 uppercase">Primary Button</h5>
              <div>
                <label className="block font-bold text-gray-400 mb-1">Text</label>
                <input
                  type="text"
                  value={pageData.hero?.primaryButton?.text || ""}
                  onChange={(e) => setPageData({ ...pageData, hero: { ...pageData.hero, primaryButton: { ...pageData.hero.primaryButton, text: e.target.value } } })}
                  className="w-full px-4 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-400 mb-1">Link URL</label>
                <input
                  type="text"
                  value={pageData.hero?.primaryButton?.url || ""}
                  onChange={(e) => setPageData({ ...pageData, hero: { ...pageData.hero, primaryButton: { ...pageData.hero.primaryButton, url: e.target.value } } })}
                  className="w-full px-4 py-2 border rounded-xl"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 border p-4 rounded-xl bg-gray-50/30">
              <h5 className="col-span-2 font-bold text-gray-500 uppercase">Secondary Button</h5>
              <div>
                <label className="block font-bold text-gray-400 mb-1">Text</label>
                <input
                  type="text"
                  value={pageData.hero?.secondaryButton?.text || ""}
                  onChange={(e) => setPageData({ ...pageData, hero: { ...pageData.hero, secondaryButton: { ...pageData.hero.secondaryButton, text: e.target.value } } })}
                  className="w-full px-4 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-400 mb-1">Link URL</label>
                <input
                  type="text"
                  value={pageData.hero?.secondaryButton?.url || ""}
                  onChange={(e) => setPageData({ ...pageData, hero: { ...pageData.hero, secondaryButton: { ...pageData.hero.secondaryButton, url: e.target.value } } })}
                  className="w-full px-4 py-2 border rounded-xl"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold text-gray-500 uppercase mb-1">Background Image (Contabo S3)</label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  disabled
                  value={pageData.hero?.backgroundImage || ""}
                  className="w-full px-4 py-2 border rounded-xl bg-gray-50"
                />
                <input
                  type="file"
                  id="heroBgImage"
                  onChange={(e) => triggerUpload(e, (url) => setPageData({ ...pageData, hero: { ...pageData.hero, backgroundImage: url } }))}
                  className="hidden"
                />
                <label htmlFor="heroBgImage" className="bg-[#0B5D38] hover:bg-[#073D24] text-white px-4 py-2 rounded-xl cursor-pointer font-bold">
                  Upload
                </label>
              </div>
              {pageData.hero?.backgroundImage && (
                <img src={pageData.hero.backgroundImage} alt="Preview" className="h-28 w-auto object-cover rounded-xl mt-2 border" />
              )}
            </div>
          </div>
        )}
      </div>

      {/* 2. STATISTICS ACCORDION */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <button
          onClick={() => toggleSection("stats")}
          className="w-full flex justify-between items-center px-6 py-4 bg-gray-50/50 font-bold text-sm text-[#0B5D38] border-b"
        >
          <span>2. Statistics Strip ({pageData.statistics?.length || 0})</span>
          <span>{openSections.stats ? "▲" : "▼"}</span>
        </button>
        {openSections.stats && (
          <div className="p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-gray-400 font-bold">Configure Counter Strips</span>
              <button onClick={addStat} className="bg-[#0B5D38] text-white px-3 py-1.5 rounded-lg font-bold hover:bg-[#073D24]">
                + Add Stat Card
              </button>
            </div>
            <div className="space-y-4 divide-y">
              {(pageData.statistics || []).map((stat, idx) => (
                <div key={idx} className="pt-4 flex flex-col md:flex-row gap-4 items-start md:items-end justify-between">
                  <div className="grid grid-cols-3 gap-2 flex-1">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase">Title</label>
                      <input
                        type="text"
                        value={stat.title}
                        onChange={(e) => {
                          const updated = [...pageData.statistics];
                          updated[idx].title = e.target.value;
                          setPageData({ ...pageData, statistics: updated });
                        }}
                        className="w-full px-3 py-1.5 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase">Value (e.g. 500+)</label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => {
                          const updated = [...pageData.statistics];
                          updated[idx].value = e.target.value;
                          setPageData({ ...pageData, statistics: updated });
                        }}
                        className="w-full px-3 py-1.5 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase">Icon</label>
                      <select
                        value={stat.icon}
                        onChange={(e) => {
                          const updated = [...pageData.statistics];
                          updated[idx].icon = e.target.value;
                          setPageData({ ...pageData, statistics: updated });
                        }}
                        className="w-full px-3 py-1.5 border rounded-lg bg-white"
                      >
                        {COMMON_ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => moveStat(idx, -1)} disabled={idx === 0} className="px-2 py-1 bg-gray-100 rounded">▲</button>
                    <button onClick={() => moveStat(idx, 1)} disabled={idx === pageData.statistics.length - 1} className="px-2 py-1 bg-gray-100 rounded">▼</button>
                    <button onClick={() => removeStat(idx)} className="px-2 py-1 bg-red-100 text-red-700 rounded font-bold">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. CORE SERVICES ACCORDION */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <button
          onClick={() => toggleSection("core")}
          className="w-full flex justify-between items-center px-6 py-4 bg-gray-50/50 font-bold text-sm text-[#0B5D38] border-b"
        >
          <span>3. Core Services ({pageData.coreServices?.length || 0})</span>
          <span>{openSections.core ? "▲" : "▼"}</span>
        </button>
        {openSections.core && (
          <div className="p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-gray-400 font-bold">Manage Core Services Cards (Exactly 4 Recommended)</span>
              <button onClick={addCore} className="bg-[#0B5D38] text-white px-3 py-1.5 rounded-lg font-bold hover:bg-[#073D24]">
                + Add Core Card
              </button>
            </div>
            <div className="space-y-6 divide-y">
              {(pageData.coreServices || []).map((service, idx) => (
                <div key={idx} className="pt-6 flex flex-col md:flex-row gap-4 items-start justify-between">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase">Title</label>
                      <input
                        type="text"
                        value={service.title}
                        onChange={(e) => {
                          const updated = [...pageData.coreServices];
                          updated[idx].title = e.target.value;
                          setPageData({ ...pageData, coreServices: updated });
                        }}
                        className="w-full px-3 py-1.5 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase">Icon</label>
                      <select
                        value={service.icon}
                        onChange={(e) => {
                          const updated = [...pageData.coreServices];
                          updated[idx].icon = e.target.value;
                          setPageData({ ...pageData, coreServices: updated });
                        }}
                        className="w-full px-3 py-1.5 border rounded-lg bg-white"
                      >
                        {COMMON_ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase">Description</label>
                      <textarea
                        value={service.description}
                        onChange={(e) => {
                          const updated = [...pageData.coreServices];
                          updated[idx].description = e.target.value;
                          setPageData({ ...pageData, coreServices: updated });
                        }}
                        className="w-full px-3 py-1.5 border rounded-lg h-16"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase">Features checklist (Comma-separated)</label>
                      <input
                        type="text"
                        value={service.features?.join(", ") || ""}
                        onChange={(e) => {
                          const updated = [...pageData.coreServices];
                          updated[idx].features = e.target.value.split(",").map(f => f.trim()).filter(Boolean);
                          setPageData({ ...pageData, coreServices: updated });
                        }}
                        className="w-full px-3 py-1.5 border rounded-lg"
                        placeholder="Feature 1, Feature 2, Feature 3"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase">Highlight Badge Text</label>
                      <input
                        type="text"
                        value={service.highlight || ""}
                        onChange={(e) => {
                          const updated = [...pageData.coreServices];
                          updated[idx].highlight = e.target.value;
                          setPageData({ ...pageData, coreServices: updated });
                        }}
                        className="w-full px-3 py-1.5 border rounded-lg"
                        placeholder="e.g. Mysore Gold Standard"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase">S3 Thumbnail Image</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          disabled
                          value={service.image || ""}
                          className="w-full px-3 py-1.5 border rounded-lg bg-gray-50"
                        />
                        <input
                          type="file"
                          id={`coreImg-${idx}`}
                          onChange={(e) => triggerUpload(e, (url) => {
                            const updated = [...pageData.coreServices];
                            updated[idx].image = url;
                            setPageData({ ...pageData, coreServices: updated });
                          })}
                          className="hidden"
                        />
                        <label htmlFor={`coreImg-${idx}`} className="bg-[#0B5D38] text-white px-3 py-1.5 rounded-lg cursor-pointer font-bold">
                          Upload
                        </label>
                      </div>
                      {service.image && (
                        <img src={service.image} alt="Preview" className="h-16 w-auto object-cover mt-2 rounded border" />
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0 self-end md:self-auto">
                    <button onClick={() => moveCore(idx, -1)} disabled={idx === 0} className="px-2 py-1 bg-gray-100 rounded">▲</button>
                    <button onClick={() => moveCore(idx, 1)} disabled={idx === pageData.coreServices.length - 1} className="px-2 py-1 bg-gray-100 rounded">▼</button>
                    <button onClick={() => removeCore(idx)} className="px-2 py-1 bg-red-100 text-red-700 rounded font-bold">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. ADDITIONAL SERVICES ACCORDION */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <button
          onClick={() => toggleSection("additional")}
          className="w-full flex justify-between items-center px-6 py-4 bg-gray-50/50 font-bold text-sm text-[#0B5D38] border-b"
        >
          <span>4. Additional Services ({pageData.additionalServices?.length || 0})</span>
          <span>{openSections.additional ? "▲" : "▼"}</span>
        </button>
        {openSections.additional && (
          <div className="p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-gray-400 font-bold">Manage Secondary Services Cards</span>
              <button onClick={addAdditional} className="bg-[#0B5D38] text-white px-3 py-1.5 rounded-lg font-bold hover:bg-[#073D24]">
                + Add Additional Card
              </button>
            </div>
            <div className="space-y-6 divide-y">
              {(pageData.additionalServices || []).map((service, idx) => (
                <div key={idx} className="pt-6 flex flex-col md:flex-row gap-4 items-start justify-between">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase">Title</label>
                      <input
                        type="text"
                        value={service.title}
                        onChange={(e) => {
                          const updated = [...pageData.additionalServices];
                          updated[idx].title = e.target.value;
                          setPageData({ ...pageData, additionalServices: updated });
                        }}
                        className="w-full px-3 py-1.5 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase">Icon</label>
                      <select
                        value={service.icon}
                        onChange={(e) => {
                          const updated = [...pageData.additionalServices];
                          updated[idx].icon = e.target.value;
                          setPageData({ ...pageData, additionalServices: updated });
                        }}
                        className="w-full px-3 py-1.5 border rounded-lg bg-white"
                      >
                        {COMMON_ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase">Description</label>
                      <textarea
                        value={service.description}
                        onChange={(e) => {
                          const updated = [...pageData.additionalServices];
                          updated[idx].description = e.target.value;
                          setPageData({ ...pageData, additionalServices: updated });
                        }}
                        className="w-full px-3 py-1.5 border rounded-lg h-16"
                      />
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0 self-end md:self-auto">
                    <button onClick={() => moveAdditional(idx, -1)} disabled={idx === 0} className="px-2 py-1 bg-gray-100 rounded">▲</button>
                    <button onClick={() => moveAdditional(idx, 1)} disabled={idx === pageData.additionalServices.length - 1} className="px-2 py-1 bg-gray-100 rounded">▼</button>
                    <button onClick={() => removeAdditional(idx)} className="px-2 py-1 bg-red-100 text-red-700 rounded font-bold">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 5. JOURNEY PROCESS ACCORDION */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <button
          onClick={() => toggleSection("process")}
          className="w-full flex justify-between items-center px-6 py-4 bg-gray-50/50 font-bold text-sm text-[#0B5D38] border-b"
        >
          <span>5. Process timeline steps ({pageData.investmentProcess?.length || 0})</span>
          <span>{openSections.process ? "▲" : "▼"}</span>
        </button>
        {openSections.process && (
          <div className="p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-gray-400 font-bold">Manage Phased Progress (6 Steps Recommended)</span>
              <button onClick={addProcess} className="bg-[#0B5D38] text-white px-3 py-1.5 rounded-lg font-bold hover:bg-[#073D24]">
                + Add Process Step
              </button>
            </div>
            <div className="space-y-6 divide-y">
              {(pageData.investmentProcess || []).map((step, idx) => (
                <div key={idx} className="pt-6 flex flex-col md:flex-row gap-4 items-start justify-between">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase">Step Counter (e.g. 01)</label>
                      <input
                        type="text"
                        value={step.stepNumber}
                        onChange={(e) => {
                          const updated = [...pageData.investmentProcess];
                          updated[idx].stepNumber = e.target.value;
                          setPageData({ ...pageData, investmentProcess: updated });
                        }}
                        className="w-full px-3 py-1.5 border rounded-lg font-bold text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase">Title</label>
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => {
                          const updated = [...pageData.investmentProcess];
                          updated[idx].title = e.target.value;
                          setPageData({ ...pageData, investmentProcess: updated });
                        }}
                        className="w-full px-3 py-1.5 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase">Icon</label>
                      <select
                        value={step.icon}
                        onChange={(e) => {
                          const updated = [...pageData.investmentProcess];
                          updated[idx].icon = e.target.value;
                          setPageData({ ...pageData, investmentProcess: updated });
                        }}
                        className="w-full px-3 py-1.5 border rounded-lg bg-white"
                      >
                        {COMMON_ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase">Short Description</label>
                      <textarea
                        value={step.description}
                        onChange={(e) => {
                          const updated = [...pageData.investmentProcess];
                          updated[idx].description = e.target.value;
                          setPageData({ ...pageData, investmentProcess: updated });
                        }}
                        className="w-full px-3 py-1.5 border rounded-lg h-16"
                      />
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0 self-end md:self-auto">
                    <button onClick={() => moveProcess(idx, -1)} disabled={idx === 0} className="px-2 py-1 bg-gray-100 rounded">▲</button>
                    <button onClick={() => moveProcess(idx, 1)} disabled={idx === pageData.investmentProcess.length - 1} className="px-2 py-1 bg-gray-100 rounded">▼</button>
                    <button onClick={() => removeProcess(idx)} className="px-2 py-1 bg-red-100 text-red-700 rounded font-bold">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 6. CTA SECTION ACCORDION */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <button
          onClick={() => toggleSection("cta")}
          className="w-full flex justify-between items-center px-6 py-4 bg-gray-50/50 font-bold text-sm text-[#0B5D38] border-b"
        >
          <span>6. CTA Section Settings</span>
          <span>{openSections.cta ? "▲" : "▼"}</span>
        </button>
        {openSections.cta && (
          <div className="p-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-500 uppercase mb-1">Heading</label>
                <input
                  type="text"
                  value={pageData.ctaSection?.heading || ""}
                  onChange={(e) => setPageData({ ...pageData, ctaSection: { ...pageData.ctaSection, heading: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-500 uppercase mb-1 font-bold">Button Text</label>
                <input
                  type="text"
                  value={pageData.ctaSection?.buttonText || ""}
                  onChange={(e) => setPageData({ ...pageData, ctaSection: { ...pageData.ctaSection, buttonText: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-500 uppercase mb-1 font-bold">Button Link URL</label>
                <input
                  type="text"
                  value={pageData.ctaSection?.buttonUrl || ""}
                  onChange={(e) => setPageData({ ...pageData, ctaSection: { ...pageData.ctaSection, buttonUrl: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-xl"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold text-gray-500 uppercase mb-1">Description</label>
              <textarea
                value={pageData.ctaSection?.description || ""}
                onChange={(e) => setPageData({ ...pageData, ctaSection: { ...pageData.ctaSection, description: e.target.value } })}
                className="w-full px-4 py-2 border rounded-xl h-20"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-500 uppercase mb-1">Background Image (Contabo S3)</label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  disabled
                  value={pageData.ctaSection?.backgroundImage || ""}
                  className="w-full px-4 py-2 border rounded-xl bg-gray-50"
                />
                <input
                  type="file"
                  id="ctaBgImage"
                  onChange={(e) => triggerUpload(e, (url) => setPageData({ ...pageData, ctaSection: { ...pageData.ctaSection, backgroundImage: url } }))}
                  className="hidden"
                />
                <label htmlFor="ctaBgImage" className="bg-[#0B5D38] hover:bg-[#073D24] text-white px-4 py-2 rounded-xl cursor-pointer font-bold">
                  Upload
                </label>
              </div>
              {pageData.ctaSection?.backgroundImage && (
                <img src={pageData.ctaSection.backgroundImage} alt="Preview" className="h-28 w-auto object-cover rounded-xl mt-2 border" />
              )}
            </div>
          </div>
        )}
      </div>

      {/* 7. VISIBILITY ACCORDION */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <button
          onClick={() => toggleSection("visibility")}
          className="w-full flex justify-between items-center px-6 py-4 bg-gray-50/50 font-bold text-sm text-[#0B5D38] border-b"
        >
          <span>7. Section Visibility Configs</span>
          <span>{openSections.visibility ? "▲" : "▼"}</span>
        </button>
        {openSections.visibility && (
          <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-bold">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={pageData.visibility?.showHero ?? true}
                onChange={(e) => setPageData({ ...pageData, visibility: { ...pageData.visibility, showHero: e.target.checked } })}
                className="rounded text-[#0B5D38]"
              />
              <span>Show Hero Banner</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={pageData.visibility?.showStats ?? true}
                onChange={(e) => setPageData({ ...pageData, visibility: { ...pageData.visibility, showStats: e.target.checked } })}
                className="rounded text-[#0B5D38]"
              />
              <span>Show Stats Strip</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={pageData.visibility?.showCoreServices ?? true}
                onChange={(e) => setPageData({ ...pageData, visibility: { ...pageData.visibility, showCoreServices: e.target.checked } })}
                className="rounded text-[#0B5D38]"
              />
              <span>Show Core Services</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={pageData.visibility?.showAdditionalServices ?? true}
                onChange={(e) => setPageData({ ...pageData, visibility: { ...pageData.visibility, showAdditionalServices: e.target.checked } })}
                className="rounded text-[#0B5D38]"
              />
              <span>Show Additional Services</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={pageData.visibility?.showProcess ?? true}
                onChange={(e) => setPageData({ ...pageData, visibility: { ...pageData.visibility, showProcess: e.target.checked } })}
                className="rounded text-[#0B5D38]"
              />
              <span>Show Process Timeline</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={pageData.visibility?.showCTA ?? true}
                onChange={(e) => setPageData({ ...pageData, visibility: { ...pageData.visibility, showCTA: e.target.checked } })}
                className="rounded text-[#0B5D38]"
              />
              <span>Show CTA Block</span>
            </label>
          </div>
        )}
      </div>

      {/* 8. SEO ACCORDION */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <button
          onClick={() => toggleSection("seo")}
          className="w-full flex justify-between items-center px-6 py-4 bg-gray-50/50 font-bold text-sm text-[#0B5D38] border-b"
        >
          <span>8. SEO & Page Meta Settings</span>
          <span>{openSections.seo ? "▲" : "▼"}</span>
        </button>
        {openSections.seo && (
          <div className="p-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-500 uppercase mb-1">Meta Title</label>
                <input
                  type="text"
                  value={pageData.seo?.metaTitle || ""}
                  onChange={(e) => setPageData({ ...pageData, seo: { ...pageData.seo, metaTitle: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-500 uppercase mb-1">Canonical URL</label>
                <input
                  type="text"
                  value={pageData.seo?.canonicalUrl || ""}
                  onChange={(e) => setPageData({ ...pageData, seo: { ...pageData.seo, canonicalUrl: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-xl"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-bold text-gray-500 uppercase mb-1">Meta Description</label>
                <textarea
                  value={pageData.seo?.metaDescription || ""}
                  onChange={(e) => setPageData({ ...pageData, seo: { ...pageData.seo, metaDescription: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-xl h-16"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-bold text-gray-500 uppercase mb-1">Keywords</label>
                <input
                  type="text"
                  value={pageData.seo?.keywords || ""}
                  onChange={(e) => setPageData({ ...pageData, seo: { ...pageData.seo, keywords: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-500 uppercase mb-1">OpenGraph Image (Contabo S3)</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    disabled
                    value={pageData.seo?.ogImage || ""}
                    className="w-full px-4 py-2 border rounded-xl bg-gray-50"
                  />
                  <input
                    type="file"
                    id="seoOgImage"
                    onChange={(e) => triggerUpload(e, (url) => setPageData({ ...pageData, seo: { ...pageData.seo, ogImage: url } }))}
                    className="hidden"
                  />
                  <label htmlFor="seoOgImage" className="bg-[#0B5D38] text-white px-4 py-2 rounded-xl cursor-pointer font-bold">
                    Upload
                  </label>
                </div>
              </div>
              <div>
                <label className="block font-bold text-gray-500 uppercase mb-1">Twitter Card Image (Contabo S3)</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    disabled
                    value={pageData.seo?.twitterCard || ""}
                    className="w-full px-4 py-2 border rounded-xl bg-gray-50"
                  />
                  <input
                    type="file"
                    id="seoTwitterImage"
                    onChange={(e) => triggerUpload(e, (url) => setPageData({ ...pageData, seo: { ...pageData.seo, twitterCard: url } }))}
                    className="hidden"
                  />
                  <label htmlFor="seoTwitterImage" className="bg-[#0B5D38] text-white px-4 py-2 rounded-xl cursor-pointer font-bold">
                    Upload
                  </label>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block font-bold text-gray-500 uppercase mb-1">Schema Markup (JSON-LD)</label>
                <textarea
                  value={pageData.seo?.schemaMarkup || ""}
                  onChange={(e) => setPageData({ ...pageData, seo: { ...pageData.seo, schemaMarkup: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-xl h-24 font-mono"
                  placeholder='{ "@context": "https://schema.org", ... }'
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
