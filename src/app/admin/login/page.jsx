"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [siteSettings, setSiteSettings] = useState({ companyName: "Chandan Valley Farms", logo: "/logo.png" });

  useEffect(() => {
    let active = true;
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (active && data) {
          setSiteSettings((prev) => ({
            companyName: data.companyName || prev.companyName,
            logo: data.logo || prev.logo,
          }));
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        setError(data.error || "Authentication failed");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-cover bg-center flex items-center justify-center p-4 relative" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop')` }}>
      {/* Premium dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#052111]/95 via-[#0F9D6D]/85 to-[#052111]/90" />
      
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <img src={siteSettings.logo} alt={`${siteSettings.companyName} Logo`} className="h-16 w-auto mb-3" />
          <h1 className="font-playfair text-2xl font-extrabold text-[#0F9D6D]">
            {siteSettings.companyName}
          </h1>
          <p className="text-gray-400 text-xs mt-1 font-semibold uppercase tracking-wider">
            Admin Console Login
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-semibold mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="admin@chandanvalley.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0F9D6D] text-sm bg-gray-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0F9D6D] text-sm bg-gray-50/50"
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-300 text-[#0F9D6D] focus:ring-[#0F9D6D]"
              />
              <span>Remember Me</span>
            </label>
            <a href="#" className="text-[#D9A321] hover:underline font-bold">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0F9D6D] hover:bg-[#12B886] text-white font-bold py-3.5 rounded-xl shadow-xl transition-all duration-300 text-sm flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In to Console</span>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
