"use client";

import React, { useState, useEffect } from "react";
import { PageLoader } from "../../../components/PageLoader";

export default function BlogsModule() {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editingBlog, setEditingBlog] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    tags: "",
    image: "",
    status: "Published",
  });

  const loadBlogs = async () => {
    try {
      const res = await fetch(`/api/blogs?search=${search}&status=${statusFilter}`);
      const data = await res.json();
      setBlogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, [search, statusFilter]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    try {
      setUploading(true);
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const val = await res.json();
      if (val.url) {
        setFormData((prev) => ({ ...prev, image: val.url }));
      }
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = editingBlog ? "PUT" : "POST";
      const tagsArray = typeof formData.tags === "string" 
        ? formData.tags.split(",").map(t => t.trim()).filter(Boolean)
        : formData.tags;

      const bodyData = editingBlog 
        ? { ...formData, tags: tagsArray, id: editingBlog._id } 
        : { ...formData, tags: tagsArray };

      const res = await fetch("/api/blogs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (res.ok) {
        alert("Blog saved successfully!");
        setFormData({
          title: "",
          slug: "",
          excerpt: "",
          content: "",
          category: "",
          tags: "",
          image: "",
          status: "Published",
        });
        setEditingBlog(null);
        setShowForm(false);
        loadBlogs();
      }
    } catch (err) {
      alert("Error saving blog");
      setLoading(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title || "",
      slug: blog.slug || "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      category: blog.category || "",
      tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : "",
      image: blog.image || "",
      status: blog.status || "Published",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/blogs?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        loadBlogs();
      }
    } catch (e) {
      alert("Delete failed");
      setLoading(false);
    }
  };

  if (loading && blogs.length === 0) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-4">
        <div>
          <h2 className="font-playfair text-2xl font-extrabold text-[#0F9D6D]">Blogs & News Module</h2>
          <p className="text-xs text-gray-500 mt-1">Publish marketing articles and scientific agronomy news updates.</p>
        </div>
        <button
          onClick={() => {
            setEditingBlog(null);
            setFormData({
              title: "",
              slug: "",
              excerpt: "",
              content: "",
              category: "",
              tags: "",
              image: "",
              status: "Published",
            });
            setShowForm(!showForm);
          }}
          className="bg-[#0F9D6D] text-white hover:bg-[#12B886] font-bold px-5 py-2.5 rounded-full text-xs shadow-md"
        >
          {showForm ? "Cancel Form" : "+ Write Article"}
        </button>
      </div>

      {uploading && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-xl flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#0F9D6D] border-t-transparent" />
            <span className="font-semibold text-sm">Uploading cover image...</span>
          </div>
        </div>
      )}

      {/* Blog form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-xl space-y-4">
          <h3 className="font-playfair text-lg font-bold text-[#0F9D6D]">
            {editingBlog ? "Edit Article Details" : "Compose New Article"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Article Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Custom Slug (optional)</label>
              <input
                type="text"
                placeholder="e.g. sandalwood-liquid-gold"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
              <input
                type="text"
                placeholder="e.g. Agronomy Tech"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                placeholder="sandalwood, investment, land"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Excerpt / Summary</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-4 py-2 border rounded-xl text-sm h-14"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Content Text</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-2 border rounded-xl text-sm h-48"
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
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Featured image (S3)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  disabled
                  value={formData.image}
                  className="w-full px-3 py-2 border rounded-xl bg-gray-50 text-xs"
                />
                <input type="file" id="blogImg" onChange={handleUpload} className="hidden" />
                <label htmlFor="blogImg" className="bg-[#0F9D6D] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer">
                  Upload File
                </label>
              </div>
            </div>
          </div>
          <button type="submit" className="bg-[#0F9D6D] text-white px-6 py-2 rounded-full text-xs font-bold">
            {editingBlog ? "Update Article" : "Publish Article"}
          </button>
        </form>
      )}

      {/* Filter Options */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search articles..."
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

      {/* Blogs Table */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400">
                <th className="pb-3 font-semibold">Article</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Slug</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-400 text-xs">No articles published.</td>
                </tr>
              ) : (
                blogs.map((b) => (
                  <tr key={b._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img src={b.image || "/logo.png"} alt="Blog" className="h-10 w-10 rounded-xl object-cover border" />
                        <div className="max-w-xs font-semibold text-[#0F9D6D] truncate">{b.title}</div>
                      </div>
                    </td>
                    <td className="py-4 text-xs font-semibold text-gray-500">{b.category}</td>
                    <td className="py-4 text-xs text-gray-400 font-mono truncate max-w-xs">{b.slug}</td>
                    <td className="py-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        b.status === "Published" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-2.5">
                        <button onClick={() => handleEdit(b)} className="text-[#0F9D6D] hover:underline text-xs font-bold">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(b._id)} className="text-red-600 hover:underline text-xs font-bold">
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
