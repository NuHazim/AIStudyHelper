"use client";

import Sidebar from "../components/Sidebar";
import LIHeader from "../components/LIHeader";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type TimerState = "idle" | "running" | "paused" | "checkin" | "ended";

interface Session {
  id: string;
  date: string;
  duration: number; // seconds
  pauses: number;
  missedCheckins: number;
  rating: number | null;
}

interface Playlist {
  id: string;
  playlistId: string;
  name: string;
  thumbnail: string;
  channelName: string;
  videoCount: number;
  url: string;
}

interface YTVideo {
  videoId: string;
  title: string;
  thumbnail: string;
  duration: string;
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const DUMMY_PLAYLISTS: Playlist[] = [
  {
    id: "pl1",
    playlistId: "PLbpi6ZahtOH6Ar_3GPy3vnR1LCRSrE0b5",
    name: "Lo-Fi Study Beats",
    thumbnail: "https://i.ytimg.com/vi/jfKfPfyJRdk/mqdefault.jpg",
    channelName: "Lofi Girl",
    videoCount: 1,
    url: "https://www.youtube.com/playlist?list=PLbpi6ZahtOH6Ar_3GPy3vnR1LCRSrE0b5",
  },
  {
    id: "pl2",
    playlistId: "PL6NdkXsPL07KN01gH2vucrHCEyyNmVEx4",
    name: "Study with Me — Pomodoro Sessions",
    thumbnail: "https://i.ytimg.com/vi/dm4oGnnTUoI/mqdefault.jpg",
    channelName: "Mike and Matty",
    videoCount: 24,
    url: "https://www.youtube.com/playlist?list=PL6NdkXsPL07KN01gH2vucrHCEyyNmVEx4",
  },
];

const DUMMY_SESSIONS: Session[] = [
  { id: "s1", date: "Today, 10:30 AM", duration: 5400, pauses: 1, missedCheckins: 0, rating: 5 },
  { id: "s2", date: "Yesterday, 8:00 PM", duration: 7200, pauses: 2, missedCheckins: 1, rating: 4 },
  { id: "s3", date: "28 May, 3:00 PM", duration: 3600, pauses: 0, missedCheckins: 0, rating: 5 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function genId() { return Math.random().toString(36).slice(2, 9); }

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function playBeep() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 520;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.8);
    setTimeout(() => {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.frequency.value = 660;
      osc2.type = "sine";
      gain2.gain.setValueAtTime(0.4, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc2.start(ctx.currentTime);
      osc2.stop(ctx.currentTime + 0.8);
    }, 400);
  } catch (_) {}
}

// ─── Circular Timer ───────────────────────────────────────────────────────────
function CircularTimer({ elapsed, interval, state }: { elapsed: number; interval: number; state: TimerState }) {
  const intervalSecs = interval * 60;
  const progress = intervalSecs > 0 ? (elapsed % intervalSecs) / intervalSecs : 0;
  const r = 110;
  const circ = 2 * Math.PI * r;
  const dash = circ * progress;

  const colorMap: Record<TimerState, string> = {
    idle: "#4a4a7a",
    running: "#4a4ae8",
    paused: "#fbbf24",
    checkin: "#fb7185",
    ended: "#34d399",
  };
  const color = colorMap[state] ?? "#4a4ae8";

  return (
    <svg width="264" height="264" viewBox="0 0 264 264" style={{ transform: "rotate(-90deg)" }}>
      {/* Track */}
      <circle cx="132" cy="132" r={r} fill="none" stroke="rgba(74,74,232,0.1)" strokeWidth="8" />
      {/* Progress */}
      <circle
        cx="132" cy="132" r={r} fill="none"
        stroke={color} strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        style={{ transition: "stroke-dasharray 0.5s ease, stroke 0.4s ease" }}
      />
      {/* Glow dots */}
      {state === "running" && (
        <circle
          cx={132 + r * Math.cos(2 * Math.PI * progress - Math.PI / 2)}
          cy={132 + r * Math.sin(2 * Math.PI * progress - Math.PI / 2)}
          r="5" fill={color}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      )}
    </svg>
  );
}

// ─── Check-in Modal ───────────────────────────────────────────────────────────
function CheckInModal({
  onStillHere, onBreak, countdown,
}: {
  onStillHere: () => void;
  onBreak: () => void;
  countdown: number;
}) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(5,5,16,0.92)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200,
    }}>
      <div style={{
        background: "#0a0a2e", border: "1px solid rgba(74,74,232,0.35)",
        borderRadius: 20, padding: "36px 40px", textAlign: "center",
        maxWidth: 400, width: "90%",
        boxShadow: "0 0 60px rgba(74,74,232,0.15)",
      }}>
        <div style={{ fontSize: 44, marginBottom: 16 }}>🎯</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#e8e8ff", marginBottom: 8, letterSpacing: "-0.02em" }}>
          Focus Check-In
        </div>
        <div style={{ fontSize: 13, color: "#8888bb", lineHeight: 1.6, marginBottom: 28 }}>
          Are you still studying? Your timer will auto-pause in{" "}
          <span style={{ color: "#fb7185", fontWeight: 700, fontFamily: "monospace" }}>{countdown}s</span>{" "}
          if you don&apos;t respond.
        </div>

        {/* Countdown ring */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(251,113,133,0.15)" strokeWidth="5" />
            <circle cx="32" cy="32" r="26" fill="none" stroke="#fb7185" strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={`${(countdown / 30) * 163} 163`}
              style={{ transition: "stroke-dasharray 1s linear" }}
            />
          </svg>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={onBreak} style={{
            padding: "11px 22px", borderRadius: 10,
            background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.3)",
            color: "#fbbf24", fontSize: 13, fontWeight: 700, cursor: "pointer",
            fontFamily: "'Outfit',sans-serif", transition: "all 0.2s",
          }}>☕ Take a break</button>
          <button onClick={onStillHere} style={{
            padding: "11px 22px", borderRadius: 10,
            background: "#4a4ae8", border: "none",
            color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
            fontFamily: "'Outfit',sans-serif", transition: "all 0.2s",
          }}>✓ Still here!</button>
        </div>
      </div>
    </div>
  );
}

// ─── Session Rating Modal ─────────────────────────────────────────────────────
function RatingModal({ session, onRate }: { session: Partial<Session>; onRate: (r: number) => void }) {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(5,5,16,0.92)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200,
    }}>
      <div style={{
        background: "#0a0a2e", border: "1px solid rgba(52,211,153,0.3)",
        borderRadius: 20, padding: "36px 40px", textAlign: "center", maxWidth: 400, width: "90%",
      }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>🏁</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#e8e8ff", marginBottom: 6 }}>Session Complete!</div>
        <div style={{ fontSize: 13, color: "#8888bb", marginBottom: 20, lineHeight: 1.6 }}>
          You studied for <span style={{ color: "#34d399", fontWeight: 700 }}>{formatDuration(session.duration ?? 0)}</span>
          {(session.pauses ?? 0) > 0 && <> · {session.pauses} pause{(session.pauses ?? 0) > 1 ? "s" : ""}</>}
        </div>
        <div style={{ fontSize: 12, color: "#4a4a7a", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 700 }}>Rate your productivity</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 28 }}>
          {[1, 2, 3, 4, 5].map(n => (
            <div
              key={n}
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setSelected(n)}
              style={{
                fontSize: 28, cursor: "pointer", transition: "transform 0.15s",
                transform: (hovered >= n || selected >= n) ? "scale(1.2)" : "scale(1)",
                filter: (hovered >= n || selected >= n) ? "none" : "grayscale(1) opacity(0.4)",
              }}
            >⭐</div>
          ))}
        </div>
        <button
          onClick={() => selected > 0 && onRate(selected)}
          disabled={selected === 0}
          style={{
            padding: "11px 32px", borderRadius: 10,
            background: selected > 0 ? "#4a4ae8" : "rgba(74,74,232,0.2)",
            border: "none", color: "#fff", fontSize: 13, fontWeight: 700,
            cursor: selected > 0 ? "pointer" : "not-allowed",
            fontFamily: "'Outfit',sans-serif", transition: "all 0.2s",
          }}
        >Save Session</button>
      </div>
    </div>
  );
}

// ─── Add Playlist Modal ───────────────────────────────────────────────────────
function AddPlaylistModal({ onClose, onAdd }: {
  onClose: () => void;
  onAdd: (url: string) => void;
}) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    if (!trimmed.includes("youtube.com/playlist") && !trimmed.includes("youtu.be")) {
      setError("Please enter a valid YouTube playlist URL.");
      return;
    }
    setLoading(true);
    setError("");
    // ── Replace with real YouTube API call ──────────────────────────────────
    // const listId = new URL(trimmed).searchParams.get("list");
    // const res = await fetch(`/api/youtube/playlist?id=${listId}`);
    // const data = await res.json();
    // onAdd(data);
    // ────────────────────────────────────────────────────────────────────────
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    onAdd(trimmed);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(5,5,16,0.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: "#0a0a2e", border: "1px solid rgba(74,74,232,0.3)", borderRadius: 18, width: 440, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid rgba(74,74,232,0.12)" }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#e8e8ff" }}>Add YouTube Playlist</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#4a4a7a", cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#8888bb", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Playlist URL</div>
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/playlist?list=..."
            style={{
              width: "100%", background: "#0f0f3a", border: "1px solid rgba(74,74,232,0.2)",
              borderRadius: 9, padding: "10px 14px", color: "#e8e8ff",
              fontFamily: "'Outfit',sans-serif", fontSize: 13, outline: "none",
            }}
            onFocus={e => (e.currentTarget.style.borderColor = "rgba(74,74,232,0.5)")}
            onBlur={e => (e.currentTarget.style.borderColor = "rgba(74,74,232,0.2)")}
          />
          {error && <div style={{ fontSize: 11, color: "#fb7185", marginTop: 8 }}>⚠️ {error}</div>}
          <div style={{ fontSize: 11, color: "#4a4a7a", marginTop: 10, lineHeight: 1.5 }}>
            Paste any YouTube playlist link. Songs and videos will load from the YouTube API.
          </div>
        </div>
        <div style={{ padding: "12px 20px 20px", display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button onClick={onClose} style={{ padding: "9px 16px", borderRadius: 9, background: "#0f0f3a", border: "1px solid rgba(74,74,232,0.15)", color: "#8888bb", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>Cancel</button>
          <button onClick={handleAdd} disabled={loading || !url.trim()} style={{
            padding: "9px 18px", borderRadius: 9, background: loading ? "rgba(74,74,232,0.3)" : "#4a4ae8",
            border: "none", color: "#fff", fontSize: 12, fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Outfit',sans-serif",
            display: "flex", alignItems: "center", gap: 7, transition: "all 0.2s",
          }}>
            {loading ? (
              <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 1s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Loading...</>
            ) : "Add Playlist"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Playlist Card ────────────────────────────────────────────────────────────
function PlaylistCard({ pl, onSelect, onRemove, isActive }: {
  pl: Playlist;
  onSelect: () => void;
  onRemove: () => void;
  isActive: boolean;
}) {
  return (
    <div style={{
      background: isActive ? "rgba(74,74,232,0.12)" : "#0a0a2e",
      border: `1px solid ${isActive ? "rgba(74,74,232,0.4)" : "rgba(74,74,232,0.15)"}`,
      borderRadius: 12, overflow: "hidden", transition: "all 0.2s", cursor: "pointer",
    }}
    onClick={onSelect}
    onMouseEnter={e => !isActive && ((e.currentTarget as HTMLDivElement).style.borderColor = "rgba(74,74,232,0.3)")}
    onMouseLeave={e => !isActive && ((e.currentTarget as HTMLDivElement).style.borderColor = "rgba(74,74,232,0.15)")}
    >
      <div style={{ display: "flex", gap: 12, padding: 12, alignItems: "center" }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <img src={pl.thumbnail} alt={pl.name} style={{ width: 72, height: 50, borderRadius: 7, objectFit: "cover", display: "block" }} />
          {isActive && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(74,74,232,0.5)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>▶</div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#e8e8ff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 3 }}>{pl.name}</div>
          <div style={{ fontSize: 10, color: "#4a4a7a", fontFamily: "monospace" }}>{pl.channelName} · {pl.videoCount} videos</div>
        </div>
        <button
          onClick={e => { e.stopPropagation(); onRemove(); }}
          style={{ background: "none", border: "none", color: "#4a4a7a", cursor: "pointer", padding: "4px 6px", borderRadius: 6, transition: "all 0.15s", fontSize: 13, flexShrink: 0 }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#fb7185"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(251,113,133,0.1)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#4a4a7a"; (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
        >✕</button>
      </div>
    </div>
  );
}

// ─── YouTube Embed Player ─────────────────────────────────────────────────────
function YouTubePlayer({ playlist }: { playlist: Playlist }) {
  return (
    <div style={{ background: "#0a0a2e", border: "1px solid rgba(74,74,232,0.15)", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(74,74,232,0.1)", display: "flex", alignItems: "center", gap: 8 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#fb7185"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8z"/><polygon points="9.5,15.5 15.5,12 9.5,8.5" fill="white"/></svg>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#e8e8ff" }}>{playlist.name}</span>
        <span style={{ fontSize: 10, color: "#4a4a7a", fontFamily: "monospace", marginLeft: "auto" }}>{playlist.videoCount} videos</span>
      </div>
      <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
        <iframe
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
          src={`https://www.youtube.com/embed/videoseries?list=${playlist.playlistId}&autoplay=0&rel=0`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={playlist.name}
        />
      </div>
    </div>
  );
}

// ─── Session History Row ──────────────────────────────────────────────────────
function SessionRow({ session }: { session: Session }) {
  const stars = session.rating ?? 0;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: "12px 16px", background: "#0a0a2e",
      border: "1px solid rgba(74,74,232,0.1)", borderRadius: 10, marginBottom: 8,
    }}>
      <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(74,74,232,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>⚡</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#e8e8ff" }}>{formatDuration(session.duration)} session</div>
        <div style={{ fontSize: 10, color: "#4a4a7a", marginTop: 2, fontFamily: "monospace" }}>
          {session.date} · {session.pauses} pause{session.pauses !== 1 ? "s" : ""} · {session.missedCheckins} missed check-in{session.missedCheckins !== 1 ? "s" : ""}
        </div>
      </div>
      <div style={{ display: "flex", gap: 2 }}>
        {[1,2,3,4,5].map(n => (
          <span key={n} style={{ fontSize: 12, filter: n <= stars ? "none" : "grayscale(1) opacity(0.25)" }}>⭐</span>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function FocusMode() {
  // Timer state
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [interval, setIntervalMin] = useState(30);
  const [pauseCount, setPauseCount] = useState(0);
  const [missedCheckins, setMissedCheckins] = useState(0);
  const [checkinCountdown, setCheckinCountdown] = useState(30);
  const [pendingSession, setPendingSession] = useState<Partial<Session> | null>(null);

  // Playlist state
  const [playlists, setPlaylists] = useState<Playlist[]>(DUMMY_PLAYLISTS);
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);
  const [showAddPlaylist, setShowAddPlaylist] = useState(false);

  // Sessions
  const [sessions, setSessions] = useState<Session[]>(DUMMY_SESSIONS);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const checkinRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (checkinRef.current) clearInterval(checkinRef.current);
  }, []);

  // Main timer tick
  useEffect(() => {
    if (timerState === "running") {
      timerRef.current = setInterval(() => {
        setElapsed(prev => {
          const next = prev + 1;
          // Trigger check-in at interval
          if (next > 0 && next % (interval * 60) === 0) {
            playBeep();
            setTimerState("checkin");
            setCheckinCountdown(30);
          }
          return next;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerState, interval]);

  // Check-in countdown
  useEffect(() => {
    if (timerState === "checkin") {
      checkinRef.current = setInterval(() => {
        setCheckinCountdown(prev => {
          if (prev <= 1) {
            // Missed check-in — auto pause
            setMissedCheckins(m => m + 1);
            setTimerState("paused");
            clearInterval(checkinRef.current!);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (checkinRef.current) clearInterval(checkinRef.current); };
  }, [timerState]);

  const handleStart = () => {
    if (timerState === "idle") {
      startTimeRef.current = Date.now();
      setPauseCount(0);
      setMissedCheckins(0);
      setElapsed(0);
    }
    setTimerState("running");
  };

  const handlePause = () => {
    setPauseCount(p => p + 1);
    setTimerState("paused");
  };

  const handleEnd = () => {
    clearTimers();
    setTimerState("ended");
    setPendingSession({ duration: elapsed, pauses: pauseCount, missedCheckins });
  };

  const handleReset = () => {
    clearTimers();
    setTimerState("idle");
    setElapsed(0);
    setPauseCount(0);
    setMissedCheckins(0);
  };

  const handleStillHere = () => {
    if (checkinRef.current) clearInterval(checkinRef.current);
    setTimerState("running");
  };

  const handleBreak = () => {
    if (checkinRef.current) clearInterval(checkinRef.current);
    setPauseCount(p => p + 1);
    setTimerState("paused");
  };

  const handleRate = (rating: number) => {
    if (!pendingSession) return;
    const newSession: Session = {
      id: genId(),
      date: `Today, ${new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`,
      duration: pendingSession.duration ?? 0,
      pauses: pendingSession.pauses ?? 0,
      missedCheckins: pendingSession.missedCheckins ?? 0,
      rating,
    };
    setSessions(prev => [newSession, ...prev]);
    setPendingSession(null);
    handleReset();
  };

  const handleAddPlaylist = (url: string) => {
    // In real app, fetch from YouTube API and get real data
    const fake: Playlist = {
      id: genId(),
      playlistId: new URL(url).searchParams.get("list") ?? genId(),
      name: "New Playlist",
      thumbnail: "https://i.ytimg.com/vi/jfKfPfyJRdk/mqdefault.jpg",
      channelName: "YouTube",
      videoCount: 0,
      url,
    };
    setPlaylists(prev => [...prev, fake]);
    setShowAddPlaylist(false);
  };

  const intervalOptions = [5, 10, 15, 20, 30, 45, 60];
  const nextCheckin = interval * 60 - (elapsed % (interval * 60));

  const stateColors: Record<TimerState, string> = {
    idle: "#4a4a7a", running: "#4a4ae8", paused: "#fbbf24", checkin: "#fb7185", ended: "#34d399",
  };
  const stateColor = stateColors[timerState];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600&display=swap');
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(74,74,232,0.2); border-radius: 2px; }
      `}</style>

      <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <Sidebar />
        <div className="flex flex-col flex-1 transition-all duration-300 ease-in-out" style={{ background: "#050510" }}>
          <LIHeader pageName="Focus Mode" pageDesc="Track your study sessions" />

          <div className="flex-1 overflow-y-auto" style={{ padding: 24, color: "#e8e8ff" }}>

            {/* Background glow */}
            <div style={{ position: "fixed", top: -200, left: "50%", transform: "translateX(-50%)", width: 800, height: 500, background: "radial-gradient(ellipse, rgba(74,74,232,0.09) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

            <div style={{ position: "relative", zIndex: 1 }}>

              {/* Page header */}
              <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.025em" }}>Focus Mode</h1>
                <p style={{ fontSize: 12, color: "#4a4a7a", marginTop: 4, fontFamily: "monospace" }}>
                  {sessions.length} sessions logged · stay locked in
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

                {/* ── LEFT COLUMN ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                  {/* Timer card */}
                  <div style={{ background: "#0a0a2e", border: `1px solid ${stateColor}33`, borderRadius: 18, padding: "28px 24px", display: "flex", flexDirection: "column", alignItems: "center", transition: "border-color 0.4s" }}>

                    {/* State badge */}
                    <div style={{
                      fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20,
                      background: `${stateColor}18`, border: `1px solid ${stateColor}44`,
                      color: stateColor, fontFamily: "monospace", marginBottom: 24, letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      ...(timerState === "running" ? { animation: "pulse 2s ease-in-out infinite" } : {}),
                    }}>
                      {timerState === "idle" ? "Ready" : timerState === "running" ? "● Focused" : timerState === "paused" ? "⏸ Paused" : timerState === "checkin" ? "🎯 Check-in" : "✓ Complete"}
                    </div>

                    {/* Circular timer */}
                    <div style={{ position: "relative", width: 264, height: 264, marginBottom: 8 }}>
                      <CircularTimer elapsed={elapsed} interval={interval} state={timerState} />
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ fontSize: 44, fontWeight: 900, fontFamily: "'JetBrains Mono',monospace", letterSpacing: "-0.04em", color: "#e8e8ff" }}>
                          {formatTime(elapsed)}
                        </div>
                        {timerState === "running" && (
                          <div style={{ fontSize: 11, color: "#4a4a7a", marginTop: 6, fontFamily: "monospace" }}>
                            next check-in {formatTime(nextCheckin)}
                          </div>
                        )}
                        {timerState === "paused" && (
                          <div style={{ fontSize: 11, color: "#fbbf24", marginTop: 6 }}>paused · {pauseCount} pause{pauseCount !== 1 ? "s" : ""}</div>
                        )}
                      </div>
                    </div>

                    {/* Controls */}
                    <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                      {timerState === "idle" && (
                        <button onClick={handleStart} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 32px", borderRadius: 12, background: "#4a4ae8", border: "none", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Outfit',sans-serif", transition: "all 0.2s" }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                          Start Session
                        </button>
                      )}
                      {timerState === "running" && (<>
                        <button onClick={handlePause} style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 22px", borderRadius: 11, background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.3)", color: "#fbbf24", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                          Pause
                        </button>
                        <button onClick={handleEnd} style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 22px", borderRadius: 11, background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)", color: "#34d399", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                          End
                        </button>
                      </>)}
                      {timerState === "paused" && (<>
                        <button onClick={handleStart} style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 22px", borderRadius: 11, background: "#4a4ae8", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                          Resume
                        </button>
                        <button onClick={handleEnd} style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 22px", borderRadius: 11, background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)", color: "#34d399", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                          End
                        </button>
                        <button onClick={handleReset} style={{ padding: "11px 16px", borderRadius: 11, background: "transparent", border: "1px solid rgba(74,74,232,0.15)", color: "#4a4a7a", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>Reset</button>
                      </>)}
                    </div>
                  </div>

                  {/* Interval settings */}
                  <div style={{ background: "#0a0a2e", border: "1px solid rgba(74,74,232,0.15)", borderRadius: 14, padding: "16px 20px" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#e8e8ff", marginBottom: 12 }}>⏱ Check-in Interval</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {intervalOptions.map(v => (
                        <button
                          key={v}
                          onClick={() => timerState === "idle" && setIntervalMin(v)}
                          disabled={timerState !== "idle"}
                          style={{
                            padding: "6px 14px", borderRadius: 8,
                            background: interval === v ? "rgba(74,74,232,0.2)" : "#0f0f3a",
                            border: `1px solid ${interval === v ? "rgba(74,74,232,0.45)" : "rgba(74,74,232,0.12)"}`,
                            color: interval === v ? "#a78bfa" : "#4a4a7a",
                            fontSize: 12, fontWeight: 700, cursor: timerState === "idle" ? "pointer" : "not-allowed",
                            fontFamily: "monospace", transition: "all 0.15s",
                          }}
                        >{v}m</button>
                      ))}
                    </div>
                    <div style={{ fontSize: 11, color: "#4a4a7a", marginTop: 10, lineHeight: 1.5 }}>
                      You&apos;ll get a check-in notification every {interval} minutes. Can only be changed before starting.
                    </div>
                  </div>

                  {/* Session stats (current) */}
                  {timerState !== "idle" && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                      {[
                        { label: "Elapsed", value: formatDuration(elapsed), color: "#a78bfa" },
                        { label: "Pauses", value: String(pauseCount), color: "#fbbf24" },
                        { label: "Missed", value: String(missedCheckins), color: "#fb7185" },
                      ].map(s => (
                        <div key={s.label} style={{ background: "#0a0a2e", border: "1px solid rgba(74,74,232,0.12)", borderRadius: 11, padding: "12px 14px", textAlign: "center" }}>
                          <div style={{ fontSize: 18, fontWeight: 900, color: s.color, fontFamily: "monospace" }}>{s.value}</div>
                          <div style={{ fontSize: 10, color: "#4a4a7a", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── RIGHT COLUMN ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                  {/* Study Playlist */}
                  <div style={{ background: "#0a0a2e", border: "1px solid rgba(74,74,232,0.15)", borderRadius: 14, padding: "16px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "#e8e8ff" }}>🎵 Study Playlists</div>
                      <button
                        onClick={() => setShowAddPlaylist(true)}
                        style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 13px", borderRadius: 8, background: "rgba(74,74,232,0.12)", border: "1px solid rgba(74,74,232,0.25)", color: "#a78bfa", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif", transition: "all 0.2s" }}
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Add Playlist
                      </button>
                    </div>

                    {playlists.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "24px 0", color: "#4a4a7a", fontSize: 12 }}>
                        No playlists added yet. Add a YouTube playlist to get started.
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
                        {playlists.map(pl => (
                          <PlaylistCard
                            key={pl.id} pl={pl}
                            isActive={activePlaylist?.id === pl.id}
                            onSelect={() => setActivePlaylist(prev => prev?.id === pl.id ? null : pl)}
                            onRemove={() => {
                              setPlaylists(prev => prev.filter(p => p.id !== pl.id));
                              if (activePlaylist?.id === pl.id) setActivePlaylist(null);
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {/* Embedded player */}
                    {activePlaylist && <YouTubePlayer playlist={activePlaylist} />}
                  </div>

                  {/* Session history */}
                  <div style={{ background: "#0a0a2e", border: "1px solid rgba(74,74,232,0.15)", borderRadius: 14, padding: "16px 20px" }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#e8e8ff", marginBottom: 14 }}>📊 Session History</div>
                    {sessions.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "20px 0", color: "#4a4a7a", fontSize: 12 }}>No sessions yet. Start your first one!</div>
                    ) : (
                      sessions.map(s => <SessionRow key={s.id} session={s} />)
                    )}
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {timerState === "checkin" && (
        <CheckInModal onStillHere={handleStillHere} onBreak={handleBreak} countdown={checkinCountdown} />
      )}
      {pendingSession && (
        <RatingModal session={pendingSession} onRate={handleRate} />
      )}
      {showAddPlaylist && (
        <AddPlaylistModal onClose={() => setShowAddPlaylist(false)} onAdd={handleAddPlaylist} />
      )}
    </>
  );
}