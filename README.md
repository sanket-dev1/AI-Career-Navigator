# AI Career Navigator

**From where you are to where you want to be — powered by AI.**

A next-generation AI career planning platform that analyzes your resume, identifies skill gaps, generates personalized learning roadmaps, and tracks your job readiness score.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-8-green)
![Mongoose](https://img.shields.io/badge/Mongoose-8-red)

## 🚀 Features

### Core Capabilities

- **AI Resume Analysis** — Upload PDF/DOCX resumes, extract skills, and get AI-powered insights
- **Skill Gap Analysis** — Compare your skills against target role requirements with radar charts and visualizations
- **Personalized Roadmaps** — Week-by-week learning plans with projects, resources, and time estimates
- **Job Readiness Score** — Composite score across skills, projects, resume quality, and experience
- **Learning Resources** — Curated free resources filtered by skill, difficulty, and type
- **Mini Projects** — Hands-on projects that close your specific skill gaps
- **AI Career Assistant** — Chat with an AI coach that knows your profile, gaps, and roadmap
- **Progress Tracking** — Visualize weekly hours, skill improvement, and roadmap completion
- **Community Dashboard** — Anonymous statistics from learners on similar paths
- **PDF Export** — Download professional PDF roadmaps to share with mentors

### User Experience

- **Futuristic UI** — Dark theme with glassmorphism, neon accents, and smooth animations
- **Responsive Design** — Desktop, tablet, and mobile with adaptive layouts
- **Real-time Updates** — Live progress tracking and skill analysis
- **Secure Authentication** — JWT-based auth with bcrypt password hashing
- **Admin Dashboard** — Platform statistics and user management
- **Portable Data** — MongoDB works locally, on Atlas, or falls back to in-memory for dev/CI

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Framer Motion** — Smooth animations
- **Recharts** — Data visualizations (radar, bar, line charts)
- **Lucide React** — Beautiful icons
- **React Dropzone** — Drag-and-drop file uploads
- **jsPDF** — Client-side PDF generation

### Backend
- **Next.js API Routes** (Route Handlers)
- **MongoDB** (local, Atlas, or in-memory fallback)
- **Mongoose 8** — Schema modeling and ODM
- **JWT** (jose) for authentication
- **bcryptjs** for password hashing
- **pdf-parse** — PDF text extraction
- **mammoth** — DOCX text extraction
- **Zod** — Schema validation
- **mongodb-memory-server** — Dev/CI fallback when MongoDB is unreachable

### AI Service
- **Modular AI Layer** — Supports OpenAI-compatible APIs via `.env`
- **Mock AI Service** — Deterministic, realistic fallback for local development
- **Structured JSON Responses** — Validated AI output
- **Context-Aware** — Uses resume, skills, target role, and progress

## 📦 Installation

### Prerequisites
- Node.js 20+
- MongoDB 7+ (local or Atlas) — optional, in-memory fallback works out-of-the-box
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd ai-career-navigator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env`:
   ```env
   # MongoDB (local or Atlas). If unreachable, falls back to in-memory MongoDB.
   MONGO_URI=mongodb://127.0.0.1:27017/ai_career_navigator
   # Or MongoDB Atlas:
   # MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/ai_career_navigator?retryWrites=true&w=majority

   JWT_SECRET=your-secure-random-string

   # Optional — real LLM (OpenAI-compatible). If unset, uses deterministic mock.
   AI_API_KEY=
   AI_BASE_URL=https://api.openai.com
   AI_MODEL=gpt-4o-mini
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   > No schema migrations needed — Mongoose creates collections and indexes on first use.

5. **Open** [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth pages (login, register)
│   ├── (dashboard)/         # Protected app pages
│   │   ├── dashboard/
│   │   ├── resume/
│   │   ├── role/
│   │   ├── skills/
│   │   ├── roadmap/
│   │   ├── resources/
│   │   ├── projects/
│   │   ├── progress/
│   │   ├── community/
│   │   ├── assistant/
│   │   ├── profile/
│   │   ├── settings/
│   │   └── admin/
│   ├── api/                 # API routes
│   │   ├── auth/           # Authentication
│   │   ├── resume/         # Resume upload & analysis
│   │   ├── analyze/        # AI skill gap analysis
│   │   ├── roadmap/        # Roadmap generation
│   │   ├── progress/       # Progress tracking
│   │   ├── assistant/      # AI chat assistant
│   │   ├── catalog/        # Resources & projects
│   │   └── profile/        # User profile & admin stats
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles
│
├── components/
│   ├── ui.tsx              # Reusable UI components
│   └── layout.tsx          # Navbar, sidebar, dashboard layout
│
├── context/
│   └── AuthContext.tsx      # Auth state management
│
├── db/
│   ├── index.ts            # Mongoose connection (with in-memory fallback)
│   └── models.ts           # All Mongoose schemas + models
│
├── lib/
│   ├── auth.ts             # JWT, bcrypt, session management
│   ├── utils.ts            # Helper functions
│   ├── types.ts            # TypeScript types
│   └── seed.ts             # Seed data (career roles, resources, projects)
│
└── services/
    ├── ai.ts               # AI service (mock + real LLM)
    ├── resume.ts           # PDF/DOCX parsing
    └── scoring.ts          # Readiness score calculation
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Sign in
- `POST /api/auth/logout` — Sign out
- `GET /api/auth/me` — Get current user

### Resume
- `POST /api/resume` — Upload resume (multipart/form-data)
- `GET /api/resume` — List user's resumes

### Analysis
- `POST /api/analyze` — Analyze resume against target role
- `GET /api/analyze` — Get latest analysis

### Roadmap
- `GET /api/roadmap` — Get user's roadmap

### Progress
- `GET /api/progress` — Get progress data
- `POST /api/progress` — Update progress

### Assistant
- `GET /api/assistant` — Get chat history
- `POST /api/assistant` — Send message to AI

### Catalog
- `GET /api/catalog` — Get career roles, resources, projects (auto-seeds on first call)

### Profile
- `GET /api/profile` — Get user profile
- `PUT /api/profile` — Update profile
- `DELETE /api/profile` — Admin: get platform stats

## 🗄️ Database (MongoDB)

The application uses **Mongoose** for schema modeling on top of MongoDB. Collections are created automatically on first use — no migrations needed.

### Models

| Collection       | Purpose                                          |
| ---------------- | ------------------------------------------------ |
| `users`          | Accounts and learning preferences                |
| `resumes`        | Uploaded resumes and extracted text/skills       |
| `careerroles`    | Target career paths and required skills          |
| `roadmaps`       | Generated week-by-week learning plans            |
| `skillgaps`      | Analysis results (strong/developing/missing)     |
| `resources`      | Learning resources (seeded on first catalog call)|
| `projects`       | Mini project recommendations (seeded)            |
| `userprogresses` | Completed skills, projects, hours, progress      |
| `chatmessages`   | AI assistant conversation history                |

### Connection Strategy

`src/db/index.ts` implements a smart connection strategy:

1. If `MONGO_URI` is set and reachable → use it
2. If `MONGO_URI` is unreachable → fall back to in-memory MongoDB
3. If `MONGO_URI` is unset → use in-memory MongoDB

This means the app runs **anywhere** without requiring a running MongoDB server, making it ideal for:
- Local development (no setup)
- CI/CD pipelines
- Sandbox environments
- Quick demos

For production, just set `MONGO_URI` to your **MongoDB Atlas** connection string.

## 🎨 Design System

### Colors
- **Background**: Deep black/navy (`#05060f`)
- **Primary**: Electric blue, violet, cyan gradients
- **Success**: Emerald green
- **Warning**: Amber/orange
- **Error**: Red

### Components
- **Glass cards** with backdrop blur
- **Glowing borders** on important elements
- **Gradient text** for headings
- **Animated progress bars**
- **Skeleton loaders**

### Typography
- **Font**: Inter (400, 500, 600, 700, 800)
- **Headings**: Gradient text with tracking
- **Body**: Slate-400 for secondary text

## 🤖 AI Service

The AI service is modular and supports two modes:

### Mock Mode (Default)
- Deterministic, realistic output
- No API key required
- Perfect for development and demos
- Uses rule-based skill extraction and scoring

### Real LLM Mode
- Set `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL` in `.env`
- Supports OpenAI-compatible APIs
- Structured JSON responses
- Falls back to mock on error

### Example AI Response
```json
{
  "userSkills": [
    { "name": "Python", "level": 85 },
    { "name": "SQL", "level": 75 }
  ],
  "strong": [...],
  "developing": [...],
  "missing": [
    {
      "name": "TensorFlow",
      "priority": "high",
      "reason": "Required for AI/ML Engineer"
    }
  ],
  "matchScore": 72,
  "readinessScore": 78,
  "strengths": ["Strong Python experience"],
  "improvements": ["Add cloud technologies"]
}
```

## 🔒 Security

- **Password hashing** with bcrypt (10 rounds)
- **JWT tokens** in httpOnly cookies
- **Protected routes** with session validation
- **Input validation** with Zod
- **File type validation** (PDF/DOCX only)
- **File size limits** (5MB max)
- **Rate limiting** ready (add middleware as needed)
- **CORS configuration** (via Next.js)
- **No API keys in client bundle**

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

Set environment variables in Vercel dashboard:
- `MONGO_URI` — Your MongoDB Atlas connection string
- `JWT_SECRET` — A secure random string
- `AI_API_KEY` — (optional) OpenAI or compatible key

### MongoDB Atlas Setup
1. Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a database user with read/write permissions
3. Whitelist your deployment IP (or use `0.0.0.0/0` for serverless)
4. Copy your connection string into `MONGO_URI`

### Docker
```bash
docker build -t ai-career-navigator .
docker run -p 3000:3000 --env-file .env ai-career-navigator
```

### Self-hosted
```bash
npm run build
npm start
```

## 🔐 Admin Access

The application includes an admin dashboard with platform statistics. There are **two ways** to create an admin account, both protected by the `ADMIN_SECRET` environment variable.

### Step 1 — Configure the secret

Add an `ADMIN_SECRET` to your `.env`:

```env
ADMIN_SECRET=your-secure-admin-secret
```

> In production, generate a strong random string (e.g. `openssl rand -base64 32`).

### Step 2 — Create an admin (pick one method)

#### Method A — Register form (easiest)

1. Go to `/register`
2. Fill in your name, email, and password
3. Click **"Register as admin"** to reveal the admin secret field
4. Paste your `ADMIN_SECRET` value
5. Click **"Create Admin Account"**

You'll be redirected to `/admin` automatically.

#### Method B — API seed endpoint (best for scripts / CI)

```bash
curl -X POST http://localhost:3000/api/auth/seed-admin \
  -H "Content-Type: application/json" \
  -d '{
    "adminSecret": "your-secure-admin-secret",
    "name": "Admin",
    "email": "admin@example.com",
    "password": "strong-password"
  }'
```

If the email already exists, the user is **promoted** to admin instead of duplicated.

### Step 3 — Log in

1. Go to `/login`
2. Sign in with your admin email + password
3. The navbar will show an **🛡 Admin** link
4. Click it (or visit `/admin`) to access the dashboard

### Admin dashboard features

- Total users count
- Total resumes uploaded
- Total roadmaps generated
- Career role popularity (from skill gap analyses)

### Security notes

- `ADMIN_SECRET` is **never exposed** to the browser
- The secret is only checked server-side
- Disable admin creation in production by leaving `ADMIN_SECRET` empty
- The `/api/auth/seed-admin` endpoint returns `500` if `ADMIN_SECRET` is not configured

## 🧪 Testing the App

1. **Register** a new account (or create an admin first — see above)
2. **Upload** a sample resume (PDF or DOCX)
3. **Select** a target career role (e.g., AI/ML Engineer)
4. **View** skill gap analysis with radar charts
5. **Explore** your personalized roadmap
6. **Browse** recommended resources and projects
7. **Chat** with the AI assistant
8. **Track** your progress
9. **Export** your roadmap as PDF

## 🎯 Use Cases

- **College Major Project** — Full-stack AI application with modern architecture
- **Hackathon Demo** — Impressive UI, real functionality, AI integration
- **Startup MVP** — Production-ready code, scalable design
- **Portfolio Piece** — Demonstrates fullstack skills, AI/ML, data viz, MongoDB

## 📊 Key Technical Highlights

| Area                   | Implementation                                                    |
| ---------------------- | ----------------------------------------------------------------- |
| Database               | MongoDB + Mongoose with in-memory fallback                        |
| Auth                   | JWT (jose) + bcrypt + httpOnly cookies                            |
| Resume Parsing         | pdf-parse + mammoth (lazy-loaded)                                 |
| AI                     | Modular service (mock + OpenAI-compatible)                        |
| Charts                 | Recharts (radar, bar, line)                                       |
| Animations             | Framer Motion                                                     |
| Type Safety            | TypeScript strict mode across full stack                          |
| API Validation         | Zod schemas                                                       |
| Deployment             | Vercel / Docker / self-hosted ready                               |

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## 📧 Support

For questions or support, open an issue on GitHub.

---

**Built with ❤️ using Next.js, MongoDB, and AI**
