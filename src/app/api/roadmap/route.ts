import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { connectDb } from "@/db";
import { Roadmap } from "@/db/models";

export async function GET() {
  try {
    const session = await requireSession();
    await connectDb();
    const rm = await Roadmap.findOne({ userId: session.sub }).sort({ createdAt: -1 }).lean();
    if (!rm) return NextResponse.json({ roadmap: null });
    return NextResponse.json({ roadmap: rm });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Fetch failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
