"use client";

import React, { useState, useEffect } from "react";
import { PageLoader } from "../../../../components/PageLoader";
import { IconPicker } from "../../../../components/IconPicker";

// Ensures older DB documents (saved before new fields were added) don't
// crash the controlled inputs below.
const withDefaults = (data) => ({
  ...data,
  hero: {
    ...data.hero,
    bgImages: data.hero?.bgImages && data.hero.bgImages.length > 0
      ? data.hero.bgImages
      : data.hero?.bgImage
      ? [data.hero.bgImage]
      : [],
  },
  whyInvest: data.whyInvest || { smallTitle: "Sustainable Returns", heading: "Why Invest in Sandalwood?" },
  highlightsSection: data.highlightsSection || { smallTitle: "World-Class Amenities", heading: "Estate Highlights & Infrastructure" },
  processSection: data.processSection || { smallTitle: "Step-by-Step", heading: "Our Investment Process" },
  trustCards: data.trustCards || [],
  investmentBenefits: data.investmentBenefits || [],
  highlights: data.highlights || [],
  processSteps: data.processSteps || [],
  testimonials: data.testimonials || [],
});

// Defined at module scope (not inside the page component) so its identity
// stays stable across renders. Previously this was declared inside
// HomeCMS(), which meant React saw a brand-new component type on every
// keystroke and remounted the whole accordion body (including inputs),
// causing the input to lose focus after a single character.
const AccordionShell = ({ id, title, expandedSection, toggleAccordion, children }) => (
  <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
    <button
      type="button"
      onClick={() => toggleAccordion(id)}
      className="w-full flex justify-between items-center px-6 py-4 bg-gray-50/70 border-b hover:bg-gray-50 transition-colors"
    >
      <span className="font-playfair text-base font-bold text-[#0F9D6D]">{title}</span>
      <span className="text-xs text-gray-400">{expandedSection === id ? "Collapse ▲" : "Expand ▼"}</span>
    </button>
    {expandedSection === id && <div className="p-6 space-y-4">{children}</div>}
  </div>
);

export default function HomeCMS() {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [homeData, setHomeData] = useState(null);
  const [projectsList, setProjectsList] = useState([]);

  // Section Accordion Expanded states
  const [expandedSection, setExpandedSection] = useState("hero"); // defaults to hero

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/home");
        const val = await res.json();
        setHomeData(withDefaults(val));
      } catch (err) {
        console.error("Home CMS failed to fetch:", err);
      } finally {
        setLoading(false);
      }
    }
    async function loadProjects() {
      try {
        const res = await fetch("/api/projects");
        const val = await res.json();
        setProjectsList(Array.isArray(val) ? val : []);
      } catch (err) {
        console.error("Projects list failed to fetch:", err);
      }
    }
    loadData();
    loadProjects();
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
      if (data.url) callback(data.url);
    } catch (err) {
      alert("S3 upload failed");
    } finally {
      setUploading(false);
    }
  };

  const updateNested = (path, value) => {
    setHomeData((prev) => {
      const copy = { ...prev };
      const keys = path.split(".");
      let current = copy;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return { ...copy };
    });
  };

  const getNested = (obj, path) => path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);

  const setNested = (obj, path, value) => {
    const keys = path.split(".");
    const copy = { ...obj };
    let current = copy;
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    return copy;
  };

  const updateArrayItem = (arrayKey, idx, field, value) => {
    setHomeData((prev) => {
      const arr = [...(getNested(prev, arrayKey) || [])];
      arr[idx] = { ...arr[idx], [field]: value };
      return setNested(prev, arrayKey, arr);
    });
  };

  const addArrayItem = (arrayKey, blankItem) => {
    setHomeData((prev) => {
      const arr = [...(getNested(prev, arrayKey) || []), blankItem];
      return setNested(prev, arrayKey, arr);
    });
  };

  const deleteArrayItem = (arrayKey, idx) => {
    setHomeData((prev) => {
      const arr = (getNested(prev, arrayKey) || []).filter((_, i) => i !== idx);
      return setNested(prev, arrayKey, arr);
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(homeData),
      });
      if (res.ok) alert("Home page CMS saved!");
    } catch (e) {
      alert("Error saving Home CMS");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !homeData) return <PageLoader />;

  const toggleAccordion = (sec) => {
    setExpandedSection((prev) => (prev === sec ? "" : sec));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-4">
        <div>
          <h2 className="font-playfair text-2xl font-extrabold text-[#0F9D6D]">Home Page CMS</h2>
          <p className="text-xs text-gray-500 mt-1">Configure layout parts and visual assets on the Home page.</p>
        </div>
        <button
          onClick={handleSave}
          className="bg-[#0F9D6D] text-white hover:bg-[#12B886] font-bold px-6 py-2.5 rounded-full text-xs shadow-md"
        >
          Save All Changes
        </button>
      </div>

      {uploading && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-xl flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#0F9D6D] border-t-transparent" />
            <span className="font-semibold text-sm">Uploading file to Contabo S3...</span>
          </div>
        </div>
      )}

      {/* Visibility Section */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
        <h3 className="font-playfair text-sm font-bold text-[#0F9D6D] uppercase tracking-wider">Section Visibilities</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.keys(homeData.visibility).map((key) => (
            <label key={key} className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={homeData.visibility[key]}
                onChange={(e) => updateNested(`visibility.${key}`, e.target.checked)}
                className="rounded border-gray-300 text-[#0F9D6D] focus:ring-[#0F9D6D] h-4 w-4"
              />
              <span>{key.replace("show", "")}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {/* Section 1: Hero */}
        <AccordionShell id="hero" title="Hero Banner Settings" expandedSection={expandedSection} toggleAccordion={toggleAccordion}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Small Heading</label>
              <input
                type="text"
                value={homeData.hero.smallHeading}
                onChange={(e) => updateNested("hero.smallHeading", e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Main Heading</label>
              <input
                type="text"
                value={homeData.hero.mainHeading}
                onChange={(e) => updateNested("hero.mainHeading", e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
              <textarea
                value={homeData.hero.description}
                onChange={(e) => updateNested("hero.description", e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm h-16"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Primary Button Label</label>
              <input
                type="text"
                value={homeData.hero.primaryBtnText}
                onChange={(e) => updateNested("hero.primaryBtnText", e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Primary Button Link</label>
              <input
                type="text"
                value={homeData.hero.primaryBtnUrl}
                onChange={(e) => updateNested("hero.primaryBtnUrl", e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                Background Images (Scrolling Banner)
              </label>
              <p className="text-[11px] text-gray-400 mb-3">
                Upload multiple images — they'll auto-rotate as a slideshow behind the hero banner.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                {homeData.hero.bgImages.map((img, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-video bg-gray-50">
                    <img src={img} alt={`Hero background ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => deleteArrayItem("hero.bgImages", idx)}
                      className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove image"
                    >
                      ✕
                    </button>
                    <span className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                      {idx + 1}
                    </span>
                  </div>
                ))}
              </div>
              <input
                type="file"
                id="heroBg"
                onChange={(e) => triggerUpload(e, (url) => addArrayItem("hero.bgImages", url))}
                className="hidden"
              />
              <label htmlFor="heroBg" className="inline-block bg-[#0F9D6D] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer">
                + Add Background Image
              </label>
            </div>
          </div>
        </AccordionShell>

        {/* Section 2: Stats */}
        <AccordionShell id="stats" title="Hero Statistics Cards" expandedSection={expandedSection} toggleAccordion={toggleAccordion}>
          {homeData.stats.map((stat, idx) => (
            <div key={idx} className="flex flex-wrap md:flex-nowrap items-center gap-3 p-3 border rounded-xl bg-gray-50 relative">
              <input
                type="text"
                placeholder="Title"
                value={stat.title}
                onChange={(e) => updateArrayItem("stats", idx, "title", e.target.value)}
                className="w-full md:w-1/3 px-3 py-1.5 border rounded-lg text-xs"
              />
              <input
                type="text"
                placeholder="Value"
                value={stat.value}
                onChange={(e) => updateArrayItem("stats", idx, "value", e.target.value)}
                className="w-full md:w-1/4 px-3 py-1.5 border rounded-lg text-xs"
              />
              <div className="w-full md:w-1/3">
                <IconPicker label="" value={stat.icon} onChange={(val) => updateArrayItem("stats", idx, "icon", val)} />
              </div>
              <button
                type="button"
                onClick={() => deleteArrayItem("stats", idx)}
                className="text-red-600 hover:text-red-800 text-xs font-bold ml-auto"
              >
                Delete
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("stats", { title: "", value: "", icon: "Trees", sortOrder: 0 })}
            className="text-xs bg-[#0F9D6D] text-white px-3 py-1.5 rounded-lg font-bold"
          >
            + Add Card
          </button>
        </AccordionShell>

        {/* Section 3: Trust Cards (Image 01) */}
        <AccordionShell id="trust" title="Trust Cards (3-Card Strip Below Hero)" expandedSection={expandedSection} toggleAccordion={toggleAccordion}>
          {homeData.trustCards.map((item, idx) => (
            <div key={idx} className="p-4 border rounded-xl bg-gray-50 space-y-3 relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <IconPicker value={item.icon} onChange={(val) => updateArrayItem("trustCards", idx, "icon", val)} />
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateArrayItem("trustCards", idx, "title", e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                <textarea
                  value={item.description}
                  onChange={(e) => updateArrayItem("trustCards", idx, "description", e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm h-16"
                />
              </div>
              <button
                type="button"
                onClick={() => deleteArrayItem("trustCards", idx)}
                className="text-red-600 hover:text-red-800 text-xs font-bold"
              >
                Delete Card
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("trustCards", { icon: "Trees", title: "", description: "" })}
            className="text-xs bg-[#0F9D6D] text-white px-3 py-1.5 rounded-lg font-bold"
          >
            + Add Card
          </button>
        </AccordionShell>

        {/* Section 3.5: Featured Project */}
        <AccordionShell id="featured" title="Featured Project" expandedSection={expandedSection} toggleAccordion={toggleAccordion}>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select Project to Feature on Home Page</label>
            <select
              value={homeData.featuredProjectId || ""}
              onChange={(e) => updateNested("featuredProjectId", e.target.value || null)}
              className="w-full px-4 py-2 border rounded-xl text-sm bg-white"
            >
              <option value="">— None Selected —</option>
              {projectsList.map((proj) => (
                <option key={proj._id} value={proj._id}>
                  {proj.title}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-gray-400 mt-2">
              The Featured Project section on the Home page will always display the details (image, location, pricing, etc.) of the project selected here, pulled live from Projects.
            </p>
          </div>
        </AccordionShell>

        {/* Section 4: About Preview */}
        <AccordionShell id="about" title="About Preview Settings" expandedSection={expandedSection} toggleAccordion={toggleAccordion}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Small Heading</label>
              <input
                type="text"
                value={homeData.aboutPreview.smallTitle}
                onChange={(e) => updateNested("aboutPreview.smallTitle", e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Heading</label>
              <input
                type="text"
                value={homeData.aboutPreview.heading}
                onChange={(e) => updateNested("aboutPreview.heading", e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
              <textarea
                value={homeData.aboutPreview.description}
                onChange={(e) => updateNested("aboutPreview.description", e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm h-16"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mission Quote</label>
              <input
                type="text"
                value={homeData.aboutPreview.mission}
                onChange={(e) => updateNested("aboutPreview.mission", e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Vision Quote</label>
              <input
                type="text"
                value={homeData.aboutPreview.vision}
                onChange={(e) => updateNested("aboutPreview.vision", e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Featured image (S3)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  disabled
                  value={homeData.aboutPreview.image}
                  className="w-full px-3 py-2 border rounded-xl bg-gray-50 text-xs"
                />
                <input
                  type="file"
                  id="aboutPrevImg"
                  onChange={(e) => triggerUpload(e, (url) => updateNested("aboutPreview.image", url))}
                  className="hidden"
                />
                <label htmlFor="aboutPrevImg" className="bg-[#0F9D6D] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer">
                  Upload
                </label>
              </div>
            </div>
          </div>
        </AccordionShell>

        {/* Section 5: Why Invest (Image 02) */}
        <AccordionShell id="whyInvest" title="Why Invest Section (Benefit Cards)" expandedSection={expandedSection} toggleAccordion={toggleAccordion}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2 border-b">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Small Heading</label>
              <input
                type="text"
                value={homeData.whyInvest.smallTitle}
                onChange={(e) => updateNested("whyInvest.smallTitle", e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Main Title</label>
              <input
                type="text"
                value={homeData.whyInvest.heading}
                onChange={(e) => updateNested("whyInvest.heading", e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
          </div>

          {homeData.investmentBenefits.map((item, idx) => (
            <div key={idx} className="p-4 border rounded-xl bg-gray-50 space-y-3 relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <IconPicker value={item.icon} onChange={(val) => updateArrayItem("investmentBenefits", idx, "icon", val)} />
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateArrayItem("investmentBenefits", idx, "title", e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                <textarea
                  value={item.description}
                  onChange={(e) => updateArrayItem("investmentBenefits", idx, "description", e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm h-16"
                />
              </div>
              <button
                type="button"
                onClick={() => deleteArrayItem("investmentBenefits", idx)}
                className="text-red-600 hover:text-red-800 text-xs font-bold"
              >
                Delete Card
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("investmentBenefits", { icon: "Leaf", title: "", description: "" })}
            className="text-xs bg-[#0F9D6D] text-white px-3 py-1.5 rounded-lg font-bold"
          >
            + Add Card
          </button>
        </AccordionShell>

        {/* Section 6: Estate Highlights (Image 03) */}
        <AccordionShell id="highlights" title="Estate Highlights & Infrastructure" expandedSection={expandedSection} toggleAccordion={toggleAccordion}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2 border-b">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Small Heading</label>
              <input
                type="text"
                value={homeData.highlightsSection.smallTitle}
                onChange={(e) => updateNested("highlightsSection.smallTitle", e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Main Title</label>
              <input
                type="text"
                value={homeData.highlightsSection.heading}
                onChange={(e) => updateNested("highlightsSection.heading", e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
          </div>

          {homeData.highlights.map((item, idx) => (
            <div key={idx} className="p-4 border rounded-xl bg-gray-50 space-y-3 relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <IconPicker value={item.icon} onChange={(val) => updateArrayItem("highlights", idx, "icon", val)} />
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateArrayItem("highlights", idx, "title", e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subtitle / Description</label>
                <input
                  type="text"
                  value={item.subtitle}
                  onChange={(e) => updateArrayItem("highlights", idx, "subtitle", e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>
              <button
                type="button"
                onClick={() => deleteArrayItem("highlights", idx)}
                className="text-red-600 hover:text-red-800 text-xs font-bold"
              >
                Delete Card
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("highlights", { icon: "Grid", title: "", subtitle: "", sortOrder: homeData.highlights.length + 1 })}
            className="text-xs bg-[#0F9D6D] text-white px-3 py-1.5 rounded-lg font-bold"
          >
            + Add Card
          </button>
        </AccordionShell>

        {/* Section 7: Investment Process (Image 04) */}
        <AccordionShell id="process" title="Investment Process Steps" expandedSection={expandedSection} toggleAccordion={toggleAccordion}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2 border-b">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Small Heading</label>
              <input
                type="text"
                value={homeData.processSection.smallTitle}
                onChange={(e) => updateNested("processSection.smallTitle", e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Main Title</label>
              <input
                type="text"
                value={homeData.processSection.heading}
                onChange={(e) => updateNested("processSection.heading", e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
          </div>

          {homeData.processSteps.map((item, idx) => (
            <div key={idx} className="p-4 border rounded-xl bg-gray-50 space-y-3 relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Number (e.g. 01)</label>
                  <input
                    type="text"
                    value={item.step}
                    onChange={(e) => updateArrayItem("processSteps", idx, "step", e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateArrayItem("processSteps", idx, "title", e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateArrayItem("processSteps", idx, "description", e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Extra Detail (italic subtext)</label>
                <input
                  type="text"
                  value={item.details}
                  onChange={(e) => updateArrayItem("processSteps", idx, "details", e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>
              <button
                type="button"
                onClick={() => deleteArrayItem("processSteps", idx)}
                className="text-red-600 hover:text-red-800 text-xs font-bold"
              >
                Delete Step
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              addArrayItem("processSteps", {
                step: String(homeData.processSteps.length + 1).padStart(2, "0"),
                title: "",
                description: "",
                details: "",
              })
            }
            className="text-xs bg-[#0F9D6D] text-white px-3 py-1.5 rounded-lg font-bold"
          >
            + Add Step
          </button>
        </AccordionShell>

        {/* Section 8: Testimonials (Image 05) */}
        <AccordionShell id="testimonials" title="Client Testimonials" expandedSection={expandedSection} toggleAccordion={toggleAccordion}>
          {homeData.testimonials.map((item, idx) => (
            <div key={idx} className="p-4 border rounded-xl bg-gray-50 space-y-3 relative">
              <div className="flex items-center gap-3">
                <img
                  src={item.avatar || "https://placehold.co/80x80"}
                  alt=""
                  className="w-14 h-14 rounded-full object-cover border"
                />
                <input
                  type="file"
                  id={`testimonialAvatar-${idx}`}
                  onChange={(e) => triggerUpload(e, (url) => updateArrayItem("testimonials", idx, "avatar", url))}
                  className="hidden"
                />
                <label
                  htmlFor={`testimonialAvatar-${idx}`}
                  className="bg-[#0F9D6D] text-white px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                >
                  Upload Photo
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateArrayItem("testimonials", idx, "name", e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Role / Profession</label>
                  <input
                    type="text"
                    value={item.role}
                    onChange={(e) => updateArrayItem("testimonials", idx, "role", e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Location</label>
                  <input
                    type="text"
                    value={item.location}
                    onChange={(e) => updateArrayItem("testimonials", idx, "location", e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Plot Owned</label>
                <input
                  type="text"
                  value={item.plotOwned}
                  onChange={(e) => updateArrayItem("testimonials", idx, "plotOwned", e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Testimonial Message</label>
                <textarea
                  value={item.quote}
                  onChange={(e) => updateArrayItem("testimonials", idx, "quote", e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm h-20"
                />
              </div>
              <button
                type="button"
                onClick={() => deleteArrayItem("testimonials", idx)}
                className="text-red-600 hover:text-red-800 text-xs font-bold"
              >
                Delete Testimonial
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              addArrayItem("testimonials", {
                name: "",
                role: "",
                location: "",
                avatar: "",
                rating: 5,
                quote: "",
                plotOwned: "",
              })
            }
            className="text-xs bg-[#0F9D6D] text-white px-3 py-1.5 rounded-lg font-bold"
          >
            + Add Testimonial
          </button>
        </AccordionShell>
      </div>
    </div>
  );
}
