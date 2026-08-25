"use client";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp } from "lucide-react";
import { DashboardLayout } from "@/components/layout";
import { Card, Progress, SectionHeading } from "@/components/ui";

export default function ProgressPage() {
  const [progress, setProgress] = useState<{
    completedSkills?: string[];
    completedProjects?: string[];
    weeklyHours?: number[];
    roadmapProgress?: number;
  }>({});

  useEffect(() => {
    fetch("/api/progress").then((r) => r.json()).then((d) => setProgress(d.progress || {})).catch(() => {});
  }, []);

  const weeklyData = (progress.weeklyHours || [4, 6, 5, 8, 7, 9, 6]).map((h, i) => ({
    week: `W${i + 1}`,
    hours: h,
  }));

  const roadmapProgress = progress.roadmapProgress || 0;

  return (
    <DashboardLayout>
      <SectionHeading
        eyebrow="Progress"
        title="Track Your Progress"
        subtitle="Watch your readiness score climb as you complete goals."
      />

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">Roadmap Progress</div>
          <div className="text-3xl font-bold gradient-text mb-3">{roadmapProgress}%</div>
          <Progress value={roadmapProgress} />
        </Card>
        <Card>
          <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">Skills Completed</div>
          <div className="text-3xl font-bold gradient-text">{progress.completedSkills?.length || 0}</div>
        </Card>
        <Card>
          <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">Projects Done</div>
          <div className="text-3xl font-bold gradient-text">{progress.completedProjects?.length || 0}</div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-semibold mb-4">Weekly Learning Hours</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2452" />
              <XAxis dataKey="week" tick={{ fill: "#9aa3c7", fontSize: 11 }} />
              <YAxis tick={{ fill: "#9aa3c7", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#0d1028", border: "1px solid #1f2452", borderRadius: 8 }} />
              <Bar dataKey="hours" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-semibold mb-4">Skill Improvement</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={[
              { month: "Jan", score: 30 },
              { month: "Feb", score: 42 },
              { month: "Mar", score: 55 },
              { month: "Apr", score: 63 },
              { month: "May", score: 72 },
              { month: "Jun", score: 78 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2452" />
              <XAxis dataKey="month" tick={{ fill: "#9aa3c7", fontSize: 11 }} />
              <YAxis tick={{ fill: "#9aa3c7", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#0d1028", border: "1px solid #1f2452", borderRadius: 8 }} />
              <Line type="monotone" dataKey="score" stroke="#22d3ee" strokeWidth={3} dot={{ fill: "#22d3ee", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </DashboardLayout>
  );
}
