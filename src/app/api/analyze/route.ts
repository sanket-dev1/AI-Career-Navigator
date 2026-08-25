import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { connectDb } from "@/db";
import { User, Resume, SkillGap, Roadmap } from "@/db/models";
import { analyzeResume, generateRoadmap } from "@/services/ai";
import { SEED_CAREER_ROLES } from "@/lib/seed";

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    const body = await req.json();
    const targetSlug = body.targetRole as string | undefined;
    if (!targetSlug) {
      return NextResponse.json({ error: "targetRole required" }, { status: 400 });
    }

    const roleSeed = SEED_CAREER_ROLES.find((r) => r.slug === targetSlug);
    const requiredSkills = roleSeed?.requiredSkills || [];
    const recommendedSkills = roleSeed?.recommendedSkills || [];
    const targetName = body.customRoleName || roleSeed?.name || targetSlug;

    await connectDb();
    await User.findByIdAndUpdate(session.sub, { targetRole: targetSlug });

    const latest = await Resume.findOne({ userId: session.sub }).sort({ createdAt: -1 });
    if (!latest) {
      return NextResponse.json({ error: "Please upload a resume first" }, { status: 400 });
    }

    const user = await User.findById(session.sub);
    const analysis = await analyzeResume({
      text: latest.extractedText || "",
      targetRole: targetName,
      requiredSkills,
      recommendedSkills,
      learningHoursPerWeek: user?.learningHoursPerWeek ?? 10,
    });

    await SkillGap.create({
      userId: session.sub,
      targetRole: targetName,
      strong: analysis.strong,
      developing: analysis.developing,
      missing: analysis.missing,
      matchScore: analysis.matchScore,
    });

    const weeks = generateRoadmap({
      analysis,
      targetRole: targetName,
      learningHoursPerWeek: user?.learningHoursPerWeek ?? 10,
    });

    const roadmap = await Roadmap.create({
      userId: session.sub,
      targetRole: targetName,
      totalWeeks: weeks.length,
      readinessScore: analysis.readinessScore,
      skillMatch: analysis.matchScore,
      progress: 0,
      data: { weeks, analysis },
    });

    return NextResponse.json({ analysis, roadmap: weeks, roadmapId: String(roadmap._id) });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Analysis failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await requireSession();
    await connectDb();
    const latest = await Resume.findOne({ userId: session.sub }).sort({ createdAt: -1 }).lean();
    const gap = await SkillGap.findOne({ userId: session.sub }).sort({ createdAt: -1 }).lean();
    const rm = await Roadmap.findOne({ userId: session.sub }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ resume: latest, gap, roadmap: rm });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Fetch failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
