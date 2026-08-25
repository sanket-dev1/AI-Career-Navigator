"use client";
import { useState, useEffect, useRef } from "react";
import { Bot, Send, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout";
import { Card, Button, Input, SectionHeading } from "@/components/ui";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/assistant").then((r) => r.json()).then((d) => setMessages(d.messages || [])).catch(() => {});
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      if (data.message) setMessages((prev) => [...prev, data.message]);
    } catch {
      // noop
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <SectionHeading
        eyebrow="AI Assistant"
        title="Your AI Career Coach"
        subtitle="Ask anything. Answers are personalized based on your profile, gaps, and roadmap."
      />

      <Card className="h-[600px] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <Bot className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <div className="text-lg font-semibold mb-2">Start a conversation</div>
              <div className="text-sm text-slate-400">
                Try: "How should I learn Docker with 2 hours per day?"
              </div>
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  m.role === "user"
                    ? "bg-gradient-to-br from-violet-500 to-blue-500 text-white"
                    : "glass border border-violet-500/30"
                }`}
              >
                <div className="text-sm whitespace-pre-wrap">{m.content}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="glass border border-violet-500/30 rounded-2xl px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Ask your AI career coach..."
            disabled={loading}
          />
          <Button onClick={handleSend} disabled={loading || !input.trim()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </Card>
    </DashboardLayout>
  );
}
