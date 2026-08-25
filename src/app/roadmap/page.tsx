"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Map, BookOpen, FolderKanban, Clock, Download } from "lucide-react";
import { DashboardLayout } from "@/components/layout";
import { Card, Button, Badge, SectionHeading } from "@/components/ui";
import { jsPDF } from "jspdf";

type RoadmapData = {
  roadmap?: {
    targetRole?: string;
    totalWeeks?: number;
    readinessScore?: number;
    data?: { weeks?: { week: number; title: string; topics: string[]; project: { title: string; description: string }; resources: { title: string; url: string; platform: string }[]; hours: number }[] };
  } | null;
};

export default function RoadmapPage() {
  const [data, setData] = useState<RoadmapData>({});

  useEffect(() => {
    fetch("/api/roadmap").then((r) => r.json()).then(setData).catch(() => {});
  }, []);

  const weeks = data.roadmap?.data?.weeks || [];
  const targetRole = data.roadmap?.targetRole || "Your Target Role";

  function exportPDF() {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("AI Career Navigator — Your Roadmap", 20, 20);
    doc.setFontSize(14);
    doc.text(`Target Role: ${targetRole}`, 20, 35);
    doc.text(`Readiness Score: ${data.roadmap?.readinessScore || 0}/100`, 20, 45);
    doc.text(`Duration: ${weeks.length} weeks`, 20, 55);

    let y = 75;
    weeks.forEach((w) => {
      if (y > 260) { doc.addPage(); y = 20; }
      doc.setFontSize(12);
      doc.text(`Week ${w.week}: ${w.title}`, 20, y);
      y += 8;
      doc.setFontSize(10);
      w.topics.forEach((t) => { doc.text(`• ${t}`, 25, y); y += 6; });
      doc.text(`Project: ${w.project.title}`, 25, y);
      y += 6;
      doc.text(`Hours: ${w.hours}`, 25, y);
      y += 12;
    });

    doc.save("career-roadmap.pdf");
  }

  return (
    <DashboardLayout>
      <SectionHeading
        eyebrow="Roadmap"
        title={`Your Personalized ${weeks.length}-Week Career Roadmap`}
        subtitle="A week-by-week plan to close your skill gaps and become job-ready."
      />

      {weeks.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Map className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <div className="text-lg font-semibold mb-2">No roadmap yet</div>
            <div className="text-sm text-slate-400">Upload a resume and select a target role to generate your roadmap.</div>
          </div>
        </Card>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <Button onClick={exportPDF}>
              <Download className="h-4 w-4" /> Export PDF
            </Button>
          </div>

          <div className="space-y-4">
            {weeks.map((w, i) => (
              <motion.div
                key={w.week}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card>
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center shrink-0 glow-cyan">
                      <span className="text-lg font-bold">{w.week}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold">{w.title}</h3>
                        <Badge color="violet">
                          <Clock className="h-3 w-3" /> {w.hours}h
                        </Badge>
                      </div>

                      <div className="mb-4">
                        <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">Topics</div>
                        <div className="space-y-1">
                          {w.topics.map((t, j) => (
                            <div key={j} className="text-sm text-slate-300 flex items-center gap-2">
                              <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
                              {t}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">Mini Project</div>
                        <div className="glass rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <FolderKanban className="h-4 w-4 text-violet-400" />
                            <span className="font-medium text-sm">{w.project.title}</span>
                          </div>
                          <div className="text-xs text-slate-400">{w.project.description}</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">Resources</div>
                        <div className="flex flex-wrap gap-2">
                          {w.resources.map((r, j) => (
                            <a
                              key={j}
                              href={r.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="chip hover:bg-violet-500/20 transition"
                            >
                              {r.title}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
