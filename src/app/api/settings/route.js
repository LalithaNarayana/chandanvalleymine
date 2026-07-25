import { NextResponse } from "next/server";
import dbConnect from "../../../lib/db";
import Settings from "../../../models/Settings";
import { getAdminFromSession } from "../../../lib/auth";

const DEFAULT_SETTINGS = {
  companyName: "Chandan Valley Farms",
  logo: "/logo.png",
  favicon: "/favicon.png",
  footerDescription:
    "South India's premier managed sandalwood farm plot community. Engineered for maximum heartwood growth, clear title legal protection, and long-term generational wealth.",
  phone: "+91 98765 43210",
  phone2: "+91 80 2345 6789",
  email: "info@chandanvalley.com",
  address: "Chikkaballapur Highway, Bengaluru North Extension, Karnataka, India",
  navLinks: [
    { label: "Home", href: "/", order: 1 },
    { label: "About Us", href: "/about", order: 2 },
    { label: "Services", href: "/services", order: 3 },
    { label: "Projects", href: "/projects", order: 4 },
    { label: "Blogs", href: "/blogs", order: 5 },
    { label: "Contact Us", href: "/contact", order: 6 },
  ],
  socialLinks: {
    facebook: "",
    instagram: "",
    linkedin: "",
    whatsapp: "",
  },
};

export async function GET() {
  try {
    await dbConnect();
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(DEFAULT_SETTINGS);
    }
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const admin = await getAdminFromSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(body);
    } else {
      Object.assign(settings, body);
    }
    await settings.save();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
