"use client";

import React, { useState, useEffect } from "react";
import { PageLoader } from "../../../components/PageLoader";

const emptyForm = {
  title: "",
  tagline: "",
  location: "",
  area: "",
  plotSize: "",
  price: "",
  expectedRoi: "",
  image: "",
  images: [],
  brochure: "",
  description: "",
  category: "",
  status: "Published",
  featured: false,
};

export default function ProjectsModule() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editingProject, setEditingProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState(emptyForm);

  const loadCategories = async () => {
    try {
      const res = await fetch("/api/project-categories");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  const loadProjects = async () => {
    try {
      const res = await fetch(`/api/projects?search=${search}&status=${statusFilter}`);
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProjects();
  }, [search, statusFilter]);

  const handleUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    try {
      setUploading(true);
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const val = await res.json();
      if (val.url) {
        setFormData((prev) => ({ ...prev, [field]: val.url }));
      }
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    try {
      setUploading(true);
      const uploadedUrls = [];
      for (const file of files) {
        const data = new FormData();
        data.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: data });
        const val = await res.json();
        if (val.url) uploadedUrls.push(val.url);
      }
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
    } catch (err) {
      alert("Gallery upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (idx) => {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = editingProject ? "PUT" : "POST";
      const bodyData = editingProject ? { ...formData, id: editingProject._id } : formData;

      const res = await fetch("/api/projects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (res.ok) {
        alert("Project saved successfully!");
        setFormData(emptyForm);
        setEditingProject(null);
        setShowForm(false);
        loadProjects();
      }
    } catch (err) {
      alert("Error saving project");
      setLoading(false);
    }
  };

  const handleEdit = (proj) => {
    setEditingProject(proj);
    setFormData({
      title: proj.title || "",
      tagline: proj.tagline || "",
      location: proj.location || "",
      area: proj.area || "",
      plotSize: proj.plotSize || "",
      price: proj.price || "",
      expectedRoi: proj.expectedRoi || "",
      image: proj.image || "",
      images: proj.images || [],
      brochure: proj.brochure || "",
      description: proj.description || "",
      category: proj.category?._id || proj.category || "",
      status: proj.status || "Published",
      featured: proj.featured || false,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        loadProjects();
      }
    } catch (e) {
      alert("Delete failed");
      setLoading(false);
    }
  };

  if (loading && projects.length === 0) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-4">
        <div>
          <h2 className="font-playfair text-2xl font-extrabold text-[#0F9D6D]">Land Projects Module</h2>
          <p className="text-xs text-gray-500 mt-1">Add, edit, or filter sandalwood managed plot project releases.</p>
        </div>
        <div className="flex gap-2">
          <a
            href="/admin/projects/categories"
            className="bg-white border border-[#0F9D6D]/30 text-[#0F9D6D] font-bold px-5 py-2.5 rounded-full text-xs shadow-sm hover:bg-[#F8FAF8]"
          >
            Manage Categories
          </a>
          <button
            onClick={() => {
              setEditingProject(null);
              setFormData(emptyForm);
              setShowForm(!showForm);
            }}
            className="bg-[#0F9D6D] text-white hover:bg-[#12B886] font-bold px-5 py-2.5 rounded-full text-xs shadow-md"
          >
            {showForm ? "Cancel Form" : "+ Add New Project"}
          </button>
        </div>
      </div>

      {uploading && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-xl flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#0F9D6D] border-t-transparent" />
            <span className="font-semibold text-sm">Uploading file...</span>
          </div>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-xl space-y-4">
          <h3 className="font-playfair text-lg font-bold text-[#0F9D6D]">
            {editingProject ? "Edit Project Details" : "Create New Project"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Project Name *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border rounded-xl text-sm bg-white"
              >
                <option value="">— None —</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Total Estate Area</label>
              <input
                type="text"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Plot Size Ranges</label>
              <input
                type="text"
                value={formData.plotSize}
                onChange={(e) => setFormData({ ...formData, plotSize: e.target.value })}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Starting Price</label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expected ROI</label>
              <input
                type="text"
                value={formData.expectedRoi}
                onChange={(e) => setFormData({ ...formData, expectedRoi: e.target.value })}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-gray-300 text-[#0F9D6D] focus:ring-[#0F9D6D]"
                />
                <span>Set as Featured Project</span>
              </label>
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
              <textarea
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-xl text-sm"
                placeholder="Full project description shown on the project detail page..."
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cover Image</label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  disabled
                  value={formData.image}
                  className="w-full px-3 py-2 border rounded-xl bg-gray-50 text-xs"
                />
                <input type="file" id="projImgUpload" accept="image/*" onChange={(e) => handleUpload(e, "image")} className="hidden" />
                <label htmlFor="projImgUpload" className="bg-[#0F9D6D] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer shrink-0">
                  Upload File
                </label>
              </div>
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Brochure (PDF)</label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  disabled
                  value={formData.brochure}
                  className="w-full px-3 py-2 border rounded-xl bg-gray-50 text-xs"
                />
                <input type="file" id="projBrochureUpload" accept="application/pdf" onChange={(e) => handleUpload(e, "brochure")} className="hidden" />
                <label htmlFor="projBrochureUpload" className="bg-[#0F9D6D] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer shrink-0">
                  Upload PDF
                </label>
              </div>
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Gallery Images (multiple)</label>
              <div className="flex flex-wrap gap-3 mb-3">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img src={img} alt={`Gallery ${idx + 1}`} className="h-20 w-20 object-cover rounded-xl border" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <input type="file" id="projGalleryUpload" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />
              <label htmlFor="projGalleryUpload" className="inline-block bg-[#0F9D6D] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer">
                Add Gallery Images
              </label>
            </div>
          </div>
          <button type="submit" className="bg-[#0F9D6D] text-white px-6 py-2 rounded-full text-xs font-bold">
            {editingProject ? "Update Project" : "Create Project"}
          </button>
        </form>
      )}

      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/3 px-3 py-2 border rounded-xl text-xs"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-1/4 px-3 py-2 border rounded-xl text-xs"
        >
          <option value="">All Statuses</option>
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
        </select>
      </div>

      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400">
                <th className="pb-3 font-semibold">Project</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Specs</th>
                <th className="pb-3 font-semibold">Price</th>
                <th className="pb-3 font-semibold">Featured</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-4 text-center text-gray-400 text-xs">No projects loaded.</td>
                </tr>
              ) : (
                projects.map((proj) => (
                  <tr key={proj._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img src={proj.image || "/logo.png"} alt="Project" className="h-10 w-10 rounded-xl object-cover border" />
                        <div>
                          <div className="font-semibold text-[#0F9D6D]">{proj.title}</div>
                          <div className="text-gray-400 text-[10px] mt-0.5">{proj.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-xs text-gray-500">{proj.category?.name || "—"}</td>
                    <td className="py-4 text-xs text-gray-500">
                      <div>Area: {proj.area}</div>
                      <div>Plots: {proj.plotSize}</div>
                    </td>
                    <td className="py-4 text-xs font-semibold text-emerald-800">{proj.price}</td>
                    <td className="py-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        proj.featured ? "bg-amber-100 text-[#D9A321]" : "bg-gray-100 text-gray-400"
                      }`}>
                        {proj.featured ? "Featured" : "Standard"}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        proj.status === "Published" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                      }`}>
                        {proj.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-2.5">
                        <a href={`/projects/${proj.slug}`} target="_blank" rel="noreferrer" className="text-gray-500 hover:underline text-xs font-bold">
                          View
                        </a>
                        <button onClick={() => handleEdit(proj)} className="text-[#0F9D6D] hover:underline text-xs font-bold">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(proj._id)} className="text-red-600 hover:underline text-xs font-bold">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
