import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/db";
import Service from "../../../../../models/Service";
import ServiceSection from "../../../../../models/ServiceSection";
import ServiceFAQ from "../../../../../models/ServiceFAQ";
import ServiceBenefit from "../../../../../models/ServiceBenefit";
import ServiceTestimonial from "../../../../../models/ServiceTestimonial";
import ServiceTimeline from "../../../../../models/ServiceTimeline";
import ServiceStatistic from "../../../../../models/ServiceStatistic";
import ServiceGallery from "../../../../../models/ServiceGallery";
import ServiceSEO from "../../../../../models/ServiceSEO";
import { getAdminFromSession } from "../../../../../lib/auth";
import { deleteFromS3 } from "../../../../../lib/s3";

// Helper to delete S3 URL if present
async function safeDeleteS3(url) {
  if (url && url.startsWith("https://sin1.contabostorage.com/")) {
    try {
      await deleteFromS3(url);
    } catch (err) {
      console.error("Failed to delete S3 image:", url, err);
    }
  }
}

export async function PUT(request, { params }) {
  try {
    const admin = await getAdminFromSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const oldService = await Service.findById(id);
    if (!oldService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // Check slug uniqueness if changed
    if (body.slug && body.slug !== oldService.slug) {
      const existing = await Service.findOne({ slug: body.slug });
      if (existing) {
        return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
      }
    }

    // S3 cleanups for replaced images
    if (body.thumbnail && body.thumbnail !== oldService.thumbnail) {
      await safeDeleteS3(oldService.thumbnail);
    }
    if (body.heroImage && body.heroImage !== oldService.heroImage) {
      await safeDeleteS3(oldService.heroImage);
    }

    const service = await Service.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const admin = await getAdminFromSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;

    const service = await Service.findById(id);
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // 1. Delete main images
    await safeDeleteS3(service.thumbnail);
    await safeDeleteS3(service.heroImage);

    // 2. Delete sections and their media
    const sections = await ServiceSection.find({ serviceId: id });
    for (const sec of sections) {
      if (sec.content) {
        await safeDeleteS3(sec.content.image);
        await safeDeleteS3(sec.content.video);
        await safeDeleteS3(sec.content.bgImage);
        if (Array.isArray(sec.content.images)) {
          for (const img of sec.content.images) {
            await safeDeleteS3(img.url || img);
          }
        }
      }
    }
    await ServiceSection.deleteMany({ serviceId: id });

    // 3. Delete FAQs
    await ServiceFAQ.deleteMany({ serviceId: id });

    // 4. Delete Benefits
    await ServiceBenefit.deleteMany({ serviceId: id });

    // 5. Delete Testimonials and photos
    const testimonials = await ServiceTestimonial.find({ serviceId: id });
    for (const test of testimonials) {
      await safeDeleteS3(test.photo);
    }
    await ServiceTestimonial.deleteMany({ serviceId: id });

    // 6. Delete Timelines
    await ServiceTimeline.deleteMany({ serviceId: id });

    // 7. Delete Statistics
    await ServiceStatistic.deleteMany({ serviceId: id });

    // 8. Delete Gallery and images
    const galleryItems = await ServiceGallery.find({ serviceId: id });
    for (const item of galleryItems) {
      await safeDeleteS3(item.imageUrl);
    }
    await ServiceGallery.deleteMany({ serviceId: id });

    // 9. Delete SEO and images
    const seo = await ServiceSEO.findOne({ serviceId: id });
    if (seo) {
      await safeDeleteS3(seo.ogImage);
      await safeDeleteS3(seo.twitterImage);
      await ServiceSEO.deleteMany({ serviceId: id });
    }

    // 10. Delete Service itself
    await Service.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";
