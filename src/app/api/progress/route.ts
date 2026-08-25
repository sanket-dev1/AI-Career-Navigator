import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { connectDb } from "@/db";
import { UserProgress } from "@/db/models";

export async function GET() {
  try {
    const session = await requireSession();
    await connectDb();
    const p = await UserProgress.findOne({ userId: session.sub }).lean();
    return NextResponse.json({
      progress: p || {
        completedSkills: [],
        completedResources: [],
        completedProjects: [],
        weeklyHours: [4, 6, 5, 8, 7, 9, 6],
        roadmapProgress: 0,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Fetch failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    const body = await req.json();
    await connectDb();
    const existing = await UserProgress.findOne({ userId: session.sub });

    if (existing) {
      existing.completedSkills = body.completedSkills ?? existing.completedSkills;
      existing.completedResources = body.completedResources ?? existing.completedResources;
      existing.completedProjects = body.completedProjects ?? existing.completedProjects;
      existing.weeklyHours = body.weeklyHours ?? existing.weeklyHours;
      existing.roadmapProgress = body.roadmapProgress ?? existing.roadmapProgress;
      await existing.save();
      return NextResponse.json({ progress: existing.toObject() });
    }

    const created = await UserProgress.create({
      userId: session.sub,
      completedSkills: body.completedSkills ?? [],
      completedResources: body.completedResources ?? [],
      completedProjects: body.completedProjects ?? [],
      weeklyHours: body.weeklyHours ?? [4, 6, 5, 8, 7, 9, 6],
      roadmapProgress: body.roadmapProgress ?? 0,
    });
    return NextResponse.json({ progress: created.toObject() });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
