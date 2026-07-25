"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PageLoader } from "../../components/PageLoader";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [cmsExpanded, setCmsExpanded] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [adminName, setAdminName] = useState("Admin");
  const [adminAvatar, setAdminAvatar] = useState("");
  const [siteSettings, setSiteSettings] = useState({ companyName: "Chandan Valley Farms", logo: "/logo.png" });

  const isLoginPage = pathname === "/admin/login";

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

  // Check auth session
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/profile");
        if (!res.ok) {
          if (!isLoginPage) {
            router.push("/admin/login");
          }
        } else {
          const data = await res.json();
          setAdminName(data.name || "Admin");
          setAdminAvatar(data.profileImage || "");
          if (isLoginPage) {
            router.push("/admin/dashboard");
          }
        }
      } catch (err) {
        if (!isLoginPage) {
          router.push("/admin/login");
        }
      } finally {
        setCheckingAuth(false);
      }
    }
    checkAuth();
  }, [pathname, isLoginPage, router]);

  useEffect(() => {
    if (pathname && pathname.startsWith("/admin/cms")) {
      setCmsExpanded(true);
    }
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      router.push("/admin/login");
    } catch (e) {
      alert("Logout failed");
    }
  };

  if (checkingAuth) {
    return <PageLoader />;
  }

  // If on login page, just render the child directly without sidebar shell
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Breadcrumb generator
  const getBreadcrumbs = () => {
    const parts = pathname.split("/").filter(Boolean);
    return parts.map((part, idx) => {
      const href = "/" + parts.slice(0, idx + 1).join("/");
      const label = part.charAt(0).toUpperCase() + part.slice(1);
      return (
        <React.Fragment key={idx}>
          <span className="text-gray-400">/</span>
          <a href={href} className="hover:text-[#0F9D6D] font-medium text-xs">
            {label}
          </a>
        </React.Fragment>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex text-[#222222]">
      {/* Sidebar */}
      <aside
        className={`bg-[#0F9D6D] text-white flex flex-col justify-between transition-all duration-300 z-30 ${
          sidebarOpen ? "w-64" : "w-20"
        } fixed md:sticky top-0 h-screen`}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10 overflow-hidden">
            <img src={siteSettings.logo} alt="Logo" className="h-8 w-auto shrink-0" />
            {sidebarOpen && (
              <div className="flex flex-col">
                <span className="font-playfair font-bold text-sm tracking-tight text-white leading-none">
                  {siteSettings.companyName}
                </span>
                <span className="text-[8px] tracking-[0.2em] text-[#D9A321] font-semibold mt-0.5">
                  FARMS CMS
                </span>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <a
              href="/admin/dashboard"
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                pathname === "/admin/dashboard"
                  ? "bg-[#D9A321] text-[#0F9D6D]"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
              </svg>
              {sidebarOpen && <span>Dashboard</span>}
            </a>

            {/* Collapsible CMS Node */}
            <div>
              <button
                onClick={() => setCmsExpanded(!cmsExpanded)}
                className="w-full flex items-center justify-between gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-all duration-150"
              >
                <div className="flex items-center gap-3.5">
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {sidebarOpen && <span>CMS Pages</span>}
                </div>
                {sidebarOpen && (
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      cmsExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>

              {cmsExpanded && sidebarOpen && (
                <div className="pl-9 mt-1 space-y-1">
                  <a
                    href="/admin/cms/home"
                    className={`block py-2 px-3 rounded-lg text-xs font-semibold ${
                      pathname === "/admin/cms/home"
                        ? "text-[#D9A321]"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    • Home Page
                  </a>
                  <a
                    href="/admin/cms/about"
                    className={`block py-2 px-3 rounded-lg text-xs font-semibold ${
                      pathname === "/admin/cms/about"
                        ? "text-[#D9A321]"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    • About Page
                  </a>
                  <a
                    href="/admin/cms/services"
                    className={`block py-2 px-3 rounded-lg text-xs font-semibold ${
                      pathname.startsWith("/admin/cms/services")
                        ? "text-[#D9A321]"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    • Services Page
                  </a>
                  <a
                    href="/admin/cms/contact"
                    className={`block py-2 px-3 rounded-lg text-xs font-semibold ${
                      pathname === "/admin/cms/contact"
                        ? "text-[#D9A321]"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    • Contact Page
                  </a>
                  <a
                    href="/admin/cms/privacy-policy"
                    className={`block py-2 px-3 rounded-lg text-xs font-semibold ${
                      pathname === "/admin/cms/privacy-policy"
                        ? "text-[#D9A321]"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    • Privacy Policy
                  </a>
                  <a
                    href="/admin/cms/terms-of-service"
                    className={`block py-2 px-3 rounded-lg text-xs font-semibold ${
                      pathname === "/admin/cms/terms-of-service"
                        ? "text-[#D9A321]"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    • Terms of Service
                  </a>
                </div>
              )}
            </div>

            <a
              href="/admin/projects"
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                pathname === "/admin/projects"
                  ? "bg-[#D9A321] text-[#0F9D6D]"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {sidebarOpen && <span>Projects</span>}
            </a>

            <a
              href="/admin/projects/categories"
              className={`flex items-center gap-3.5 pl-11 pr-4 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                pathname === "/admin/projects/categories"
                  ? "text-[#D9A321]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {sidebarOpen && <span>• Project Categories</span>}
            </a>

            <a
              href="/admin/blogs"
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                pathname === "/admin/blogs"
                  ? "bg-[#D9A321] text-[#0F9D6D]"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              {sidebarOpen && <span>Blogs</span>}
            </a>

            <a
              href="/admin/media"
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                pathname === "/admin/media"
                  ? "bg-[#D9A321] text-[#0F9D6D]"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {sidebarOpen && <span>Media Library</span>}
            </a>

            <a
              href="/admin/enquiries"
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                pathname === "/admin/enquiries"
                  ? "bg-[#D9A321] text-[#0F9D6D]"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
              </svg>
              {sidebarOpen && <span>Enquiries</span>}
            </a>

            <a
              href="/admin/settings"
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                pathname === "/admin/settings"
                  ? "bg-[#D9A321] text-[#0F9D6D]"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {sidebarOpen && <span>Settings</span>}
            </a>

            <a
              href="/admin/profile"
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                pathname === "/admin/profile"
                  ? "bg-[#D9A321] text-[#0F9D6D]"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {sidebarOpen && <span>Profile</span>}
            </a>
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold text-red-300 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 bg-white border-b border-[#E5E7EB] z-20 flex items-center justify-between px-6 py-4 shadow-sm">
          {/* Hamburger toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-[#0F9D6D] hover:bg-gray-100 p-2 rounded-lg transition-colors focus:outline-none"
              aria-label="Toggle Sidebar"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Breadcrumb path */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
              <span className="text-gray-400">Admin</span>
              {getBreadcrumbs()}
            </div>
          </div>

          {/* Profile Quick Toggler */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2.5 focus:outline-none group"
            >
              <div className="h-9 w-9 rounded-full bg-[#0F9D6D]/10 border border-[#0F9D6D]/20 overflow-hidden flex items-center justify-center">
                {adminAvatar ? (
                  <img src={adminAvatar} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[#0F9D6D] font-bold text-sm">A</span>
                )}
              </div>
              <span className="hidden sm:inline text-sm font-semibold text-gray-700 group-hover:text-[#0F9D6D] transition-colors">
                {adminName}
              </span>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white border border-[#E5E7EB] rounded-xl shadow-xl py-1.5 z-30">
                <a
                  href="/admin/profile"
                  onClick={() => setUserMenuOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#F8FAF8] hover:text-[#0F9D6D] font-semibold"
                >
                  My Profile
                </a>
                <a
                  href="/admin/settings"
                  onClick={() => setUserMenuOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#F8FAF8] hover:text-[#0F9D6D] font-semibold"
                >
                  Settings
                </a>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content body */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
