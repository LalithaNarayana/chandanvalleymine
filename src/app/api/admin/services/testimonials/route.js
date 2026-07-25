import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/db";
import ServiceTestimonial from "../../../../../models/ServiceTestimonial";
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
    const { searchParams } = new URL(request.url);
    const serviceIdParam = searchParams.get("serviceId");
    const serviceId = (serviceIdParam === "null" || !serviceIdParam) ? null : serviceIdParam;

    const testimonials = await ServiceTestimonial.find({ serviceId }).sort({ sortOrder: 1 });
    return NextResponse.json(testimonials);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const admin = await getAdminFromSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    if (body.serviceId === "null" || body.serviceId === "") {
      body.serviceId = null;
    }
    const testimonial = await ServiceTestimonial.create(body);
    return NextResponse.json(testimonial);
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

    if (body.reorder && Array.isArray(body.ids)) {
      const promises = body.ids.map((id, index) =>
        ServiceTestimonial.findByIdAndUpdate(id, { sortOrder: index })
      );
      await Promise.all(promises);
      return NextResponse.json({ success: true });
    }

    const { _id, ...updateData } = body;
    if (updateData.serviceId === "null" || updateData.serviceId === "") {
      updateData.serviceId = null;
    }

    const oldT = await ServiceTestimonial.findById(_id);
    if (!oldT) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    // Clean up replaced photo
    if (updateData.photo && updateData.photo !== oldT.photo) {
      await safeDeleteS3(oldT.photo);
    }

    const testimonial = await ServiceTestimonial.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json(testimonial);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const admin = await getAdminFromSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const testimonial = await ServiceTestimonial.findById(id);
    if (!testimonial) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    await safeDeleteS3(testimonial.photo);
    await ServiceTestimonial.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";
