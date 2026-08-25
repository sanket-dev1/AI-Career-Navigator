export type CareerRole = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  requiredSkills: string[];
  recommendedSkills: string[] | null;
  difficulty: string;
  prepWeeks: number;
  icon: string | null;
};

export type ResumeAnalysisResult = {
  userSkills: { name: string; level: number }[];
  strong: { name: string; level: number }[];
  developing: { name: string; level: number }[];
  missing: { name: string; priority: "high" | "medium" | "low"; reason: string }[];
  matchScore: number;
  resumeScore: number;
  readinessScore: number;
  strengths: string[];
  improvements: string[];
};

export type RoadmapWeek = {
  week: number;
  title: string;
  topics: string[];
  project: { title: string; description: string };
  resources: { title: string; url: string; platform: string }[];
  hours: number;
};

export type Resource = {
  id: string;
  title: string;
  skill: string;
  platform: string;
  url: string;
  type: string;
  difficulty: string;
  isFree: boolean;
  durationHours: number | null;
  description: string | null;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  skills: string[];
  difficulty: string;
  technologies: string[] | null;
  features: string[] | null;
  outcomes: string[] | null;
};
