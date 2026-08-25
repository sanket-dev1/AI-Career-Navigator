import { mongoose, connectDb } from "./index";
import type { Document, Model, Types } from "mongoose";

// Connect lazily but ensure models are registered
connectDb().catch(() => {
  // ignore initial connection failure at module load; will retry on first query
});

const { Schema, model, models } = mongoose;

// ---------- User ----------
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  targetRole?: string | null;
  learningHoursPerWeek?: number | null;
  learningStyle?: string | null;
  theme?: string | null;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    targetRole: { type: String, default: null },
    learningHoursPerWeek: { type: Number, default: 10 },
    learningStyle: { type: String, default: "visual" },
    theme: { type: String, default: "dark" },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const User: Model<IUser> = (models.User as Model<IUser>) || model<IUser>("User", UserSchema);

// ---------- Resume ----------
export interface IResume extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  fileName: string;
  fileSize: number;
  extractedText?: string | null;
  contactInfo?: Record<string, unknown> | null;
  education?: unknown[] | null;
  experience?: unknown[] | null;
  skills?: string[] | null;
  projects?: unknown[] | null;
  certifications?: unknown[] | null;
  analysis?: Record<string, unknown> | null;
  resumeScore?: number | null;
  createdAt: Date;
}

const ResumeSchema = new Schema<IResume>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    fileName: { type: String, required: true },
    fileSize: { type: Number, required: true },
    extractedText: { type: String, default: null },
    contactInfo: { type: Schema.Types.Mixed, default: null },
    education: { type: [Schema.Types.Mixed], default: null },
    experience: { type: [Schema.Types.Mixed], default: null },
    skills: { type: [String], default: null },
    projects: { type: [Schema.Types.Mixed], default: null },
    certifications: { type: [Schema.Types.Mixed], default: null },
    analysis: { type: Schema.Types.Mixed, default: null },
    resumeScore: { type: Number, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const Resume: Model<IResume> =
  (models.Resume as Model<IResume>) || model<IResume>("Resume", ResumeSchema);

// ---------- CareerRole ----------
export interface ICareerRole extends Document {
  _id: Types.ObjectId;
  slug: string;
  name: string;
  description?: string | null;
  requiredSkills: string[];
  recommendedSkills?: string[] | null;
  difficulty: string;
  prepWeeks: number;
  icon?: string | null;
}

const CareerRoleSchema = new Schema<ICareerRole>(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: null },
    requiredSkills: { type: [String], default: [] },
    recommendedSkills: { type: [String], default: [] },
    difficulty: { type: String, required: true },
    prepWeeks: { type: Number, required: true },
    icon: { type: String, default: null },
  },
  { timestamps: false },
);

export const CareerRole: Model<ICareerRole> =
  (models.CareerRole as Model<ICareerRole>) || model<ICareerRole>("CareerRole", CareerRoleSchema);

// ---------- Roadmap ----------
export interface IRoadmap extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  targetRole: string;
  totalWeeks: number;
  readinessScore?: number | null;
  skillMatch?: number | null;
  progress?: number | null;
  data?: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

const RoadmapSchema = new Schema<IRoadmap>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    targetRole: { type: String, required: true },
    totalWeeks: { type: Number, required: true },
    readinessScore: { type: Number, default: 0 },
    skillMatch: { type: Number, default: 0 },
    progress: { type: Number, default: 0 },
    data: { type: Schema.Types.Mixed, default: null },
  },
  { timestamps: true },
);

export const Roadmap: Model<IRoadmap> =
  (models.Roadmap as Model<IRoadmap>) || model<IRoadmap>("Roadmap", RoadmapSchema);

// ---------- SkillGap ----------
export interface ISkillGap extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  targetRole: string;
  strong?: { name: string; level: number }[] | null;
  developing?: { name: string; level: number }[] | null;
  missing?: { name: string; priority: string; reason?: string }[] | null;
  matchScore?: number | null;
  createdAt: Date;
}

const SkillGapSchema = new Schema<ISkillGap>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    targetRole: { type: String, required: true },
    strong: { type: [Schema.Types.Mixed], default: [] },
    developing: { type: [Schema.Types.Mixed], default: [] },
    missing: { type: [Schema.Types.Mixed], default: [] },
    matchScore: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const SkillGap: Model<ISkillGap> =
  (models.SkillGap as Model<ISkillGap>) || model<ISkillGap>("SkillGap", SkillGapSchema);

// ---------- Resource ----------
export interface IResource extends Document {
  _id: Types.ObjectId;
  title: string;
  skill: string;
  platform: string;
  url: string;
  type: string;
  difficulty: string;
  isFree: boolean;
  durationHours?: number | null;
  description?: string | null;
}

const ResourceSchema = new Schema<IResource>(
  {
    title: { type: String, required: true },
    skill: { type: String, required: true },
    platform: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, required: true },
    difficulty: { type: String, required: true },
    isFree: { type: Boolean, default: true },
    durationHours: { type: Number, default: null },
    description: { type: String, default: null },
  },
  { timestamps: false },
);

export const Resource: Model<IResource> =
  (models.Resource as Model<IResource>) || model<IResource>("Resource", ResourceSchema);

// ---------- Project ----------
export interface IProject extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  skills: string[];
  difficulty: string;
  technologies?: string[] | null;
  features?: string[] | null;
  outcomes?: string[] | null;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    skills: { type: [String], default: [] },
    difficulty: { type: String, required: true },
    technologies: { type: [String], default: [] },
    features: { type: [String], default: [] },
    outcomes: { type: [String], default: [] },
  },
  { timestamps: false },
);

export const Project: Model<IProject> =
  (models.Project as Model<IProject>) || model<IProject>("Project", ProjectSchema);

// ---------- UserProgress ----------
export interface IUserProgress extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  completedSkills: string[];
  completedResources: string[];
  completedProjects: string[];
  weeklyHours: number[];
  roadmapProgress: number;
  updatedAt: Date;
}

const UserProgressSchema = new Schema<IUserProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    completedSkills: { type: [String], default: [] },
    completedResources: { type: [String], default: [] },
    completedProjects: { type: [String], default: [] },
    weeklyHours: { type: [Number], default: [4, 6, 5, 8, 7, 9, 6] },
    roadmapProgress: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: false, updatedAt: true } },
);

export const UserProgress: Model<IUserProgress> =
  (models.UserProgress as Model<IUserProgress>) ||
  model<IUserProgress>("UserProgress", UserProgressSchema);

// ---------- ChatMessage ----------
export interface IChatMessage extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    role: { type: String, required: true, enum: ["user", "assistant"] },
    content: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const ChatMessage: Model<IChatMessage> =
  (models.ChatMessage as Model<IChatMessage>) ||
  model<IChatMessage>("ChatMessage", ChatMessageSchema);
