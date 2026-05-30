"use client";

import Sidebar from "../components/Sidebar";
import LIHeader from "../components/LIHeader";
import { useState, useCallback } from "react";

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
    <span style={{
      fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 20,
      letterSpacing: "0.04em", textTransform: "uppercase",
      background: s.bg, color: s.color,
    }}>{s.label}</span>
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
    <div style={{
      display: "flex", alignItems: "center", gap: 9,
      padding: "9px 9px", borderRadius: 8,
      border: "1px solid transparent",
      transition: "all 0.15s", cursor: "pointer",
    }}
    onMouseEnter={e => {
      const el = e.currentTarget as HTMLDivElement;
      el.style.background = "#0f0f3a";
      el.style.borderColor = "rgba(74,74,232,0.15)";
    }}
    onMouseLeave={e => {
      const el = e.currentTarget as HTMLDivElement;
      el.style.background = "transparent";
      el.style.borderColor = "transparent";
    }}
    className="task-row"
    >
      {/* Checkbox */}
      <div
        onClick={() => onToggle(task.id, groupId)}
        style={{
          width: 17, height: 17, borderRadius: 5, flexShrink: 0,
          border: task.done ? "2px solid #34d399" : "2px solid rgba(74,74,232,0.3)",
          background: task.done ? "#34d399" : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.15s", cursor: "pointer", fontSize: 9, color: "#fff",
        }}
      >{task.done ? "✓" : ""}</div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 12, fontWeight: 500,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          color: task.done ? "#4a4a7a" : "#e8e8ff",
          textDecoration: task.done ? "line-through" : "none",
          transition: "all 0.15s",
        }}>{task.title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 3 }}>
          {task.deadline && (
            <span style={{
              fontSize: 10, fontFamily: "monospace",
              color: uc === "urg" ? "#fb7185" : uc === "soon" ? "#fbbf24" : "#4a4a7a",
              display: "flex", alignItems: "center", gap: 3,
            }}>📅 {dlLabel}</span>
          )}
          <PriorityBadge priority={task.priority} />
        </div>
      </div>

      {/* Delete */}
      <span
        onClick={() => onDelete(task.id, groupId)}
        className="task-del-btn"
        style={{ fontSize: 11, color: "#4a4a7a", cursor: "pointer", padding: 4, transition: "color 0.15s" }}
        onMouseEnter={e => (e.currentTarget as HTMLSpanElement).style.color = "#fb7185"}
        onMouseLeave={e => (e.currentTarget as HTMLSpanElement).style.color = "#4a4a7a"}
      >✕</span>
    </div>
  );
}

function GroupCard({
  group, onToggle, onDeleteTask, onDeleteGroup, onAddTask,
}: {
  group: Group;
  onToggle: (tid: string, gid: string) => void;
  onDeleteTask: (tid: string, gid: string) => void;
  onDeleteGroup: (gid: string) => void;
  onAddTask: (gid: string) => void;
}) {
  const done = group.tasks.filter(t => t.done).length;
  const total = group.tasks.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div style={{
      background: "#0a0a2e", border: "1px solid rgba(74,74,232,0.15)",
      borderRadius: 14, overflow: "hidden", transition: "border-color 0.2s",
    }}
    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(74,74,232,0.3)"}
    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(74,74,232,0.15)"}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 14px 12px", borderBottom: "1px solid rgba(74,74,232,0.15)" }}>
        <div style={{
          width: 34, height: 34, borderRadius: 8, background: group.color,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 15, flexShrink: 0,
        }}>{group.emoji}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#e8e8ff" }}>{group.name}</div>
          <div style={{ fontSize: 10, color: "#4a4a7a", marginTop: 2, fontFamily: "monospace" }}>{done}/{total} completed · {pct}%</div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <IconBtn onClick={() => onAddTask(group.id)} title="Add task">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </IconBtn>
          <IconBtn onClick={() => onDeleteGroup(group.id)} title="Delete group">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
          </IconBtn>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: "#141448", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: group.color, transition: "width 0.6s" }} />
      </div>

      {/* Tasks */}
      <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 4 }}>
        {group.tasks.map(t => (
          <TaskItem key={t.id} task={t} groupId={group.id} onToggle={onToggle} onDelete={onDeleteTask} />
        ))}
      </div>

      {/* Add task btn */}
      <div
        onClick={() => onAddTask(group.id)}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "9px 10px", color: "#4a4a7a", fontSize: 12, cursor: "pointer",
          borderRadius: 8, border: "1px dashed rgba(74,74,232,0.15)",
          margin: "4px 8px 8px", transition: "all 0.15s", fontFamily: "'Outfit',sans-serif",
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.color = "#a78bfa";
          el.style.borderColor = "rgba(167,139,250,0.35)";
          el.style.background = "rgba(167,139,250,0.05)";
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.color = "#4a4a7a";
          el.style.borderColor = "rgba(74,74,232,0.15)";
          el.style.background = "transparent";
        }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add task
      </div>
    </div>
  );
}

function IconBtn({ onClick, title, children }: { onClick: () => void; title?: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick} title={title}
      style={{
        width: 26, height: 26, borderRadius: 6, background: "transparent",
        border: "1px solid transparent", color: "#4a4a7a",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", transition: "all 0.15s",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.background = "#0f0f3a";
        el.style.borderColor = "rgba(74,74,232,0.15)";
        el.style.color = "#e8e8ff";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.background = "transparent";
        el.style.borderColor = "transparent";
        el.style.color = "#4a4a7a";
      }}
    >{children}</button>
  );
}

// ─── Modals ───────────────────────────────────────────────────────────────────
function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(5,5,16,0.85)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: "#0a0a2e", border: "1px solid rgba(74,74,232,0.3)",
        borderRadius: 16, width: 440, overflow: "hidden",
      }}>
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid rgba(74,74,232,0.15)" }}>
      <div style={{ fontSize: 15, fontWeight: 800, color: "#e8e8ff" }}>{title}</div>
      <button onClick={onClose} style={{ background: "none", border: "none", color: "#4a4a7a", cursor: "pointer", fontSize: 16, padding: "2px 6px", borderRadius: 5 }}>✕</button>
    </div>
  );
}

function ModalFooter({ onCancel, onConfirm, confirmLabel, danger }: {
  onCancel: () => void; onConfirm: () => void; confirmLabel: string; danger?: boolean;
}) {
  return (
    <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(74,74,232,0.15)", display: "flex", justifyContent: "flex-end", gap: 10 }}>
      <button onClick={onCancel} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 9, background: "#0f0f3a", color: "#8888bb", border: "1px solid rgba(74,74,232,0.15)", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>Cancel</button>
      <button onClick={onConfirm} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif", ...(danger ? { background: "rgba(251,113,133,0.15)", color: "#fb7185", border: "1px solid rgba(251,113,133,0.3)" } : { background: "#4a4ae8", color: "#fff", border: "none" }) }}>{confirmLabel}</button>
    </div>
  );
}

function OcInput({ id, placeholder, type = "text", min }: { id: string; placeholder?: string; type?: string; min?: string }) {
  return (
    <input
      id={id} type={type} placeholder={placeholder} min={min}
      style={{
        width: "100%", background: "#0f0f3a", border: "1px solid rgba(74,74,232,0.15)",
        borderRadius: 9, padding: "9px 12px", color: "#e8e8ff",
        fontFamily: "'Outfit',sans-serif", fontSize: 13, outline: "none",
      }}
      onFocus={e => (e.currentTarget.style.borderColor = "#4a4ae8")}
      onBlur={e => (e.currentTarget.style.borderColor = "rgba(74,74,232,0.15)")}
    />
  );
}

function InputLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 11, fontWeight: 700, color: "#8888bb", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>{children}</div>;
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
      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
        <div><InputLabel>Group Name</InputLabel><OcInput id="ng-name" placeholder="e.g. Web Development, OS Assignment..." /></div>
        <div>
          <InputLabel>Icon</InputLabel>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {EMOJIS.map(e => (
              <div key={e} onClick={() => setSelEmoji(e)} style={{
                width: 34, height: 34, borderRadius: 7, cursor: "pointer", fontSize: 16,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: selEmoji === e ? "rgba(74,74,232,0.15)" : "#0f0f3a",
                border: selEmoji === e ? "1px solid #4a4ae8" : "1px solid rgba(74,74,232,0.15)",
                transition: "all 0.15s",
              }}>{e}</div>
            ))}
          </div>
        </div>
        <div>
          <InputLabel>Color</InputLabel>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            {COLORS.map(c => (
              <div key={c} onClick={() => setSelColor(c)} style={{
                width: 26, height: 26, borderRadius: 6, background: c, cursor: "pointer",
                boxShadow: selColor === c ? "0 0 0 3px rgba(255,255,255,0.25)" : "none",
                transition: "all 0.15s",
              }} />
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
      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
        <div><InputLabel>Task name</InputLabel><OcInput id="nt-name" placeholder="What needs to be done?" /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div><InputLabel>Deadline (optional)</InputLabel><OcInput id="nt-dl" type="date" min="2026-05-30" /></div>
          <div>
            <InputLabel>Priority</InputLabel>
            <select id="nt-pri" style={{ width: "100%", background: "#0f0f3a", border: "1px solid rgba(74,74,232,0.15)", borderRadius: 9, padding: "9px 12px", color: "#e8e8ff", fontFamily: "'Outfit',sans-serif", fontSize: 13, outline: "none" }}>
              <option value="high">High</option>
              <option value="medium" defaultValue="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
        <div style={{ fontSize: 11, color: "#8888bb", padding: "9px 12px", background: "rgba(74,74,232,0.06)", border: "1px solid rgba(74,74,232,0.15)", borderRadius: 8, lineHeight: 1.5 }}>
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
      <div style={{ textAlign: "center", padding: "28px 24px" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
        <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 6, color: "#e8e8ff" }}>{title}</div>
        <div style={{ fontSize: 13, color: "#8888bb", lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: desc }} />
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 20 }}>
          <button onClick={onCancel} style={{ padding: "8px 16px", borderRadius: 9, background: "#0f0f3a", color: "#8888bb", border: "1px solid rgba(74,74,232,0.15)", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding: "8px 16px", borderRadius: 9, background: "rgba(251,113,133,0.15)", color: "#fb7185", border: "1px solid rgba(251,113,133,0.3)", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>{confirmLabel}</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Tasks() {
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
  const [modal, setModal] = useState<ModalState>({ type: "none" });

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
        .task-row { position: relative; }
        .task-del-btn { opacity: 0; transition: opacity 0.15s; }
        .task-row:hover .task-del-btn { opacity: 1; }
      `}</style>

      <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <Sidebar />
        <div className="flex flex-col flex-1 transition-all duration-300 ease-in-out" style={{ background: "#050510" }}>
          <LIHeader pageName="Tasks" pageDesc={`${groups.length} groups · ${doneCount}/${allTasks.length} tasks completed`} />

          {/* ── Scrollable content ── */}
          <div className="flex-1 overflow-y-auto p-6" style={{ color: "#e8e8ff" }}>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.025em" }}>Task Groups</h1>
                <p style={{ fontSize: 12, color: "#4a4a7a", marginTop: 4, fontFamily: "monospace" }}>
                  {groups.length} groups · {doneCount}/{allTasks.length} tasks completed
                </p>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 9,
                  background: "#0a0a2e", color: "#8888bb", border: "1px solid rgba(74,74,232,0.15)",
                  fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif",
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  AI Generate
                </button>
                <button
                  onClick={() => setModal({ type: "addGroup" })}
                  style={{
                    display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 9,
                    background: "#4a4ae8", color: "#fff", border: "none",
                    fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif",
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  New Group
                </button>
              </div>
            </div>

            {/* Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
              {groups.map(g => (
                <GroupCard
                  key={g.id} group={g}
                  onToggle={toggleTask}
                  onDeleteTask={(tid, gid) => setModal({ type: "deleteTask", taskId: tid, groupId: gid })}
                  onDeleteGroup={gid => setModal({ type: "deleteGroup", groupId: gid })}
                  onAddTask={gid => setModal({ type: "addTask", groupId: gid })}
                />
              ))}

              {/* Add group placeholder */}
              <div
                onClick={() => setModal({ type: "addGroup" })}
                style={{
                  background: "transparent", border: "1px dashed rgba(74,74,232,0.15)",
                  borderRadius: 14, minHeight: 160,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", opacity: 0.5, transition: "opacity 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.opacity = "1"}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.opacity = "0.5"}
              >
                <div style={{ textAlign: "center", color: "#4a4a7a" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>+</div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>Add New Group</div>
                  <div style={{ fontSize: 10, marginTop: 3 }}>Course, project, or topic</div>
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