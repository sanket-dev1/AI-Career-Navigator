"use client";
import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout";
import { Card, Button, Input, Label, SectionHeading } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";

export default function SettingsPage() {
  const { user, refresh } = useAuth();
  const [hours, setHours] = useState(10);
  const [style, setStyle] = useState("visual");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setHours(user.learningHoursPerWeek || 10);
      setStyle(user.learningStyle || "visual");
    }
  }, [user]);

  async function handleSave() {
    setLoading(true);
    try {
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ learningHoursPerWeek: hours, learningStyle: style }),
      });
      await refresh();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // noop
    } finally {
      setLoading(false);
    }
  }

  if (!user) return <DashboardLayout><div className="skeleton h-96" /></DashboardLayout>;

  return (
    <DashboardLayout>
      <SectionHeading eyebrow="Settings" title="Preferences" subtitle="Customize your learning experience." />

      <Card className="max-w-2xl">
        <div className="space-y-4">
          <div>
            <Label>Learning Hours Per Week</Label>
            <Input type="number" value={hours} onChange={(e) => setHours(Number(e.target.value))} min={1} max={40} />
          </div>
          <div>
            <Label>Preferred Learning Style</Label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full rounded-xl bg-slate-900/60 border border-slate-700/60 px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/70"
            >
              <option value="visual">Visual</option>
              <option value="hands-on">Hands-on</option>
              <option value="reading">Reading</option>
              <option value="video">Video</option>
            </select>
          </div>
          <Button onClick={handleSave} disabled={loading} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? "Saved!" : "Save Preferences"}
          </Button>
        </div>
      </Card>
    </DashboardLayout>
  );
}
