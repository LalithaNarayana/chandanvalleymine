import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/db";
import Service from "../../../../models/Service";
import ServiceSection from "../../../../models/ServiceSection";
import ServiceFAQ from "../../../../models/ServiceFAQ";
import ServiceBenefit from "../../../../models/ServiceBenefit";
import ServiceTestimonial from "../../../../models/ServiceTestimonial";
import ServiceTimeline from "../../../../models/ServiceTimeline";
import ServiceStatistic from "../../../../models/ServiceStatistic";
import ServiceGallery from "../../../../models/ServiceGallery";
import ServiceSEO from "../../../../models/ServiceSEO";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { slug } = await params;

    const service = await Service.findOne({ slug, active: true });
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const serviceId = service._id;

    // Fetch related relational data
    const [sections, faqs, benefits, testimonials, timeline, statistics, gallery, seo] = await Promise.all([
      ServiceSection.find({ serviceId, active: true }).sort({ sortOrder: 1 }),
      ServiceFAQ.find({ serviceId, active: true }).sort({ sortOrder: 1 }),
      ServiceBenefit.find({ serviceId, active: true }).sort({ sortOrder: 1 }),
      ServiceTestimonial.find({ serviceId, active: true }).sort({ sortOrder: 1 }),
      ServiceTimeline.find({ serviceId, active: true }).sort({ sortOrder: 1 }),
      ServiceStatistic.find({ serviceId, active: true }).sort({ sortOrder: 1 }),
      ServiceGallery.find({ serviceId, active: true }).sort({ sortOrder: 1 }),
      ServiceSEO.findOne({ serviceId }),
    ]);

    return NextResponse.json({
      service,
      sections,
      faqs,
      benefits,
      testimonials,
      timeline,
      statistics,
      gallery,
      seo,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";
