"use client";

import React, { useState, useEffect } from "react";

export default function MediaLibrary() {
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [mediaList, setMediaList] = useState([]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/media?search=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setMediaList(data);
      }
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchMedia();
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const file = files[0];
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        alert("Image uploaded to Contabo S3!");
        await fetchMedia();
      }
    } catch (e) {
      alert("Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const copyToClipboard = (url, idx) => {
    navigator.clipboard.writeText(url);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const deleteMedia = async (id) => {
    if (!confirm("Delete this image from Contabo S3? This cannot be undone.")) return;
    try {
      await fetch(`/api/media?id=${id}`, { method: "DELETE" });
      setMediaList((prev) => prev.filter((m) => m._id !== id));
    } catch (e) {
      alert("Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-4">
        <div>
          <h2 className="font-playfair text-2xl font-extrabold text-[#0F9D6D]">Contabo S3 Media Library</h2>
          <p className="text-xs text-gray-500 mt-1">Manage global website pictures, brochures, and layout backgrounds.</p>
        </div>
        <div>
          <input
            type="file"
            id="mediaLibraryUpload"
            onChange={handleUpload}
            className="hidden"
          />
          <label
            htmlFor="mediaLibraryUpload"
            className="bg-[#0F9D6D] text-white hover:bg-[#12B886] font-bold px-5 py-2.5 rounded-full text-xs shadow-md cursor-pointer inline-block"
          >
            {uploading ? "Uploading to S3..." : "+ Upload New Asset"}
          </label>
        </div>
      </div>

      {/* Search Filter */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <input
          type="text"
          placeholder="Search by asset name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/3 px-3 py-2 border rounded-xl text-xs"
        />
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="text-center py-16 text-xs text-gray-400">Loading media...</div>
      ) : mediaList.length === 0 ? (
        <div className="text-center py-16 text-xs text-gray-400">No assets yet. Upload your first image.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {mediaList.map((media, idx) => (
            <div key={media._id} className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm flex flex-col justify-between group relative">
              <div className="aspect-square bg-gray-50 overflow-hidden relative border-b">
                <img src={media.url} alt={media.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>

              <div className="p-3 space-y-2">
                <p className="text-xs font-semibold text-gray-700 truncate">{media.name}</p>

                <div className="flex gap-2 justify-between">
                  <button
                    onClick={() => copyToClipboard(media.url, idx)}
                    className="text-[10px] font-bold text-[#0F9D6D] hover:underline"
                  >
                    {copiedIndex === idx ? "Copied!" : "Copy Url"}
                  </button>
                  <button
                    onClick={() => deleteMedia(media._id)}
                    className="text-[10px] font-bold text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
