import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/db";
import ServicePage from "../../../../models/ServicePage";
import { getAdminFromSession } from "../../../../lib/auth";
import { deleteFromS3 } from "../../../../lib/s3";

async function safeDeleteS3(url) {
  if (url && url.startsWith("https://sin1.contabostorage.com/")) {
    try {
      await deleteFromS3(url);
    } catch (err) {
      console.error("S3 deletion failed for:", url, err);
    }
  }
}

export async function GET(request) {
  try {
    const admin = await getAdminFromSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    let page = await ServicePage.findOne();
    if (!page) {
      // Return empty skeleton or redirect to seed via public GET route
      return NextResponse.json({});
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
    let page = await ServicePage.findOne();

    if (!page) {
      page = new ServicePage(body);
    } else {
      // 1. Clean replaced S3 images from Hero background
      if (body.hero?.backgroundImage && body.hero.backgroundImage !== page.hero?.backgroundImage) {
        await safeDeleteS3(page.hero.backgroundImage);
      }
      
      // 2. Clean replaced S3 images from CTA Section background
      if (body.ctaSection?.backgroundImage && body.ctaSection.backgroundImage !== page.ctaSection?.backgroundImage) {
        await safeDeleteS3(page.ctaSection.backgroundImage);
      }

      // 3. Clean replaced S3 images from Core Services array
      if (Array.isArray(body.coreServices) && Array.isArray(page.coreServices)) {
        const newImages = body.coreServices.map(cs => cs.image).filter(Boolean);
        for (const oldCs of page.coreServices) {
          if (oldCs.image && !newImages.includes(oldCs.image)) {
            await safeDeleteS3(oldCs.image);
          }
        }
      }

      // 4. Clean replaced S3 images from SEO settings
      if (body.seo?.ogImage && body.seo.ogImage !== page.seo?.ogImage) {
        await safeDeleteS3(page.seo.ogImage);
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
