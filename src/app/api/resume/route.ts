import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { connectDb } from "@/db";
import { Resume, User, CareerRole } from "@/db/models";
import { extractText, extractSkillsFromText, extractSections } from "@/services/resume";
import { analyzeResume } from "@/services/ai";

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }
    const lower = file.name.toLowerCase();
    if (!lower.endsWith(".pdf") && !lower.endsWith(".docx")) {
      return NextResponse.json({ error: "Only PDF and DOCX supported" }, { status: 400 });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const text = await extractText(buf, file.name);
    if (!text || text.length < 50) {
      return NextResponse.json({ error: "Resume appears empty or unreadable" }, { status: 400 });
    }

    const skills = extractSkillsFromText(text);
    const sections = extractSections(text);
    await connectDb();

    const userRow = await User.findById(session.sub);
    let analysis = null;
    let resumeScore: number | null = null;
    if (userRow?.targetRole) {
      const role = await CareerRole.findOne({ slug: userRow.targetRole });
      if (role) {
        analysis = await analyzeResume({
          text,
          targetRole: role.name,
          requiredSkills: role.requiredSkills,
          recommendedSkills: role.recommendedSkills || undefined,
          learningHoursPerWeek: userRow.learningHoursPerWeek ?? 10,
        });
        resumeScore = analysis.resumeScore;
      }
    }

    const resume = await Resume.create({
      userId: session.sub,
      fileName: file.name,
      fileSize: file.size,
      extractedText: text,
      contactInfo: sections.contact,
      education: sections.education,
      experience: sections.experience,
      projects: sections.projects,
      certifications: sections.certifications,
      skills,
      analysis: analysis as unknown as Record<string, unknown>,
      resumeScore,
    });

    return NextResponse.json({
      resume: resume.toObject({ flattenObjectIds: true }) as unknown as Record<string, unknown>,
      analysis,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await requireSession();
    await connectDb();
    const rows = await Resume.find({ userId: session.sub })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
    return NextResponse.json({ resumes: rows });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Fetch failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
