"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sparkles,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  FileText,
  Target,
  GitBranch,
  Map,
  BookOpen,
  FolderKanban,
  LineChart,
  Users,
  Bot,
  User as UserIcon,
  Settings,
  Shield,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/resume", label: "Resume", icon: FileText },
  { href: "/role", label: "Target Role", icon: Target },
  { href: "/skills", label: "Skill Gaps", icon: GitBranch },
  { href: "/roadmap", label: "Roadmap", icon: Map },
  { href: "/resources", label: "Resources", icon: BookOpen },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/progress", label: "Progress", icon: LineChart },
  { href: "/community", label: "Community", icon: Users },
  { href: "/assistant", label: "AI Assistant", icon: Bot },
  { href: "/profile", label: "Profile", icon: UserIcon },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 glass-strong border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 flex items-center justify-center glow-violet">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="leading-tight">
            <div className="font-bold tracking-tight">AI Career Navigator</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-400/70">
              Powered by AI
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
          {user ? (
            <>
              <Link href="/dashboard" className="hover:text-white transition">
                Dashboard
              </Link>
              <Link href="/roadmap" className="hover:text-white transition">
                Roadmap
              </Link>
              <Link href="/assistant" className="hover:text-white transition">
                AI Assistant
              </Link>
              <span className="text-slate-500">·</span>
              <span className="text-slate-300">{user.name.split(" ")[0]}</span>
              {user.isAdmin && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200"
                >
                  <Shield className="h-3.5 w-3.5" /> Admin
                </Link>
              )}
              <Button variant="ghost" onClick={logout}>
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/#how" className="hover:text-white transition">
                How It Works
              </Link>
              <Link href="/#features" className="hover:text-white transition">
                Features
              </Link>
              <Link href="/#careers" className="hover:text-white transition">
                Career Paths
              </Link>
              <Link href="/#about" className="hover:text-white transition">
                About
              </Link>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </nav>

        <button
          className="md:hidden p-2 rounded-lg border border-slate-700/60"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-800/60 glass-strong">
          <div className="px-4 py-4 flex flex-col gap-2">
            {user ? (
              <>
                {NAV_ITEMS.slice(0, 8).map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-violet-500/10"
                    >
                      <Icon className="h-4 w-4 text-cyan-400" />
                      {item.label}
                    </Link>
                  );
                })}
                <button
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-300 mt-2"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full">Login</Button>
                </Link>
                <Link href="/register" onClick={() => setOpen(false)}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user && typeof window !== "undefined") {
      // redirect handled by individual pages; noop here
    }
  }, [user]);

  return (
    <div className="min-h-screen grid-bg flex">
      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-white/5 glass-strong sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-cyan-400/70 mb-3">
            Command Center
          </div>
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition",
                    active
                      ? "bg-gradient-to-r from-violet-500/20 to-cyan-500/10 text-white border border-violet-500/30"
                      : "text-slate-400 hover:text-white hover:bg-white/5",
                  )}
                >
                  <Icon className={cn("h-4 w-4", active ? "text-cyan-400" : "text-slate-500")} />
                  {item.label}
                </Link>
              );
            })}
            {user?.isAdmin && (
              <Link
                href="/admin"
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition",
                  pathname === "/admin"
                    ? "bg-amber-500/15 text-amber-200 border border-amber-500/30"
                    : "text-slate-400 hover:text-amber-200 hover:bg-amber-500/10",
                )}
              >
                <Shield className="h-4 w-4" /> Admin
              </Link>
            )}
          </nav>
        </div>
        <div className="mt-auto p-4 border-t border-white/5">
          <div className="glass rounded-xl p-3">
            <div className="text-xs text-slate-400">Signed in as</div>
            <div className="text-sm font-medium truncate">{user?.name}</div>
            <button
              onClick={logout}
              className="mt-2 text-xs text-red-300 hover:text-red-200 flex items-center gap-1"
            >
              <LogOut className="h-3 w-3" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-strong border-t border-white/5">
        <div className="grid grid-cols-5 gap-1 px-2 py-2">
          {NAV_ITEMS.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-1.5 rounded-lg text-[10px]",
                  active ? "text-cyan-300" : "text-slate-500",
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="truncate w-full text-center">{item.label.split(" ")[0]}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile sidebar toggle */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/60"
          onClick={() => setSidebarOpen(false)}
        >
          <aside className="w-72 h-full glass-strong p-4 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs uppercase tracking-[0.2em] text-cyan-400">
                Menu
              </span>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-slate-300"
                  >
                    <Icon className="h-4 w-4 text-cyan-400" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      <main className="flex-1 min-w-0 pb-24 lg:pb-0">
        {/* Mobile menu button */}
        <div className="lg:hidden p-3 flex justify-between items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg border border-slate-700/60"
          >
            <Menu className="h-4 w-4" />
          </button>
          <button
            onClick={() => router.push("/assistant")}
            className="p-2 rounded-lg border border-violet-500/40 glow-violet"
            aria-label="Open AI Assistant"
          >
            <Bot className="h-4 w-4 text-violet-300" />
          </button>
        </div>
        <div className="p-4 md:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
