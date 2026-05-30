"use client";

import Sidebar from "../components/Sidebar";
import LIHeader from "../components/LIHeader";
import { useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────
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

type ModalState =
  | { type: "none" }
  | { type: "addGroup" }
  | { type: "addTask"; groupId: string }
  | { type: "deleteTask"; taskId: string; groupId: string }
  | { type: "deleteGroup"; groupId: string };

// ─── Constants ────────────────────────────────────────────────────────────────
const COLORS = ["#7c3aed","#06b6d4","#f59e0b","#ef4444","#10b981","#3b82f6","#ec4899","#8b5cf6"];
const EMOJIS = ["💻","🖥️","🧠","🎓","📊","🔬","✍️","🎯","📐","🌐"];

const INITIAL_GROUPS: Group[] = [
  {
    id: "g1", name: "Web Programming (WIF2003)", color: "#7c3aed", emoji: "💻",
    tasks: [
      { id: "t1", title: "Phase 2 MongoDB integration", priority: "high", deadline: "2026-06-01", done: false },
      { id: "t2", title: "Dashboard frontend design", priority: "high", deadline: "2026-05-30", done: true },
      { id: "t3", title: "Testing plan document", priority: "medium", deadline: "2026-06-05", done: true },
      { id: "t4", title: "LocalStorage Phase 1 complete", priority: "low", deadline: null, done: true },
    ],
  },
  {
    id: "g2", name: "Algorithms (WIA2005)", color: "#06b6d4", emoji: "🧠",
    tasks: [
      { id: "t5", title: "Group presentation slides", priority: "high", deadline: "2026-06-10", done: false },
      { id: "t6", title: "Algorithm report writeup", priority: "high", deadline: "2026-06-05", done: false },
      { id: "t7", title: "Cyber-defence narrative draft", priority: "medium", deadline: "2026-06-08", done: true },
    ],
  },
  {
    id: "g3", name: "Mobile App (WIA2007)", color: "#10b981", emoji: "📱",
    tasks: [
      { id: "t8", title: "FridgeBuddy barcode scanner", priority: "high", deadline: "2026-06-12", done: false },
      { id: "t9", title: "OpenAI recipe integration", priority: "medium", deadline: "2026-06-12", done: false },
      { id: "ta", title: "README documentation", priority: "low", deadline: null, done: true },
      { id: "tb", title: "Expiry tracking UI", priority: "medium", deadline: "2026-06-10", done: false },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function genId() { return Math.random().toString(36).slice(2, 9); }

function daysUntil(deadline: string | null): number | null {
  if (!deadline) return null;
  const diff = new Date(deadline).getTime() - new Date("2026-05-30").getTime();
  return Math.ceil(diff / 86400000);
}

function formatDeadline(days: number | null, raw: string | null): string {
  if (days === null || !raw) return "";
  if (days <= 0) return "Overdue";
  if (days === 1) return "Tomorrow";
  return new Date(raw).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function urgencyClass(days: number | null): string {
  if (days === null) return "";
  if (days <= 1) return "urg";
  if (days <= 4) return "soon";
  return "";
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function PriorityBadge({ priority }: { priority: "high" | "medium" | "low" }) {
  const map = {
    high:   { label: "High",   bg: "rgba(251,113,133,0.12)", color: "#fb7185" },
    medium: { label: "Med",    bg: "rgba(251,191,36,0.12)",  color: "#fbbf24" },
    low:    { label: "Low",    bg: "rgba(52,211,153,0.12)",  color: "#34d399" },
  };
  const s = map[priority];
  return (
    <span
      className="text-[9px] font-bold py-0.5 px-1.5 rounded-full uppercase tracking-wide"
      style={{ background: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
}

function TaskItem({
  task, groupId, onToggle, onDelete,
}: {
  task: Task;
  groupId: string;
  onToggle: (tid: string, gid: string) => void;
  onDelete: (tid: string, gid: string) => void;
}) {
  const days = daysUntil(task.deadline);
  const dlLabel = formatDeadline(days, task.deadline);
  const uc = urgencyClass(days);

  return (
    <div className="flex items-center gap-2 py-2 px-2 rounded-lg border border-transparent transition-all duration-150 cursor-pointer hover:bg-[#0f0f3a] hover:border-[rgba(74,74,232,0.15)] task-row">
      {/* Checkbox */}
      <div
        onClick={() => onToggle(task.id, groupId)}
        className="w-4 h-4 rounded-md flex-shrink-0 flex items-center justify-center transition-all duration-150 cursor-pointer text-[9px] text-white"
        style={{
          border: task.done ? "2px solid #34d399" : "2px solid rgba(74,74,232,0.3)",
          background: task.done ? "#34d399" : "transparent",
        }}
      >
        {task.done ? "✓" : ""}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div
          className="text-xs font-medium truncate transition-all duration-150"
          style={{
            color: task.done ? "#4a4a7a" : "#e8e8ff",
            textDecoration: task.done ? "line-through" : "none",
          }}
        >
          {task.title}
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          {task.deadline && (
            <span
              className="text-[10px] font-mono flex items-center gap-1"
              style={{
                color: uc === "urg" ? "#fb7185" : uc === "soon" ? "#fbbf24" : "#4a4a7a",
              }}
            >
              📅 {dlLabel}
            </span>
          )}
          <PriorityBadge priority={task.priority} />
        </div>
      </div>

      {/* Delete */}
      <span
        onClick={() => onDelete(task.id, groupId)}
        className="task-del-btn text-[11px] text-[#4a4a7a] cursor-pointer p-1 transition-colors duration-150 hover:text-[#fb7185]"
      >
        ✕
      </span>
    </div>
  );
}

function GroupCard({
  group, onToggle, onDeleteTask, onDeleteGroup, onAddTask, taskRefs,
}: {
  group: Group;
  onToggle: (tid: string, gid: string) => void;
  onDeleteTask: (tid: string, gid: string) => void;
  onDeleteGroup: (gid: string) => void;
  onAddTask: (gid: string) => void;
  taskRefs: React.MutableRefObject<Map<string, HTMLDivElement>>;
}) {
  const done = group.tasks.filter(t => t.done).length;
  const total = group.tasks.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="bg-[#0a0a2e] border border-[rgba(74,74,232,0.15)] rounded-xl overflow-hidden transition-colors duration-200 hover:border-[rgba(74,74,232,0.3)]">
      {/* Header */}
      <div className="flex items-center gap-3 p-3.5 border-b border-[rgba(74,74,232,0.15)]">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0"
          style={{ background: group.color }}
        >
          {group.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-bold truncate text-[#e8e8ff]">{group.name}</div>
          <div className="text-[10px] text-[#4a4a7a] mt-0.5 font-mono">
            {done}/{total} completed · {pct}%
          </div>
        </div>
        <div className="flex gap-1">
          <IconBtn onClick={() => onAddTask(group.id)} title="Add task">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </IconBtn>
          <IconBtn onClick={() => onDeleteGroup(group.id)} title="Delete group">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14H6L5 6"/>
              <path d="M10 11v6M14 11v6"/>
            </svg>
          </IconBtn>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-[#141448] overflow-hidden">
        <div className="h-full transition-all duration-600" style={{ width: `${pct}%`, background: group.color }} />
      </div>

      {/* Tasks */}
      <div className="p-2 flex flex-col gap-1">
        {group.tasks.map(t => (
          <div
            key={t.id}
            ref={(el) => {
              if (el) taskRefs.current.set(`${group.id}-${t.id}`, el);
            }}
          >
            <TaskItem
              task={t}
              groupId={group.id}
              onToggle={onToggle}
              onDelete={onDeleteTask}
            />
          </div>
        ))}
      </div>

      {/* Add task btn */}
      <div
        onClick={() => onAddTask(group.id)}
        className="flex items-center gap-2 py-2 px-2.5 text-[12px] text-[#4a4a7a] cursor-pointer rounded-lg border border-dashed border-[rgba(74,74,232,0.15)] mx-2 mb-2 transition-all duration-150 hover:text-[#a78bfa] hover:border-[rgba(167,139,250,0.35)] hover:bg-[rgba(167,139,250,0.05)]"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Add task
      </div>
    </div>
  );
}

function IconBtn({ onClick, title, children }: { onClick: () => void; title?: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-6 h-6 rounded-md bg-transparent border border-transparent text-[#4a4a7a] flex items-center justify-center cursor-pointer transition-all duration-150 hover:bg-[#0f0f3a] hover:border-[rgba(74,74,232,0.15)] hover:text-[#e8e8ff]"
    >
      {children}
    </button>
  );
}

// ─── Modals ───────────────────────────────────────────────────────────────────
function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-[rgba(5,5,16,0.85)] flex items-center justify-center z-[100]"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#0a0a2e] border border-[rgba(74,74,232,0.3)] rounded-2xl w-[440px] overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-[rgba(74,74,232,0.15)]">
      <div className="text-[15px] font-extrabold text-[#e8e8ff]">{title}</div>
      <button
        onClick={onClose}
        className="bg-transparent border-none text-[#4a4a7a] cursor-pointer text-lg px-2 py-1 rounded-md transition-colors duration-150 hover:text-[#e8e8ff]"
      >
        ✕
      </button>
    </div>
  );
}

function ModalFooter({ onCancel, onConfirm, confirmLabel, danger }: {
  onCancel: () => void; onConfirm: () => void; confirmLabel: string; danger?: boolean;
}) {
  return (
    <div className="p-3.5 border-t border-[rgba(74,74,232,0.15)] flex justify-end gap-2.5">
      <button
        onClick={onCancel}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0f0f3a] text-[#8888bb] border border-[rgba(74,74,232,0.15)] text-xs font-bold cursor-pointer"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
          danger
            ? "bg-[rgba(251,113,133,0.15)] text-[#fb7185] border border-[rgba(251,113,133,0.3)]"
            : "bg-[#4a4ae8] text-white border-none"
        }`}
      >
        {confirmLabel}
      </button>
    </div>
  );
}

function OcInput({ id, placeholder, type = "text", min }: { id: string; placeholder?: string; type?: string; min?: string }) {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      min={min}
      className="w-full bg-[#0f0f3a] border border-[rgba(74,74,232,0.15)] rounded-lg px-3 py-2.5 text-[#e8e8ff] text-sm outline-none transition-colors duration-150 focus:border-[#4a4ae8]"
    />
  );
}

function InputLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] font-bold text-[#8888bb] uppercase tracking-wide mb-1.5">{children}</div>;
}

// ─── Add Group Modal ──────────────────────────────────────────────────────────
function AddGroupModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (name: string, color: string, emoji: string) => void;
}) {
  const [selEmoji, setSelEmoji] = useState(EMOJIS[0]);
  const [selColor, setSelColor] = useState(COLORS[0]);

  const handleCreate = () => {
    const name = (document.getElementById("ng-name") as HTMLInputElement)?.value.trim();
    if (!name) return;
    onCreate(name, selColor, selEmoji);
  };

  return (
    <Modal onClose={onClose}>
      <ModalHeader title="Create New Group" onClose={onClose} />
      <div className="p-5 flex flex-col gap-3.5">
        <div>
          <InputLabel>Group Name</InputLabel>
          <OcInput id="ng-name" placeholder="e.g. Web Development, OS Assignment..." />
        </div>
        <div>
          <InputLabel>Icon</InputLabel>
          <div className="flex gap-1.5 flex-wrap">
            {EMOJIS.map(e => (
              <div
                key={e}
                onClick={() => setSelEmoji(e)}
                className="w-8 h-8 rounded-md cursor-pointer text-lg flex items-center justify-center transition-all duration-150"
                style={{
                  background: selEmoji === e ? "rgba(74,74,232,0.15)" : "#0f0f3a",
                  border: selEmoji === e ? "1px solid #4a4ae8" : "1px solid rgba(74,74,232,0.15)",
                }}
              >
                {e}
              </div>
            ))}
          </div>
        </div>
        <div>
          <InputLabel>Color</InputLabel>
          <div className="flex gap-1.5 flex-wrap">
            {COLORS.map(c => (
              <div
                key={c}
                onClick={() => setSelColor(c)}
                className="w-6 h-6 rounded-md cursor-pointer transition-all duration-150"
                style={{
                  background: c,
                  boxShadow: selColor === c ? "0 0 0 3px rgba(255,255,255,0.25)" : "none",
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <ModalFooter onCancel={onClose} onConfirm={handleCreate} confirmLabel="Create Group" />
    </Modal>
  );
}

// ─── Add Task Modal ───────────────────────────────────────────────────────────
function AddTaskModal({ groupName, onClose, onCreate }: {
  groupName: string;
  onClose: () => void;
  onCreate: (title: string, priority: Task["priority"], deadline: string | null) => void;
}) {
  const handleCreate = () => {
    const title = (document.getElementById("nt-name") as HTMLInputElement)?.value.trim();
    if (!title) return;
    const deadline = (document.getElementById("nt-dl") as HTMLInputElement)?.value || null;
    const priority = (document.getElementById("nt-pri") as HTMLSelectElement)?.value as Task["priority"];
    onCreate(title, priority, deadline);
  };

  return (
    <Modal onClose={onClose}>
      <ModalHeader title={`Add Task — ${groupName}`} onClose={onClose} />
      <div className="p-5 flex flex-col gap-3.5">
        <div>
          <InputLabel>Task name</InputLabel>
          <OcInput id="nt-name" placeholder="What needs to be done?" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <InputLabel>Deadline (optional)</InputLabel>
            <OcInput id="nt-dl" type="date" min="2026-05-30" />
          </div>
          <div>
            <InputLabel>Priority</InputLabel>
            <select
              id="nt-pri"
              className="w-full bg-[#0f0f3a] border border-[rgba(74,74,232,0.15)] rounded-lg px-3 py-2.5 text-[#e8e8ff] text-sm outline-none"
            >
              <option value="high">High</option>
              <option value="medium" defaultValue="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
        <div className="text-[11px] text-[#8888bb] p-2.5 bg-[rgba(74,74,232,0.06)] border border-[rgba(74,74,232,0.15)] rounded-lg leading-relaxed">
          💡 Tasks without a deadline won&apos;t appear in Reminders — they stay only in this group.
        </div>
      </div>
      <ModalFooter onCancel={onClose} onConfirm={handleCreate} confirmLabel="Add Task" />
    </Modal>
  );
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────
function ConfirmModal({ icon, title, desc, onCancel, onConfirm, confirmLabel }: {
  icon: string; title: string; desc: string;
  onCancel: () => void; onConfirm: () => void; confirmLabel: string;
}) {
  return (
    <Modal onClose={onCancel}>
      <div className="text-center p-7">
        <div className="text-3xl mb-3">{icon}</div>
        <div className="text-base font-extrabold mb-1.5 text-[#e8e8ff]">{title}</div>
        <div className="text-[13px] text-[#8888bb] leading-relaxed" dangerouslySetInnerHTML={{ __html: desc }} />
        <div className="flex justify-center gap-2.5 mt-5">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-[#0f0f3a] text-[#8888bb] border border-[rgba(74,74,232,0.15)] text-xs font-bold cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-[rgba(251,113,133,0.15)] text-[#fb7185] border border-[rgba(251,113,133,0.3)] text-xs font-bold cursor-pointer"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Tasks() {
  const [groups, setGroups] = useState<Group[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("taskGroups");
      if (saved) return JSON.parse(saved);
    }
    return INITIAL_GROUPS;
  });

  const [modal, setModal] = useState<ModalState>({ type: "none" });
  const taskRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Persist groups to localStorage
  useEffect(() => {
    localStorage.setItem("taskGroups", JSON.stringify(groups));
  }, [groups]);

  // Highlight from URL parameters
  const searchParams = useSearchParams();
  const highlightTaskId = searchParams.get("highlightTask");
  const highlightGroupId = searchParams.get("highlightGroup");

  useEffect(() => {
    if (highlightTaskId && highlightGroupId) {
      const element = taskRefs.current.get(`${highlightGroupId}-${highlightTaskId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.style.transition = "background 0.3s";
        element.style.background = "rgba(74,74,232,0.2)";
        setTimeout(() => {
          element.style.background = "";
        }, 2000);
      }
      // Clean URL after highlight
      window.history.replaceState({}, "", "/Tasks");
    }
  }, [highlightTaskId, highlightGroupId]);

  const closeModal = useCallback(() => setModal({ type: "none" }), []);

  const toggleTask = useCallback((tid: string, gid: string) => {
    setGroups(prev => prev.map(g =>
      g.id !== gid ? g : { ...g, tasks: g.tasks.map(t => t.id === tid ? { ...t, done: !t.done } : t) }
    ));
  }, []);

  const deleteTask = useCallback((tid: string, gid: string) => {
    setGroups(prev => prev.map(g =>
      g.id !== gid ? g : { ...g, tasks: g.tasks.filter(t => t.id !== tid) }
    ));
    closeModal();
  }, [closeModal]);

  const deleteGroup = useCallback((gid: string) => {
    setGroups(prev => prev.filter(g => g.id !== gid));
    closeModal();
  }, [closeModal]);

  const createGroup = useCallback((name: string, color: string, emoji: string) => {
    setGroups(prev => [...prev, { id: genId(), name, color, emoji, tasks: [] }]);
    closeModal();
  }, [closeModal]);

  const createTask = useCallback((title: string, priority: Task["priority"], deadline: string | null) => {
    setModal(prev => {
      if (prev.type !== "addTask") return prev;
      const gid = prev.groupId;
      setGroups(gs => gs.map(g =>
        g.id !== gid ? g : { ...g, tasks: [...g.tasks, { id: genId(), title, priority, deadline, done: false }] }
      ));
      return { type: "none" };
    });
  }, []);

  const allTasks = groups.flatMap(g => g.tasks);
  const doneCount = allTasks.filter(t => t.done).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        .task-del-btn { opacity: 0; transition: opacity 0.15s; }
        .task-row:hover .task-del-btn { opacity: 1; }
      `}</style>

      <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <Sidebar />
        <div className="flex flex-col flex-1 transition-all duration-300 ease-in-out bg-[#050510]">
          <LIHeader pageName="Tasks" pageDesc={`${groups.length} groups · ${doneCount}/${allTasks.length} tasks completed`} />

          {/* ── Scrollable content ── */}
          <div className="flex-1 overflow-y-auto p-6 text-[#e8e8ff]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-[22px] font-extrabold tracking-tight">Task Groups</h1>
                <p className="text-xs text-[#4a4a7a] mt-1 font-mono">
                  {groups.length} groups · {doneCount}/{allTasks.length} tasks completed
                </p>
              </div>
              <div className="flex gap-2.5">
                <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0a0a2e] text-[#8888bb] border border-[rgba(74,74,232,0.15)] text-xs font-bold cursor-pointer">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                  AI Generate
                </button>
                <button
                  onClick={() => setModal({ type: "addGroup" })}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#4a4ae8] text-white border-none text-xs font-bold cursor-pointer"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  New Group
                </button>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4.5">
              {groups.map(g => (
                <GroupCard
                  key={g.id}
                  group={g}
                  onToggle={toggleTask}
                  onDeleteTask={(tid, gid) => setModal({ type: "deleteTask", taskId: tid, groupId: gid })}
                  onDeleteGroup={gid => setModal({ type: "deleteGroup", groupId: gid })}
                  onAddTask={gid => setModal({ type: "addTask", groupId: gid })}
                  taskRefs={taskRefs}
                />
              ))}

              {/* Add group placeholder */}
              <div
                onClick={() => setModal({ type: "addGroup" })}
                className="bg-transparent border border-dashed border-[rgba(74,74,232,0.15)] rounded-xl min-h-[160px] flex items-center justify-center cursor-pointer opacity-50 transition-opacity duration-200 hover:opacity-100"
              >
                <div className="text-center text-[#4a4a7a]">
                  <div className="text-2xl mb-2">+</div>
                  <div className="text-xs font-semibold">Add New Group</div>
                  <div className="text-[10px] mt-1">Course, project, or topic</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {modal.type === "addGroup" && (
        <AddGroupModal onClose={closeModal} onCreate={createGroup} />
      )}

      {modal.type === "addTask" && (() => {
        const g = groups.find(x => x.id === modal.groupId);
        return g ? <AddTaskModal groupName={g.name} onClose={closeModal} onCreate={createTask} /> : null;
      })()}

      {modal.type === "deleteTask" && (
        <ConfirmModal
          icon="🗑️" title="Delete Task"
          desc="Are you sure you want to delete this task? This cannot be undone."
          onCancel={closeModal}
          onConfirm={() => deleteTask(modal.taskId, modal.groupId)}
          confirmLabel="Delete Task"
        />
      )}

      {modal.type === "deleteGroup" && (() => {
        const g = groups.find(x => x.id === modal.groupId);
        return g ? (
          <ConfirmModal
            icon="📁" title="Delete Group"
            desc={`Delete "<strong>${g.name}</strong>" and all ${g.tasks.length} tasks inside it?`}
            onCancel={closeModal}
            onConfirm={() => deleteGroup(g.id)}
            confirmLabel="Delete Group"
          />
        ) : null;
      })()}
    </>
  );
}