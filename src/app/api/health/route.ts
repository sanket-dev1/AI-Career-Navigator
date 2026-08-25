import { NextResponse } from "next/server";
import { connectDb } from "@/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDb();
    return NextResponse.json({ status: "ok", database: "mongodb" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unhealthy";
    return NextResponse.json({ status: "error", message: msg }, { status: 500 });
  }
}
