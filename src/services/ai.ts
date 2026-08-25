// Modular AI service. Defaults to a deterministic mock that still produces
// personalized, structured JSON. If AI_API_KEY + AI_BASE_URL + AI_MODEL are
// provided, it can forward to a real LLM with a JSON schema.
import { extractSkillsFromText } from "./resume";

export interface ResumeContext {
  text: string;
  targetRole: string;
  requiredSkills: string[];
  recommendedSkills?: string[];
  learningHoursPerWeek?: number;
}

export interface SkillAnalysis {
  userSkills: { name: string; level: number }[];
  strong: { name: string; level: number }[];
  developing: { name: string; level: number }[];
  missing: { name: string; priority: "high" | "medium" | "low"; reason: string }[];
  matchScore: number;
  resumeScore: number;
  readinessScore: number;
  strengths: string[];
  improvements: string[];
}

export interface RoadmapWeek {
  week: number;
  title: string;
  topics: string[];
  project: { title: string; description: string };
  resources: { title: string; url: string; platform: string }[];
  hours: number;
}

// Deterministic hash for stable-ish per-user results
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export async function analyzeResume(
  ctx: ResumeContext,
): Promise<SkillAnalysis> {
  // Attempt real LLM if configured
  if (process.env.AI_API_KEY && process.env.AI_BASE_URL) {
    try {
      return await callRealLLM(ctx);
    } catch {
      // fall through to mock
    }
  }
  return mockAnalyze(ctx);
}

function mockAnalyze(ctx: ResumeContext): SkillAnalysis {
  const userSkillsRaw = extractSkillsFromText(ctx.text);
  const textLen = ctx.text.length;
  const h = hashStr(ctx.text + ctx.targetRole);
  const jitter = (n: number, spread: number) =>
    Math.max(0, Math.min(100, n + ((h + n) % (spread * 2)) - spread));

  // Build user skill levels
  const userSkills = userSkillsRaw.map((name, i) => ({
    name,
    level: jitter(45 + (i % 5) * 9, 12),
  }));

  const required = ctx.requiredSkills;
  const recommended = ctx.recommendedSkills || [];

  const strong: { name: string; level: number }[] = [];
  const developing: { name: string; level: number }[] = [];
  const missing: { name: string; priority: "high" | "medium" | "low"; reason: string }[] = [];

  const allNeeded = [...required, ...recommended];
  const userMap = new Map(userSkills.map((s) => [s.name.toLowerCase(), s.level]));

  for (const skill of allNeeded) {
    const lvl = userMap.get(skill.toLowerCase());
    if (lvl && lvl >= 60) strong.push({ name: skill, level: lvl });
    else if (lvl && lvl > 0) developing.push({ name: skill, level: lvl });
    else {
      missing.push({
        name: skill,
        priority: required.includes(skill) ? "high" : "medium",
        reason: required.includes(skill)
          ? `Required for ${ctx.targetRole}`
          : `Recommended for ${ctx.targetRole}`,
      });
    }
  }

  const matchCoverage =
    required.length > 0
      ? strong.filter((s) => required.some((r) => r.toLowerCase() === s.name.toLowerCase())).length /
        required.length
      : 0;
  const partialCoverage =
    required.length > 0
      ? developing.filter((s) => required.some((r) => r.toLowerCase() === s.name.toLowerCase())).length /
        required.length
      : 0;
  const matchScore = Math.round((matchCoverage * 0.8 + partialCoverage * 0.35) * 100);

  // Resume scoring heuristics
  const hasEmail = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(ctx.text);
  const hasBullets = (ctx.text.match(/•|- /g) || []).length;
  const hasNumbers = (ctx.text.match(/\d+(\.\d+)?%/g) || []).length;
  const actionVerbs = (ctx.text.match(
    /\b(built|led|designed|shipped|improved|reduced|increased|implemented|automated)\b/gi,
  ) || []).length;
  let resumeScore = 50;
  if (hasEmail) resumeScore += 5;
  resumeScore += Math.min(15, hasBullets);
  resumeScore += Math.min(15, hasNumbers * 5);
  resumeScore += Math.min(15, actionVerbs * 2);
  if (textLen > 1500) resumeScore += 10;
  if (textLen > 3000) resumeScore += 5;
  resumeScore = Math.min(100, Math.max(30, resumeScore));

  // Readiness composite
  const readinessScore = Math.round(
    matchScore * 0.45 +
      resumeScore * 0.25 +
      (strong.length * 2 + developing.length) * 1.2 +
      10,
  );

  const strengths: string[] = [];
  if (strong.length >= 3) strengths.push(`${strong.length} strong matches for ${ctx.targetRole}`);
  if (userSkills.length >= 8) strengths.push(`Broad skill set (${userSkills.length} skills detected)`);
  if (hasNumbers > 0) strengths.push("Resume includes measurable results");
  if (actionVerbs >= 3) strengths.push("Experience uses strong action verbs");
  if (strengths.length === 0) strengths.push("Resume provides a foundation to build on");

  const improvements: string[] = [];
  if (missing.length > 0)
    improvements.push(`Close ${missing.length} skill gap${missing.length > 1 ? "s" : ""} for ${ctx.targetRole}`);
  if (hasNumbers === 0) improvements.push("Add measurable project outcomes (%, time saved, users served)");
  if (actionVerbs < 3) improvements.push("Use stronger action verbs (built, led, shipped, improved)");
  if (textLen < 1500) improvements.push("Add more detail to experience and projects");
  if (userSkills.length < 6) improvements.push("List more relevant technical skills");

  return {
    userSkills: userSkills.slice(0, 20),
    strong,
    developing,
    missing: missing.slice(0, 12),
    matchScore: Math.max(10, Math.min(95, matchScore)),
    resumeScore,
    readinessScore: Math.max(15, Math.min(95, readinessScore)),
    strengths,
    improvements,
  };
}

export function generateRoadmap(ctx: {
  analysis: SkillAnalysis;
  targetRole: string;
  learningHoursPerWeek: number;
}): RoadmapWeek[] {
  const { analysis, targetRole, learningHoursPerWeek } = ctx;
  const allGaps = [
    ...analysis.missing.map((m) => ({ name: m.name, priority: 1 })),
    ...analysis.developing.map((d) => ({ name: d.name, priority: 2 })),
  ];
  const totalWeeks = Math.min(12, Math.max(6, Math.ceil(allGaps.length * 1.3)));
  const weeks: RoadmapWeek[] = [];

  for (let w = 0; w < totalWeeks; w++) {
    const focus = allGaps[w % Math.max(1, allGaps.length)]?.name || "Practice";
    const topics = [
      `${focus} fundamentals`,
      `${focus} best practices`,
      `Applied ${focus} patterns`,
    ];
    weeks.push({
      week: w + 1,
      title: `Master ${focus}`,
      topics,
      project: {
        title: `${focus} Mini-Project`,
        description: `Build a small project that exercises ${focus} in the context of ${targetRole}.`,
      },
      resources: [
        {
          title: `Learn ${focus}`,
          url: `https://duckduckgo.com/?q=${encodeURIComponent(focus + " tutorial free")}`,
          platform: "Web",
        },
      ],
      hours: Math.max(4, learningHoursPerWeek),
    });
  }
  return weeks;
}

export function generateAssistantReply(input: {
  question: string;
  targetRole?: string | null;
  skills: string[];
  gaps: string[];
  readiness?: number | null;
}): string {
  const { question, targetRole, skills, gaps, readiness } = input;
  const q = question.toLowerCase();

  const lines: string[] = [];
  if (targetRole) {
    lines.push(`As someone targeting **${targetRole}**, here is what I'd focus on:`);
  }

  if (q.includes("docker") && gaps.some((g) => /docker/i.test(g))) {
    lines.push(
      "For Docker with limited daily time, try this 7-day plan: Day 1 — install + `docker run`; Day 2 — write a Dockerfile for a Node app; Day 3 — volumes + env; Day 4 — docker-compose; Day 5 — networking; Day 6 — multi-stage builds; Day 7 — ship to a registry.",
    );
  } else if (q.includes("time") || q.includes("hour") || q.includes("schedule")) {
    lines.push(
      "With limited hours, use a 3-block day: 30 min concept, 45 min build, 15 min reflect. Consistency beats long sessions.",
    );
  } else if (q.includes("project")) {
    lines.push(
      "Pick one project that hits 2-3 missing skills at once. For example, a full-stack app with auth + DB + deployment covers many gaps efficiently.",
    );
  } else if (q.includes("interview")) {
    lines.push(
      "Prepare a STAR story for each strong skill, review system design basics, and do 1 mock interview per week.",
    );
  } else {
    if (gaps.length > 0) {
      lines.push(`Your top gaps right now are: ${gaps.slice(0, 3).join(", ")}.`);
      lines.push(
        "I recommend tackling the highest-priority gap first with a focused 1-week sprint + a small project.",
      );
    }
  }

  if (typeof readiness === "number") {
    if (readiness < 50) lines.push("You're early — foundations first, then ship.");
    else if (readiness < 75)
      lines.push("You're mid-way — close the top 3 gaps to break into the next tier.");
    else lines.push("You're close — polish projects and practice interviews.");
  }

  if (skills.length > 0) {
    lines.push(`Leverage what you already know: ${skills.slice(0, 4).join(", ")}.`);
  }

  return lines.join("\n\n");
}

// Real LLM stub — uses OpenAI-compatible chat completions API if env set.
async function callRealLLM(ctx: ResumeContext): Promise<SkillAnalysis> {
  const baseUrl = process.env.AI_BASE_URL!;
  const key = process.env.AI_API_KEY!;
  const model = process.env.AI_MODEL || "gpt-4o-mini";

  const prompt = `You are an expert career coach. Analyze this resume for the role "${ctx.targetRole}".
Required skills: ${ctx.requiredSkills.join(", ")}.
Resume (truncated to 4000 chars):
${ctx.text.slice(0, 4000)}

Return STRICT JSON matching this schema:
{
  "userSkills": [{"name": string, "level": number 0-100}],
  "strong": [{"name": string, "level": number}],
  "developing": [{"name": string, "level": number}],
  "missing": [{"name": string, "priority": "high"|"medium"|"low", "reason": string}],
  "matchScore": number 0-100,
  "resumeScore": number 0-100,
  "readinessScore": number 0-100,
  "strengths": [string],
  "improvements": [string]
}`;

  const res = await fetch(`${baseUrl.replace(/\/$/, "")}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    }),
  });
  if (!res.ok) throw new Error("LLM request failed: " + res.status);
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty LLM response");
  const parsed = JSON.parse(content) as SkillAnalysis;
  return parsed;
}
