"use client";

import React, { useState, useEffect } from "react";
import { PageLoader } from "../../../components/PageLoader";

export default function AdminDashboardHome() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    projects: 0,
    blogs: 0,
    enquiries: 0,
    unreadEnquiries: 0,
    publishedBlogs: 0,
  });
  const [recentEnquiries, setRecentEnquiries] = useState([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [projRes, blogRes, enqRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/blogs"),
          fetch("/api/enquiries"),
        ]);
        const projs = await projRes.json();
        const blogs = await blogRes.json();
        const enqs = await enqRes.json();

        setStats({
          projects: projs.length || 0,
          blogs: blogs.length || 0,
          enquiries: enqs.length || 0,
          unreadEnquiries: enqs.filter((e) => e.status === "Unread").length || 0,
          publishedBlogs: blogs.filter((b) => b.status === "Published").length || 0,
        });

        setRecentEnquiries(enqs.slice(0, 5));
      } catch (err) {
        console.error("Dashboard metrics failed:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-8">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Projects</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-[#0F9D6D]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </span>
          </div>
          <h2 className="font-playfair text-3xl font-extrabold text-[#0F9D6D]">{stats.projects}</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Blogs</span>
            <span className="p-2 rounded-xl bg-amber-50 text-[#D9A321]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </span>
          </div>
          <h2 className="font-playfair text-3xl font-extrabold text-[#0F9D6D]">{stats.publishedBlogs} <span className="text-xs text-gray-400 font-semibold">/ {stats.blogs}</span></h2>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Unread Enquiries</span>
            <span className="p-2 rounded-xl bg-red-50 text-red-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </span>
          </div>
          <h2 className="font-playfair text-3xl font-extrabold text-red-600">{stats.unreadEnquiries} <span className="text-xs text-gray-400 font-semibold">/ {stats.enquiries} total</span></h2>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">System Status</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <h2 className="font-playfair text-3xl font-extrabold text-[#0F9D6D]">Online</h2>
        </div>
      </div>

      {/* Quick Action Banner */}
      <div className="bg-[#0F9D6D] text-white rounded-3xl p-6 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="font-playfair text-xl font-bold">Quick Actions</h3>
          <p className="text-xs text-gray-300">Fast access to dynamic CMS updating routes</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href="/admin/cms/home" className="bg-[#D9A321] text-[#0F9D6D] px-4 py-2 rounded-xl text-xs font-bold shadow hover:bg-amber-300">
            Edit Home Page
          </a>
          <a href="/admin/cms/about" className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-xl text-xs font-bold">
            Edit About Page
          </a>
          <a href="/admin/projects" className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-xl text-xs font-bold">
            Create Project
          </a>
          <a href="/admin/blogs" className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-xl text-xs font-bold">
            Write Blog Post
          </a>
          <a href="/admin/enquiries" className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-xl text-xs font-bold">
            View Enquiries
          </a>
          <a href="/admin/media" className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-xl text-xs font-bold">
            Media Library
          </a>
        </div>
      </div>

      {/* Recent Activity / Enquiries */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-sm">
        <h3 className="font-playfair text-lg font-bold text-[#0F9D6D] border-b pb-4 mb-4">
          Latest Enquiries
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400">
                <th className="pb-3 font-semibold">Name</th>
                <th className="pb-3 font-semibold">Contact Info</th>
                <th className="pb-3 font-semibold">Source</th>
                <th className="pb-3 font-semibold">Project Interested</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-400 text-xs">No customer enquiries found.</td>
                </tr>
              ) : (
                recentEnquiries.map((enq) => (
                  <tr key={enq._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td className="py-3 font-semibold text-[#0F9D6D]">{enq.name}</td>
                    <td className="py-3 text-xs">
                      <div>{enq.phone}</div>
                      <div className="text-gray-400 mt-0.5">{enq.email}</div>
                    </td>
                    <td className="py-3 text-xs">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F8FAF8] text-[#0F9D6D] border border-gray-100">
                        {enq.source || "Enquiry Form"}
                      </span>
                    </td>
                    <td className="py-3 text-xs text-gray-500 max-w-[180px] truncate" title={enq.project}>{enq.project || "—"}</td>
                    <td className="py-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        enq.status === "Unread" ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"
                      }`}>
                        {enq.status}
                      </span>
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
