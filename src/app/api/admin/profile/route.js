import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "../../../../lib/db";
import Admin from "../../../../models/Admin";
import { getAdminFromSession } from "../../../../lib/auth";

export async function GET() {
  try {
    const sessionAdmin = await getAdminFromSession();
    if (!sessionAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const admin = await Admin.findById(sessionAdmin.id).select("-passwordHash");
    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json(admin);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const sessionAdmin = await getAdminFromSession();
    if (!sessionAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const { name, email, profileImage, oldPassword, newPassword } = body;

    const admin = await Admin.findById(sessionAdmin.id);
    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    if (name) admin.name = name;
    if (email) admin.email = email;
    if (profileImage !== undefined) admin.profileImage = profileImage;

    // Password change check
    if (oldPassword && newPassword) {
      const match = await bcrypt.compare(oldPassword, admin.passwordHash);
      if (!match) {
        return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
      }
      admin.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    await admin.save();
    return NextResponse.json({ success: true, name: admin.name, email: admin.email, profileImage: admin.profileImage });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
