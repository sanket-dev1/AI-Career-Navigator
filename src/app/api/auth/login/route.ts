import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/db";
import { User } from "@/db/models";
import { verifyPassword, signToken, setAuthCookie } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const { email, password } = parsed.data;
    await connectDb();
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    const token = await signToken({
      sub: String(user._id),
      email: user.email,
      isAdmin: user.isAdmin,
    });
    await setAuthCookie(token);
    return NextResponse.json({
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        learningHoursPerWeek: user.learningHoursPerWeek,
        learningStyle: user.learningStyle,
        theme: user.theme,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Login failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
