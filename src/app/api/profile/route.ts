import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { connectDb } from "@/db";
import { User, Resume, Roadmap, SkillGap } from "@/db/models";

export async function PUT(req: NextRequest) {
  try {
    const session = await requireSession();
    const body = await req.json();
    await connectDb();
    const updated = await User.findByIdAndUpdate(
      session.sub,
      {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.targetRole !== undefined && { targetRole: body.targetRole }),
        ...(body.learningHoursPerWeek !== undefined && { learningHoursPerWeek: body.learningHoursPerWeek }),
        ...(body.learningStyle !== undefined && { learningStyle: body.learningStyle }),
        ...(body.theme !== undefined && { theme: body.theme }),
      },
      { new: true },
    );
    return NextResponse.json({ user: updated?.toObject() });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await requireSession();
    await connectDb();
    const u = await User.findById(session.sub).lean();
    return NextResponse.json({ user: u });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Fetch failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await requireSession();
    await connectDb();
    const u = await User.findById(session.sub);
    if (!u?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const usersCount = await User.countDocuments();
    const resumeCount = await Resume.countDocuments();
    const roadmapCount = await Roadmap.countDocuments();
    const gaps = await SkillGap.find().lean();

    const roleCounts: Record<string, number> = {};
    for (const g of gaps) {
      roleCounts[g.targetRole] = (roleCounts[g.targetRole] || 0) + 1;
    }

    return NextResponse.json({
      stats: {
        users: usersCount,
        resumes: resumeCount,
        roadmaps: roadmapCount,
        rolePopularity: roleCounts,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Stats failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
