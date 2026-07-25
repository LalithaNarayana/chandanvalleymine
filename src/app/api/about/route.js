import { NextResponse } from "next/server";
import dbConnect from "../../../lib/db";
import AboutPage from "../../../models/AboutPage";

export async function GET() {
  try {
    await dbConnect();
    let aboutData = await AboutPage.findOne();
    if (!aboutData) {
      aboutData = await AboutPage.create({});
    }
    return NextResponse.json(aboutData);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const body = await request.json();
    let aboutData = await AboutPage.findOne();
    if (!aboutData) {
      aboutData = new AboutPage(body);
    } else {
      Object.assign(aboutData, body);
    }
    await aboutData.save();
    return NextResponse.json(aboutData);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
