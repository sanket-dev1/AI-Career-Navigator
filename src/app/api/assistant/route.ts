import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { connectDb } from "@/db";
import { ChatMessage, User, SkillGap } from "@/db/models";
import { generateAssistantReply } from "@/services/ai";

export async function GET() {
  try {
    const session = await requireSession();
    await connectDb();
    const rows = await ChatMessage.find({ userId: session.sub })
      .sort({ createdAt: 1 })
      .limit(50)
      .lean();
    return NextResponse.json({ messages: rows });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Fetch failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    const body = await req.json();
    const question = (body.message as string || "").trim();
    if (!question) {
      return NextResponse.json({ error: "Empty message" }, { status: 400 });
    }

    await connectDb();
    await ChatMessage.create({ userId: session.sub, role: "user", content: question });

    const user = await User.findById(session.sub);
    const gap = await SkillGap.findOne({ userId: session.sub }).sort({ createdAt: -1 });

    const strongSkills = (gap?.strong || []) as { name: string; level: number }[];
    const missingSkills = (gap?.missing || []) as { name: string; priority: string }[];
    const skills = strongSkills.map((s) => s.name);
    const gaps = missingSkills.map((m) => m.name);

    const reply = generateAssistantReply({
      question,
      targetRole: user?.targetRole,
      skills,
      gaps,
      readiness: gap?.matchScore,
    });

    const msg = await ChatMessage.create({
      userId: session.sub,
      role: "assistant",
      content: reply,
    });

    return NextResponse.json({ message: msg.toObject() });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Chat failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
