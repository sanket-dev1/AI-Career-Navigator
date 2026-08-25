"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Target,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  FolderKanban,
  Map,
  Upload,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout";
import { Card, Progress, Badge, SectionHeading } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { greet } from "@/lib/utils";

type AnalyzeData = {
  resume?: { skills?: string[] } | null;
  gap?: {
    strong?: { name: string; level: number }[];
    developing?: { name: string; level: number }[];
    missing?: { name: string; priority: string }[];
    matchScore?: number;
  } | null;
  roadmap?: {
    targetRole?: string;
    readinessScore?: number;
    skillMatch?: number;
    progress?: number;
    totalWeeks?: number;
  } | null;
};

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<AnalyzeData>({});

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/analyze")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, [user]);

  if (loading || !user) return <DashboardLayout><div className="skeleton h-96" /></DashboardLayout>;

  const readiness = data.roadmap?.readinessScore ?? 0;
  const matchScore = data.roadmap?.skillMatch ?? data.gap?.matchScore ?? 0;
  const missingCount = data.gap?.missing?.length ?? 0;
  const roadmapProgress = data.roadmap?.progress ?? 0;

  const stats = [
    {
      icon: Target,
      label: "Skill Match",
      value: `${matchScore}%`,
      color: "from-cyan-400 to-blue-500",
    },
    {
      icon: AlertTriangle,
      label: "Skills Missing",
      value: missingCount,
      color: "from-amber-400 to-orange-500",
    },
    {
      icon: Map,
      label: "Roadmap Progress",
      value: `${roadmapProgress}%`,
      color: "from-violet-400 to-pink-500",
    },
    {
      icon: FolderKanban,
      label: "Projects",
      value: "4",
      color: "from-emerald-400 to-green-500",
    },
  ];

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <SectionHeading
          eyebrow="Dashboard"
          title={`${greet()}, ${user.name.split(" ")[0]} 👋`}
          subtitle="Let's move one step closer to your target career."
        />

        {/* Target role + readiness */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="md:col-span-2 glow-border">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-cyan-400/80 mb-1">
                  Target Role
                </div>
                <div className="text-2xl font-bold gradient-text-2">
                  {data.roadmap?.targetRole || user.targetRole || "Not set"}
                </div>
                {!user.targetRole && (
                  <button
                    onClick={() => router.push("/role")}
                    className="mt-3 text-sm text-cyan-300 hover:text-cyan-200"
                  >
                    Choose your target →
                  </button>
                )}
              </div>
              <div className="text-right">
                <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">
                  Status
                </div>
                <Badge color={matchScore >= 70 ? "green" : matchScore >= 40 ? "amber" : "red"}>
                  {matchScore >= 70 ? "On Track" : matchScore >= 40 ? "Building" : "Starting"}
                </Badge>
              </div>
            </div>
          </Card>

          <Card className="glow-border text-center">
            <div className="text-xs uppercase tracking-wider text-cyan-400/80 mb-3">
              Job Readiness
            </div>
            <div className="relative inline-flex items-center justify-center">
              <svg className="h-32 w-32 -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="rgba(139,92,246,0.15)"
                  strokeWidth="10"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="url(#grad)"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - readiness / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute">
                <div className="text-3xl font-bold gradient-text">{readiness}</div>
                <div className="text-xs text-slate-400">/ 100</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Stat cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card>
                  <div className={`inline-flex h-10 w-10 rounded-lg bg-gradient-to-br ${s.color} items-center justify-center mb-3 opacity-80`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-xs uppercase tracking-wider text-slate-400">
                    {s.label}
                  </div>
                  <div className="text-3xl font-bold gradient-text mt-1">{s.value}</div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Skills overview */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Strong Skills</h3>
              <Badge color="green">{data.gap?.strong?.length || 0}</Badge>
            </div>
            <div className="space-y-3">
              {(data.gap?.strong || []).slice(0, 6).map((s) => (
                <div key={s.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{s.name}</span>
                    <span className="text-emerald-400">{s.level}%</span>
                  </div>
                  <Progress value={s.level} />
                </div>
              ))}
              {(!data.gap?.strong || data.gap.strong.length === 0) && (
                <div className="text-sm text-slate-500">
                  Upload a resume and select a target role to see your skill analysis.
                </div>
              )}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Skill Gaps</h3>
              <Badge color="amber">{data.gap?.missing?.length || 0}</Badge>
            </div>
            <div className="space-y-2">
              {(data.gap?.missing || []).slice(0, 6).map((m) => (
                <div
                  key={m.name}
                  className="flex items-center justify-between text-sm py-2 border-b border-slate-800/60 last:border-0"
                >
                  <span>{m.name}</span>
                  <Badge color={m.priority === "high" ? "red" : "amber"}>
                    {m.priority}
                  </Badge>
                </div>
              ))}
              {(!data.gap?.missing || data.gap.missing.length === 0) && (
                <div className="text-sm text-slate-500">
                  No gaps yet — analyze your resume to discover them.
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Quick actions */}
        <Card>
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Upload Resume", href: "/resume", icon: Upload },
              { label: "Pick Target Role", href: "/role", icon: Target },
              { label: "View Roadmap", href: "/roadmap", icon: Map },
              { label: "Track Progress", href: "/progress", icon: TrendingUp },
            ].map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.href}
                  onClick={() => router.push(a.href)}
                  className="btn-ghost rounded-xl p-4 text-left hover:glow-border transition"
                >
                  <Icon className="h-5 w-5 text-cyan-400 mb-2" />
                  <div className="text-sm font-medium">{a.label}</div>
                </button>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
}
