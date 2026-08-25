import { type ReactNode, type ButtonHTMLAttributes, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Button({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" | "success" }) {
  const variants = {
    primary: "btn-primary",
    ghost: "btn-ghost",
    danger: "bg-red-500/20 border border-red-500/40 text-red-200 hover:bg-red-500/30",
    success: "bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 hover:bg-emerald-500/30",
  };
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Card({
  children,
  className,
  glow,
}: {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={cn(
        "glass rounded-2xl p-5",
        glow && "glow-border",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-xl bg-slate-900/60 border border-slate-700/60 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/20 transition",
        className,
      )}
    />
  );
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-xl bg-slate-900/60 border border-slate-700/60 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/20 transition",
        className,
      )}
    />
  );
}

export function Label({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block text-xs uppercase tracking-wider text-slate-400 mb-1.5", className)}>
      {children}
    </label>
  );
}

export function Badge({
  children,
  color = "violet",
  className,
}: {
  children: ReactNode;
  color?: "violet" | "cyan" | "green" | "amber" | "red" | "blue";
  className?: string;
}) {
  const colors = {
    violet: "bg-violet-500/15 border-violet-500/40 text-violet-200",
    cyan: "bg-cyan-500/15 border-cyan-500/40 text-cyan-200",
    green: "bg-emerald-500/15 border-emerald-500/40 text-emerald-200",
    amber: "bg-amber-500/15 border-amber-500/40 text-amber-200",
    red: "bg-red-500/15 border-red-500/40 text-red-200",
    blue: "bg-blue-500/15 border-blue-500/40 text-blue-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        colors[color],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Progress({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("bar-track", className)}>
      <div className="bar-fill" style={{ width: `${clamped}%` }} />
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "inline-block h-4 w-4 animate-spin rounded-full border-2 border-violet-400/30 border-t-violet-400",
        className,
      )}
    />
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <div className="text-xs uppercase tracking-[0.2em] text-cyan-400/80 mb-2">
          {eyebrow}
        </div>
      )}
      <h2 className="text-3xl md:text-4xl font-bold gradient-text-2">{title}</h2>
      {subtitle && <p className="mt-2 text-slate-400 max-w-2xl">{subtitle}</p>}
    </div>
  );
}
