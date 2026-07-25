"use client";

import React, { useState, useEffect } from "react";
import { PageLoader } from "../../../components/PageLoader";

export default function ProfileModule() {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    profileImage: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const loadProfile = async () => {
    try {
      const res = await fetch("/api/admin/profile");
      const data = await res.json();
      setProfile({
        name: data.name || "",
        email: data.email || "",
        profileImage: data.profileImage || "",
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      setUploading(true);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const val = await res.json();
      if (val.url) {
        setProfile((prev) => ({ ...prev, profileImage: val.url }));
        await fetch("/api/admin/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profileImage: val.url }),
        });
        alert("Profile image updated in database!");
      }
    } catch (err) {
      alert("Asset upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profile.name, email: profile.email }),
      });
      if (res.ok) {
        alert("Personal profile properties saved!");
      }
    } catch (err) {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Authentication password updated!");
        setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        alert(data.error || "Password change failed");
      }
    } catch (err) {
      alert("Error updating password");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-[#E5E7EB] pb-4">
        <h2 className="font-playfair text-2xl font-extrabold text-[#0F9D6D]">My Profile</h2>
        <p className="text-xs text-gray-500 mt-1">Configure your email address, profile avatar, and login password.</p>
      </div>

      {uploading && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-xl flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#0F9D6D] border-t-transparent" />
            <span className="font-semibold text-sm">Uploading photo...</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Avatar Box */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-sm flex flex-col items-center justify-center text-center space-y-4">
          <div className="h-28 w-28 rounded-full bg-[#0F9D6D]/5 border-2 border-[#0F9D6D]/10 overflow-hidden relative flex items-center justify-center">
            {profile.profileImage ? (
              <img src={profile.profileImage} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <span className="text-[#0F9D6D] font-bold text-3xl">A</span>
            )}
          </div>
          <div>
            <input type="file" id="profileImageUpload" onChange={handleUpload} className="hidden" />
            <label htmlFor="profileImageUpload" className="bg-[#0F9D6D] text-white hover:bg-[#12B886] px-4 py-2 rounded-xl text-xs font-bold cursor-pointer inline-block">
              Upload Avatar
            </label>
          </div>
        </div>

        {/* Right Side Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile Form */}
          <form onSubmit={handleProfileUpdate} className="bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-sm space-y-4">
            <h3 className="font-playfair text-sm font-bold text-[#0F9D6D] uppercase tracking-wider border-b pb-2">Profile Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500">Name</label>
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs mt-1"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500">Email Address</label>
                <input
                  type="email"
                  required
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs mt-1"
                />
              </div>
            </div>
            <button type="submit" className="bg-[#0F9D6D] text-white px-5 py-2 rounded-full text-xs font-bold">
              Save Details
            </button>
          </form>

          {/* Password Form */}
          <form onSubmit={handlePasswordUpdate} className="bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-sm space-y-4">
            <h3 className="font-playfair text-sm font-bold text-[#0F9D6D] uppercase tracking-wider border-b pb-2">Change Password</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500">Current Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs mt-1"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500">New Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs mt-1"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs mt-1"
                />
              </div>
            </div>
            <button type="submit" className="bg-[#0F9D6D] text-white px-5 py-2 rounded-full text-xs font-bold">
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
