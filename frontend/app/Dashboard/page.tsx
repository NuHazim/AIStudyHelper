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
    valueColor: undefined,
  },
  {
    icon: <span className="text-lg">🔥</span>,
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

const quickActions = [
  { icon: "📁", label: "New Group" },
  { icon: "⚡", label: "Focus Session" },
  { icon: "✦", label: "Ask AI" },
  { icon: "📚", label: "Study Notes" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatCardItem({ card }: { card: StatCard }) {
  return (
    <div className="bg-[#0a0a2e] border border-[rgba(74,74,232,0.15)] rounded-xl p-[18px] relative overflow-hidden transition-all duration-200 cursor-default hover:border-[rgba(74,74,232,0.3)] hover:-translate-y-0.5">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
        style={{ background: `${card.glowColor}26` }}
      >
        {card.icon}
      </div>

      <div
        className="text-[26px] font-black tracking-tighter leading-none"
        style={
          card.valueColor
            ? { color: card.valueColor }
            : {
                background: "linear-gradient(135deg, #a78bfa, #6b6bf0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }
        }
      >
        {card.value}
      </div>

      <div className="text-[11px] text-[#8888bb] font-semibold mt-1 uppercase tracking-wide">
        {card.label}
      </div>
      <div
        className="text-[11px] font-semibold mt-2"
        style={{
          color: card.changeType === "up" ? "#34d399" : card.changeType === "down" ? "#fb7185" : "#fbbf24",
        }}
      >
        {card.change}
      </div>

      <div
        className="absolute -top-[30px] -right-[30px] w-20 h-20 rounded-full opacity-[0.07] pointer-events-none"
        style={{ background: card.glowColor }}
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
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
    <div className="flex h-screen overflow-hidden font-['Outfit',sans-serif]">
      <Sidebar />
      <div className="flex flex-col flex-1 transition-all duration-300 ease-in-out bg-[#050510]">
        <LIHeader pageName="Dashboard" pageDesc="Monday, 30 May 2026 · Week 12 of Semester" />

        <div className="flex-1 overflow-y-auto p-6 text-[#e8e8ff] relative">
          {/* Background glow */}
          <div className="fixed top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-[radial-gradient(ellipse,rgba(74,74,232,0.12)_0%,transparent_70%)] pointer-events-none z-0" />

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-end justify-between mb-6">
              <div>
                <div className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-[#e8e8ff] to-[#a78bfa] bg-clip-text text-transparent">
                  Good evening, Nufail 👋
                </div>
                <div className="text-xs text-[#4a4a7a] mt-1 font-mono">
                  Saturday, 30 May 2026 · Week 12 of Semester
                </div>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-4 gap-3.5 mb-4">
              {stats.map((card, i) => <StatCardItem key={i} card={card} />)}
            </div>

            {/* Middle Row - Chart only */}
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div className="bg-[#0a0a2e] border border-[rgba(74,74,232,0.15)] rounded-xl p-[18px]">
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-[13px] font-bold text-[#e8e8ff]">Weekly Focus Activity</span>
                  <span className="text-[10px] font-bold py-0.5 px-2 rounded-md bg-[rgba(74,74,232,0.18)] text-[#6b6bf0] font-mono">
                    This week
                  </span>
                </div>
                <div className="h-[120px] relative">
                  <canvas ref={chartRef} />
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-3 gap-4">
              {/* AI Insights */}
              <div className="bg-[#0a0a2e] border border-[rgba(74,74,232,0.15)] rounded-xl p-[18px]">
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-[13px] font-bold text-[#e8e8ff]">✦ AI Insights</span>
                  <span className="text-[11px] text-[#6b6bf0] font-semibold cursor-pointer hover:text-[#a78bfa]">Chat →</span>
                </div>
                {insights.map((ins, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-2.5 bg-[#0f0f3a] border border-[rgba(74,74,232,0.15)] rounded-lg mb-2 last:mb-0 transition-all duration-150 hover:border-[rgba(74,74,232,0.3)] hover:bg-[#141448]"
                  >
                    <div
                      className="w-[30px] h-[30px] rounded-lg flex items-center justify-center text-[13px] shrink-0"
                      style={{ background: ins.bgColor }}
                    >
                      {ins.icon}
                    </div>
                    <div>
                      <div className="text-xs font-bold mb-0.5" style={{ color: ins.titleColor }}>
                        {ins.title}
                      </div>
                      <div className="text-[11px] text-[#8888bb] leading-relaxed">{ins.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Upcoming Deadlines */}
              <div className="bg-[#0a0a2e] border border-[rgba(74,74,232,0.15)] rounded-xl p-[18px]">
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-[13px] font-bold text-[#e8e8ff]">Upcoming Deadlines</span>
                  <span className="text-[11px] text-[#6b6bf0] font-semibold cursor-pointer hover:text-[#a78bfa]">All →</span>
                </div>
                {deadlines.map((dl, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 p-[9px_11px] bg-[#0f0f3a] border border-[rgba(74,74,232,0.15)] rounded-lg mb-2 last:mb-0 cursor-pointer transition-all duration-150 hover:border-[rgba(74,74,232,0.3)] hover:bg-[#141448]"
                  >
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: dl.dotColor }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold truncate">{dl.name}</div>
                      <div className="text-[10px] text-[#4a4a7a] mt-0.5">{dl.group}</div>
                    </div>
                    <div className="text-[10px] font-bold font-mono whitespace-nowrap" style={{ color: dl.dateColor }}>
                      {dl.date}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions + Streak */}
              <div className="bg-[#0a0a2e] border border-[rgba(74,74,232,0.15)] rounded-xl p-[18px]">
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-[13px] font-bold text-[#e8e8ff]">Quick Actions</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3.5">
                  {quickActions.map((qa, i) => (
                    <button
                      key={i}
                      className="flex flex-col items-center gap-1.5 p-3.5 bg-[#0f0f3a] border border-[rgba(74,74,232,0.15)] rounded-lg text-[11px] font-semibold text-[#8888bb] cursor-pointer transition-all duration-200 hover:bg-[#141448] hover:border-[rgba(74,74,232,0.3)] hover:text-[#e8e8ff] hover:-translate-y-0.5"
                    >
                      <span className="text-xl">{qa.icon}</span>
                      {qa.label}
                    </button>
                  ))}
                </div>
                <div className="h-px bg-[rgba(74,74,232,0.15)] my-3" />
                <div className="text-[10px] font-bold text-[#4a4a7a] uppercase tracking-wider mb-2">
                  Focus Streak
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 14 }, (_, i) => (
                    <div key={i} className="flex-1 h-6 rounded-md bg-[rgba(251,191,36,0.7)]" />
                  ))}
                </div>
                <div className="text-[11px] text-[#4a4a7a] mt-1.5 text-right font-mono">🔥 14 days</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}