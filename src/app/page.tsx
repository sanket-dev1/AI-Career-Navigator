"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Upload,
  Target,
  Brain,
  Map,
  TrendingUp,
  Layers,
  Layout,
  Server,
  BrainCircuit,
  BarChart3,
  Rocket,
  Shield,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Download,
  Mail,
  Globe,
} from "lucide-react";
import { Navbar } from "@/components/layout";
import { Button, Card, Badge } from "@/components/ui";
import { SEED_CAREER_ROLES } from "@/lib/seed";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

function Hero() {
  const stats = [
    { label: "Skill Match", value: "82%", color: "from-cyan-400 to-blue-500" },
    { label: "Missing Skills", value: "6", color: "from-amber-400 to-orange-500" },
    { label: "Job Readiness", value: "78%", color: "from-emerald-400 to-green-500" },
    { label: "Roadmap", value: "8 Weeks", color: "from-violet-400 to-pink-500" },
  ];

  return (
    <section className="relative pt-12 md:pt-20 pb-16 md:pb-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center">
        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <div className="chip mb-4">
            <Sparkles className="h-3 w-3" /> New · AI-Powered Career OS
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
            Navigate Your Career{" "}
            <span className="gradient-text">With AI.</span>
          </h1>
          <p className="mt-5 text-lg md:text-xl text-slate-400 max-w-xl">
            Upload your resume, discover your skill gaps, and get a personalized
            roadmap to become job-ready.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/register">
              <Button className="text-base">
                Analyze My Resume <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#careers">
              <Button variant="ghost" className="text-base">
                Explore Career Paths
              </Button>
            </Link>
          </div>
          <div className="mt-10 flex items-center gap-6 text-sm text-slate-500">
            <div className="flex -space-x-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full border-2 border-[#05060f] bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500"
                  style={{
                    filter: `hue-rotate(${i * 40}deg)`,
                  }}
                />
              ))}
            </div>
            <span>
              Trusted by <span className="text-white font-semibold">1,240+</span>{" "}
              learners on the AI/ML path
            </span>
          </div>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative"
        >
          <div className="absolute -inset-6 bg-gradient-to-tr from-cyan-500/20 via-violet-500/20 to-pink-500/20 blur-3xl rounded-full" />
          <div className="relative glass glow-border rounded-3xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-cyan-400">
                  Live Analysis
                </div>
                <div className="text-lg font-semibold mt-1">Resume → AI → Roadmap</div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-300">Processing</span>
              </div>
            </div>

            {/* Flow visualization */}
            <div className="grid grid-cols-5 gap-1 mb-6">
              {["Resume", "Analyze", "Gaps", "Roadmap", "Ready"].map((label, i) => (
                <motion.div
                  key={label}
                  variants={fadeUp}
                  className="text-center"
                >
                  <div className="h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/30 flex items-center justify-center text-[11px] font-medium">
                    {label}
                  </div>
                  {i < 4 && (
                    <div className="mt-1 text-[10px] text-slate-500">step {i + 1}</div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Floating stat cards */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  variants={fadeUp}
                  className="relative rounded-xl border border-slate-700/60 bg-slate-900/50 p-3 overflow-hidden"
                  style={{
                    animationDelay: `${i * 150}ms`,
                  }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-5`}
                  />
                  <div className="relative">
                    <div className="text-[10px] uppercase tracking-wider text-slate-400">
                      {s.label}
                    </div>
                    <div className="text-2xl font-bold mt-1 gradient-text">
                      {s.value}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: Upload, title: "Upload Resume", text: "Drop your PDF or DOCX resume. We extract the content securely." },
    { icon: Target, title: "Choose Target Career", text: "Pick from 8 in-demand roles or define your own custom path." },
    { icon: Brain, title: "AI Analyzes Skills", text: "Our AI compares your skills against role requirements." },
    { icon: Map, title: "Personalized Roadmap", text: "Get a week-by-week learning plan with projects and resources." },
    { icon: TrendingUp, title: "Track Your Progress", text: "Watch your readiness score climb as you complete goals." },
  ];
  return (
    <section id="how" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="chip mx-auto mb-4">
            <Zap className="h-3 w-3" /> How It Works
          </div>
          <h2 className="text-3xl md:text-5xl font-bold gradient-text-2">
            From resume to job-ready in 5 steps
          </h2>
          <p className="mt-3 text-slate-400 max-w-2xl mx-auto">
            A clear, guided journey powered by AI that adapts to your background
            and goals.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-5 relative group hover:glow-border transition"
              >
                <div className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center text-sm font-bold glow-cyan">
                  {i + 1}
                </div>
                <Icon className="h-6 w-6 text-cyan-400 mb-3" />
                <h3 className="font-semibold mb-1.5">{step.title}</h3>
                <p className="text-sm text-slate-400">{step.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: BrainCircuit,
      title: "AI Skill Gap Analysis",
      text: "See exactly which skills match, which need work, and which are missing.",
    },
    {
      icon: Map,
      title: "Personalized Roadmaps",
      text: "Week-by-week learning plans with topics, projects, and resources.",
    },
    {
      icon: FolderKanban,
      title: "Mini Projects",
      text: "Hands-on projects that close your specific skill gaps.",
    },
    {
      icon: BarChart3,
      title: "Job Readiness Score",
      text: "A composite score across skills, projects, resume, and experience.",
    },
    {
      icon: Bot,
      title: "AI Career Assistant",
      text: "Ask anything. Answers use your profile, gaps, and roadmap.",
    },
    {
      icon: Download,
      title: "PDF Roadmap Export",
      text: "Download a professional PDF to share with mentors or employers.",
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="chip mx-auto mb-4">
            <Sparkles className="h-3 w-3" /> Features
          </div>
          <h2 className="text-3xl md:text-5xl font-bold gradient-text-2">
            Everything you need to land the role
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-6 hover:glow-border transition"
              >
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-violet-500/30 to-cyan-500/30 border border-violet-500/30 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-cyan-300" />
                </div>
                <h3 className="text-lg font-semibold mb-1.5">{f.title}</h3>
                <p className="text-sm text-slate-400">{f.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// lucide imports used dynamically
import { FolderKanban } from "lucide-react";
import { Bot } from "lucide-react";

const ICONS: Record<string, typeof Layers> = {
  Layers,
  Layout,
  Server,
  Brain: BrainCircuit,
  BarChart3,
  Rocket,
  Shield,
  Cloud,
};

function CareerPaths() {
  return (
    <section id="careers" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="chip mx-auto mb-4">
            <Target className="h-3 w-3" /> Career Paths
          </div>
          <h2 className="text-3xl md:text-5xl font-bold gradient-text-2">
            Pick your destination
          </h2>
          <p className="mt-3 text-slate-400 max-w-2xl mx-auto">
            Choose from in-demand roles or define a custom path — the AI adapts
            to any career.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SEED_CAREER_ROLES.map((role, i) => {
            const Icon = ICONS[role.icon] || Layers;
            const diffColor: Record<string, "green" | "amber" | "red" | "violet"> = {
              Beginner: "green",
              Intermediate: "amber",
              Advanced: "red",
            };
            return (
              <motion.div
                key={role.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="h-full flex flex-col">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-400/20 to-violet-500/20 border border-violet-500/30 flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-cyan-300" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{role.name}</h3>
                  <p className="text-sm text-slate-400 mb-4 flex-1">
                    {role.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {role.requiredSkills.slice(0, 3).map((s) => (
                      <span key={s} className="chip">
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                    <Badge color={diffColor[role.difficulty] || "violet"}>
                      {role.difficulty}
                    </Badge>
                    <span>{role.prepWeeks} weeks</span>
                  </div>
                  <Link href="/register">
                    <Button variant="ghost" className="w-full">
                      Explore Career <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="chip mx-auto mb-4">
            <Sparkles className="h-3 w-3" /> About
          </div>
          <h2 className="text-3xl md:text-5xl font-bold gradient-text-2 mb-6">
            Your career operating system
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
            AI Career Navigator combines resume analysis, skill-gap intelligence,
            and personalized learning into one platform. Built as a modern
            fullstack product — suitable as a college major project, hackathon
            demo, or startup MVP.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "AI & NLP",
              "Resume Parsing",
              "Recommender Systems",
              "Fullstack",
              "Data Viz",
              "Personalized Learning",
            ].map((tag) => (
              <span key={tag} className="chip">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-strong glow-border rounded-3xl p-10 md:p-14 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-violet-500/10" />
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text-2">
              From where you are
              <br />
              to where you want to be.
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-8">
              Powered by AI. Built for builders, learners, and career changers.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/register">
                <Button className="text-base">
                  Get Started Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost" className="text-base">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 py-10 mt-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold">AI Career Navigator</span>
          </div>
          <p className="text-xs text-slate-500 max-w-sm">
            Navigate your career with AI. From where you are to where you want to
            be.
          </p>
        </div>
        <div className="flex gap-4 text-slate-400">
          <a href="#" className="hover:text-white transition">
            <Mail className="h-4 w-4" />
          </a>
          <a href="#" className="hover:text-white transition">
            <Globe className="h-4 w-4" />
          </a>
          <a href="#" className="hover:text-white transition">
            <Sparkles className="h-4 w-4" />
          </a>
        </div>
        <div className="text-xs text-slate-500">
          © {new Date().getFullYear()} AI Career Navigator. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default function Landing() {
  return (
    <>
      <Navbar />
      <main className="relative">
        <Hero />
        <HowItWorks />
        <Features />
        <CareerPaths />
        <About />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
