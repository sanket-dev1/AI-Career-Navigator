import { NextResponse } from "next/server";
import { connectDb } from "@/db";
import { CareerRole, Resource, Project } from "@/db/models";
import { SEED_CAREER_ROLES, SEED_RESOURCES, SEED_PROJECTS } from "@/lib/seed";

export async function GET() {
  try {
    await connectDb();
    const count = await CareerRole.countDocuments();
    if (count === 0) {
      await CareerRole.insertMany(SEED_CAREER_ROLES, { ordered: false }).catch(() => {});
      await Resource.insertMany(SEED_RESOURCES, { ordered: false }).catch(() => {});
      await Project.insertMany(SEED_PROJECTS, { ordered: false }).catch(() => {});
    }
    const roles = await CareerRole.find().lean();
    const ress = await Resource.find().lean();
    const projs = await Project.find().lean();
    return NextResponse.json({ roles, resources: ress, projects: projs });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Fetch failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
