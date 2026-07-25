import { NextResponse } from "next/server";
import dbConnect from "../../../lib/db";
import ServicePage from "../../../models/ServicePage";

export async function GET(request) {
  try {
    await dbConnect();
    let page = await ServicePage.findOne();
    if (!page) {
      page = await ServicePage.create({});
    }
    return NextResponse.json(page);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";
