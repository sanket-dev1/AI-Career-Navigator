import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { getSession } from "@/lib/auth";
import { User } from "@/db/models";
import { connectDb } from "@/db";

export const metadata: Metadata = {
  title: "AI Career Navigator — From where you are to where you want to be",
  description:
    "AI-powered career planning platform. Upload your resume, discover skill gaps, get a personalized roadmap, and track your job readiness.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  let initialUser = null;
  if (session) {
    await connectDb();
    const row = await User.findById(session.sub).lean();
    if (row) {
      initialUser = {
        id: String(row._id),
        name: row.name,
        email: row.email,
        targetRole: (row.targetRole ?? null) as string | null,
        learningHoursPerWeek: (row.learningHoursPerWeek ?? null) as number | null,
        learningStyle: (row.learningStyle ?? null) as string | null,
        theme: (row.theme ?? null) as string | null,
        isAdmin: row.isAdmin,
      };
    }
  }

  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="noise min-h-screen">
        <AuthProvider initial={initialUser}>{children}</AuthProvider>
      </body>
    </html>
  );
}
