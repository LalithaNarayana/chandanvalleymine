import { NextResponse } from "next/server";
import dbConnect from "../../../lib/db";
import HomePage from "../../../models/HomePage";
import Project from "../../../models/Project";

export async function GET() {
  try {
    await dbConnect();
    let homeData = await HomePage.findOne();
    if (!homeData) {
      homeData = await HomePage.create({});
    }

    const result = homeData.toObject();

    // If admin has selected a project to feature, pull its live data in so the
    // Home page always reflects the current details of that project.
    if (homeData.featuredProjectId) {
      const project = await Project.findById(homeData.featuredProjectId);
      if (project) {
        result.featuredProject = {
          image: project.image || "",
          title: project.title || "",
          tagline: project.tagline || "",
          location: project.location || "",
          area: project.area || "",
          plotSize: project.plotSize || "",
          price: project.price || "",
          expectedRoi: project.expectedRoi || "",
          btnText: project.btnText || "Schedule Site Visit",
          btnUrl: project.btnUrl || "/contact",
          slug: project.slug || "",
        };
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const body = await request.json();
    if (body.featuredProjectId === "") body.featuredProjectId = null;
    let homeData = await HomePage.findOne();
    if (!homeData) {
      homeData = new HomePage(body);
    } else {
      Object.assign(homeData, body);
    }
    await homeData.save();
    return NextResponse.json(homeData);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
