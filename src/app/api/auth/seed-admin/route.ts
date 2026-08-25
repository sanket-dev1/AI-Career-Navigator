import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/db";
import { User } from "@/db/models";
import { hashPassword } from "@/lib/auth";

/**
 * Admin bootstrap endpoint. Creates (or promotes) an admin user.
 *
 * Requires the ADMIN_SECRET environment variable to be set on the server.
 * The caller must send the same secret in the request body for the action
 * to succeed. This is meant for one-time setup / CI scripts — not for
 * regular user flows.
 *
 * Body JSON:
 * {
 *   "adminSecret": "same-as-ADMIN_SECRET-env",
 *   "name": "Admin",
 *   "email": "admin@example.com",
 *   "password": "strong-password"
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const configuredSecret = process.env.ADMIN_SECRET;
    if (!configuredSecret) {
      return NextResponse.json(
        { error: "ADMIN_SECRET is not configured on the server" },
        { status: 500 },
      );
    }

    const body = await req.json();
    const { adminSecret, name, email, password } = body as {
      adminSecret?: string;
      name?: string;
      email?: string;
      password?: string;
    };

    if (!adminSecret || adminSecret !== configuredSecret) {
      return NextResponse.json({ error: "Invalid admin secret" }, { status: 403 });
    }
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "name, email, and password are required" },
        { status: 400 },
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    await connectDb();
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      // Promote existing user to admin
      user.isAdmin = true;
      if (name) user.name = name;
      await user.save();
      return NextResponse.json({
        ok: true,
        action: "promoted",
        user: {
          id: String(user._id),
          name: user.name,
          email: user.email,
          isAdmin: true,
        },
      });
    }

    const hash = await hashPassword(password);
    user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash: hash,
      isAdmin: true,
    });
    return NextResponse.json({
      ok: true,
      action: "created",
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        isAdmin: true,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Seed failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
