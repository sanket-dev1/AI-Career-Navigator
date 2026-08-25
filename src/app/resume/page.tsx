"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { DashboardLayout } from "@/components/layout";
import { Card, Button, Progress, SectionHeading } from "@/components/ui";
import { formatBytes } from "@/lib/utils";

type Status = "idle" | "uploading" | "extracting" | "analyzing" | "done" | "error";

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ resume?: { fileName: string; fileSize: number; skills?: string[] } } | null>(null);

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted.length > 0) {
      setFile(accepted[0]);
      setError("");
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  async function handleUpload() {
    if (!file) return;
    setStatus("uploading");
    setProgress(20);
    try {
      const formData = new FormData();
      formData.append("file", file);
      setStatus("extracting");
      setProgress(50);
      const res = await fetch("/api/resume", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setStatus("analyzing");
      setProgress(80);
      await new Promise((r) => setTimeout(r, 800));
      setProgress(100);
      setStatus("done");
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setStatus("error");
    }
  }

  return (
    <DashboardLayout>
      <SectionHeading
        eyebrow="Resume"
        title="Upload Your Resume"
        subtitle="We'll extract your skills and experience to build your personalized roadmap."
      />

      <Card className="mb-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition ${
            isDragActive ? "border-cyan-400 bg-cyan-500/5" : "border-slate-700 hover:border-violet-500/50"
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
          <div className="text-lg font-semibold mb-2">
            {isDragActive ? "Drop your resume here" : "Drop your resume here"}
          </div>
          <div className="text-sm text-slate-400 mb-4">or click to browse files</div>
          <div className="text-xs text-slate-500">Supported: PDF, DOCX (max 5MB)</div>
        </div>

        {file && (
          <div className="mt-6 glass rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="h-8 w-8 text-violet-400" />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{file.name}</div>
                <div className="text-xs text-slate-400">{formatBytes(file.size)}</div>
              </div>
            </div>
            <Button onClick={handleUpload} disabled={status !== "idle" && status !== "error" && status !== "done"} className="w-full">
              {status === "uploading" || status === "extracting" || status === "analyzing" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {status === "uploading" && "Uploading..."}
                  {status === "extracting" && "Extracting text..."}
                  {status === "analyzing" && "Analyzing..."}
                </>
              ) : (
                "Upload & Analyze"
              )}
            </Button>
            {progress > 0 && progress < 100 && (
              <div className="mt-3">
                <Progress value={progress} />
              </div>
            )}
          </div>
        )}

        {status === "error" && (
          <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div className="text-sm text-red-200">{error}</div>
          </div>
        )}

        {status === "done" && result && (
          <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-emerald-200 mb-1">Resume uploaded successfully!</div>
              <div className="text-sm text-slate-400">
                {result.resume?.skills?.length || 0} skills detected. Next, choose your target role.
              </div>
            </div>
          </div>
        )}
      </Card>

      {status === "done" && (
        <Card>
          <h3 className="font-semibold mb-3">Next Steps</h3>
          <div className="text-sm text-slate-400">
            1. Choose your target career role
            <br />
            2. AI will analyze your skill gaps
            <br />
            3. Receive your personalized roadmap
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
}
