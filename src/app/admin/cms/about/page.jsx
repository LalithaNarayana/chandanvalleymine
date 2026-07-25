"use client";

import React, { useState, useEffect } from "react";
import { PageLoader } from "../../../../components/PageLoader";
import { IconPicker } from "../../../../components/IconPicker";

// Defined at module scope (not inside the page component) so its identity
// stays stable across renders. Previously this was declared inside the
// AboutCMS component, which meant React saw a brand-new component type on
// every keystroke and remounted the whole accordion body (including
// inputs), causing the input to lose focus after a single character.
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

// Ensures older DB documents (saved before new fields were added) don't
// crash the controlled inputs below.
const withDefaults = (data) => ({
  ...data,
  ourStory: {
    ...data.ourStory,
    badgeTitle: data.ourStory?.badgeTitle || "15+ Years",
    badgeSubtitle: data.ourStory?.badgeSubtitle || "OF AGRICULTURAL EXCELLENCE",
  },
  coreValuesSection: data.coreValuesSection || { title: "Our Core Values" },
  coreValues: data.coreValues || [],
  journeySection: data.journeySection || { title: "The Journey", subtitle: "SANDALWOOD OF GROWTH" },
  journeyTimeline: data.journeyTimeline || [],
  whyChooseUs: {
    smallTitle: data.whyChooseUs?.smallTitle || "INVESTOR BENEFITS",
    heading: data.whyChooseUs?.heading || "Why Choose Us?",
    checklist: data.whyChooseUs?.checklist || [],
    images: data.whyChooseUs?.images && data.whyChooseUs.images.length === 4
      ? data.whyChooseUs.images
      : [data.whyChooseUs?.images?.[0] || "", data.whyChooseUs?.images?.[1] || "", data.whyChooseUs?.images?.[2] || "", data.whyChooseUs?.images?.[3] || ""],
  },
  cta: {
    heading: "",
    description: "",
    primaryBtnText: "Book Site Visit",
    ...data.cta,
    primaryBtnUrl: data.cta?.primaryBtnUrl || "/contact",
  },
});

export default function AboutCMS() {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [aboutData, setAboutData] = useState(null);

  // Section Accordion Expanded states
  const [expandedSection, setExpandedSection] = useState("hero");

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/about");
        const val = await res.json();
        setAboutData(withDefaults(val));
      } catch (err) {
        console.error("About CMS failed to fetch:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
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
    setAboutData((prev) => {
      const copy = { ...prev };
      const keys = path.split(".");
      let current = copy;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return copy;
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
    setAboutData((prev) => {
      const arr = [...(getNested(prev, arrayKey) || [])];
      arr[idx] = { ...arr[idx], [field]: value };
      return setNested(prev, arrayKey, arr);
    });
  };

  const addArrayItem = (arrayKey, blankItem) => {
    setAboutData((prev) => {
      const arr = [...(getNested(prev, arrayKey) || []), blankItem];
      return setNested(prev, arrayKey, arr);
    });
  };

  const deleteArrayItem = (arrayKey, idx) => {
    setAboutData((prev) => {
      const arr = (getNested(prev, arrayKey) || []).filter((_, i) => i !== idx);
      return setNested(prev, arrayKey, arr);
    });
  };

  const updateImageAt = (arrayKey, idx, url) => {
    setAboutData((prev) => {
      const arr = [...(getNested(prev, arrayKey) || [])];
      arr[idx] = url;
      return setNested(prev, arrayKey, arr);
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aboutData),
      });
      if (res.ok) alert("About page CMS saved!");
    } catch (e) {
      alert("Error saving About CMS");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !aboutData) return <PageLoader />;

  const toggleAccordion = (sec) => {
    setExpandedSection((prev) => (prev === sec ? "" : sec));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-4">
        <div>
          <h2 className="font-playfair text-2xl font-extrabold text-[#0F9D6D]">About Page CMS</h2>
          <p className="text-xs text-gray-500 mt-1">Configure layout parts and milestones on the About Us page.</p>
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
          {Object.keys(aboutData.visibility).map((key) => (
            <label key={key} className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={aboutData.visibility[key]}
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
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Heading</label>
              <input
                type="text"
                value={aboutData.hero.heading}
                onChange={(e) => updateNested("hero.heading", e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
              <textarea
                value={aboutData.hero.description}
                onChange={(e) => updateNested("hero.description", e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm h-16"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Background Image Url (S3)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  disabled
                  value={aboutData.hero.bgImage}
                  className="w-full px-3 py-2 border rounded-xl bg-gray-50 text-xs"
                />
                <input
                  type="file"
                  id="aboutHeroBg"
                  onChange={(e) => triggerUpload(e, (url) => updateNested("hero.bgImage", url))}
                  className="hidden"
                />
                <label htmlFor="aboutHeroBg" className="bg-[#0F9D6D] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer">
                  Upload
                </label>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Watch Video Button Label</label>
              <input
                type="text"
                value={aboutData.hero.secondaryBtnText}
                onChange={(e) => updateNested("hero.secondaryBtnText", e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm"
                placeholder="Watch Video"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Watch Video URL</label>
              <input
                type="text"
                value={aboutData.hero.secondaryBtnUrl}
                onChange={(e) => updateNested("hero.secondaryBtnUrl", e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm"
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Clicking the button on the About page will open this video URL in a new tab.
              </p>
            </div>
          </div>
        </AccordionShell>

        {/* Section 2: Story */}
        <AccordionShell id="story" title="Our Story Section" expandedSection={expandedSection} toggleAccordion={toggleAccordion}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Small Title</label>
              <input
                type="text"
                value={aboutData.ourStory.smallTitle}
                onChange={(e) => updateNested("ourStory.smallTitle", e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Heading</label>
              <input
                type="text"
                value={aboutData.ourStory.heading}
                onChange={(e) => updateNested("ourStory.heading", e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Story Content Text</label>
              <textarea
                value={aboutData.ourStory.description}
                onChange={(e) => updateNested("ourStory.description", e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm h-32"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Story image (S3)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  disabled
                  value={aboutData.ourStory.image}
                  className="w-full px-3 py-2 border rounded-xl bg-gray-50 text-xs"
                />
                <input
                  type="file"
                  id="storyImg"
                  onChange={(e) => triggerUpload(e, (url) => updateNested("ourStory.image", url))}
                  className="hidden"
                />
                <label htmlFor="storyImg" className="bg-[#0F9D6D] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer">
                  Upload
                </label>
              </div>
            </div>
            <div className="md:col-span-2 border-t pt-4 mt-2">
              <p className="text-xs font-bold text-gray-500 uppercase mb-3">Floating Badge (over story image)</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Badge Title</label>
              <input
                type="text"
                placeholder="15+ Years"
                value={aboutData.ourStory.badgeTitle}
                onChange={(e) => updateNested("ourStory.badgeTitle", e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Badge Subtitle</label>
              <input
                type="text"
                placeholder="OF AGRICULTURAL EXCELLENCE"
                value={aboutData.ourStory.badgeSubtitle}
                onChange={(e) => updateNested("ourStory.badgeSubtitle", e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
          </div>
        </AccordionShell>

        {/* Section 3: Mission & Vision (read-only pointer to Home CMS) */}
        <AccordionShell id="missionvision" title="Mission & Vision Section" expandedSection={expandedSection} toggleAccordion={toggleAccordion}>
          <div className="bg-[#F8FAF8] border border-[#E5E7EB] rounded-xl p-4 text-xs text-gray-600 leading-relaxed">
            The Mission and Vision copy shown on this page is pulled directly from the{" "}
            <span className="font-bold text-[#0F9D6D]">Home Page CMS → Heritage &amp; Excellence</span> section, so
            it only needs to be maintained in one place. Edit it from the{" "}
            <a href="/admin/cms/home" className="text-[#0F9D6D] underline font-bold">Home Page CMS</a>.
          </div>
        </AccordionShell>

        {/* Section 4: Founder */}
        <AccordionShell id="founder" title="Founder Profile Settings" expandedSection={expandedSection} toggleAccordion={toggleAccordion}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Founder Name</label>
              <input
                type="text"
                value={aboutData.founder.name}
                onChange={(e) => updateNested("founder.name", e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Designation</label>
              <input
                type="text"
                value={aboutData.founder.designation}
                onChange={(e) => updateNested("founder.designation", e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Founder Message Quote</label>
              <textarea
                value={aboutData.founder.quote}
                onChange={(e) => updateNested("founder.quote", e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm h-20"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Founder Portrait Image (S3)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  disabled
                  value={aboutData.founder.image}
                  className="w-full px-3 py-2 border rounded-xl bg-gray-50 text-xs"
                />
                <input
                  type="file"
                  id="founderImg"
                  onChange={(e) => triggerUpload(e, (url) => updateNested("founder.image", url))}
                  className="hidden"
                />
                <label htmlFor="founderImg" className="bg-[#0F9D6D] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer">
                  Upload
                </label>
              </div>
            </div>
          </div>
        </AccordionShell>

        {/* Section 5: Core Values */}
        <AccordionShell id="coreValues" title="Our Core Values Section" expandedSection={expandedSection} toggleAccordion={toggleAccordion}>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Section Title</label>
            <input
              type="text"
              value={aboutData.coreValuesSection.title}
              onChange={(e) => updateNested("coreValuesSection.title", e.target.value)}
              className="w-full px-4 py-2 border rounded-xl text-sm"
            />
          </div>

          <div className="space-y-3 pt-2">
            {aboutData.coreValues.map((item, idx) => (
              <div key={idx} className="p-4 border rounded-xl bg-gray-50 space-y-3 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <IconPicker value={item.icon} onChange={(val) => updateArrayItem("coreValues", idx, "icon", val)} />
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateArrayItem("coreValues", idx, "title", e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                  <textarea
                    value={item.description}
                    onChange={(e) => updateArrayItem("coreValues", idx, "description", e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm h-16"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => deleteArrayItem("coreValues", idx)}
                  className="text-red-600 hover:text-red-800 text-xs font-bold"
                >
                  Delete Value
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => addArrayItem("coreValues", { title: "", description: "", icon: "ShieldCheck" })}
            className="text-xs bg-[#0F9D6D] text-white px-3 py-1.5 rounded-lg font-bold"
          >
            + Add Core Value
          </button>
        </AccordionShell>

        {/* Section 6: Journey Timeline */}
        <AccordionShell id="journey" title="Company Journey Timeline" expandedSection={expandedSection} toggleAccordion={toggleAccordion}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Main Title</label>
              <input
                type="text"
                value={aboutData.journeySection.title}
                onChange={(e) => updateNested("journeySection.title", e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subtitle</label>
              <input
                type="text"
                value={aboutData.journeySection.subtitle}
                onChange={(e) => updateNested("journeySection.subtitle", e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {aboutData.journeyTimeline.map((item, idx) => (
              <div key={idx} className="p-4 border rounded-xl bg-gray-50 space-y-3 relative">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image || "https://placehold.co/120x80"}
                    alt=""
                    className="w-24 h-16 rounded-lg object-cover border"
                  />
                  <input
                    type="file"
                    id={`journeyImg-${idx}`}
                    onChange={(e) => triggerUpload(e, (url) => updateArrayItem("journeyTimeline", idx, "image", url))}
                    className="hidden"
                  />
                  <label
                    htmlFor={`journeyImg-${idx}`}
                    className="bg-[#0F9D6D] text-white px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Upload Image
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Year</label>
                    <input
                      type="text"
                      value={item.year}
                      onChange={(e) => updateArrayItem("journeyTimeline", idx, "year", e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateArrayItem("journeyTimeline", idx, "title", e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                  <textarea
                    value={item.description}
                    onChange={(e) => updateArrayItem("journeyTimeline", idx, "description", e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm h-16"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => deleteArrayItem("journeyTimeline", idx)}
                  className="text-red-600 hover:text-red-800 text-xs font-bold"
                >
                  Delete Milestone
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => addArrayItem("journeyTimeline", { year: "", title: "", description: "", image: "" })}
            className="text-xs bg-[#0F9D6D] text-white px-3 py-1.5 rounded-lg font-bold"
          >
            + Add Milestone
          </button>
        </AccordionShell>

        {/* Section 7: Why Choose Us */}
        <AccordionShell id="whyChooseUs" title="Why Choose Us Section" expandedSection={expandedSection} toggleAccordion={toggleAccordion}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Small Title</label>
              <input
                type="text"
                value={aboutData.whyChooseUs.smallTitle}
                onChange={(e) => updateNested("whyChooseUs.smallTitle", e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Heading</label>
              <input
                type="text"
                value={aboutData.whyChooseUs.heading}
                onChange={(e) => updateNested("whyChooseUs.heading", e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <p className="text-xs font-bold text-gray-500 uppercase">Checklist Items</p>
            {aboutData.whyChooseUs.checklist.map((item, idx) => (
              <div key={idx} className="p-4 border rounded-xl bg-gray-50 space-y-3 relative">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateArrayItem("whyChooseUs.checklist", idx, "title", e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                  <textarea
                    value={item.description}
                    onChange={(e) => updateArrayItem("whyChooseUs.checklist", idx, "description", e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm h-16"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => deleteArrayItem("whyChooseUs.checklist", idx)}
                  className="text-red-600 hover:text-red-800 text-xs font-bold"
                >
                  Delete Item
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => addArrayItem("whyChooseUs.checklist", { title: "", description: "" })}
            className="text-xs bg-[#0F9D6D] text-white px-3 py-1.5 rounded-lg font-bold"
          >
            + Add Checklist Item
          </button>

          <div className="border-t pt-4 mt-4 space-y-3">
            <p className="text-xs font-bold text-gray-500 uppercase">
              Collage Images (fixed set of 4 — replace individually, cannot add/remove)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {aboutData.whyChooseUs.images.map((img, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="rounded-xl overflow-hidden border border-gray-200 aspect-square bg-gray-50">
                    <img src={img || "https://placehold.co/300x300"} alt={`Collage ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                  <input
                    type="file"
                    id={`whyChooseImg-${idx}`}
                    onChange={(e) => triggerUpload(e, (url) => updateImageAt("whyChooseUs.images", idx, url))}
                    className="hidden"
                  />
                  <label
                    htmlFor={`whyChooseImg-${idx}`}
                    className="block text-center bg-[#0F9D6D] text-white px-2 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer"
                  >
                    Replace Image {idx + 1}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </AccordionShell>

        {/* Section 8: CTA */}
        <AccordionShell id="cta" title="Call To Action Section" expandedSection={expandedSection} toggleAccordion={toggleAccordion}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Heading</label>
              <input
                type="text"
                value={aboutData.cta.heading}
                onChange={(e) => updateNested("cta.heading", e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
              <textarea
                value={aboutData.cta.description}
                onChange={(e) => updateNested("cta.description", e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm h-16"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Button Label</label>
              <input
                type="text"
                value={aboutData.cta.primaryBtnText}
                onChange={(e) => updateNested("cta.primaryBtnText", e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Button Link</label>
              <input
                type="text"
                value={aboutData.cta.primaryBtnUrl}
                onChange={(e) => updateNested("cta.primaryBtnUrl", e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm"
                placeholder="/contact"
              />
            </div>
          </div>
        </AccordionShell>
      </div>
    </div>
  );
}
