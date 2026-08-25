"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout";
import { Card, Button, Input, Label, SectionHeading } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user, refresh } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setTargetRole(user.targetRole || "");
    }
  }, [user]);

  async function handleSave() {
    setLoading(true);
    try {
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, targetRole }),
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
      <SectionHeading eyebrow="Profile" title="Your Profile" subtitle="View and edit your account information." />

      <Card className="max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 flex items-center justify-center glow-violet">
            <User className="h-8 w-8 text-white" />
          </div>
          <div>
            <div className="text-xl font-bold">{user.name}</div>
            <div className="text-sm text-slate-400">{user.email}</div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Full Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={user.email} disabled />
          </div>
          <div>
            <Label>Target Role</Label>
            <Input value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="e.g., ai-ml-engineer" />
          </div>
          <Button onClick={handleSave} disabled={loading} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? "Saved!" : "Save Changes"}
          </Button>
        </div>
      </Card>
    </DashboardLayout>
  );
}
