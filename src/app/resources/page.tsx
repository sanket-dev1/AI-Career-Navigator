"use client";
import { useEffect, useState } from "react";
import { BookOpen, ExternalLink } from "lucide-react";
import { DashboardLayout } from "@/components/layout";
import { Card, Badge, SectionHeading } from "@/components/ui";

type Resource = {
  id: string;
  title: string;
  skill: string;
  platform: string;
  url: string;
  type: string;
  difficulty: string;
  isFree: boolean;
  durationHours: number | null;
  description: string | null;
};

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/api/catalog").then((r) => r.json()).then((d) => setResources(d.resources || [])).catch(() => {});
  }, []);

  const filtered = resources.filter((r) =>
    filter ? r.skill.toLowerCase().includes(filter.toLowerCase()) || r.type.toLowerCase().includes(filter.toLowerCase()) : true,
  );

  return (
    <DashboardLayout>
      <SectionHeading
        eyebrow="Resources"
        title="Learning Resources"
        subtitle="Curated free resources to close your skill gaps."
      />

      <div className="mb-6">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by skill or type..."
          className="w-full max-w-md rounded-xl bg-slate-900/60 border border-slate-700/60 px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/70"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((r) => (
          <Card key={r.id}>
            <div className="flex items-start justify-between mb-3">
              <BookOpen className="h-6 w-6 text-cyan-400" />
              <Badge color={r.isFree ? "green" : "amber"}>{r.isFree ? "Free" : "Paid"}</Badge>
            </div>
            <h3 className="font-semibold mb-2">{r.title}</h3>
            <p className="text-sm text-slate-400 mb-4 line-clamp-2">{r.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge color="violet">{r.skill}</Badge>
              <Badge color="blue">{r.type}</Badge>
              <Badge color="cyan">{r.difficulty}</Badge>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <span>{r.platform}</span>
              {r.durationHours && <span>{r.durationHours}h</span>}
            </div>
            <a
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost rounded-xl px-4 py-2 text-sm flex items-center justify-center gap-2 hover:glow-border transition"
            >
              Visit Resource <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
