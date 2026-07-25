"use client";

import React, { useState, useEffect } from "react";
import { PageLoader } from "../../../components/PageLoader";

export default function EnquiriesModule() {
  const [loading, setLoading] = useState(true);
  const [enquiries, setEnquiries] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const loadEnquiries = async () => {
    try {
      const res = await fetch(`/api/enquiries?search=${search}&status=${statusFilter}`);
      const data = await res.json();
      setEnquiries(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, [search, statusFilter]);

  const handleStatusChange = async (id, currentStatus) => {
    const nextStatus = currentStatus === "Unread" ? "Read" : "Unread";
    setLoading(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      if (res.ok) {
        loadEnquiries();
      }
    } catch (e) {
      alert("Status update failed");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/enquiries?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        loadEnquiries();
      }
    } catch (e) {
      alert("Delete failed");
      setLoading(false);
    }
  };

  // Convert array to CSV and trigger download
  const exportToCSV = () => {
    if (enquiries.length === 0) return;
    const headers = ["Name", "Phone", "Email", "Source", "Project Interested", "Message", "Status", "Date Submitted"];
    const rows = enquiries.map((e) => [
      e.name,
      e.phone,
      e.email || "",
      e.source || "Contact Us",
      e.project || "",
      e.message || "",
      e.status,
      new Date(e.createdAt).toLocaleDateString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.map((val) => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `enquiries_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && enquiries.length === 0) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-4">
        <div>
          <h2 className="font-playfair text-2xl font-extrabold text-[#0F9D6D]">Leads & Enquiries</h2>
          <p className="text-xs text-gray-500 mt-1">Manage prospective plot customer visits, phone numbers, and CSV exports.</p>
        </div>
        <button
          onClick={exportToCSV}
          disabled={enquiries.length === 0}
          className="bg-[#0F9D6D] text-white hover:bg-[#12B886] disabled:bg-gray-200 disabled:text-gray-400 font-bold px-5 py-2.5 rounded-full text-xs shadow-md"
        >
          Export CSV Sheet
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by name, email or phone..."
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
          <option value="Unread">Unread</option>
          <option value="Read">Read</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400">
                <th className="pb-3 font-semibold">Client Name</th>
                <th className="pb-3 font-semibold">Phone & Email</th>
                <th className="pb-3 font-semibold">Source</th>
                <th className="pb-3 font-semibold">Project Interested</th>
                <th className="pb-3 font-semibold">Message</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-4 text-center text-gray-400 text-xs">No client enquiries matching filters.</td>
                </tr>
              ) : (
                enquiries.map((enq) => (
                  <tr key={enq._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td className="py-4 font-semibold text-[#0F9D6D]">{enq.name}</td>
                    <td className="py-4 text-xs">
                      <div>{enq.phone}</div>
                      <div className="text-gray-400 mt-0.5">{enq.email}</div>
                    </td>
                    <td className="py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F8FAF8] text-[#0F9D6D] border border-gray-100">
                        {enq.source || "Enquiry Form"}
                      </span>
                    </td>
                    <td className="py-4 text-xs text-gray-500 max-w-[180px] truncate" title={enq.project}>{enq.project || "—"}</td>
                    <td className="py-4 text-xs text-gray-500 max-w-[220px] truncate" title={enq.message}>{enq.message || "—"}</td>
                    <td className="py-4">
                      <button
                        onClick={() => handleStatusChange(enq._id, enq.status)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                          enq.status === "Unread" ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        }`}
                      >
                        {enq.status}
                      </button>
                    </td>
                    <td className="py-4 text-right">
                      <button onClick={() => handleDelete(enq._id)} className="text-red-600 hover:underline text-xs font-bold">
                        Delete
                      </button>
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
