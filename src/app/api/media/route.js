import { NextResponse } from "next/server";
import dbConnect from "../../../lib/db";
import Media from "../../../models/Media";
import { deleteFromS3 } from "../../../lib/s3";
import { getAdminFromSession } from "../../../lib/auth";

export async function GET(request) {
  try {
    const admin = await getAdminFromSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const media = await Media.find(query).sort({ createdAt: -1 });
    return NextResponse.json(media);
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

    const media = await Media.findById(id);
    if (media) {
      try {
        await deleteFromS3(media.key || media.url);
      } catch (s3Error) {
        console.error("Failed to delete from S3:", s3Error.message);
      }
      await Media.findByIdAndDelete(id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
