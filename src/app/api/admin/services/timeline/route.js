import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/db";
import ServiceTimeline from "../../../../../models/ServiceTimeline";
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

    const timeline = await ServiceTimeline.find({ serviceId }).sort({ sortOrder: 1 });
    return NextResponse.json(timeline);
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
    const timelineStep = await ServiceTimeline.create(body);
    return NextResponse.json(timelineStep);
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
        ServiceTimeline.findByIdAndUpdate(id, { sortOrder: index })
      );
      await Promise.all(promises);
      return NextResponse.json({ success: true });
    }

    const { _id, ...updateData } = body;
    if (updateData.serviceId === "null" || updateData.serviceId === "") {
      updateData.serviceId = null;
    }

    const oldT = await ServiceTimeline.findById(_id);
    if (!oldT) {
      return NextResponse.json({ error: "Timeline step not found" }, { status: 404 });
    }

    // Clean up replaced icon image if it was S3
    if (updateData.icon && updateData.icon !== oldT.icon) {
      await safeDeleteS3(oldT.icon);
    }

    const timelineStep = await ServiceTimeline.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json(timelineStep);
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

    const step = await ServiceTimeline.findById(id);
    if (!step) {
      return NextResponse.json({ error: "Timeline step not found" }, { status: 404 });
    }

    await safeDeleteS3(step.icon);
    await ServiceTimeline.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";
