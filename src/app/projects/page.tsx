"use client";

import { useEffect, useState } from "react";
import { FolderKanban, CheckCircle2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout";
import { Card, Button, Badge, SectionHeading } from "@/components/ui";

type Project = {
  id: string;
  title: string;
  description: string;
  skills: string[];
  difficulty: string;
  technologies: string[] | null;
  features: string[] | null;
  outcomes: string[] | null;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [completedProjects, setCompletedProjects] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/catalog")
      .then((r) => r.json())
      .then((d) => {
        console.log("Projects:", d.projects);
        setProjects(d.projects || []);
      })
      .catch(() => {});
  }, []);

  function toggleComplete(projectId: string) {
    setCompletedProjects((prev) => {
      if (prev.includes(projectId)) {
        return prev.filter((id) => id !== projectId);
      }

      return [...prev, projectId];
    });
  }

  return (
    <DashboardLayout>
      <SectionHeading
        eyebrow="Projects"
        title="Mini Project Recommendations"
        subtitle="Hands-on projects to close your specific skill gaps."
      />

      <div className="grid md:grid-cols-2 gap-4">
        {projects.map((project) => {
          const isCompleted = completedProjects.includes(project.id);

          return (
            <Card key={project.id}>
              <div className="flex items-start justify-between mb-3">
                <FolderKanban className="h-6 w-6 text-violet-400" />

                <Badge color="violet">
                  {project.difficulty}
                </Badge>
              </div>

              <h3 className="font-semibold text-lg mb-2">
                {project.title}
              </h3>

              <p className="text-sm text-slate-400 mb-4">
                {project.description}
              </p>

              {/* Skills */}
              <div className="mb-4">
                <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">
                  Skills
                </div>

                <div className="flex flex-wrap gap-1">
                  {project.skills.map((skill) => (
                    <span
                      key={skill}
                      className="chip text-[10px]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              {project.technologies &&
                project.technologies.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">
                      Technologies
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((technology) => (
                        <span
                          key={technology}
                          className="chip text-[10px]"
                        >
                          {technology}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Features */}
              {project.features &&
                project.features.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">
                      Features
                    </div>

                    <ul className="text-sm text-slate-300 space-y-1">
                      {project.features.slice(0, 3).map((feature, index) => (
                        <li
                          key={`${project.id}-feature-${index}`}
                          className="flex items-start gap-2"
                        >
                          <span className="text-cyan-400">
                            •
                          </span>

                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Complete Button */}
              <Button
                onClick={() => toggleComplete(project.id)}
                variant={isCompleted ? "success" : "ghost"}
                className="w-full"
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Completed
                  </>
                ) : (
                  "Mark Complete"
                )}
              </Button>
            </Card>
          );
        })}
      </div>
    </DashboardLayout>
  );
}