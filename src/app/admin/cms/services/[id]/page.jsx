"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageLoader } from "../../../../../components/PageLoader";

const SECTION_TYPES = [
  "Hero",
  "Text Block",
  "Image",
  "Video",
  "Gallery",
  "Timeline",
  "Feature Cards",
  "Statistics",
  "Benefits",
  "Accordion",
  "Testimonials",
  "CTA",
  "Custom Rich Text",
  "Image + Content",
  "Two Column Layout",
  "Three Column Layout",
  "Table",
  "Download Brochure",
  "Investment Calculator",
  "Custom HTML"
];

const COMMON_ICONS = [
  "Trees", "ShieldCheck", "TrendingUp", "Coins", "Leaf", "Globe", "Lock",
  "BarChart3", "Sparkles", "Grid", "Compass", "Droplets", "Road", "Zap",
  "GlassWater", "Footprints", "UserCheck"
];

export default function IndividualServiceCMS() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id;

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [service, setService] = useState(null);
  const [activeTab, setActiveTab] = useState("sections"); // sections, seo, gallery, faqs, timeline, benefits, testimonials, stats

  // Data arrays
  const [sections, setSections] = useState([]);
  const [seo, setSeo] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [stats, setStats] = useState([]);

  // Modals / Item states
  const [currentSection, setCurrentSection] = useState(null);
  const [sectionModalOpen, setSectionModalOpen] = useState(false);

  const [currentGallery, setCurrentGallery] = useState(null);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);

  const [currentFaq, setCurrentFaq] = useState(null);
  const [faqModalOpen, setFaqModalOpen] = useState(false);

  const [currentTimeline, setCurrentTimeline] = useState(null);
  const [timelineModalOpen, setTimelineModalOpen] = useState(false);

  const [currentBenefit, setCurrentBenefit] = useState(null);
  const [benefitModalOpen, setBenefitModalOpen] = useState(false);

  const [currentTestimonial, setCurrentTestimonial] = useState(null);
  const [testimonialModalOpen, setTestimonialModalOpen] = useState(false);

  const [currentStat, setCurrentStat] = useState(null);
  const [statModalOpen, setStatModalOpen] = useState(false);

  useEffect(() => {
    if (!serviceId) return;

    async function loadServiceData() {
      try {
        setLoading(true);
        // Get service general details
        const resService = await fetch(`/api/admin/services`);
        const servicesList = await resService.json();
        const current = servicesList.find(s => s._id === serviceId);
        if (!current) {
          router.push("/admin/cms/services");
          return;
        }
        setService(current);

        // Fetch relational lists
        const [
          resSections,
          resSeo,
          resGallery,
          resFaqs,
          resTimeline,
          resBenefits,
          resTestimonials,
          resStats
        ] = await Promise.all([
          fetch(`/api/admin/services/sections?serviceId=${serviceId}`),
          fetch(`/api/admin/services/seo?serviceId=${serviceId}`),
          fetch(`/api/admin/services/gallery?serviceId=${serviceId}`),
          fetch(`/api/admin/services/faqs?serviceId=${serviceId}`),
          fetch(`/api/admin/services/timeline?serviceId=${serviceId}`),
          fetch(`/api/admin/services/benefits?serviceId=${serviceId}`),
          fetch(`/api/admin/services/testimonials?serviceId=${serviceId}`),
          fetch(`/api/admin/services/statistics?serviceId=${serviceId}`)
        ]);

        if (resSections.ok) setSections(await resSections.json());
        if (resSeo.ok) setSeo(await resSeo.json());
        if (resGallery.ok) setGallery(await resGallery.json());
        if (resFaqs.ok) setFaqs(await resFaqs.json());
        if (resTimeline.ok) setTimeline(await resTimeline.json());
        if (resBenefits.ok) setBenefits(await resBenefits.json());
        if (resTestimonials.ok) setTestimonials(await resTestimonials.json());
        if (resStats.ok) setStats(await resStats.json());

      } catch (err) {
        console.error("Failed to fetch individual service CMS data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadServiceData();
  }, [serviceId]);

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

  const handleReorder = async (type, list, index, direction) => {
    const newList = [...list];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newList.length) return;

    const temp = newList[index];
    newList[index] = newList[targetIndex];
    newList[targetIndex] = temp;

    if (type === "sections") setSections(newList);
    else if (type === "gallery") setGallery(newList);
    else if (type === "faqs") setFaqs(newList);
    else if (type === "timeline") setTimeline(newList);
    else if (type === "benefits") setBenefits(newList);
    else if (type === "testimonials") setTestimonials(newList);
    else if (type === "statistics") setStats(newList);

    try {
      await fetch(`/api/admin/services/${type}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reorder: true,
          ids: newList.map(item => item._id)
        })
      });
    } catch (err) {
      console.error(err);
    }
  };

  // CRUD Save & Delete for relational lists
  const saveRelational = async (type, currentItem, list, setList, setModalOpen) => {
    const isNew = !currentItem._id;
    const method = isNew ? "POST" : "PUT";
    const url = `/api/admin/services/${type}`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...currentItem, serviceId })
      });
      const saved = await res.json();
      if (res.ok) {
        if (isNew) {
          setList([...list, saved]);
        } else {
          setList(list.map(item => item._id === saved._id ? saved : item));
        }
        setModalOpen(false);
      } else {
        alert(saved.error || "Save failed");
      }
    } catch (err) {
      alert("Error saving item");
    }
  };

  const deleteRelational = async (type, id, list, setList) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(`/api/admin/services/${type}?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setList(list.filter(item => item._id !== id));
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      alert("Error deleting item");
    }
  };

  const saveSeo = async () => {
    try {
      const res = await fetch("/api/admin/services/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...seo, serviceId })
      });
      if (res.ok) {
        alert("SEO settings saved!");
      }
    } catch (err) {
      alert("Error saving SEO");
    }
  };

  // Sections Dynamic Content Field Helpers
  const initializeSectionContent = (type) => {
    switch (type) {
      case "Hero":
        return { title: "", subtitle: "", bgImage: "", btnText: "", btnLink: "" };
      case "Text Block":
        return { title: "", body: "" };
      case "Image":
        return { imageUrl: "", caption: "" };
      case "Video":
        return { videoUrl: "", bgImage: "" };
      case "Feature Cards":
        return { title: "", cards: [{ title: "", desc: "", icon: "ShieldCheck" }] };
      case "Accordion":
        return { title: "", items: [{ title: "", content: "" }] };
      case "CTA":
        return { title: "", desc: "", bgImage: "", btnText: "", btnLink: "" };
      case "Custom Rich Text":
        return { htmlContent: "" };
      case "Image + Content":
        return { title: "", body: "", imageUrl: "", imagePosition: "left" };
      case "Two Column Layout":
        return { col1Html: "", col2Html: "" };
      case "Three Column Layout":
        return { col1Html: "", col2Html: "", col3Html: "" };
      case "Table":
        return { headers: ["Header 1", "Header 2"], rows: [["Cell 1", "Cell 2"]] };
      case "Download Brochure":
        return { title: "", desc: "", fileUrl: "", btnText: "Download Brochure" };
      case "Investment Calculator":
        return { title: "Compounding Growth Estimate", basePrice: 2500000, compoundingRate: 15, years: 10 };
      case "Custom HTML":
        return { html: "" };
      // Relational sections don't need content objects because they load from other collections
      case "Gallery":
      case "Timeline":
      case "Statistics":
      case "Benefits":
      case "Testimonials":
      default:
        return {};
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      {/* Header breadcrumbs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#E5E7EB] pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold mb-1">
            <a href="/admin/cms/services" className="hover:text-[#0F9D6D]">Services CMS</a>
            <span>/</span>
            <span className="text-[#0F9D6D]">{service?.name}</span>
          </div>
          <h2 className="font-playfair text-2xl font-extrabold text-[#0F9D6D] flex items-center gap-2">
            <span>Page Builder:</span>
            <span className="text-[#D9A321]">{service?.name}</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">Configure layout, sections, SEO and relational widgets for this individual service page.</p>
        </div>
      </div>

      {uploading && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-xl flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#0F9D6D] border-t-transparent" />
            <span className="font-semibold text-sm">Uploading file to Contabo S3...</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-[#E5E7EB] pb-1 scrollbar-hide">
        {[
          { id: "sections", label: "Page Sections (Layout)" },
          { id: "seo", label: "SEO Meta" },
          { id: "gallery", label: "Gallery Section" },
          { id: "faqs", label: "Page FAQs" },
          { id: "timeline", label: "Page Timeline" },
          { id: "benefits", label: "Page Benefits" },
          { id: "testimonials", label: "Testimonials" },
          { id: "stats", label: "Statistics" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap px-4 py-2 text-xs font-bold rounded-lg transition-all duration-150 ${
              activeTab === tab.id
                ? "bg-[#0F9D6D] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sections Layout Content */}
      {activeTab === "sections" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200">
            <span className="text-sm font-bold text-[#0F9D6D]">{sections.length} Sections Configured</span>
            <button
              onClick={() => {
                const defaultType = "Hero";
                setCurrentSection({
                  serviceId,
                  type: defaultType,
                  content: initializeSectionContent(defaultType),
                  sortOrder: sections.length + 1,
                  active: true
                });
                setSectionModalOpen(true);
              }}
              className="bg-[#0F9D6D] text-white hover:bg-[#12B886] font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow"
            >
              + Add Section to Layout
            </button>
          </div>

          <div className="bg-white rounded-2xl border divide-y overflow-hidden shadow-sm">
            {sections.map((section, index) => (
              <div key={section._id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50/50 transition">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#D9A321]/20 text-[#0F9D6D] text-[10px] font-bold px-2 py-0.5 rounded">
                      {section.type}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${section.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {section.active ? "Active" : "Disabled"}
                    </span>
                  </div>
                  <h4 className="font-playfair font-bold text-base text-[#0F9D6D] mt-1.5">
                    {section.content?.title || section.content?.heading || `${section.type} Block`}
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {section.type === "Gallery" || section.type === "Timeline" || section.type === "Statistics" || section.type === "Benefits" || section.type === "Testimonials"
                      ? `Loads relational items dynamically from the ${section.type} tab.`
                      : "Custom custom block contents stored in section configuration."}
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleReorder("sections", sections, index, -1)}
                      disabled={index === 0}
                      className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-xs font-bold text-gray-600"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => handleReorder("sections", sections, index, 1)}
                      disabled={index === sections.length - 1}
                      className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-xs font-bold text-gray-600"
                    >
                      ▼
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setCurrentSection(section);
                        setSectionModalOpen(true);
                      }}
                      className="bg-[#0F9D6D]/10 hover:bg-[#0F9D6D]/20 text-[#0F9D6D] px-3.5 py-1.5 rounded-lg text-xs font-bold"
                    >
                      Edit Section
                    </button>
                    <button
                      onClick={() => deleteRelational("sections", section._id, sections, setSections)}
                      className="bg-red-50 hover:bg-red-100 text-red-700 px-3.5 py-1.5 rounded-lg text-xs font-bold"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {sections.length === 0 && (
              <div className="p-12 text-center text-gray-400 font-bold text-xs">
                No sections defined yet. Click "Add Section" to create your first page element.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SEO Settings */}
      {activeTab === "seo" && seo && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="font-playfair text-lg font-bold text-[#0F9D6D]">Page Dynamic SEO Settings</h3>
            <button onClick={saveSeo} className="bg-[#0F9D6D] text-white hover:bg-[#12B886] font-bold px-5 py-2 rounded-xl text-xs shadow">
              Save SEO settings
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Meta Title</label>
              <input type="text" value={seo.metaTitle || ""} onChange={e => setSeo({ ...seo, metaTitle: e.target.value })} className="w-full px-4 py-2 border rounded-xl text-xs" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Canonical URL</label>
              <input type="text" value={seo.canonicalUrl || ""} onChange={e => setSeo({ ...seo, canonicalUrl: e.target.value })} className="w-full px-4 py-2 border rounded-xl text-xs" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Meta Description</label>
              <textarea value={seo.metaDescription || ""} onChange={e => setSeo({ ...seo, metaDescription: e.target.value })} className="w-full px-4 py-2 border rounded-xl text-xs h-16" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Keywords</label>
              <input type="text" value={seo.keywords || ""} onChange={e => setSeo({ ...seo, keywords: e.target.value })} className="w-full px-4 py-2 border rounded-xl text-xs" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">OG Image</label>
              <div className="flex gap-2">
                <input type="text" disabled value={seo.ogImage || ""} className="w-full px-4 py-2 border rounded-xl text-xs bg-gray-50" />
                <input type="file" id="seoOg" onChange={e => triggerUpload(e, url => setSeo({ ...seo, ogImage: url }))} className="hidden" />
                <label htmlFor="seoOg" className="bg-[#0F9D6D] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer">Upload</label>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Twitter Image</label>
              <div className="flex gap-2">
                <input type="text" disabled value={seo.twitterImage || ""} className="w-full px-4 py-2 border rounded-xl text-xs bg-gray-50" />
                <input type="file" id="seoTw" onChange={e => triggerUpload(e, url => setSeo({ ...seo, twitterImage: url }))} className="hidden" />
                <label htmlFor="seoTw" className="bg-[#0F9D6D] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer">Upload</label>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Robots</label>
              <input type="text" value={seo.robots || ""} onChange={e => setSeo({ ...seo, robots: e.target.value })} className="w-full px-4 py-2 border rounded-xl text-xs" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Schema JSON-LD</label>
              <textarea value={seo.schemaMarkup || ""} onChange={e => setSeo({ ...seo, schemaMarkup: e.target.value })} className="w-full px-4 py-2 border rounded-xl text-xs h-24 font-mono" />
            </div>
          </div>
        </div>
      )}

      {/* Relational Tabs (Faqs, Gallery, Timeline, Benefits, Testimonials, Stats) */}
      {activeTab === "gallery" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border">
            <span className="text-xs font-bold text-gray-500">Service Page Gallery Images</span>
            <button
              onClick={() => {
                setCurrentGallery({ imageUrl: "", title: "", sortOrder: gallery.length + 1, active: true });
                setGalleryModalOpen(true);
              }}
              className="bg-[#0F9D6D] text-white px-4 py-2 rounded-xl text-xs font-bold shadow"
            >
              + Add Image
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((item, idx) => (
              <div key={item._id} className="bg-white border rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                <div className="h-32 bg-gray-100 relative">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-3 space-y-2">
                  <p className="font-bold text-xs text-[#0F9D6D] truncate">{item.title || "No label"}</p>
                  <div className="flex justify-between items-center text-[10px]">
                    <div className="flex gap-1">
                      <button onClick={() => handleReorder("gallery", gallery, idx, -1)} disabled={idx === 0} className="p-1 rounded bg-gray-100">▲</button>
                      <button onClick={() => handleReorder("gallery", gallery, idx, 1)} disabled={idx === gallery.length - 1} className="p-1 rounded bg-gray-100">▼</button>
                    </div>
                    <button onClick={() => deleteRelational("gallery", item._id, gallery, setGallery)} className="text-red-600 font-bold">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "faqs" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border">
            <span className="text-xs font-bold text-gray-500">Specific Page FAQs</span>
            <button
              onClick={() => {
                setCurrentFaq({ question: "", answer: "", sortOrder: faqs.length + 1, active: true });
                setFaqModalOpen(true);
              }}
              className="bg-[#0F9D6D] text-white px-4 py-2 rounded-xl text-xs font-bold shadow"
            >
              + Add FAQ
            </button>
          </div>

          <div className="bg-white rounded-xl border divide-y">
            {faqs.map((faq, idx) => (
              <div key={faq._id} className="p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-sm text-[#0F9D6D]">Q: {faq.question}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">A: {faq.answer}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex gap-1">
                    <button onClick={() => handleReorder("faqs", faqs, idx, -1)} disabled={idx === 0} className="p-1 rounded bg-gray-100 text-xs">▲</button>
                    <button onClick={() => handleReorder("faqs", faqs, idx, 1)} disabled={idx === faqs.length - 1} className="p-1 rounded bg-gray-100 text-xs">▼</button>
                  </div>
                  <button onClick={() => { setCurrentFaq(faq); setFaqModalOpen(true); }} className="text-[#0F9D6D] text-xs font-bold">Edit</button>
                  <button onClick={() => deleteRelational("faqs", faq._id, faqs, setFaqs)} className="text-red-600 text-xs font-bold">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "timeline" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border">
            <span className="text-xs font-bold text-gray-500">Service Page Timeline Steps</span>
            <button
              onClick={() => {
                setCurrentTimeline({ stepNumber: `${timeline.length + 1}`, title: "", description: "", icon: "Footprints", sortOrder: timeline.length + 1, active: true });
                setTimelineModalOpen(true);
              }}
              className="bg-[#0F9D6D] text-white px-4 py-2 rounded-xl text-xs font-bold shadow"
            >
              + Add Step
            </button>
          </div>

          <div className="bg-white rounded-xl border divide-y">
            {timeline.map((step, idx) => (
              <div key={step._id} className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="h-6 w-6 rounded-full bg-[#0F9D6D]/10 text-[#0F9D6D] font-bold text-xs flex items-center justify-center">{step.stepNumber}</span>
                  <div>
                    <h4 className="font-bold text-sm text-[#0F9D6D]">{step.title}</h4>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <button onClick={() => handleReorder("timeline", timeline, idx, -1)} disabled={idx === 0} className="p-1 rounded bg-gray-100 text-xs">▲</button>
                    <button onClick={() => handleReorder("timeline", timeline, idx, 1)} disabled={idx === timeline.length - 1} className="p-1 rounded bg-gray-100 text-xs">▼</button>
                  </div>
                  <button onClick={() => { setCurrentTimeline(step); setTimelineModalOpen(true); }} className="text-[#0F9D6D] text-xs font-bold">Edit</button>
                  <button onClick={() => deleteRelational("timeline", step._id, timeline, setTimeline)} className="text-red-600 text-xs font-bold">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "benefits" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border">
            <span className="text-xs font-bold text-gray-500">Service Page Benefits</span>
            <button
              onClick={() => {
                setCurrentBenefit({ title: "", description: "", icon: "Leaf", sortOrder: benefits.length + 1, active: true });
                setBenefitModalOpen(true);
              }}
              className="bg-[#0F9D6D] text-white px-4 py-2 rounded-xl text-xs font-bold shadow"
            >
              + Add Benefit
            </button>
          </div>

          <div className="bg-white rounded-xl border divide-y">
            {benefits.map((b, idx) => (
              <div key={b._id} className="p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-sm text-[#0F9D6D]">{b.title}</h4>
                  <p className="text-xs text-gray-500">{b.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <button onClick={() => handleReorder("benefits", benefits, idx, -1)} disabled={idx === 0} className="p-1 rounded bg-gray-100 text-xs">▲</button>
                    <button onClick={() => handleReorder("benefits", benefits, idx, 1)} disabled={idx === benefits.length - 1} className="p-1 rounded bg-gray-100 text-xs">▼</button>
                  </div>
                  <button onClick={() => { setCurrentBenefit(b); setBenefitModalOpen(true); }} className="text-[#0F9D6D] text-xs font-bold">Edit</button>
                  <button onClick={() => deleteRelational("benefits", b._id, benefits, setBenefits)} className="text-red-600 text-xs font-bold">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "testimonials" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border">
            <span className="text-xs font-bold text-gray-500">Service Page Testimonials</span>
            <button
              onClick={() => {
                setCurrentTestimonial({ name: "", designation: "", company: "", photo: "", rating: 5, review: "", sortOrder: testimonials.length + 1, active: true });
                setTestimonialModalOpen(true);
              }}
              className="bg-[#0F9D6D] text-white px-4 py-2 rounded-xl text-xs font-bold shadow"
            >
              + Add Testimonial
            </button>
          </div>

          <div className="bg-white rounded-xl border divide-y font-semibold">
            {testimonials.map((t, idx) => (
              <div key={t._id} className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img src={t.photo} alt={t.name} className="h-8 w-8 rounded-full object-cover bg-gray-100" />
                  <div>
                    <h4 className="text-sm text-[#0F9D6D]">{t.name}</h4>
                    <p className="text-[10px] text-gray-400">{t.designation}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <button onClick={() => handleReorder("testimonials", testimonials, idx, -1)} disabled={idx === 0} className="p-1 rounded bg-gray-100 text-xs">▲</button>
                    <button onClick={() => handleReorder("testimonials", testimonials, idx, 1)} disabled={idx === testimonials.length - 1} className="p-1 rounded bg-gray-100 text-xs">▼</button>
                  </div>
                  <button onClick={() => { setCurrentTestimonial(t); setTestimonialModalOpen(true); }} className="text-[#0F9D6D] text-xs font-bold">Edit</button>
                  <button onClick={() => deleteRelational("testimonials", t._id, testimonials, setTestimonials)} className="text-red-600 text-xs font-bold">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "stats" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border">
            <span className="text-xs font-bold text-gray-500">Service Page Statistics</span>
            <button
              onClick={() => {
                setCurrentStat({ title: "", value: "", icon: "TrendingUp", sortOrder: stats.length + 1, active: true });
                setStatModalOpen(true);
              }}
              className="bg-[#0F9D6D] text-white px-4 py-2 rounded-xl text-xs font-bold shadow"
            >
              + Add Stat
            </button>
          </div>

          <div className="bg-white rounded-xl border divide-y">
            {stats.map((s, idx) => (
              <div key={s._id} className="p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-sm text-[#0F9D6D]">{s.title}</h4>
                  <p className="text-xs text-gray-500">{s.value}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <button onClick={() => handleReorder("statistics", stats, idx, -1)} disabled={idx === 0} className="p-1 rounded bg-gray-100 text-xs">▲</button>
                    <button onClick={() => handleReorder("statistics", stats, idx, 1)} disabled={idx === stats.length - 1} className="p-1 rounded bg-gray-100 text-xs">▼</button>
                  </div>
                  <button onClick={() => { setCurrentStat(s); setStatModalOpen(true); }} className="text-[#0F9D6D] text-xs font-bold">Edit</button>
                  <button onClick={() => deleteRelational("statistics", s._id, stats, setStats)} className="text-red-600 text-xs font-bold">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic Section Modal Editor */}
      {sectionModalOpen && currentSection && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="font-playfair text-lg font-bold text-[#0F9D6D]">
                {currentSection._id ? "Edit Section Block" : "Add Section Block"}
              </h3>
              <button onClick={() => setSectionModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold">×</button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-500 uppercase mb-1">Section Type</label>
                  <select
                    disabled={Boolean(currentSection._id)}
                    value={currentSection.type}
                    onChange={(e) => {
                      const type = e.target.value;
                      setCurrentSection({
                        ...currentSection,
                        type,
                        content: initializeSectionContent(type)
                      });
                    }}
                    className="w-full px-4 py-2 border rounded-xl bg-white"
                  >
                    {SECTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="flex items-end pl-4 pb-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      checked={currentSection.active}
                      onChange={e => setCurrentSection({ ...currentSection, active: e.target.checked })}
                      className="rounded border-gray-300 text-[#0F9D6D] focus:ring-[#0F9D6D]"
                    />
                    <span>Active (Enabled)</span>
                  </label>
                </div>
              </div>

              {/* DYNAMIC FORM ACCORDING TO TYPE */}
              <div className="border-t pt-4 space-y-4">
                {currentSection.type === "Hero" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-gray-500 uppercase mb-1">Title</label>
                        <input type="text" value={currentSection.content?.title || ""} onChange={e => setCurrentSection({ ...currentSection, content: { ...currentSection.content, title: e.target.value } })} className="w-full px-4 py-2 border rounded-xl" />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-500 uppercase mb-1">Subtitle</label>
                        <input type="text" value={currentSection.content?.subtitle || ""} onChange={e => setCurrentSection({ ...currentSection, content: { ...currentSection.content, subtitle: e.target.value } })} className="w-full px-4 py-2 border rounded-xl" />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-500 uppercase mb-1">Primary Button Text</label>
                        <input type="text" value={currentSection.content?.btnText || ""} onChange={e => setCurrentSection({ ...currentSection, content: { ...currentSection.content, btnText: e.target.value } })} className="w-full px-4 py-2 border rounded-xl" />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-500 uppercase mb-1">Primary Button Link</label>
                        <input type="text" value={currentSection.content?.btnLink || ""} onChange={e => setCurrentSection({ ...currentSection, content: { ...currentSection.content, btnLink: e.target.value } })} className="w-full px-4 py-2 border rounded-xl" />
                      </div>
                    </div>
                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">Background Image (Contabo S3)</label>
                      <div className="flex gap-2">
                        <input type="text" disabled value={currentSection.content?.bgImage || ""} className="w-full px-4 py-2 border rounded-xl bg-gray-50" />
                        <input type="file" id="heroSecBg" onChange={e => triggerUpload(e, url => setCurrentSection({ ...currentSection, content: { ...currentSection.content, bgImage: url } }))} className="hidden" />
                        <label htmlFor="heroSecBg" className="bg-[#0F9D6D] text-white px-4 py-2 rounded-xl cursor-pointer">Upload</label>
                      </div>
                    </div>
                  </>
                )}

                {currentSection.type === "Text Block" && (
                  <>
                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">Title</label>
                      <input type="text" value={currentSection.content?.title || ""} onChange={e => setCurrentSection({ ...currentSection, content: { ...currentSection.content, title: e.target.value } })} className="w-full px-4 py-2 border rounded-xl" />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">Body Text</label>
                      <textarea value={currentSection.content?.body || ""} onChange={e => setCurrentSection({ ...currentSection, content: { ...currentSection.content, body: e.target.value } })} className="w-full px-4 py-2 border rounded-xl h-32" />
                    </div>
                  </>
                )}

                {currentSection.type === "Image" && (
                  <>
                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">Caption / Label</label>
                      <input type="text" value={currentSection.content?.caption || ""} onChange={e => setCurrentSection({ ...currentSection, content: { ...currentSection.content, caption: e.target.value } })} className="w-full px-4 py-2 border rounded-xl" />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">Image Upload (Contabo S3)</label>
                      <div className="flex gap-2">
                        <input type="text" disabled value={currentSection.content?.imageUrl || ""} className="w-full px-4 py-2 border rounded-xl bg-gray-50" />
                        <input type="file" id="imgSec" onChange={e => triggerUpload(e, url => setCurrentSection({ ...currentSection, content: { ...currentSection.content, imageUrl: url } }))} className="hidden" />
                        <label htmlFor="imgSec" className="bg-[#0F9D6D] text-white px-4 py-2 rounded-xl cursor-pointer">Upload</label>
                      </div>
                    </div>
                  </>
                )}

                {currentSection.type === "Video" && (
                  <>
                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">Video Stream URL (e.g. YouTube embed or mp4 link)</label>
                      <input type="text" value={currentSection.content?.videoUrl || ""} onChange={e => setCurrentSection({ ...currentSection, content: { ...currentSection.content, videoUrl: e.target.value } })} className="w-full px-4 py-2 border rounded-xl" />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">Thumbnail Cover Image (Contabo S3)</label>
                      <div className="flex gap-2">
                        <input type="text" disabled value={currentSection.content?.bgImage || ""} className="w-full px-4 py-2 border rounded-xl bg-gray-50" />
                        <input type="file" id="videoSecBg" onChange={e => triggerUpload(e, url => setCurrentSection({ ...currentSection, content: { ...currentSection.content, bgImage: url } }))} className="hidden" />
                        <label htmlFor="videoSecBg" className="bg-[#0F9D6D] text-white px-4 py-2 rounded-xl cursor-pointer">Upload</label>
                      </div>
                    </div>
                  </>
                )}

                {currentSection.type === "CTA" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-gray-500 uppercase mb-1">CTA Title</label>
                        <input type="text" value={currentSection.content?.title || ""} onChange={e => setCurrentSection({ ...currentSection, content: { ...currentSection.content, title: e.target.value } })} className="w-full px-4 py-2 border rounded-xl" />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-500 uppercase mb-1">Button Text</label>
                        <input type="text" value={currentSection.content?.btnText || ""} onChange={e => setCurrentSection({ ...currentSection, content: { ...currentSection.content, btnText: e.target.value } })} className="w-full px-4 py-2 border rounded-xl" />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-500 uppercase mb-1">Button Link</label>
                        <input type="text" value={currentSection.content?.btnLink || ""} onChange={e => setCurrentSection({ ...currentSection, content: { ...currentSection.content, btnLink: e.target.value } })} className="w-full px-4 py-2 border rounded-xl" />
                      </div>
                    </div>
                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">Description</label>
                      <textarea value={currentSection.content?.desc || ""} onChange={e => setCurrentSection({ ...currentSection, content: { ...currentSection.content, desc: e.target.value } })} className="w-full px-4 py-2 border rounded-xl h-16" />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">Background Image (Contabo S3)</label>
                      <div className="flex gap-2">
                        <input type="text" disabled value={currentSection.content?.bgImage || ""} className="w-full px-4 py-2 border rounded-xl bg-gray-50" />
                        <input type="file" id="ctaSecBg" onChange={e => triggerUpload(e, url => setCurrentSection({ ...currentSection, content: { ...currentSection.content, bgImage: url } }))} className="hidden" />
                        <label htmlFor="ctaSecBg" className="bg-[#0F9D6D] text-white px-4 py-2 rounded-xl cursor-pointer">Upload</label>
                      </div>
                    </div>
                  </>
                )}

                {currentSection.type === "Custom Rich Text" && (
                  <div>
                    <label className="block font-bold text-gray-500 uppercase mb-1">HTML Content</label>
                    <textarea value={currentSection.content?.htmlContent || ""} onChange={e => setCurrentSection({ ...currentSection, content: { ...currentSection.content, htmlContent: e.target.value } })} className="w-full px-4 py-2 border rounded-xl h-32 font-mono" />
                  </div>
                )}

                {currentSection.type === "Image + Content" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-gray-500 uppercase mb-1">Title</label>
                        <input type="text" value={currentSection.content?.title || ""} onChange={e => setCurrentSection({ ...currentSection, content: { ...currentSection.content, title: e.target.value } })} className="w-full px-4 py-2 border rounded-xl" />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-500 uppercase mb-1">Image Alignment</label>
                        <select value={currentSection.content?.imagePosition || "left"} onChange={e => setCurrentSection({ ...currentSection, content: { ...currentSection.content, imagePosition: e.target.value } })} className="w-full px-4 py-2 border rounded-xl bg-white">
                          <option value="left">Image on Left, Content on Right</option>
                          <option value="right">Content on Left, Image on Right</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">Body Content</label>
                      <textarea value={currentSection.content?.body || ""} onChange={e => setCurrentSection({ ...currentSection, content: { ...currentSection.content, body: e.target.value } })} className="w-full px-4 py-2 border rounded-xl h-24" />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">Image (Contabo S3)</label>
                      <div className="flex gap-2">
                        <input type="text" disabled value={currentSection.content?.imageUrl || ""} className="w-full px-4 py-2 border rounded-xl bg-gray-50" />
                        <input type="file" id="imgContSec" onChange={e => triggerUpload(e, url => setCurrentSection({ ...currentSection, content: { ...currentSection.content, imageUrl: url } }))} className="hidden" />
                        <label htmlFor="imgContSec" className="bg-[#0F9D6D] text-white px-4 py-2 rounded-xl cursor-pointer">Upload</label>
                      </div>
                    </div>
                  </>
                )}

                {currentSection.type === "Two Column Layout" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">Column 1 HTML</label>
                      <textarea value={currentSection.content?.col1Html || ""} onChange={e => setCurrentSection({ ...currentSection, content: { ...currentSection.content, col1Html: e.target.value } })} className="w-full px-4 py-2 border rounded-xl h-32 font-mono" />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">Column 2 HTML</label>
                      <textarea value={currentSection.content?.col2Html || ""} onChange={e => setCurrentSection({ ...currentSection, content: { ...currentSection.content, col2Html: e.target.value } })} className="w-full px-4 py-2 border rounded-xl h-32 font-mono" />
                    </div>
                  </div>
                )}

                {currentSection.type === "Three Column Layout" && (
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">Col 1 HTML</label>
                      <textarea value={currentSection.content?.col1Html || ""} onChange={e => setCurrentSection({ ...currentSection, content: { ...currentSection.content, col1Html: e.target.value } })} className="w-full px-2 py-2 border rounded-xl h-32 font-mono text-[10px]" />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">Col 2 HTML</label>
                      <textarea value={currentSection.content?.col2Html || ""} onChange={e => setCurrentSection({ ...currentSection, content: { ...currentSection.content, col2Html: e.target.value } })} className="w-full px-2 py-2 border rounded-xl h-32 font-mono text-[10px]" />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">Col 3 HTML</label>
                      <textarea value={currentSection.content?.col3Html || ""} onChange={e => setCurrentSection({ ...currentSection, content: { ...currentSection.content, col3Html: e.target.value } })} className="w-full px-2 py-2 border rounded-xl h-32 font-mono text-[10px]" />
                    </div>
                  </div>
                )}

                {currentSection.type === "Download Brochure" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-gray-500 uppercase mb-1">Title</label>
                        <input type="text" value={currentSection.content?.title || ""} onChange={e => setCurrentSection({ ...currentSection, content: { ...currentSection.content, title: e.target.value } })} className="w-full px-4 py-2 border rounded-xl" />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-500 uppercase mb-1">Button Text</label>
                        <input type="text" value={currentSection.content?.btnText || ""} onChange={e => setCurrentSection({ ...currentSection, content: { ...currentSection.content, btnText: e.target.value } })} className="w-full px-4 py-2 border rounded-xl" />
                      </div>
                    </div>
                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">Description</label>
                      <textarea value={currentSection.content?.desc || ""} onChange={e => setCurrentSection({ ...currentSection, content: { ...currentSection.content, desc: e.target.value } })} className="w-full px-4 py-2 border rounded-xl h-16" />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">Brochure File (PDF/Doc) (Contabo S3)</label>
                      <div className="flex gap-2">
                        <input type="text" disabled value={currentSection.content?.fileUrl || ""} className="w-full px-4 py-2 border rounded-xl bg-gray-50" />
                        <input type="file" id="brochureFile" onChange={e => triggerUpload(e, url => setCurrentSection({ ...currentSection, content: { ...currentSection.content, fileUrl: url } }))} className="hidden" />
                        <label htmlFor="brochureFile" className="bg-[#0F9D6D] text-white px-4 py-2 rounded-xl cursor-pointer">Upload</label>
                      </div>
                    </div>
                  </>
                )}

                {currentSection.type === "Investment Calculator" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">Calculator Title</label>
                      <input type="text" value={currentSection.content?.title || ""} onChange={e => setCurrentSection({ ...currentSection, content: { ...currentSection.content, title: e.target.value } })} className="w-full px-4 py-2 border rounded-xl" />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">Base Investment Amount (₹)</label>
                      <input type="number" value={currentSection.content?.basePrice || 2500000} onChange={e => setCurrentSection({ ...currentSection, content: { ...currentSection.content, basePrice: parseFloat(e.target.value) || 0 } })} className="w-full px-4 py-2 border rounded-xl" />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">Est. Compounding Rate (%)</label>
                      <input type="number" value={currentSection.content?.compoundingRate || 15} onChange={e => setCurrentSection({ ...currentSection, content: { ...currentSection.content, compoundingRate: parseFloat(e.target.value) || 0 } })} className="w-full px-4 py-2 border rounded-xl" />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">Projection Period (Years)</label>
                      <input type="number" value={currentSection.content?.years || 10} onChange={e => setCurrentSection({ ...currentSection, content: { ...currentSection.content, years: parseInt(e.target.value) || 0 } })} className="w-full px-4 py-2 border rounded-xl" />
                    </div>
                  </div>
                )}

                {currentSection.type === "Custom HTML" && (
                  <div>
                    <label className="block font-bold text-gray-500 uppercase mb-1">Custom Embedded HTML Script</label>
                    <textarea value={currentSection.content?.html || ""} onChange={e => setCurrentSection({ ...currentSection, content: { ...currentSection.content, html: e.target.value } })} className="w-full px-4 py-2 border rounded-xl h-32 font-mono" />
                  </div>
                )}

                {/* Relational loaders info messages */}
                {(currentSection.type === "Gallery" || currentSection.type === "Timeline" || currentSection.type === "Statistics" || currentSection.type === "Benefits" || currentSection.type === "Testimonials") && (
                  <div className="bg-[#0F9D6D]/5 text-[#0F9D6D] p-4 rounded-xl border border-[#0F9D6D]/10 font-medium">
                    This block will automatically retrieve the active elements configured in the <strong>{currentSection.type}</strong> tab for this page. Nothing else to fill out here.
                  </div>
                )}
              </div>

              <div className="border-t pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setSectionModalOpen(false)} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-bold">Cancel</button>
                <button type="button" onClick={() => saveRelational("sections", currentSection, sections, setSections, setSectionModalOpen)} className="bg-[#0F9D6D] text-white px-4 py-2 rounded-xl font-bold shadow">Save Layout Block</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Relational Modals (Gallery, FAQ, Timeline, Benefit, Testimonial, Stat) */}
      {galleryModalOpen && currentGallery && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden text-xs">
            <div className="p-4 border-b font-bold text-sm text-[#0F9D6D]">Add Gallery Image</div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block font-bold text-gray-500 uppercase mb-1">Label / Title</label>
                <input type="text" value={currentGallery.title} onChange={e => setCurrentGallery({ ...currentGallery, title: e.target.value })} className="w-full px-4 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block font-bold text-gray-500 uppercase mb-1">Upload File (Contabo S3)</label>
                <div className="flex gap-2">
                  <input type="text" disabled value={currentGallery.imageUrl} className="w-full px-4 py-2 border rounded-xl bg-gray-50" />
                  <input type="file" id="galS3" onChange={e => triggerUpload(e, url => setCurrentGallery({ ...currentGallery, imageUrl: url }))} className="hidden" />
                  <label htmlFor="galS3" className="bg-[#0F9D6D] text-white px-4 py-2 rounded-xl cursor-pointer">Upload</label>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setGalleryModalOpen(false)} className="bg-gray-100 px-4 py-2 rounded-xl">Cancel</button>
                <button onClick={() => saveRelational("gallery", currentGallery, gallery, setGallery, setGalleryModalOpen)} className="bg-[#0F9D6D] text-white px-4 py-2 rounded-xl font-bold">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {faqModalOpen && currentFaq && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden text-xs">
            <div className="p-4 border-b font-bold text-sm text-[#0F9D6D]">Manage FAQ</div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block font-bold text-gray-500 uppercase mb-1">Question</label>
                <input type="text" value={currentFaq.question} onChange={e => setCurrentFaq({ ...currentFaq, question: e.target.value })} className="w-full px-4 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block font-bold text-gray-500 uppercase mb-1">Answer</label>
                <textarea value={currentFaq.answer} onChange={e => setCurrentFaq({ ...currentFaq, answer: e.target.value })} className="w-full px-4 py-2 border rounded-xl h-24" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setFaqModalOpen(false)} className="bg-gray-100 px-4 py-2 rounded-xl">Cancel</button>
                <button onClick={() => saveRelational("faqs", currentFaq, faqs, setFaqs, setFaqModalOpen)} className="bg-[#0F9D6D] text-white px-4 py-2 rounded-xl font-bold">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {timelineModalOpen && currentTimeline && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden text-xs">
            <div className="p-4 border-b font-bold text-sm text-[#0F9D6D]">Manage Timeline Step</div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-gray-500 uppercase mb-1">Step #</label>
                  <input type="text" value={currentTimeline.stepNumber} onChange={e => setCurrentTimeline({ ...currentTimeline, stepNumber: e.target.value })} className="w-full px-4 py-2 border rounded-xl" />
                </div>
                <div className="col-span-2">
                  <label className="block font-bold text-gray-500 uppercase mb-1">Title</label>
                  <input type="text" value={currentTimeline.title} onChange={e => setCurrentTimeline({ ...currentTimeline, title: e.target.value })} className="w-full px-4 py-2 border rounded-xl" />
                </div>
              </div>
              <div>
                <label className="block font-bold text-gray-500 uppercase mb-1">Description</label>
                <textarea value={currentTimeline.description} onChange={e => setCurrentTimeline({ ...currentTimeline, description: e.target.value })} className="w-full px-4 py-2 border rounded-xl h-20" />
              </div>
              <div>
                <label className="block font-bold text-gray-500 uppercase mb-1">Icon</label>
                <select value={currentTimeline.icon} onChange={e => setCurrentTimeline({ ...currentTimeline, icon: e.target.value })} className="w-full px-4 py-2 border rounded-xl bg-white">
                  {COMMON_ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setTimelineModalOpen(false)} className="bg-gray-100 px-4 py-2 rounded-xl">Cancel</button>
                <button onClick={() => saveRelational("timeline", currentTimeline, timeline, setTimeline, setTimelineModalOpen)} className="bg-[#0F9D6D] text-white px-4 py-2 rounded-xl font-bold">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {benefitModalOpen && currentBenefit && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden text-xs">
            <div className="p-4 border-b font-bold text-sm text-[#0F9D6D]">Manage Benefit Card</div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block font-bold text-gray-500 uppercase mb-1">Title</label>
                <input type="text" value={currentBenefit.title} onChange={e => setCurrentBenefit({ ...currentBenefit, title: e.target.value })} className="w-full px-4 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block font-bold text-gray-500 uppercase mb-1">Description</label>
                <textarea value={currentBenefit.description} onChange={e => setCurrentBenefit({ ...currentBenefit, description: e.target.value })} className="w-full px-4 py-2 border rounded-xl h-20" />
              </div>
              <div>
                <label className="block font-bold text-gray-500 uppercase mb-1">Icon</label>
                <select value={currentBenefit.icon} onChange={e => setCurrentBenefit({ ...currentBenefit, icon: e.target.value })} className="w-full px-4 py-2 border rounded-xl bg-white">
                  {COMMON_ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setBenefitModalOpen(false)} className="bg-gray-100 px-4 py-2 rounded-xl">Cancel</button>
                <button onClick={() => saveRelational("benefits", currentBenefit, benefits, setBenefits, setBenefitModalOpen)} className="bg-[#0F9D6D] text-white px-4 py-2 rounded-xl font-bold">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {testimonialModalOpen && currentTestimonial && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden text-xs">
            <div className="p-4 border-b font-bold text-sm text-[#0F9D6D]">Manage Testimonial</div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-500 uppercase mb-1">Name</label>
                  <input type="text" value={currentTestimonial.name} onChange={e => setCurrentTestimonial({ ...currentTestimonial, name: e.target.value })} className="w-full px-4 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold text-gray-500 uppercase mb-1">Designation</label>
                  <input type="text" value={currentTestimonial.designation} onChange={e => setCurrentTestimonial({ ...currentTestimonial, designation: e.target.value })} className="w-full px-4 py-2 border rounded-xl" />
                </div>
              </div>
              <div>
                <label className="block font-bold text-gray-500 uppercase mb-1">Review</label>
                <textarea value={currentTestimonial.review} onChange={e => setCurrentTestimonial({ ...currentTestimonial, review: e.target.value })} className="w-full px-4 py-2 border rounded-xl h-20" />
              </div>
              <div>
                <label className="block font-bold text-gray-500 uppercase mb-1">Photo (Contabo S3)</label>
                <div className="flex gap-2">
                  <input type="text" disabled value={currentTestimonial.photo} className="w-full px-4 py-2 border rounded-xl bg-gray-50" />
                  <input type="file" id="tPhoto" onChange={e => triggerUpload(e, url => setCurrentTestimonial({ ...currentTestimonial, photo: url }))} className="hidden" />
                  <label htmlFor="tPhoto" className="bg-[#0F9D6D] text-white px-4 py-2 rounded-xl cursor-pointer">Upload</label>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setTestimonialModalOpen(false)} className="bg-gray-100 px-4 py-2 rounded-xl">Cancel</button>
                <button onClick={() => saveRelational("testimonials", currentTestimonial, testimonials, setTestimonials, setTestimonialModalOpen)} className="bg-[#0F9D6D] text-white px-4 py-2 rounded-xl font-bold">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {statModalOpen && currentStat && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden text-xs">
            <div className="p-4 border-b font-bold text-sm text-[#0F9D6D]">Manage Statistic</div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block font-bold text-gray-500 uppercase mb-1">Title</label>
                <input type="text" value={currentStat.title} onChange={e => setCurrentStat({ ...currentStat, title: e.target.value })} className="w-full px-4 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block font-bold text-gray-500 uppercase mb-1">Value</label>
                <input type="text" value={currentStat.value} onChange={e => setCurrentStat({ ...currentStat, value: e.target.value })} className="w-full px-4 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block font-bold text-gray-500 uppercase mb-1">Icon</label>
                <select value={currentStat.icon} onChange={e => setCurrentStat({ ...currentStat, icon: e.target.value })} className="w-full px-4 py-2 border rounded-xl bg-white">
                  {COMMON_ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setStatModalOpen(false)} className="bg-gray-100 px-4 py-2 rounded-xl">Cancel</button>
                <button onClick={() => saveRelational("statistics", currentStat, stats, setStats, setStatModalOpen)} className="bg-[#0F9D6D] text-white px-4 py-2 rounded-xl font-bold">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
