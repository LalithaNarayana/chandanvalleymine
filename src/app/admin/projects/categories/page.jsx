"use client";

import React, { useState, useEffect } from "react";
import { PageLoader } from "../../../../components/PageLoader";

export default function ProjectCategoriesModule() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", sortOrder: 0 });

  const loadCategories = async () => {
    try {
      const res = await fetch("/api/project-categories");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = editingCategory ? "PUT" : "POST";
      const bodyData = editingCategory ? { ...formData, id: editingCategory._id } : formData;
      const res = await fetch("/api/project-categories", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
      if (res.ok) {
        setFormData({ name: "", sortOrder: 0 });
        setEditingCategory(null);
        setShowForm(false);
        loadCategories();
      } else {
        const err = await res.json();
        alert(err.error || "Error saving category");
        setLoading(false);
      }
    } catch (err) {
      alert("Error saving category");
      setLoading(false);
    }
  };

  const handleEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name || "", sortOrder: cat.sortOrder || 0 });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category? Projects linked to it will remain but lose their category tag.")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/project-categories?id=${id}`, { method: "DELETE" });
      if (res.ok) loadCategories();
    } catch (e) {
      alert("Delete failed");
      setLoading(false);
    }
  };

  if (loading && categories.length === 0) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-4">
        <div>
          <h2 className="font-playfair text-2xl font-extrabold text-[#0F9D6D]">Project Categories</h2>
          <p className="text-xs text-gray-500 mt-1">
            Manage the categories used to filter projects (e.g. Ongoing, Completed). "All" is shown automatically.
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="/admin/projects"
            className="bg-white border border-[#0F9D6D]/30 text-[#0F9D6D] font-bold px-5 py-2.5 rounded-full text-xs shadow-sm hover:bg-[#F8FAF8]"
          >
            ← Back to Projects
          </a>
          <button
            onClick={() => {
              setEditingCategory(null);
              setFormData({ name: "", sortOrder: 0 });
              setShowForm(!showForm);
            }}
            className="bg-[#0F9D6D] text-white hover:bg-[#12B886] font-bold px-5 py-2.5 rounded-full text-xs shadow-md"
          >
            {showForm ? "Cancel Form" : "+ Add New Category"}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-xl space-y-4">
          <h3 className="font-playfair text-lg font-bold text-[#0F9D6D]">
            {editingCategory ? "Edit Category" : "Create New Category"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ongoing"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sort Order</label>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
          </div>
          <button type="submit" className="bg-[#0F9D6D] text-white px-6 py-2 rounded-full text-xs font-bold">
            {editingCategory ? "Update Category" : "Create Category"}
          </button>
        </form>
      )}

      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400">
                <th className="pb-3 font-semibold">Name</th>
                <th className="pb-3 font-semibold">Slug</th>
                <th className="pb-3 font-semibold">Sort Order</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-400 text-xs">
                    No categories yet. Add "Ongoing" and "Completed" to get started.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td className="py-4 font-semibold text-[#0F9D6D]">{cat.name}</td>
                    <td className="py-4 text-xs text-gray-500">{cat.slug}</td>
                    <td className="py-4 text-xs text-gray-500">{cat.sortOrder}</td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-2.5">
                        <button onClick={() => handleEdit(cat)} className="text-[#0F9D6D] hover:underline text-xs font-bold">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(cat._id)} className="text-red-600 hover:underline text-xs font-bold">
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
