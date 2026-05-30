"use client";

import Sidebar from "../components/Sidebar";
import LIHeader from "../components/LIHeader";
import { useState, useRef, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const SUGGESTIONS = [
  { icon: "📝", label: "Summarise my notes", prompt: "Can you summarise my notes on Database Normalisation?" },
  { icon: "📅", label: "Plan my week", prompt: "Help me plan my study schedule for this week based on my deadlines." },
  { icon: "🧠", label: "Explain a concept", prompt: "Explain Big O notation in simple terms with examples." },
  { icon: "✅", label: "Break down a task", prompt: "Break down the steps I need to complete my WIF2003 Phase 2 assignment." },
  { icon: "⚡", label: "Quiz me", prompt: "Quiz me on Database Normalisation — 1NF, 2NF and 3NF." },
  { icon: "🔍", label: "Find weak spots", prompt: "What topics should I focus on before my algorithms exam?" },
];

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: "Hey Nufail! 👋 I'm your AI study assistant. I can help you summarise notes, plan your schedule, explain concepts, generate flashcards, and more.\n\nWhat do you need help with today?",
  timestamp: new Date(),
};

function genId() { return Math.random().toString(36).slice(2, 9); }

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 20 }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%", background: "rgba(74,74,232,0.2)",
        border: "1px solid rgba(74,74,232,0.3)", display: "flex",
        alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14,
      }}>✦</div>
      <div style={{
        background: "#0a0a2e", border: "1px solid rgba(74,74,232,0.15)",
        borderRadius: "4px 14px 14px 14px", padding: "12px 16px",
        display: "flex", alignItems: "center", gap: 5,
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: "50%", background: "#4a4ae8",
            animation: "bounce 1.2s ease-in-out infinite",
            animationDelay: `${i * 0.2}s`,
          }} />
        ))}
      </div>
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div style={{
      display: "flex",
      flexDirection: isUser ? "row-reverse" : "row",
      alignItems: "flex-start",
      gap: 10,
      marginBottom: 20,
    }}>
      {/* Avatar */}
      <div style={{
        width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: isUser ? 12 : 14, fontWeight: 700,
        ...(isUser
          ? { background: "#4a4ae8", color: "#fff" }
          : { background: "rgba(74,74,232,0.2)", border: "1px solid rgba(74,74,232,0.3)", color: "#6b6bf0" }
        ),
      }}>
        {isUser ? "N" : "✦"}
      </div>

      {/* Bubble + timestamp */}
      <div style={{ maxWidth: "72%", display: "flex", flexDirection: "column", gap: 4, alignItems: isUser ? "flex-end" : "flex-start" }}>
        <div style={{
          padding: "12px 16px",
          borderRadius: isUser ? "14px 4px 14px 14px" : "4px 14px 14px 14px",
          fontSize: 13, lineHeight: 1.65, color: "#e8e8ff",
          whiteSpace: "pre-wrap", wordBreak: "break-word",
          ...(isUser
            ? { background: "#4a4ae8", color: "#fff" }
            : { background: "#0a0a2e", border: "1px solid rgba(74,74,232,0.15)" }
          ),
        }}>
          {message.content}
        </div>
        <div style={{ fontSize: 10, color: "#4a4a7a", fontFamily: "monospace" }}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = inputRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  }, [input]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMsg: Message = {
      id: genId(), role: "user", content: trimmed, timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setShowSuggestions(false);

    // ── Plug in your Groq API call here ──────────────────────────────────────
    // Replace this timeout with a real fetch to /api/ai or directly to Groq.
    // Example:
    //
    // const res = await fetch("/api/ai", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })) }),
    // });
    // const data = await res.json();
    // const reply = data.content;
    //
    // ─────────────────────────────────────────────────────────────────────────

    await new Promise(r => setTimeout(r, 1400));

    const reply = `This is a placeholder response to: "${trimmed}"\n\nOnce you connect your Groq API key, real responses will appear here. Add your API route at \`frontend/app/api/ai/route.ts\` and update the \`sendMessage\` function above.`;

    setIsTyping(false);
    setMessages(prev => [...prev, {
      id: genId(), role: "assistant", content: reply, timestamp: new Date(),
    }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([WELCOME_MESSAGE]);
    setShowSuggestions(true);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
        .send-btn:hover { background: #6b6bf0 !important; transform: translateY(-1px); }
        .send-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }
        .suggestion-chip:hover {
          background: rgba(74,74,232,0.15) !important;
          border-color: rgba(74,74,232,0.4) !important;
          color: #e8e8ff !important;
        }
        .clear-btn:hover { color: #fb7185 !important; border-color: rgba(251,113,133,0.3) !important; background: rgba(251,113,133,0.08) !important; }
        .oc-textarea:focus { border-color: rgba(74,74,232,0.5) !important; outline: none; }
        .oc-textarea { resize: none; }
        .oc-textarea::placeholder { color: #4a4a7a; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(74,74,232,0.2); border-radius: 2px; }
      `}</style>

      <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <Sidebar />
        <div className="flex flex-col flex-1 transition-all duration-300 ease-in-out" style={{ background: "#050510" }}>
          <LIHeader pageName="AI Assistant" pageDesc="Your personal study companion" />

          {/* ── Main chat area ── */}
          <div className="flex-1 overflow-hidden" style={{ display: "flex", flexDirection: "column", position: "relative" }}>

            {/* Background glow */}
            <div style={{
              position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)",
              width: 600, height: 400, borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(74,74,232,0.08) 0%, transparent 70%)",
              pointerEvents: "none", zIndex: 0,
            }} />

            {/* ── Messages scroll area ── */}
            <div style={{
              flex: 1, overflowY: "auto", padding: "24px 0",
              position: "relative", zIndex: 1,
            }}>
              <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px" }}>

                {messages.map(msg => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}

                {isTyping && <TypingIndicator />}

                {/* Suggestion chips — shown only at start */}
                {showSuggestions && messages.length === 1 && (
                  <div style={{ marginTop: 8, marginBottom: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#4a4a7a", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                      Try asking
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                      {SUGGESTIONS.map((s, i) => (
                        <button
                          key={i}
                          className="suggestion-chip"
                          onClick={() => sendMessage(s.prompt)}
                          style={{
                            display: "flex", alignItems: "center", gap: 8,
                            padding: "11px 14px",
                            background: "#0a0a2e", border: "1px solid rgba(74,74,232,0.15)",
                            borderRadius: 10, cursor: "pointer",
                            fontSize: 12, fontWeight: 600, color: "#8888bb",
                            fontFamily: "'Outfit', sans-serif",
                            transition: "all 0.2s", textAlign: "left",
                          }}
                        >
                          <span style={{ fontSize: 16, flexShrink: 0 }}>{s.icon}</span>
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>
            </div>

            {/* ── Input area ── */}
            <div style={{
              borderTop: "1px solid rgba(74,74,232,0.12)",
              background: "rgba(5,5,16,0.95)",
              backdropFilter: "blur(12px)",
              padding: "16px 24px 20px",
              position: "relative", zIndex: 2,
            }}>
              <div style={{ maxWidth: 760, margin: "0 auto" }}>

                {/* Suggestion chips inline — shown after conversation starts */}
                {!showSuggestions && (
                  <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                    {SUGGESTIONS.slice(0, 4).map((s, i) => (
                      <button
                        key={i}
                        className="suggestion-chip"
                        onClick={() => sendMessage(s.prompt)}
                        style={{
                          display: "flex", alignItems: "center", gap: 6,
                          padding: "5px 10px",
                          background: "#0a0a2e", border: "1px solid rgba(74,74,232,0.15)",
                          borderRadius: 20, cursor: "pointer",
                          fontSize: 11, fontWeight: 600, color: "#8888bb",
                          fontFamily: "'Outfit', sans-serif",
                          transition: "all 0.2s",
                        }}
                      >
                        <span style={{ fontSize: 12 }}>{s.icon}</span>
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input box */}
                <div style={{
                  display: "flex", alignItems: "flex-end", gap: 10,
                  background: "#0a0a2e", border: "1px solid rgba(74,74,232,0.2)",
                  borderRadius: 14, padding: "10px 12px",
                  transition: "border-color 0.2s",
                }}>
                  {/* AI icon */}
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "rgba(74,74,232,0.15)", border: "1px solid rgba(74,74,232,0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, color: "#6b6bf0", flexShrink: 0, marginBottom: 2,
                  }}>✦</div>

                  {/* Textarea */}
                  <textarea
                    ref={inputRef}
                    className="oc-textarea"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything — notes, plans, concepts, quizzes..."
                    rows={1}
                    style={{
                      flex: 1, background: "transparent", border: "none",
                      color: "#e8e8ff", fontFamily: "'Outfit', sans-serif",
                      fontSize: 13, lineHeight: 1.6, padding: "4px 0",
                      maxHeight: 120, overflowY: "auto",
                    }}
                  />

                  {/* Right side buttons */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, marginBottom: 2 }}>
                    {/* Clear chat */}
                    {messages.length > 1 && (
                      <button
                        className="clear-btn"
                        onClick={clearChat}
                        title="Clear chat"
                        style={{
                          width: 30, height: 30, borderRadius: 8,
                          background: "transparent", border: "1px solid rgba(74,74,232,0.15)",
                          color: "#4a4a7a", cursor: "pointer", fontSize: 13,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all 0.2s",
                        }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>
                        </svg>
                      </button>
                    )}

                    {/* Send */}
                    <button
                      className="send-btn"
                      onClick={() => sendMessage(input)}
                      disabled={!input.trim() || isTyping}
                      style={{
                        width: 34, height: 34, borderRadius: 9,
                        background: input.trim() ? "#4a4ae8" : "rgba(74,74,232,0.2)",
                        border: "none", color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", transition: "all 0.2s", flexShrink: 0,
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Footer hint */}
                <div style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: "#4a4a7a" }}>
                  Press <kbd style={{ background: "#0a0a2e", border: "1px solid rgba(74,74,232,0.2)", borderRadius: 4, padding: "1px 5px", fontSize: 10, fontFamily: "monospace", color: "#8888bb" }}>Enter</kbd> to send · <kbd style={{ background: "#0a0a2e", border: "1px solid rgba(74,74,232,0.2)", borderRadius: 4, padding: "1px 5px", fontSize: 10, fontFamily: "monospace", color: "#8888bb" }}>Shift + Enter</kbd> for new line
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}