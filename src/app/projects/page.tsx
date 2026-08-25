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
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/catalog").then((r) => r.json()).then((d) => setProjects(d.projects || [])).catch(() => {});
  }, []);

  function toggleComplete(id: string) {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
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
        {projects.map((p) => (
          <Card key={p.id}>
            <div className="flex items-start justify-between mb-3">
              <FolderKanban className="h-6 w-6 text-violet-400" />
              <Badge color="violet">{p.difficulty}</Badge>
            </div>
            <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
            <p className="text-sm text-slate-400 mb-4">{p.description}</p>

            <div className="mb-4">
              <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">Skills</div>
              <div className="flex flex-wrap gap-1">
                {p.skills.map((s) => (
                  <span key={s} className="chip text-[10px]">{s}</span>
                ))}
              </div>
            </div>

            {p.technologies && (
              <div className="mb-4">
                <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">Technologies</div>
                <div className="flex flex-wrap gap-1">
                  {p.technologies.map((t) => (
                    <span key={t} className="chip text-[10px]">{t}</span>
                  ))}
                </div>
              </div>
            )}

            {p.features && (
              <div className="mb-4">
                <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">Features</div>
                <ul className="text-sm text-slate-300 space-y-1">
                  {p.features.slice(0, 3).map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-cyan-400">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button
              onClick={() => toggleComplete(p.id)}
              variant={completed.has(p.id) ? "success" : "ghost"}
              className="w-full"
            >
              {completed.has(p.id) ? (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Completed
                </>
              ) : (
                "Mark Complete"
              )}
            </Button>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
