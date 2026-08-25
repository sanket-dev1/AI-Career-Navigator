// Resume text extraction for PDF and DOCX files.
// Lazy-load heavy parsers only when actually needed to avoid server build issues.
async function loadPdfParse(): Promise<(buf: Buffer) => Promise<{ text: string }>> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mod = require("pdf-parse");
  return (mod.default || mod) as (buf: Buffer) => Promise<{ text: string }>;
}

async function loadMammoth(): Promise<{ extractRawText: (opts: { buffer: Buffer }) => Promise<{ value: string }> }> {
  const mod = await import("mammoth");
  return mod.default || mod;
}

export async function extractText(
  buffer: Buffer,
  fileName: string,
): Promise<string> {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".pdf")) {
    const pdfParse = await loadPdfParse();
    const data = await pdfParse(buffer);
    return (data.text || "").trim();
  }
  if (lower.endsWith(".docx")) {
    const mammoth = await loadMammoth();
    const result = await mammoth.extractRawText({ buffer });
    return (result.value || "").trim();
  }
  throw new Error("Unsupported file type. Please upload PDF or DOCX.");
}

// Lightweight rule-based skill extraction from resume text.
const KNOWN_SKILLS = [
  "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Express",
  "Python", "Django", "Flask", "FastAPI", "Java", "Spring", "Kotlin",
  "Go", "Rust", "C++", "C#", ".NET",
  "HTML", "CSS", "Tailwind CSS", "SASS",
  "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "DynamoDB",
  "Docker", "Kubernetes", "AWS", "GCP", "Azure", "Terraform",
  "CI/CD", "GitHub Actions", "Jenkins",
  "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Scikit-Learn",
  "Pandas", "NumPy", "Statistics", "NLP", "Computer Vision",
  "GraphQL", "REST APIs", "WebSockets",
  "Git", "Linux", "Bash", "Nginx",
  "React Native", "Flutter", "Swift",
  "Figma", "UI/UX", "Accessibility",
  "Testing", "Jest", "Cypress", "Playwright",
];

export function extractSkillsFromText(text: string): string[] {
  const found = new Set<string>();
  const lower = text.toLowerCase();
  for (const skill of KNOWN_SKILLS) {
    const re = new RegExp(`\\b${skill.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    if (re.test(lower)) found.add(skill);
  }
  return Array.from(found);
}

export function extractSections(text: string): {
  contact: Record<string, string>;
  education: string[];
  experience: string[];
  projects: string[];
  certifications: string[];
} {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phoneMatch = text.match(/\+?\d[\d\s().-]{7,}\d/);
  const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
  const githubMatch = text.match(/github\.com\/[\w-]+/i);

  const contact: Record<string, string> = {};
  if (emailMatch) contact.email = emailMatch[0];
  if (phoneMatch) contact.phone = phoneMatch[0];
  if (linkedinMatch) contact.linkedin = linkedinMatch[0];
  if (githubMatch) contact.github = githubMatch[0];

  // Simple heuristic section splitter
  const sectionHeaders = /(education|experience|work|projects|certifications|skills|summary|objective)/i;
  const buckets: Record<string, string[]> = {
    education: [], experience: [], projects: [], certifications: [],
  };
  let current = "summary";
  const accum: Record<string, string[]> = { summary: [] };
  for (const line of lines) {
    if (sectionHeaders.test(line) && line.length < 60) {
      current = line.toLowerCase().replace(/[^a-z]+/g, "");
      if (!accum[current]) accum[current] = [];
    } else {
      if (!accum[current]) accum[current] = [];
      accum[current].push(line);
    }
  }
  if (accum.education) buckets.education = accum.education.slice(0, 10);
  if (accum.experience || accum.work)
    buckets.experience = (accum.experience || accum.work || []).slice(0, 20);
  if (accum.projects) buckets.projects = accum.projects.slice(0, 10);
  if (accum.certifications) buckets.certifications = accum.certifications.slice(0, 10);

  return {
    contact,
    education: buckets.education,
    experience: buckets.experience,
    projects: buckets.projects,
    certifications: buckets.certifications,
  };
}
