import { NextResponse } from "next/server";

import { connectDb } from "@/db";
import { CareerRole, Resource, Project } from "@/db/models";

import {
  SEED_CAREER_ROLES,
  SEED_RESOURCES,
  SEED_PROJECTS,
} from "@/lib/seed";

export async function GET() {
  try {
    await connectDb();

    const count = await CareerRole.countDocuments();

    if (count === 0) {
      await CareerRole.insertMany(SEED_CAREER_ROLES, {
        ordered: false,
      }).catch(() => {});

      await Resource.insertMany(SEED_RESOURCES, {
        ordered: false,
      }).catch(() => {});

      await Project.insertMany(SEED_PROJECTS, {
        ordered: false,
      }).catch(() => {});
    }

    const roles = await CareerRole.find().lean();
    const resources = await Resource.find().lean();
    const projects = await Project.find().lean();

    return NextResponse.json({
      roles: roles.map((role) => ({
        id: role._id.toString(),
        slug: role.slug,
        name: role.name,
        description: role.description,
        requiredSkills: role.requiredSkills,
        recommendedSkills: role.recommendedSkills,
        difficulty: role.difficulty,
        prepWeeks: role.prepWeeks,
        icon: role.icon,
      })),

      resources: resources.map((resource) => ({
        id: resource._id.toString(),
        title: resource.title,
        skill: resource.skill,
        platform: resource.platform,
        url: resource.url,
        type: resource.type,
        difficulty: resource.difficulty,
        isFree: resource.isFree,
        durationHours: resource.durationHours,
        description: resource.description,
      })),

      projects: projects.map((project) => ({
        id: project._id.toString(),
        title: project.title,
        description: project.description,
        skills: project.skills,
        difficulty: project.difficulty,
        technologies: project.technologies,
        features: project.features,
        outcomes: project.outcomes,
      })),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Fetch failed";

    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}