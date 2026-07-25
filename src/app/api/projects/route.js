import { NextResponse } from "next/server";
import dbConnect from "../../../lib/db";
import Project from "../../../models/Project";
import "../../../models/ProjectCategory";
import { getAdminFromSession } from "../../../lib/auth";

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function ensureUniqueSlug(baseSlug, excludeId) {
  let slug = baseSlug || `project-${Date.now()}`;
  let counter = 1;
  // eslint-disable-next-line no-await-in-loop
  while (await Project.findOne({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
  return slug;
}

// Backfill missing slugs so legacy records created before the slug field
// existed don't break links like /projects/undefined.
async function backfillMissingSlugs(projects) {
  const fixes = [];
  for (const project of projects) {
    if (!project.slug) {
      const baseSlug = slugify(project.title) || `project-${project._id}`;
      const uniqueSlug = await ensureUniqueSlug(baseSlug, project._id);
      project.slug = uniqueSlug;
      fixes.push(Project.findByIdAndUpdate(project._id, { slug: uniqueSlug }));
    }
  }
  if (fixes.length > 0) {
    await Promise.all(fixes);
  }
  return projects;
}

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const category = searchParams.get("category") || "";
    const limit = searchParams.get("limit");

    const query = {};
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    if (status) {
      query.status = status;
    }
    if (category) {
      query.category = category;
    }

    let q = Project.find(query).populate("category").sort({ createdAt: -1 });
    if (limit) {
      q = q.limit(parseInt(limit, 10));
    }
    let projects = await q;
    projects = await backfillMissingSlugs(projects);
    return NextResponse.json(projects);
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

    const baseSlug = body.slug ? slugify(body.slug) : slugify(body.title);
    body.slug = await ensureUniqueSlug(baseSlug);
    if (body.category === "") body.category = null;

    const project = await Project.create(body);
    return NextResponse.json(project);
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
    const { id, ...updateData } = body;
    if (updateData.category === "") updateData.category = null;

    // Ensure a valid slug always exists, generating one if missing/blank.
    if (!updateData.slug || !updateData.slug.trim()) {
      const baseSlug = slugify(updateData.title) || `project-${id}`;
      updateData.slug = await ensureUniqueSlug(baseSlug, id);
    } else {
      updateData.slug = await ensureUniqueSlug(slugify(updateData.slug), id);
    }

    const project = await Project.findByIdAndUpdate(id, updateData, { new: true }).populate("category");
    return NextResponse.json(project);
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

    await Project.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
