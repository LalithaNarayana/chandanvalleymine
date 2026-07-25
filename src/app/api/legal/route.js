import { NextResponse } from "next/server";
import dbConnect from "../../../lib/db";
import LegalPage from "../../../models/LegalPage";

const DEFAULTS = {
  "privacy-policy": {
    type: "privacy-policy",
    title: "Privacy Policy",
    content:
      "<p>This Privacy Policy describes how Chandan Valley Farms collects, uses, and protects your personal information. Please update this content from the admin panel.</p>",
  },
  "terms-of-service": {
    type: "terms-of-service",
    title: "Terms of Service",
    content:
      "<p>These Terms of Service govern your use of the Chandan Valley Farms website and services. Please update this content from the admin panel.</p>",
  },
};

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (!type || !DEFAULTS[type]) {
      return NextResponse.json({ error: "Invalid or missing 'type' parameter" }, { status: 400 });
    }

    let page = await LegalPage.findOne({ type });
    if (!page) {
      page = await LegalPage.create(DEFAULTS[type]);
    }
    return NextResponse.json(page);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { type } = body;

    if (!type || !DEFAULTS[type]) {
      return NextResponse.json({ error: "Invalid or missing 'type' field" }, { status: 400 });
    }

    let page = await LegalPage.findOne({ type });
    if (!page) {
      page = new LegalPage({ ...DEFAULTS[type], ...body });
    } else {
      Object.assign(page, body, { updatedAt: new Date() });
    }
    await page.save();
    return NextResponse.json(page);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
