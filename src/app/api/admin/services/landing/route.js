import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/db";
import ServiceLandingPage from "../../../../../models/ServiceLandingPage";
import { getAdminFromSession } from "../../../../../lib/auth";
import { deleteFromS3 } from "../../../../../lib/s3";

async function safeDeleteS3(url) {
  if (url && url.startsWith("https://sin1.contabostorage.com/")) {
    try {
      await deleteFromS3(url);
    } catch (err) {
      console.error(err);
    }
  }
}

export async function GET(request) {
  try {
    await dbConnect();
    let page = await ServiceLandingPage.findOne();
    if (!page) {
      page = await ServiceLandingPage.create({
        hero: {
          bgImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop",
          badgeText: "PREMIUM CULTIVATION",
          heading: "Dynamic Services Landing Page",
          description: "Manage this section dynamically using the Admin Panel.",
          primaryBtnText: "Explore Services",
          primaryBtnLink: "#services-list",
          secondaryBtnText: "Contact Us",
          secondaryBtnLink: "/contact",
        },
        whyChooseUs: {
          title: "Why Choose Chandan Valley Farms?",
          description: "Premium managed farmland services designed for ultimate ROI.",
        },
        cta: {
          heading: "Ready to Start Your Sandalwood Investment?",
          description: "Get in touch with our experts today.",
          bgImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop",
          btnText: "Book Site Visit",
          btnLink: "/contact",
          btnSecondaryText: "Talk to Expert",
          btnSecondaryLink: "/contact",
        },
      });
    }
    return NextResponse.json(page);
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
    let page = await ServiceLandingPage.findOne();

    if (!page) {
      page = new ServiceLandingPage(body);
    } else {
      // Clean replaced S3 images
      if (body.hero?.bgImage && body.hero.bgImage !== page.hero?.bgImage) {
        await safeDeleteS3(page.hero.bgImage);
      }
      if (body.cta?.bgImage && body.cta.bgImage !== page.cta?.bgImage) {
        await safeDeleteS3(page.cta.bgImage);
      }
      Object.assign(page, body);
    }

    await page.save();
    return NextResponse.json(page);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";
