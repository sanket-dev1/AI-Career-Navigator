import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDb } from "@/db";
import { User } from "@/db/models";

export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ user: null }, { status: 401 });
  await connectDb();
  const row = await User.findById(s.sub).lean();
  if (!row) return NextResponse.json({ user: null }, { status: 401 });
  return NextResponse.json({
    user: {
      id: String(row._id),
      name: row.name,
      email: row.email,
      targetRole: row.targetRole,
      learningHoursPerWeek: row.learningHoursPerWeek,
      learningStyle: row.learningStyle,
      theme: row.theme,
      isAdmin: row.isAdmin,
    },
  });
}
