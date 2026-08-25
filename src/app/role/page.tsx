"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Target, ArrowRight, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout";
import { Card, Button, Badge, SectionHeading } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { SEED_CAREER_ROLES } from "@/lib/seed";

export default function RolePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.targetRole) setSelected(user.targetRole);
  }, [user]);

  async function handleSelect(slug: string) {
    setSelected(slug);
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole: slug }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Analysis failed");
        return;
      }
      router.push("/skills");
    } catch {
      alert("Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <SectionHeading
        eyebrow="Target Role"
        title="What role are you targeting?"
        subtitle="Choose from popular paths or define your own custom career."
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {SEED_CAREER_ROLES.map((role, i) => (
          <motion.div
            key={role.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Card
              className={`cursor-pointer hover:glow-border transition ${
                selected === role.slug ? "glow-border" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <Target className="h-6 w-6 text-cyan-400" />
                <Badge color="violet">{role.difficulty}</Badge>
              </div>
              <h3 className="font-semibold text-lg mb-2">{role.name}</h3>
              <p className="text-sm text-slate-400 mb-4">{role.description}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {role.requiredSkills.slice(0, 4).map((s) => (
                  <span key={s} className="chip text-[10px]">
                    {s}
                  </span>
                ))}
              </div>
              <Button
                onClick={() => handleSelect(role.slug)}
                disabled={loading}
                variant="ghost"
                className="w-full"
              >
                {loading && selected === role.slug ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Select <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <h3 className="font-semibold mb-3">Custom Role</h3>
        <p className="text-sm text-slate-400 mb-4">
          Don't see your target role? Enter a custom career path.
        </p>
        <div className="flex gap-3">
          <input
            type="text"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="e.g., Generative AI Engineer"
            className="flex-1 rounded-xl bg-slate-900/60 border border-slate-700/60 px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/70"
          />
          <Button disabled={!custom.trim() || loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Use Custom"}
          </Button>
        </div>
      </Card>
    </DashboardLayout>
  );
}
