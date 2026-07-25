import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/db";
import ServiceFAQ from "../../../../../models/ServiceFAQ";
import { getAdminFromSession } from "../../../../../lib/auth";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const serviceIdParam = searchParams.get("serviceId");
    const serviceId = (serviceIdParam === "null" || !serviceIdParam) ? null : serviceIdParam;

    const faqs = await ServiceFAQ.find({ serviceId }).sort({ sortOrder: 1 });
    return NextResponse.json(faqs);
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
    const faq = await ServiceFAQ.create(body);
    return NextResponse.json(faq);
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
        ServiceFAQ.findByIdAndUpdate(id, { sortOrder: index })
      );
      await Promise.all(promises);
      return NextResponse.json({ success: true });
    }

    const { _id, ...updateData } = body;
    if (updateData.serviceId === "null" || updateData.serviceId === "") {
      updateData.serviceId = null;
    }
    const faq = await ServiceFAQ.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json(faq);
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

    await ServiceFAQ.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";
