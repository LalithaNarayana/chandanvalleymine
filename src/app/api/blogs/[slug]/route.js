import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/db";
import Blog from "../../../../models/Blog";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { slug } = await params;

    const blog = await Blog.findOne({ slug, status: "Published" });
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const related = await Blog.find({
      slug: { $ne: slug },
      status: "Published",
      category: blog.category,
    })
      .sort({ createdAt: -1 })
      .limit(3);

    return NextResponse.json({ blog, related });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";
