"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Users, FileText, Map } from "lucide-react";
import { DashboardLayout } from "@/components/layout";
import { Card, SectionHeading } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<{ users?: number; resumes?: number; roadmaps?: number }>({});

  useEffect(() => {
    if (!user?.isAdmin) {
      router.push("/dashboard");
      return;
    }
    fetch("/api/profile", { method: "DELETE" })
      .then((r) => r.json())
      .then((d) => setStats(d.stats || {}))
      .catch(() => {});
  }, [user, router]);

  if (!user?.isAdmin) return null;

  const cards = [
    { label: "Total Users", value: stats.users || 0, icon: Users },
    { label: "Resumes Uploaded", value: stats.resumes || 0, icon: FileText },
    { label: "Roadmaps Generated", value: stats.roadmaps || 0, icon: Map },
  ];

  return (
    <DashboardLayout>
      <SectionHeading eyebrow="Admin" title="Admin Dashboard" subtitle="Platform statistics and management." />

      <div className="grid md:grid-cols-3 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.label}>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-400">{c.label}</div>
                  <div className="text-2xl font-bold gradient-text">{c.value}</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
