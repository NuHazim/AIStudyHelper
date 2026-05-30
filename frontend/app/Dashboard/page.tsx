"use client";

import Sidebar from "../components/Sidebar";
import LIHeader from "../components/LIHeader";
import { useEffect, useRef } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface StatCard {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  change: string;
  changeType: "up" | "down" | "warn";
  glowColor: string;
  valueColor?: string;
}

interface Insight {
  icon: string;
  title: string;
  desc: string;
  titleColor: string;
  bgColor: string;
}

interface Deadline {
  name: string;
  group: string;
  date: string;
  dotColor: string;
  dateColor: string;
}

interface Mission {
  icon: string;
  name: string;
  progress: number;
  barColor: string;
  xp: number;
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const stats: StatCard[] = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    value: 84,
    label: "Productivity Score",
    change: "↑ +12 this week",
    changeType: "up",
    glowColor: "#a78bfa",
    valueColor: undefined, // gradient
  },
  {
    icon: <span style={{ fontSize: 18 }}>🔥</span>,
    value: 14,
    label: "Day Streak",
    change: "Personal best!",
    changeType: "warn",
    glowColor: "#fbbf24",
    valueColor: "#fbbf24",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    value: 23,
    label: "Tasks Completed",
    change: "↑ 4 today",
    changeType: "up",
    glowColor: "#34d399",
    valueColor: "#34d399",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fb7185" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    value: 7,
    label: "Pending Tasks",
    change: "3 due this week",
    changeType: "down",
    glowColor: "#fb7185",
    valueColor: "#fb7185",
  },
];

const insights: Insight[] = [
  {
    icon: "⚠️",
    title: "Burnout risk this week",
    desc: "Assignment load 40% above average. Schedule rest.",
    titleColor: "#fb7185",
    bgColor: "rgba(244,63,94,0.12)",
  },
  {
    icon: "🕗",
    title: "Best focus: 8PM–10PM",
    desc: "Last 7 sessions show peak concentration in evening hours.",
    titleColor: "#fbbf24",
    bgColor: "rgba(251,191,36,0.12)",
  },
  {
    icon: "📈",
    title: "Productivity improving",
    desc: "Score up 12pts. Your 14-day streak is paying off.",
    titleColor: "#34d399",
    bgColor: "rgba(52,211,153,0.12)",
  },
  {
    icon: "⚡",
    title: "OS Assignment due soon",
    desc: "Memory Management due May 27. Start now.",
    titleColor: "#a78bfa",
    bgColor: "rgba(167,139,250,0.12)",
  },
];

const deadlines: Deadline[] = [
  { name: "Memory Management OS", group: "University · CS", date: "Tomorrow", dotColor: "#fb7185", dateColor: "#fb7185" },
  { name: "WIF2003 Phase 2", group: "University · Web", date: "Jun 1", dotColor: "#fbbf24", dateColor: "#fbbf24" },
  { name: "Algorithm Report", group: "University · WIA2005", date: "Jun 5", dotColor: "#fbbf24", dateColor: "#fbbf24" },
  { name: "FridgeBuddy Demo", group: "University · Mobile", date: "Jun 12", dotColor: "#34d399", dateColor: "#34d399" },
  { name: "UMHackathon Report", group: "Extracurricular", date: "Jun 15", dotColor: "#34d399", dateColor: "#34d399" },
];

const missions: Mission[] = [
  { icon: "📚", name: "Study 5 hrs", progress: 76, barColor: "#a78bfa", xp: 150 },
  { icon: "✅", name: "Complete 10 tasks", progress: 60, barColor: "#34d399", xp: 100 },
  { icon: "🎯", name: "7-day streak", progress: 100, barColor: "#fbbf24", xp: 200 },
];

const quickActions = [
  { icon: "📁", label: "New Group" },
  { icon: "⚡", label: "Focus Session" },
  { icon: "✦", label: "Ask AI" },
  { icon: "📚", label: "Study Notes" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatCardItem({ card }: { card: StatCard }) {
  return (
    <div style={{
      background: "var(--oc-surface1)",
      border: "1px solid var(--oc-border-subtle)",
      borderRadius: 14,
      padding: 18,
      position: "relative",
      overflow: "hidden",
      transition: "all 0.2s",
      cursor: "default",
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLDivElement).style.borderColor = "var(--oc-border-default)";
      (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLDivElement).style.borderColor = "var(--oc-border-subtle)";
      (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
    }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 9,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: `${card.glowColor}26`,
        marginBottom: 12,
      }}>{card.icon}</div>

      <div style={{
        fontSize: 26, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1,
        ...(card.valueColor
          ? { color: card.valueColor }
          : {
              background: "linear-gradient(135deg, #a78bfa, #6b6bf0)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }),
      }}>{card.value}</div>

      <div style={{ fontSize: 11, color: "var(--oc-text-secondary)", fontWeight: 500, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {card.label}
      </div>
      <div style={{
        fontSize: 11, fontWeight: 600, marginTop: 8,
        color: card.changeType === "up" ? "#34d399" : card.changeType === "down" ? "#fb7185" : "#fbbf24",
      }}>{card.change}</div>

      <div style={{
        position: "absolute", top: -30, right: -30,
        width: 80, height: 80, borderRadius: "50%",
        background: card.glowColor, opacity: 0.07,
      }} />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    // Dynamically import Chart.js
    import("chart.js/auto").then((ChartModule) => {
      const Chart = ChartModule.default;
      if (!chartRef.current) return;

      if (chartInstance.current) chartInstance.current.destroy();

      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const data = [2.5, 3.8, 1.2, 4.1, 3.3, 5.0, 2.8];

      chartInstance.current = new Chart(chartRef.current, {
        type: "bar",
        data: {
          labels: days,
          datasets: [{
            label: "Focus Hours",
            data,
            backgroundColor: data.map(v => v >= 4 ? "rgba(74,74,232,0.85)" : "rgba(74,74,232,0.3)"),
            borderRadius: 6,
            borderSkipped: false,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "#0a0a2e",
              borderColor: "rgba(74,74,232,0.4)",
              borderWidth: 1,
              titleColor: "#e8e8ff",
              bodyColor: "#8888bb",
              padding: 10,
              callbacks: { label: (ctx: any) => ` ${ctx.parsed.y}h focus` },
            },
          },
          scales: {
            x: {
              grid: { color: "rgba(74,74,232,0.06)" },
              ticks: { color: "#4a4a7a", font: { size: 11 } },
            },
            y: {
              grid: { color: "rgba(74,74,232,0.06)" },
              ticks: { color: "#4a4a7a", font: { size: 11 }, callback: (v: any) => v + "h" },
              beginAtZero: true,
            },
          },
        },
      });
    });

    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, []);

  return (
    <>
      {/* CSS variables scoped to this page */}
      <style>{`
        :root {
          --oc-bg: #050510;
          --oc-surface1: #0a0a2e;
          --oc-surface2: #0f0f3a;
          --oc-surface3: #141448;
          --oc-accent: #4a4ae8;
          --oc-accent-bright: #6b6bf0;
          --oc-border-subtle: rgba(74,74,232,0.15);
          --oc-border-default: rgba(74,74,232,0.3);
          --oc-text-primary: #e8e8ff;
          --oc-text-secondary: #8888bb;
          --oc-text-muted: #4a4a7a;
        }
        .oc-stat-icon-wrap { background: rgba(139,92,246,0.15); }
        .oc-widget {
          background: var(--oc-surface1);
          border: 1px solid var(--oc-border-subtle);
          border-radius: 14px;
          padding: 18px;
        }
        .oc-w-title { font-size: 13px; font-weight: 700; color: var(--oc-text-primary); }
        .oc-w-action { font-size: 11px; color: var(--oc-accent-bright); font-weight: 600; cursor: pointer; }
        .oc-w-action:hover { color: #a78bfa; }
        .oc-insight-card {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 10px 12px;
          background: var(--oc-surface2);
          border: 1px solid var(--oc-border-subtle);
          border-radius: 10px;
          margin-bottom: 8px;
          transition: all 0.15s;
        }
        .oc-insight-card:last-child { margin-bottom: 0; }
        .oc-insight-card:hover { border-color: var(--oc-border-default); background: var(--oc-surface3); }
        .oc-deadline-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 11px;
          background: var(--oc-surface2);
          border: 1px solid var(--oc-border-subtle);
          border-radius: 9px; margin-bottom: 7px;
          cursor: pointer; transition: all 0.15s;
        }
        .oc-deadline-item:last-child { margin-bottom: 0; }
        .oc-deadline-item:hover { border-color: var(--oc-border-default); background: var(--oc-surface3); }
        .oc-qa-btn {
          display: flex; flex-direction: column;
          align-items: center; gap: 6px; padding: 14px;
          background: var(--oc-surface2);
          border: 1px solid var(--oc-border-subtle);
          border-radius: 10px; cursor: pointer;
          transition: all 0.2s; font-size: 11px;
          font-weight: 600; color: var(--oc-text-secondary);
        }
        .oc-qa-btn:hover {
          background: var(--oc-surface3);
          border-color: var(--oc-border-default);
          color: var(--oc-text-primary);
          transform: translateY(-2px);
        }
      `}</style>

      <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <Sidebar />
        <div className="flex flex-col flex-1 transition-all duration-300 ease-in-out" style={{ background: "#050510" }}>
          <LIHeader pageName="Dashboard" pageDesc="Monday, 30 May 2026 · Week 12 of Semester" />

          {/* ── Scrollable Content ── */}
          <div className="flex-1 overflow-y-auto p-6" style={{ color: "#e8e8ff", position: "relative" }}>

            {/* Background glow */}
            <div style={{
              position: "fixed", top: -200, left: "50%", transform: "translateX(-50%)",
              width: 800, height: 500, borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(74,74,232,0.12) 0%, transparent 70%)",
              pointerEvents: "none", zIndex: 0,
            }} />

            <div style={{ position: "relative", zIndex: 1 }}>

              {/* ── Header ── */}
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24 }}>
                <div>
                  <div style={{
                    fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em",
                    background: "linear-gradient(135deg, #e8e8ff 0%, #a78bfa 100%)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  }}>Good evening, Nufail 👋</div>
                  <div style={{ fontSize: 12, color: "#4a4a7a", marginTop: 4, fontFamily: "monospace" }}>
                    Saturday, 30 May 2026 · Week 12 of Semester
                  </div>
                </div>
                <button style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "9px 16px", background: "#4a4ae8",
                  border: "none", borderRadius: 10, color: "#fff",
                  fontSize: 13, fontWeight: 700, cursor: "pointer",
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  Ask AI
                </button>
              </div>

              {/* ── Stat Cards ── */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 18 }}>
                {stats.map((card, i) => <StatCardItem key={i} card={card} />)}
              </div>

              {/* ── Middle Row ── */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>

                {/* Chart */}
                <div className="oc-widget" style={{ gridColumn: "span 2" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <span className="oc-w-title">Weekly Focus Activity</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6,
                      background: "rgba(74,74,232,0.18)", color: "#6b6bf0", fontFamily: "monospace",
                    }}>This week</span>
                  </div>
                  <div style={{ height: 120, position: "relative" }}>
                    <canvas ref={chartRef} />
                  </div>
                </div>

                {/* XP + Missions */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {/* XP Bar */}
                  <div className="oc-widget" style={{ padding: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#6b6bf0", fontFamily: "monospace" }}>⚡ Level 12</span>
                      <span style={{ fontSize: 11, color: "#4a4a7a", fontFamily: "monospace" }}>2,840 / 4,200 XP</span>
                    </div>
                    <div style={{ height: 6, background: "#141448", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: "68%", background: "linear-gradient(90deg,#4a4ae8,#6b6bf0)", borderRadius: 3 }} />
                    </div>
                    <div style={{ fontSize: 10, color: "#4a4a7a", marginTop: 6, fontFamily: "monospace" }}>1,360 XP until Level 13</div>
                  </div>

                  {/* Missions */}
                  <div className="oc-widget" style={{ padding: 16, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <span className="oc-w-title">Weekly Missions</span>
                      <span className="oc-w-action">All →</span>
                    </div>
                    {missions.map((m, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < missions.length - 1 ? 10 : 0 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: 7, background: "#141448",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 13, flexShrink: 0,
                        }}>{m.icon}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.name}</div>
                          <div style={{ height: 4, background: "#141448", borderRadius: 2, marginTop: 5, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${m.progress}%`, background: m.barColor, borderRadius: 2 }} />
                          </div>
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#6b6bf0", fontFamily: "monospace", whiteSpace: "nowrap" }}>+{m.xp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Bottom Row ── */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>

                {/* AI Insights */}
                <div className="oc-widget">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <span className="oc-w-title">✦ AI Insights</span>
                    <span className="oc-w-action">Chat →</span>
                  </div>
                  {insights.map((ins, i) => (
                    <div key={i} className="oc-insight-card">
                      <div style={{
                        width: 30, height: 30, borderRadius: 8, background: ins.bgColor,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 13, flexShrink: 0,
                      }}>{ins.icon}</div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 2, color: ins.titleColor }}>{ins.title}</div>
                        <div style={{ fontSize: 11, color: "#8888bb", lineHeight: 1.45 }}>{ins.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Upcoming Deadlines */}
                <div className="oc-widget">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <span className="oc-w-title">Upcoming Deadlines</span>
                    <span className="oc-w-action">All →</span>
                  </div>
                  {deadlines.map((dl, i) => (
                    <div key={i} className="oc-deadline-item">
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: dl.dotColor, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{dl.name}</div>
                        <div style={{ fontSize: 10, color: "#4a4a7a", marginTop: 2 }}>{dl.group}</div>
                      </div>
                      <div style={{ fontSize: 10, fontWeight: 700, fontFamily: "monospace", whiteSpace: "nowrap", color: dl.dateColor }}>{dl.date}</div>
                    </div>
                  ))}
                </div>

                {/* Quick Actions + Streak */}
                <div className="oc-widget">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <span className="oc-w-title">Quick Actions</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8, marginBottom: 14 }}>
                    {quickActions.map((qa, i) => (
                      <button key={i} className="oc-qa-btn">
                        <span style={{ fontSize: 20 }}>{qa.icon}</span>
                        {qa.label}
                      </button>
                    ))}
                  </div>
                  <div style={{ height: 1, background: "rgba(74,74,232,0.15)", margin: "12px 0" }} />
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#4a4a7a", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                    Focus Streak
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {Array.from({ length: 14 }, (_, i) => (
                      <div key={i} style={{ flex: 1, height: 24, borderRadius: 4, background: "rgba(251,191,36,0.7)" }} />
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: "#4a4a7a", marginTop: 6, textAlign: "right", fontFamily: "monospace" }}>
                    🔥 14 days
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}