"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { DashboardLayout } from "@/components/layout";
import { Card, Progress, Badge, SectionHeading } from "@/components/ui";

type GapData = {
  gap?: {
    strong?: { name: string; level: number }[];
    developing?: { name: string; level: number }[];
    missing?: { name: string; priority: string; reason?: string }[];
    matchScore?: number;
  } | null;
};

export default function SkillsPage() {
  const [data, setData] = useState<GapData>({});

  useEffect(() => {
    fetch("/api/analyze").then((r) => r.json()).then(setData).catch(() => {});
  }, []);

  const { strong = [], developing = [], missing = [] } = data.gap || {};
  const matchScore = data.gap?.matchScore ?? 0;

  const radarData = [
    ...strong.map((s) => ({ skill: s.name, you: s.level, target: 85 })),
    ...developing.map((s) => ({ skill: s.name, you: s.level, target: 75 })),
  ].slice(0, 8);

  const barData = [
    ...strong.map((s) => ({ name: s.name, level: s.level, status: "strong" })),
    ...developing.map((s) => ({ name: s.name, level: s.level, status: "developing" })),
    ...missing.slice(0, 5).map((m) => ({ name: m.name, level: 0, status: "missing" })),
  ].slice(0, 10);

  return (
    <DashboardLayout>
      <SectionHeading
        eyebrow="Skill Gaps"
        title="AI Skill Gap Analysis"
        subtitle="Compare your current skills against your target role requirements."
      />

      <Card className="mb-6 glow-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Skill Match Score</h3>
          <Badge color={matchScore >= 70 ? "green" : matchScore >= 40 ? "amber" : "red"}>
            {matchScore}%
          </Badge>
        </div>
        <Progress value={matchScore} />
        <div className="mt-4 text-sm text-slate-400">
          {strong.length} strong · {developing.length} developing · {missing.length} missing
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {radarData.length > 0 && (
          <Card>
            <h3 className="font-semibold mb-4">Skill Radar</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1f2452" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: "#9aa3c7", fontSize: 11 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#9aa3c7", fontSize: 10 }} />
                <Radar name="You" dataKey="you" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.3} />
                <Radar name="Target" dataKey="target" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        )}

        <Card>
          <h3 className="font-semibold mb-4">Skill Levels</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2452" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: "#9aa3c7", fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={100} tick={{ fill: "#9aa3c7", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#0d1028", border: "1px solid #1f2452", borderRadius: 8 }} />
              <Bar dataKey="level" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <h3 className="font-semibold">Strong</h3>
            <Badge color="green">{strong.length}</Badge>
          </div>
          <div className="space-y-2">
            {strong.map((s) => (
              <motion.div key={s.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex justify-between text-sm py-1.5 border-b border-slate-800/60 last:border-0">
                <span>{s.name}</span>
                <span className="text-emerald-400">{s.level}%</span>
              </motion.div>
            ))}
            {strong.length === 0 && <div className="text-sm text-slate-500">No strong matches yet</div>}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-amber-400" />
            <h3 className="font-semibold">Developing</h3>
            <Badge color="amber">{developing.length}</Badge>
          </div>
          <div className="space-y-2">
            {developing.map((s) => (
              <motion.div key={s.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex justify-between text-sm py-1.5 border-b border-slate-800/60 last:border-0">
                <span>{s.name}</span>
                <span className="text-amber-400">{s.level}%</span>
              </motion.div>
            ))}
            {developing.length === 0 && <div className="text-sm text-slate-500">None</div>}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="h-5 w-5 text-red-400" />
            <h3 className="font-semibold">Missing</h3>
            <Badge color="red">{missing.length}</Badge>
          </div>
          <div className="space-y-2">
            {missing.map((m) => (
              <motion.div key={m.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex justify-between text-sm py-1.5 border-b border-slate-800/60 last:border-0">
                <span>{m.name}</span>
                <Badge color={m.priority === "high" ? "red" : "amber"}>{m.priority}</Badge>
              </motion.div>
            ))}
            {missing.length === 0 && <div className="text-sm text-slate-500">No gaps!</div>}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
