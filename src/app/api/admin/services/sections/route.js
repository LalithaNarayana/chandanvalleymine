import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/db";
import ServiceSection from "../../../../../models/ServiceSection";
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
    const serviceId = searchParams.get("serviceId");

    if (!serviceId) {
      return NextResponse.json({ error: "serviceId is required" }, { status: 400 });
    }

    const sections = await ServiceSection.find({ serviceId }).sort({ sortOrder: 1 });
    return NextResponse.json(sections);
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
    const section = await ServiceSection.create(body);
    return NextResponse.json(section);
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

    // Check if it's a batch reorder
    if (body.reorder && Array.isArray(body.ids)) {
      const promises = body.ids.map((id, index) =>
        ServiceSection.findByIdAndUpdate(id, { sortOrder: index })
      );
      await Promise.all(promises);
      return NextResponse.json({ success: true });
    }

    const { _id, ...updateData } = body;
    const oldSection = await ServiceSection.findById(_id);
    if (!oldSection) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    // Clean up replaced images/media in content
    if (oldSection.content) {
      const oldC = oldSection.content;
      const newC = updateData.content || {};
      if (oldC.image && oldC.image !== newC.image) await safeDeleteS3(oldC.image);
      if (oldC.video && oldC.video !== newC.video) await safeDeleteS3(oldC.video);
      if (oldC.bgImage && oldC.bgImage !== newC.bgImage) await safeDeleteS3(oldC.bgImage);
      if (Array.isArray(oldC.images)) {
        for (const img of oldC.images) {
          const url = img.url || img;
          const newImagesUrls = (newC.images || []).map(ni => ni.url || ni);
          if (!newImagesUrls.includes(url)) {
            await safeDeleteS3(url);
          }
        }
      }
    }

    const section = await ServiceSection.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json(section);
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

    const section = await ServiceSection.findById(id);
    if (!section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    // S3 Cleanups
    if (section.content) {
      await safeDeleteS3(section.content.image);
      await safeDeleteS3(section.content.video);
      await safeDeleteS3(section.content.bgImage);
      if (Array.isArray(section.content.images)) {
        for (const img of section.content.images) {
          await safeDeleteS3(img.url || img);
        }
      }
    }

    await ServiceSection.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";
