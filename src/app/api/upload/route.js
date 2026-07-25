import { NextResponse } from "next/server";
import { uploadToS3 } from "../../../lib/s3";
import dbConnect from "../../../lib/db";
import Media from "../../../models/Media";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const fileUrl = await uploadToS3(buffer, uniqueName, file.type);

    try {
      await dbConnect();
      await Media.create({
        name: file.name,
        url: fileUrl,
        key: uniqueName,
        mimeType: file.type,
        size: file.size,
      });
    } catch (dbError) {
      // Upload to S3 succeeded even if the DB record fails; don't block the response
      console.error("Failed to save media record:", dbError.message);
    }

    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";
