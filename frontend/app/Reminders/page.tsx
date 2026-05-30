"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "../components/Sidebar";
import LIHeader from "../components/LIHeader";

// ─── Types (matching Task page) ─────────────────────────────────────────────
interface Task {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  deadline: string | null;
  done: boolean;
}

interface Group {
  id: string;
  name: string;
  color: string;
  emoji: string;
  tasks: Task[];
}

// ─── Helper Functions ───────────────────────────────────────────────────────
function daysUntil(deadline: string | null): number | null {
  if (!deadline) return null;
  const diff = new Date(deadline).getTime() - new Date().getTime();
  return Math.ceil(diff / 86400000);
}

function formatDeadline(deadline: string): string {
  const days = daysUntil(deadline);
  if (days === null) return "";
  if (days < 0) return "Overdue";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return new Date(deadline).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case "high":
      return "#fb7185";
    case "medium":
      return "#fbbf24";
    default:
      return "#34d399";
  }
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function Reminders() {
  const [reminderTasks, setReminderTasks] = useState<
    (Task & { groupId: string; groupName: string; groupColor: string })[]
  >([]);

  // Load groups from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("taskGroups");
    if (saved) {
      const groups: Group[] = JSON.parse(saved);
      const tasksWithDeadlines = groups.flatMap((group) =>
        group.tasks
          .filter((task) => task.deadline !== null && !task.done) // only pending tasks with deadlines
          .map((task) => ({
            ...task,
            groupId: group.id,
            groupName: group.name,
            groupColor: group.color,
          }))
      );
      // Sort by deadline (soonest first)
      tasksWithDeadlines.sort(
        (a, b) =>
          new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime()
      );
      setReminderTasks(tasksWithDeadlines);
    }
  }, []);

  // Subscribe to storage changes (if Tasks page updates in another tab)
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("taskGroups");
      if (saved) {
        const groups: Group[] = JSON.parse(saved);
        const tasksWithDeadlines = groups.flatMap((group) =>
          group.tasks
            .filter((task) => task.deadline !== null && !task.done)
            .map((task) => ({
              ...task,
              groupId: group.id,
              groupName: group.name,
              groupColor: group.color,
            }))
        );
        tasksWithDeadlines.sort(
          (a, b) =>
            new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime()
        );
        setReminderTasks(tasksWithDeadlines);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <Sidebar />
      <div className="flex flex-col flex-1 transition-all duration-300 ease-in-out bg-[#050510]">
        <LIHeader
          pageName="Reminders"
          pageDesc={`${reminderTasks.length} pending tasks with deadlines`}
        />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6">
          {reminderTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-[#4a4a7a]">
              <div className="text-4xl mb-3">📭</div>
              <div className="text-lg font-semibold">No upcoming deadlines</div>
              <p className="text-sm mt-1">
                Tasks with deadlines will appear here automatically.
              </p>
              <Link
                href="/Tasks"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#4a4ae8] text-white text-sm font-semibold hover:bg-[#5a5af8] transition-colors"
              >
                + Add a task
              </Link>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-3">
              {reminderTasks.map((task) => {
                const days = daysUntil(task.deadline);
                const isOverdue = days !== null && days < 0;
                return (
                  <Link
                    key={task.id}
                    href={`/Tasks?highlightTask=${task.id}&highlightGroup=${task.groupId}`}
                    className="block transition-all duration-200 hover:scale-[1.01]"
                  >
                    <div
                      className="bg-[#0a0a2e] border border-[rgba(74,74,232,0.15)] rounded-xl p-4 hover:border-[rgba(74,74,232,0.4)] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className="inline-block w-2 h-2 rounded-full"
                              style={{ background: task.groupColor }}
                            />
                            <span className="text-xs font-medium text-[#8888bb] uppercase tracking-wide">
                              {task.groupName}
                            </span>
                            {isOverdue && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[rgba(251,113,133,0.15)] text-[#fb7185] border border-[rgba(251,113,133,0.3)]">
                                OVERDUE
                              </span>
                            )}
                          </div>
                          <h3 className="text-[15px] font-semibold text-[#e8e8ff] mt-1 line-clamp-1">
                            {task.title}
                          </h3>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1.5 text-xs">
                              <span>📅</span>
                              <span
                                className={`font-mono ${
                                  isOverdue
                                    ? "text-[#fb7185]"
                                    : days !== null && days <= 2
                                    ? "text-[#fbbf24]"
                                    : "text-[#4a4a7a]"
                                }`}
                              >
                                {formatDeadline(task.deadline!)}
                              </span>
                            </div>
                            <div
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                              style={{
                                background: `${getPriorityColor(task.priority)}20`,
                                color: getPriorityColor(task.priority),
                              }}
                            >
                              {task.priority.toUpperCase()}
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0 text-[#4a4a7a] group-hover:text-[#e8e8ff] transition-colors">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}