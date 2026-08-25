"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, Shield } from "lucide-react";
import { Button, Input, Label, Card } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminSecret, setAdminSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          ...(showAdmin && adminSecret ? { adminSecret } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      await refresh();
      router.push(data.user?.isAdmin ? "/admin" : "/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md glow-border">
        <div className="text-center mb-6">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 flex items-center justify-center mx-auto mb-3 glow-violet">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold gradient-text-2">Get Started</h1>
          <p className="text-sm text-slate-400 mt-1">Create your account and begin</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Full Name</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              required
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          <div>
            <Label>Confirm Password</Label>
            <Input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {/* Admin secret toggle */}
          <div className="pt-2 border-t border-slate-800/60">
            <button
              type="button"
              onClick={() => setShowAdmin((s) => !s)}
              className="flex items-center gap-2 text-xs text-slate-400 hover:text-amber-300 transition"
            >
              <Shield className="h-3.5 w-3.5" />
              {showAdmin ? "Hide admin options" : "Register as admin"}
            </button>
            {showAdmin && (
              <div className="mt-3">
                <Label>Admin Secret</Label>
                <Input
                  type="password"
                  value={adminSecret}
                  onChange={(e) => setAdminSecret(e.target.value)}
                  placeholder="Server ADMIN_SECRET value"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Must match the ADMIN_SECRET environment variable on the server.
                </p>
              </div>
            )}
          </div>

          {error && <div className="text-sm text-red-400">{error}</div>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {showAdmin && adminSecret ? "Create Admin Account" : "Create Account"}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-cyan-400 hover:text-cyan-300">
            Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
}
