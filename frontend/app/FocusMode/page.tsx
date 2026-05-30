"use client";

import Sidebar from "../components/Sidebar";
import LIHeader from "../components/LIHeader";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type TimerState = "idle" | "running" | "paused" | "checkin" | "ended";

interface Session {
  id: string;
  date: string;
  duration: number;
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

// ─── Dummy videos per playlist (swap with real YouTube Data API later) ────────
const DUMMY_VIDEOS: Record<string, YTVideo[]> = {
  pl1: [
    { videoId: "jfKfPfyJRdk", title: "lofi hip hop radio 📚 - beats to relax/study to", thumbnail: "https://i.ytimg.com/vi/jfKfPfyJRdk/mqdefault.jpg", duration: "LIVE" },
    { videoId: "5qap5aO4i9A", title: "lofi hip hop radio - beats to sleep/chill to", thumbnail: "https://i.ytimg.com/vi/5qap5aO4i9A/mqdefault.jpg", duration: "LIVE" },
    { videoId: "DWcJFNfaw9c", title: "coffee shop radio ☕ - beats to study/work to", thumbnail: "https://i.ytimg.com/vi/DWcJFNfaw9c/mqdefault.jpg", duration: "LIVE" },
    { videoId: "Na0w3Mz46GA", title: "rainy night lo-fi radio 🌧", thumbnail: "https://i.ytimg.com/vi/Na0w3Mz46GA/mqdefault.jpg", duration: "LIVE" },
  ],
  pl2: [
    { videoId: "dm4oGnnTUoI", title: "Study With Me — 2 Hour Pomodoro Session", thumbnail: "https://i.ytimg.com/vi/dm4oGnnTUoI/mqdefault.jpg", duration: "2:03:14" },
    { videoId: "rXV6PGM2nKE", title: "Study With Me — 4 Hour Deep Work", thumbnail: "https://i.ytimg.com/vi/rXV6PGM2nKE/mqdefault.jpg", duration: "4:11:20" },
    { videoId: "1lTOGMXYTCE", title: "Pomodoro Timer — 25/5 Study Session", thumbnail: "https://i.ytimg.com/vi/1lTOGMXYTCE/mqdefault.jpg", duration: "1:00:00" },
    { videoId: "hHL6scl9vUE", title: "3 Hour Session with Background Music", thumbnail: "https://i.ytimg.com/vi/hHL6scl9vUE/mqdefault.jpg", duration: "3:00:45" },
    { videoId: "t1TcKTHKMTg", title: "Study With Me — Morning Session", thumbnail: "https://i.ytimg.com/vi/t1TcKTHKMTg/mqdefault.jpg", duration: "1:32:00" },
    { videoId: "77ZozI0rw7w", title: "Night Study Session — Lo-Fi Beats", thumbnail: "https://i.ytimg.com/vi/77ZozI0rw7w/mqdefault.jpg", duration: "1:45:30" },
  ],
};

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const DUMMY_PLAYLISTS: Playlist[] = [
  { id: "pl1", playlistId: "PLbpi6ZahtOH6Ar_3GPy3vnR1LCRSrE0b5", name: "Lo-Fi Study Beats", thumbnail: "https://i.ytimg.com/vi/jfKfPfyJRdk/mqdefault.jpg", channelName: "Lofi Girl", videoCount: 4, url: "https://www.youtube.com/playlist?list=PLbpi6ZahtOH6Ar_3GPy3vnR1LCRSrE0b5" },
  { id: "pl2", playlistId: "PL6NdkXsPL07KN01gH2vucrHCEyyNmVEx4", name: "Study with Me — Pomodoro Sessions", thumbnail: "https://i.ytimg.com/vi/dm4oGnnTUoI/mqdefault.jpg", channelName: "Mike and Matty", videoCount: 6, url: "https://www.youtube.com/playlist?list=PL6NdkXsPL07KN01gH2vucrHCEyyNmVEx4" },
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
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.value = 520; osc.type = "sine";
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.8);
    setTimeout(() => {
      const osc2 = ctx.createOscillator(); const gain2 = ctx.createGain();
      osc2.connect(gain2); gain2.connect(ctx.destination);
      osc2.frequency.value = 660; osc2.type = "sine";
      gain2.gain.setValueAtTime(0.4, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc2.start(ctx.currentTime); osc2.stop(ctx.currentTime + 0.8);
    }, 400);
  } catch (_) {}
}

// ─── Circular Timer ───────────────────────────────────────────────────────────
function CircularTimer({ elapsed, interval, state }: { elapsed: number; interval: number; state: TimerState }) {
  const intervalSecs = interval * 60;
  const progress = intervalSecs > 0 ? (elapsed % intervalSecs) / intervalSecs : 0;
  const r = 110; const circ = 2 * Math.PI * r; const dash = circ * progress;
  const colorMap: Record<TimerState, string> = { idle: "#4a4a7a", running: "#4a4ae8", paused: "#fbbf24", checkin: "#fb7185", ended: "#34d399" };
  const color = colorMap[state] ?? "#4a4ae8";
  return (
    <svg width="264" height="264" viewBox="0 0 264 264" style={{ transform: "rotate(-90deg)" }}>
      <circle cx="132" cy="132" r={r} fill="none" stroke="rgba(74,74,232,0.1)" strokeWidth="8" />
      <circle cx="132" cy="132" r={r} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${dash} ${circ}`} style={{ transition: "stroke-dasharray 0.5s ease, stroke 0.4s ease" }} />
      {state === "running" && (
        <circle cx={132 + r * Math.cos(2 * Math.PI * progress - Math.PI / 2)} cy={132 + r * Math.sin(2 * Math.PI * progress - Math.PI / 2)} r="5" fill={color} style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
      )}
    </svg>
  );
}

// ─── Check-in Modal ───────────────────────────────────────────────────────────
function CheckInModal({ onStillHere, onBreak, countdown }: { onStillHere: () => void; onBreak: () => void; countdown: number }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(5,5,16,0.92)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
      <div style={{ background: "#0a0a2e", border: "1px solid rgba(74,74,232,0.35)", borderRadius: 20, padding: "36px 40px", textAlign: "center", maxWidth: 400, width: "90%", boxShadow: "0 0 60px rgba(74,74,232,0.15)" }}>
        <div style={{ fontSize: 44, marginBottom: 16 }}>🎯</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#e8e8ff", marginBottom: 8, letterSpacing: "-0.02em" }}>Focus Check-In</div>
        <div style={{ fontSize: 13, color: "#8888bb", lineHeight: 1.6, marginBottom: 28 }}>
          Are you still studying? Your timer will auto-pause in <span style={{ color: "#fb7185", fontWeight: 700, fontFamily: "monospace" }}>{countdown}s</span> if you don&apos;t respond.
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(251,113,133,0.15)" strokeWidth="5" />
            <circle cx="32" cy="32" r="26" fill="none" stroke="#fb7185" strokeWidth="5" strokeLinecap="round" strokeDasharray={`${(countdown / 30) * 163} 163`} style={{ transition: "stroke-dasharray 1s linear" }} />
          </svg>
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={onBreak} style={{ padding: "11px 22px", borderRadius: 10, background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.3)", color: "#fbbf24", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>☕ Take a break</button>
          <button onClick={onStillHere} style={{ padding: "11px 22px", borderRadius: 10, background: "#4a4ae8", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>✓ Still here!</button>
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
    <div style={{ position: "fixed", inset: 0, background: "rgba(5,5,16,0.92)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
      <div style={{ background: "#0a0a2e", border: "1px solid rgba(52,211,153,0.3)", borderRadius: 20, padding: "36px 40px", textAlign: "center", maxWidth: 400, width: "90%" }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>🏁</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#e8e8ff", marginBottom: 6 }}>Session Complete!</div>
        <div style={{ fontSize: 13, color: "#8888bb", marginBottom: 20, lineHeight: 1.6 }}>
          You studied for <span style={{ color: "#34d399", fontWeight: 700 }}>{formatDuration(session.duration ?? 0)}</span>
          {(session.pauses ?? 0) > 0 && <> · {session.pauses} pause{(session.pauses ?? 0) > 1 ? "s" : ""}</>}
        </div>
        <div style={{ fontSize: 12, color: "#4a4a7a", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 700 }}>Rate your productivity</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 28 }}>
          {[1,2,3,4,5].map(n => (
            <div key={n} onMouseEnter={() => setHovered(n)} onMouseLeave={() => setHovered(0)} onClick={() => setSelected(n)}
              style={{ fontSize: 28, cursor: "pointer", transition: "transform 0.15s", transform: (hovered >= n || selected >= n) ? "scale(1.2)" : "scale(1)", filter: (hovered >= n || selected >= n) ? "none" : "grayscale(1) opacity(0.4)" }}>⭐</div>
          ))}
        </div>
        <button onClick={() => selected > 0 && onRate(selected)} disabled={selected === 0}
          style={{ padding: "11px 32px", borderRadius: 10, background: selected > 0 ? "#4a4ae8" : "rgba(74,74,232,0.2)", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: selected > 0 ? "pointer" : "not-allowed", fontFamily: "'Outfit',sans-serif" }}>
          Save Session
        </button>
      </div>
    </div>
  );
}

// ─── Add Playlist Modal ───────────────────────────────────────────────────────
function AddPlaylistModal({ onClose, onAdd }: { onClose: () => void; onAdd: (url: string) => void }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleAdd = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    if (!trimmed.includes("youtube.com/playlist")) { setError("Please enter a valid YouTube playlist URL."); return; }
    setLoading(true); setError("");
    await new Promise(r => setTimeout(r, 900));
    setLoading(false); onAdd(trimmed);
  };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(5,5,16,0.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: "#0a0a2e", border: "1px solid rgba(74,74,232,0.3)", borderRadius: 18, width: 440, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid rgba(74,74,232,0.12)" }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#e8e8ff" }}>Add YouTube Playlist</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#4a4a7a", cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#8888bb", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Playlist URL</div>
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://www.youtube.com/playlist?list=..."
            style={{ width: "100%", background: "#0f0f3a", border: "1px solid rgba(74,74,232,0.2)", borderRadius: 9, padding: "10px 14px", color: "#e8e8ff", fontFamily: "'Outfit',sans-serif", fontSize: 13, outline: "none" }}
            onFocus={e => (e.currentTarget.style.borderColor = "rgba(74,74,232,0.5)")}
            onBlur={e => (e.currentTarget.style.borderColor = "rgba(74,74,232,0.2)")} />
          {error && <div style={{ fontSize: 11, color: "#fb7185", marginTop: 8 }}>⚠️ {error}</div>}
          <div style={{ fontSize: 11, color: "#4a4a7a", marginTop: 10, lineHeight: 1.5 }}>Paste any YouTube playlist link. Songs and videos will load via the YouTube API.</div>
        </div>
        <div style={{ padding: "12px 20px 20px", display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button onClick={onClose} style={{ padding: "9px 16px", borderRadius: 9, background: "#0f0f3a", border: "1px solid rgba(74,74,232,0.15)", color: "#8888bb", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>Cancel</button>
          <button onClick={handleAdd} disabled={loading || !url.trim()}
            style={{ padding: "9px 18px", borderRadius: 9, background: loading ? "rgba(74,74,232,0.3)" : "#4a4ae8", border: "none", color: "#fff", fontSize: 12, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Outfit',sans-serif", display: "flex", alignItems: "center", gap: 7 }}>
            {loading ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 1s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Loading...</> : "Add Playlist"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Playlist Panel (side-by-side video list + player) ────────────────────────
function PlaylistPanel({ playlist, onClose }: { playlist: Playlist; onClose: () => void }) {
  const videos = DUMMY_VIDEOS[playlist.id] ?? [];
  const [activeVideo, setActiveVideo] = useState<YTVideo>(videos[0]);

  return (
    <div style={{ background: "#0f0f3a", border: "1px solid rgba(74,74,232,0.25)", borderRadius: 14, overflow: "hidden", marginTop: 12 }}>
      {/* Panel header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderBottom: "1px solid rgba(74,74,232,0.12)", background: "#0a0a2e" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#fb7185"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8z"/><polygon points="9.5,15.5 15.5,12 9.5,8.5" fill="white"/></svg>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#e8e8ff", flex: 1 }}>{playlist.name}</span>
        <span style={{ fontSize: 10, color: "#4a4a7a", fontFamily: "monospace" }}>{videos.length} videos</span>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#4a4a7a", cursor: "pointer", fontSize: 14, padding: "0 4px", lineHeight: 1 }}
          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "#e8e8ff"}
          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = "#4a4a7a"}>✕</button>
      </div>

      {/* Side-by-side layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", height: 320 }}>

        {/* Left — YouTube player */}
        <div style={{ position: "relative", background: "#000" }}>
          <iframe
            key={activeVideo.videoId}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
            src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1&rel=0`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={activeVideo.title}
          />
        </div>

        {/* Right — Scrollable video list */}
        <div style={{ overflowY: "auto", borderLeft: "1px solid rgba(74,74,232,0.12)", background: "#0a0a2e" }}>
          {videos.map((v, i) => {
            const isActive = v.videoId === activeVideo.videoId;
            return (
              <div
                key={v.videoId}
                onClick={() => setActiveVideo(v)}
                style={{
                  display: "flex", flexDirection: "column", gap: 0,
                  padding: "8px 10px", cursor: "pointer",
                  background: isActive ? "rgba(74,74,232,0.15)" : "transparent",
                  borderBottom: "1px solid rgba(74,74,232,0.07)",
                  borderLeft: isActive ? "2px solid #4a4ae8" : "2px solid transparent",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = "rgba(74,74,232,0.07)"; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
              >
                {/* Thumbnail */}
                <div style={{ position: "relative", marginBottom: 7 }}>
                  <img src={v.thumbnail} alt={v.title} style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 6, display: "block" }} />
                  {/* Duration badge */}
                  <div style={{ position: "absolute", bottom: 4, right: 4, background: "rgba(0,0,0,0.8)", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 5px", borderRadius: 4, fontFamily: "monospace" }}>{v.duration}</div>
                  {/* Playing overlay */}
                  {isActive && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(74,74,232,0.35)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(74,74,232,0.9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                      </div>
                    </div>
                  )}
                </div>

                {/* Title + index */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                  <span style={{ fontSize: 10, color: "#4a4a7a", fontFamily: "monospace", flexShrink: 0, paddingTop: 1 }}>{String(i + 1).padStart(2, "0")}</span>
                  <div style={{ fontSize: 11, fontWeight: isActive ? 700 : 500, color: isActive ? "#a78bfa" : "#c4c4e8", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{v.title}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Playlist Card (compact row in the list) ──────────────────────────────────
function PlaylistCard({ pl, onSelect, onRemove, isExpanded }: { pl: Playlist; onSelect: () => void; onRemove: () => void; isExpanded: boolean }) {
  return (
    <div style={{ background: isExpanded ? "rgba(74,74,232,0.1)" : "#0a0a2e", border: `1px solid ${isExpanded ? "rgba(74,74,232,0.4)" : "rgba(74,74,232,0.15)"}`, borderRadius: 11, overflow: "hidden", transition: "all 0.2s", cursor: "pointer" }} onClick={onSelect}
      onMouseEnter={e => { if (!isExpanded) (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(74,74,232,0.3)"; }}
      onMouseLeave={e => { if (!isExpanded) (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(74,74,232,0.15)"; }}>
      <div style={{ display: "flex", gap: 12, padding: 10, alignItems: "center" }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <img src={pl.thumbnail} alt={pl.name} style={{ width: 68, height: 48, borderRadius: 7, objectFit: "cover", display: "block" }} />
          {isExpanded && <div style={{ position: "absolute", inset: 0, background: "rgba(74,74,232,0.5)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>▶</div>}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#e8e8ff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 3 }}>{pl.name}</div>
          <div style={{ fontSize: 10, color: "#4a4a7a", fontFamily: "monospace" }}>{pl.channelName} · {pl.videoCount} videos</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <span style={{ fontSize: 11, color: isExpanded ? "#a78bfa" : "#4a4a7a", fontFamily: "monospace", transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", display: "inline-block" }}>▾</span>
          <button onClick={e => { e.stopPropagation(); onRemove(); }}
            style={{ background: "none", border: "none", color: "#4a4a7a", cursor: "pointer", padding: "3px 5px", borderRadius: 5, transition: "all 0.15s", fontSize: 12 }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#fb7185"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(251,113,133,0.1)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#4a4a7a"; (e.currentTarget as HTMLButtonElement).style.background = "none"; }}>✕</button>
        </div>
      </div>
    </div>
  );
}

// ─── Session History Row ──────────────────────────────────────────────────────
function SessionRow({ session }: { session: Session }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", background: "#0a0a2e", border: "1px solid rgba(74,74,232,0.1)", borderRadius: 10, marginBottom: 8 }}>
      <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(74,74,232,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>⚡</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#e8e8ff" }}>{formatDuration(session.duration)} session</div>
        <div style={{ fontSize: 10, color: "#4a4a7a", marginTop: 2, fontFamily: "monospace" }}>{session.date} · {session.pauses} pause{session.pauses !== 1 ? "s" : ""} · {session.missedCheckins} missed</div>
      </div>
      <div style={{ display: "flex", gap: 2 }}>
        {[1,2,3,4,5].map(n => <span key={n} style={{ fontSize: 12, filter: n <= (session.rating ?? 0) ? "none" : "grayscale(1) opacity(0.25)" }}>⭐</span>)}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function FocusMode() {
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [intervalMin, setIntervalMin] = useState(30);
  const [pauseCount, setPauseCount] = useState(0);
  const [missedCheckins, setMissedCheckins] = useState(0);
  const [checkinCountdown, setCheckinCountdown] = useState(30);
  const [pendingSession, setPendingSession] = useState<Partial<Session> | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>(DUMMY_PLAYLISTS);
  const [expandedPlaylistId, setExpandedPlaylistId] = useState<string | null>(null);
  const [showAddPlaylist, setShowAddPlaylist] = useState(false);
  const [sessions, setSessions] = useState<Session[]>(DUMMY_SESSIONS);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const checkinRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (checkinRef.current) clearInterval(checkinRef.current);
  }, []);

  useEffect(() => {
    if (timerState === "running") {
      timerRef.current = setInterval(() => {
        setElapsed(prev => {
          const next = prev + 1;
          if (next > 0 && next % (intervalMin * 60) === 0) {
            playBeep(); setTimerState("checkin"); setCheckinCountdown(30);
          }
          return next;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerState, intervalMin]);

  useEffect(() => {
    if (timerState === "checkin") {
      checkinRef.current = setInterval(() => {
        setCheckinCountdown(prev => {
          if (prev <= 1) {
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

  const handleStart = () => { if (timerState === "idle") { setPauseCount(0); setMissedCheckins(0); setElapsed(0); } setTimerState("running"); };
  const handlePause = () => { setPauseCount(p => p + 1); setTimerState("paused"); };
  const handleEnd = () => { clearTimers(); setTimerState("ended"); setPendingSession({ duration: elapsed, pauses: pauseCount, missedCheckins }); };
  const handleReset = () => { clearTimers(); setTimerState("idle"); setElapsed(0); setPauseCount(0); setMissedCheckins(0); };
  const handleStillHere = () => { if (checkinRef.current) clearInterval(checkinRef.current); setTimerState("running"); };
  const handleBreak = () => { if (checkinRef.current) clearInterval(checkinRef.current); setPauseCount(p => p + 1); setTimerState("paused"); };
  const handleRate = (rating: number) => {
    if (!pendingSession) return;
    setSessions(prev => [{ id: genId(), date: `Today, ${new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`, duration: pendingSession.duration ?? 0, pauses: pendingSession.pauses ?? 0, missedCheckins: pendingSession.missedCheckins ?? 0, rating }, ...prev]);
    setPendingSession(null); handleReset();
  };
  const handleAddPlaylist = (url: string) => {
    const fake: Playlist = { id: genId(), playlistId: new URL(url).searchParams.get("list") ?? genId(), name: "New Playlist", thumbnail: "https://i.ytimg.com/vi/jfKfPfyJRdk/mqdefault.jpg", channelName: "YouTube", videoCount: 0, url };
    setPlaylists(prev => [...prev, fake]);
    setShowAddPlaylist(false);
  };

  const intervalOptions = [5, 10, 15, 20, 30, 45, 60];
  const nextCheckin = intervalMin * 60 - (elapsed % (intervalMin * 60));
  const stateColors: Record<TimerState, string> = { idle: "#4a4a7a", running: "#4a4ae8", paused: "#fbbf24", checkin: "#fb7185", ended: "#34d399" };
  const stateColor = stateColors[timerState];
  const expandedPlaylist = playlists.find(p => p.id === expandedPlaylistId) ?? null;

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
            <div style={{ position: "fixed", top: -200, left: "50%", transform: "translateX(-50%)", width: 800, height: 500, background: "radial-gradient(ellipse, rgba(74,74,232,0.09) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
            <div style={{ position: "relative", zIndex: 1 }}>

              <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.025em" }}>Focus Mode</h1>
                <p style={{ fontSize: 12, color: "#4a4a7a", marginTop: 4, fontFamily: "monospace" }}>{sessions.length} sessions logged · stay locked in</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

                {/* ── LEFT — Timer ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{ background: "#0a0a2e", border: `1px solid ${stateColor}33`, borderRadius: 18, padding: "28px 24px", display: "flex", flexDirection: "column", alignItems: "center", transition: "border-color 0.4s" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, background: `${stateColor}18`, border: `1px solid ${stateColor}44`, color: stateColor, fontFamily: "monospace", marginBottom: 24, letterSpacing: "0.06em", textTransform: "uppercase", ...(timerState === "running" ? { animation: "pulse 2s ease-in-out infinite" } : {}) }}>
                      {timerState === "idle" ? "Ready" : timerState === "running" ? "● Focused" : timerState === "paused" ? "⏸ Paused" : timerState === "checkin" ? "🎯 Check-in" : "✓ Complete"}
                    </div>
                    <div style={{ position: "relative", width: 264, height: 264, marginBottom: 8 }}>
                      <CircularTimer elapsed={elapsed} interval={intervalMin} state={timerState} />
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ fontSize: 44, fontWeight: 900, fontFamily: "'JetBrains Mono',monospace", letterSpacing: "-0.04em", color: "#e8e8ff" }}>{formatTime(elapsed)}</div>
                        {timerState === "running" && <div style={{ fontSize: 11, color: "#4a4a7a", marginTop: 6, fontFamily: "monospace" }}>next check-in {formatTime(nextCheckin)}</div>}
                        {timerState === "paused" && <div style={{ fontSize: 11, color: "#fbbf24", marginTop: 6 }}>paused · {pauseCount} pause{pauseCount !== 1 ? "s" : ""}</div>}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                      {timerState === "idle" && <button onClick={handleStart} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 32px", borderRadius: 12, background: "#4a4ae8", border: "none", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>Start Session</button>}
                      {timerState === "running" && (<>
                        <button onClick={handlePause} style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 22px", borderRadius: 11, background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.3)", color: "#fbbf24", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>Pause</button>
                        <button onClick={handleEnd} style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 22px", borderRadius: 11, background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)", color: "#34d399", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>End</button>
                      </>)}
                      {timerState === "paused" && (<>
                        <button onClick={handleStart} style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 22px", borderRadius: 11, background: "#4a4ae8", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>Resume</button>
                        <button onClick={handleEnd} style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 22px", borderRadius: 11, background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)", color: "#34d399", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>End</button>
                        <button onClick={handleReset} style={{ padding: "11px 16px", borderRadius: 11, background: "transparent", border: "1px solid rgba(74,74,232,0.15)", color: "#4a4a7a", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>Reset</button>
                      </>)}
                    </div>
                  </div>

                  {/* Interval */}
                  <div style={{ background: "#0a0a2e", border: "1px solid rgba(74,74,232,0.15)", borderRadius: 14, padding: "16px 20px" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#e8e8ff", marginBottom: 12 }}>⏱ Check-in Interval</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {intervalOptions.map(v => (
                        <button key={v} onClick={() => timerState === "idle" && setIntervalMin(v)} disabled={timerState !== "idle"}
                          style={{ padding: "6px 14px", borderRadius: 8, background: intervalMin === v ? "rgba(74,74,232,0.2)" : "#0f0f3a", border: `1px solid ${intervalMin === v ? "rgba(74,74,232,0.45)" : "rgba(74,74,232,0.12)"}`, color: intervalMin === v ? "#a78bfa" : "#4a4a7a", fontSize: 12, fontWeight: 700, cursor: timerState === "idle" ? "pointer" : "not-allowed", fontFamily: "monospace", transition: "all 0.15s" }}>{v}m</button>
                      ))}
                    </div>
                    <div style={{ fontSize: 11, color: "#4a4a7a", marginTop: 10, lineHeight: 1.5 }}>Check-in every {intervalMin} minutes. Can only be changed before starting.</div>
                  </div>

                  {/* Live stats */}
                  {timerState !== "idle" && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                      {[{ label: "Elapsed", value: formatDuration(elapsed), color: "#a78bfa" }, { label: "Pauses", value: String(pauseCount), color: "#fbbf24" }, { label: "Missed", value: String(missedCheckins), color: "#fb7185" }].map(s => (
                        <div key={s.label} style={{ background: "#0a0a2e", border: "1px solid rgba(74,74,232,0.12)", borderRadius: 11, padding: "12px 14px", textAlign: "center" }}>
                          <div style={{ fontSize: 18, fontWeight: 900, color: s.color, fontFamily: "monospace" }}>{s.value}</div>
                          <div style={{ fontSize: 10, color: "#4a4a7a", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── RIGHT — Playlists + History ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                  {/* Playlists */}
                  <div style={{ background: "#0a0a2e", border: "1px solid rgba(74,74,232,0.15)", borderRadius: 14, padding: "16px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "#e8e8ff" }}>🎵 Study Playlists</div>
                      <button onClick={() => setShowAddPlaylist(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 13px", borderRadius: 8, background: "rgba(74,74,232,0.12)", border: "1px solid rgba(74,74,232,0.25)", color: "#a78bfa", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Add Playlist
                      </button>
                    </div>

                    {playlists.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "24px 0", color: "#4a4a7a", fontSize: 12 }}>No playlists yet. Add a YouTube playlist to get started.</div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {playlists.map(pl => (
                          <div key={pl.id}>
                            <PlaylistCard
                              pl={pl}
                              isExpanded={expandedPlaylistId === pl.id}
                              onSelect={() => setExpandedPlaylistId(prev => prev === pl.id ? null : pl.id)}
                              onRemove={() => { setPlaylists(prev => prev.filter(p => p.id !== pl.id)); if (expandedPlaylistId === pl.id) setExpandedPlaylistId(null); }}
                            />
                            {expandedPlaylistId === pl.id && (
                              <PlaylistPanel playlist={pl} onClose={() => setExpandedPlaylistId(null)} />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Session history */}
                  <div style={{ background: "#0a0a2e", border: "1px solid rgba(74,74,232,0.15)", borderRadius: 14, padding: "16px 20px" }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#e8e8ff", marginBottom: 14 }}>📊 Session History</div>
                    {sessions.length === 0
                      ? <div style={{ textAlign: "center", padding: "20px 0", color: "#4a4a7a", fontSize: 12 }}>No sessions yet. Start your first one!</div>
                      : sessions.map(s => <SessionRow key={s.id} session={s} />)
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {timerState === "checkin" && <CheckInModal onStillHere={handleStillHere} onBreak={handleBreak} countdown={checkinCountdown} />}
      {pendingSession && <RatingModal session={pendingSession} onRate={handleRate} />}
      {showAddPlaylist && <AddPlaylistModal onClose={() => setShowAddPlaylist(false)} onAdd={handleAddPlaylist} />}
    </>
  );
}