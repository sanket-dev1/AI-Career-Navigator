import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/db";
import { User } from "@/db/models";
import { hashPassword, signToken, setAuthCookie } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email(),
  password: z.string().min(6),
  adminSecret: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }
    const { name, email, password, adminSecret } = parsed.data;

    // Determine if this registration should create an admin account.
    // Only honored when ADMIN_SECRET is configured on the server and the
    // provided value matches it exactly.
    const configuredSecret = process.env.ADMIN_SECRET;
    const wantsAdmin = Boolean(adminSecret && configuredSecret && adminSecret === configuredSecret);
    if (adminSecret && !wantsAdmin) {
      return NextResponse.json({ error: "Invalid admin secret" }, { status: 403 });
    }

    await connectDb();
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }
    const hash = await hashPassword(password);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash: hash,
      isAdmin: wantsAdmin,
    });
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
    const msg = err instanceof Error ? err.message : "Registration failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
