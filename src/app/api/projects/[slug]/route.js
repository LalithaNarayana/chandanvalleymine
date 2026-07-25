import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/db";
import Project from "../../../../models/Project";
import "../../../../models/ProjectCategory";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { slug } = await params;
    const project = await Project.findOne({ slug }).populate("category");
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
