import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-change-me-ai-career-navigator",
);

export const COOKIE_NAME = "acn_token";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signToken(payload: {
  sub: string;
  email: string;
  isAdmin?: boolean;
}): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET);
}

export async function verifyToken(
  token: string,
): Promise<{ sub: string; email: string; isAdmin?: boolean } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as {
      sub: string;
      email: string;
      isAdmin?: boolean;
    };
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string): Promise<void> {
  const c = await cookies();
  c.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearAuthCookie(): Promise<void> {
  const c = await cookies();
  c.delete(COOKIE_NAME);
}

export async function getSession(): Promise<{
  sub: string;
  email: string;
  isAdmin?: boolean;
} | null> {
  const c = await cookies();
  const token = c.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireSession(): Promise<{
  sub: string;
  email: string;
  isAdmin?: boolean;
}> {
  const s = await getSession();
  if (!s) throw new Error("Unauthorized");
  return s;
}
