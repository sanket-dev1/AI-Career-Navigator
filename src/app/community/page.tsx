"use client";
import { Users, TrendingUp } from "lucide-react";
import { DashboardLayout } from "@/components/layout";
import { Card, Badge, SectionHeading } from "@/components/ui";

export default function CommunityPage() {
  const stats = [
    { label: "AI/ML Learners", value: "1,240", icon: Users },
    { label: "Average Readiness", value: "72%", icon: TrendingUp },
  ];

  const topSkills = ["Python", "Machine Learning", "SQL", "TensorFlow", "Docker"];

  return (
    <DashboardLayout>
      <SectionHeading
        eyebrow="Community"
        title="Community Dashboard"
        subtitle="Anonymous statistics from learners on similar paths."
      />

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-400">{s.label}</div>
                  <div className="text-2xl font-bold gradient-text">{s.value}</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card>
        <h3 className="font-semibold mb-4">Most Learned Skills (AI/ML Path)</h3>
        <div className="space-y-3">
          {topSkills.map((skill, i) => (
            <div key={skill} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-violet-500/20 flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </div>
                <span>{skill}</span>
              </div>
              <Badge color="violet">{Math.round(1240 * (1 - i * 0.15))} learners</Badge>
            </div>
          ))}
        </div>
      </Card>
    </DashboardLayout>
  );
}
