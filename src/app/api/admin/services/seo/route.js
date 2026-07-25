import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/db";
import ServiceSEO from "../../../../../models/ServiceSEO";
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

    let seo = await ServiceSEO.findOne({ serviceId });
    if (!seo) {
      seo = {
        serviceId,
        metaTitle: "",
        metaDescription: "",
        keywords: "",
        canonicalUrl: "",
        ogImage: "",
        twitterImage: "",
        schemaMarkup: "",
        robots: "index, follow",
      };
    }
    return NextResponse.json(seo);
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
    const serviceId = (body.serviceId === "null" || !body.serviceId) ? null : body.serviceId;

    let seo = await ServiceSEO.findOne({ serviceId });
    if (seo) {
      if (body.ogImage && body.ogImage !== seo.ogImage) await safeDeleteS3(seo.ogImage);
      if (body.twitterImage && body.twitterImage !== seo.twitterImage) await safeDeleteS3(seo.twitterImage);
      Object.assign(seo, body);
      await seo.save();
    } else {
      seo = await ServiceSEO.create({ ...body, serviceId });
    }

    return NextResponse.json(seo);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  return POST(request);
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

    const seo = await ServiceSEO.findById(id);
    if (seo) {
      await safeDeleteS3(seo.ogImage);
      await safeDeleteS3(seo.twitterImage);
      await ServiceSEO.findByIdAndDelete(id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";
