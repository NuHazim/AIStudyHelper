"use client";

import Sidebar from "../components/Sidebar";
import LIHeader from "../components/LIHeader";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface SettingsState {
  username: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  focusDetection: boolean;
  focusCheckInterval: number;
  notificationsEnabled: boolean;
  streakReminder: boolean;
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

// ─── Toggle Switch ────────────────────────────────────────────────────────────
function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <div
      onClick={() => onChange(!enabled)}
      style={{
        width: 44, height: 24, borderRadius: 12, cursor: "pointer",
        background: enabled ? "#4a4ae8" : "#141448",
        border: `1px solid ${enabled ? "#6b6bf0" : "rgba(74,74,232,0.2)"}`,
        position: "relative", transition: "all 0.25s", flexShrink: 0,
      }}
    >
      <div style={{
        position: "absolute", top: 3,
        left: enabled ? 22 : 3,
        width: 16, height: 16, borderRadius: "50%",
        background: enabled ? "#fff" : "#4a4a7a",
        transition: "all 0.25s",
      }} />
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "#0a0a2e", border: "1px solid rgba(74,74,232,0.15)",
      borderRadius: 14, overflow: "hidden", marginBottom: 20,
    }}>
      {/* Section header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "14px 20px", borderBottom: "1px solid rgba(74,74,232,0.1)",
      }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{ fontSize: 13, fontWeight: 800, color: "#e8e8ff", letterSpacing: "-0.01em" }}>{title}</span>
      </div>
      <div style={{ padding: "6px 0" }}>
        {children}
      </div>
    </div>
  );
}

// ─── Setting row (toggle style) ───────────────────────────────────────────────
function SettingRow({
  label, desc, children,
}: {
  label: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 16, padding: "14px 20px",
      borderBottom: "1px solid rgba(74,74,232,0.06)",
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#e8e8ff" }}>{label}</div>
        {desc && <div style={{ fontSize: 11, color: "#4a4a7a", marginTop: 3, lineHeight: 1.4 }}>{desc}</div>}
      </div>
      {children}
    </div>
  );
}

// ─── Input field ─────────────────────────────────────────────────────────────
function OcInput({
  id, type = "text", value, onChange, placeholder,
}: {
  id?: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      id={id} type={type} value={value} placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%", background: "#0f0f3a",
        border: `1px solid ${focused ? "rgba(74,74,232,0.5)" : "rgba(74,74,232,0.15)"}`,
        borderRadius: 9, padding: "9px 12px", color: "#e8e8ff",
        fontFamily: "'Outfit', sans-serif", fontSize: 13, outline: "none",
        transition: "border-color 0.2s",
      }}
    />
  );
}

// ─── Label ────────────────────────────────────────────────────────────────────
function InputLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, color: "#8888bb",
      textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6,
    }}>{children}</div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ status }: { status: SaveStatus }) {
  if (status === "idle") return null;

  const map = {
    saving: { bg: "rgba(74,74,232,0.15)", border: "rgba(74,74,232,0.3)", color: "#a78bfa", icon: "⏳", text: "Saving changes..." },
    saved:  { bg: "rgba(52,211,153,0.12)", border: "rgba(52,211,153,0.3)", color: "#34d399", icon: "✓", text: "Settings saved!" },
    error:  { bg: "rgba(251,113,133,0.12)", border: "rgba(251,113,133,0.3)", color: "#fb7185", icon: "✕", text: "Something went wrong." },
  };
  const s = map[status];

  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 50,
      display: "flex", alignItems: "center", gap: 10,
      padding: "12px 18px", borderRadius: 12,
      background: s.bg, border: `1px solid ${s.border}`,
      color: s.color, fontSize: 13, fontWeight: 600,
      fontFamily: "'Outfit', sans-serif",
      animation: "slideUp 0.3s ease",
    }}>
      <span>{s.icon}</span>
      {s.text}
    </div>
  );
}

// ─── Interval Slider ──────────────────────────────────────────────────────────
function IntervalSlider({ value, onChange, disabled }: { value: number; onChange: (v: number) => void; disabled: boolean }) {
  const steps = [5, 10, 15, 20, 30, 45, 60];
  const idx = steps.indexOf(value) === -1 ? 4 : steps.indexOf(value);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <input
        type="range" min={0} max={steps.length - 1} step={1}
        value={idx}
        disabled={disabled}
        onChange={e => onChange(steps[parseInt(e.target.value)])}
        style={{ width: 120, accentColor: "#4a4ae8", opacity: disabled ? 0.35 : 1, cursor: disabled ? "not-allowed" : "pointer" }}
      />
      <div style={{
        minWidth: 52, padding: "4px 10px", borderRadius: 8, textAlign: "center",
        background: disabled ? "#0f0f3a" : "rgba(74,74,232,0.15)",
        border: `1px solid ${disabled ? "rgba(74,74,232,0.08)" : "rgba(74,74,232,0.3)"}`,
        fontSize: 12, fontWeight: 700, fontFamily: "monospace",
        color: disabled ? "#4a4a7a" : "#a78bfa",
        transition: "all 0.2s",
      }}>
        {value}m
      </div>
    </div>
  );
}

// ─── Danger zone confirm ──────────────────────────────────────────────────────
function DangerConfirm({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(5,5,16,0.88)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
    }}
    onClick={e => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div style={{
        background: "#0a0a2e", border: "1px solid rgba(251,113,133,0.3)",
        borderRadius: 16, width: 420, padding: 28, textAlign: "center",
      }}>
        <div style={{ fontSize: 36, marginBottom: 14 }}>⚠️</div>
        <div style={{ fontSize: 16, fontWeight: 800, color: "#e8e8ff", marginBottom: 8 }}>Delete Account</div>
        <div style={{ fontSize: 13, color: "#8888bb", lineHeight: 1.6, marginBottom: 24 }}>
          This will permanently delete your account and all data — tasks, sessions, notes, playlists. This cannot be undone.
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={onCancel} style={{
            padding: "9px 18px", borderRadius: 9, background: "#0f0f3a",
            border: "1px solid rgba(74,74,232,0.15)", color: "#8888bb",
            fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif",
          }}>Cancel</button>
          <button onClick={onConfirm} style={{
            padding: "9px 18px", borderRadius: 9,
            background: "rgba(251,113,133,0.15)", border: "1px solid rgba(251,113,133,0.35)",
            color: "#fb7185", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif",
          }}>Yes, delete my account</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Settings() {
  const [settings, setSettings] = useState<SettingsState>({
    username: "Nufail",
    email: "nufail@gmail.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    focusDetection: true,
    focusCheckInterval: 30,
    notificationsEnabled: true,
    streakReminder: true,
  });

  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const set = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) =>
    setSettings(prev => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    // Password validation
    if (settings.newPassword) {
      if (!settings.currentPassword) {
        setPasswordError("Please enter your current password.");
        return;
      }
      if (settings.newPassword.length < 8) {
        setPasswordError("New password must be at least 8 characters.");
        return;
      }
      if (settings.newPassword !== settings.confirmPassword) {
        setPasswordError("New passwords do not match.");
        return;
      }
    }
    setPasswordError("");
    setSaveStatus("saving");

    // ── Replace with real API call ──────────────────────────────────────────
    // await fetch("/api/user/settings", {
    //   method: "PATCH",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(settings),
    // });
    // ────────────────────────────────────────────────────────────────────────

    await new Promise(r => setTimeout(r, 900));
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2500);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .save-btn:hover:not(:disabled) { background: #6b6bf0 !important; transform: translateY(-1px); }
        .save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .danger-btn:hover { background: rgba(251,113,133,0.2) !important; border-color: rgba(251,113,133,0.5) !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(74,74,232,0.2); border-radius: 2px; }
      `}</style>

      <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <Sidebar />
        <div className="flex flex-col flex-1 transition-all duration-300 ease-in-out" style={{ background: "#050510" }}>
          <LIHeader pageName="Settings" pageDesc="Manage your account and preferences" />

          {/* ── Scrollable content ── */}
          <div className="flex-1 overflow-y-auto" style={{ padding: 24, color: "#e8e8ff", position: "relative" }}>

            {/* Background glow */}
            <div style={{
              position: "fixed", top: -200, left: "50%", transform: "translateX(-50%)",
              width: 700, height: 400,
              background: "radial-gradient(ellipse, rgba(74,74,232,0.07) 0%, transparent 70%)",
              pointerEvents: "none", zIndex: 0,
            }} />

            <div style={{ maxWidth: 680, margin: "0 auto", position: "relative", zIndex: 1 }}>

              {/* ── Page header ── */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
                <div>
                  <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.025em" }}>Settings</h1>
                  <p style={{ fontSize: 12, color: "#4a4a7a", marginTop: 4, fontFamily: "monospace" }}>
                    Manage your account and preferences
                  </p>
                </div>
                <button
                  className="save-btn"
                  onClick={handleSave}
                  disabled={saveStatus === "saving"}
                  style={{
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "10px 20px", borderRadius: 10,
                    background: "#4a4ae8", border: "none", color: "#fff",
                    fontSize: 13, fontWeight: 700, cursor: "pointer",
                    fontFamily: "'Outfit', sans-serif", transition: "all 0.2s",
                  }}
                >
                  {saveStatus === "saving" ? (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 1s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      Save Changes
                    </>
                  )}
                </button>
              </div>

              {/* ── Profile ── */}
              <Section title="Profile" icon="👤">
                {/* Avatar row */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px 14px", borderBottom: "1px solid rgba(74,74,232,0.06)" }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: "50%",
                    background: "linear-gradient(135deg, #4a4ae8, #a78bfa)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20, fontWeight: 800, color: "#fff", flexShrink: 0,
                  }}>
                    {settings.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#e8e8ff" }}>{settings.username}</div>
                    <div style={{ fontSize: 12, color: "#4a4a7a", marginTop: 2, fontFamily: "monospace" }}>{settings.email}</div>
                    <div style={{ fontSize: 11, marginTop: 4 }}>
                      <span style={{ background: "rgba(74,74,232,0.15)", border: "1px solid rgba(74,74,232,0.25)", color: "#a78bfa", padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700 }}>
                        ⚡ Level 12
                      </span>
                    </div>
                  </div>
                </div>

                {/* Username */}
                <div style={{ padding: "16px 20px 14px", borderBottom: "1px solid rgba(74,74,232,0.06)" }}>
                  <InputLabel>Username</InputLabel>
                  <OcInput value={settings.username} onChange={v => set("username", v)} placeholder="Your username" />
                </div>

                {/* Email */}
                <div style={{ padding: "16px 20px 14px" }}>
                  <InputLabel>Email Address</InputLabel>
                  <OcInput type="email" value={settings.email} onChange={v => set("email", v)} placeholder="your@email.com" />
                </div>
              </Section>

              {/* ── Password ── */}
              <Section title="Change Password" icon="🔒">
                <div style={{ padding: "16px 20px 14px", borderBottom: "1px solid rgba(74,74,232,0.06)" }}>
                  <InputLabel>Current Password</InputLabel>
                  <OcInput type="password" value={settings.currentPassword} onChange={v => set("currentPassword", v)} placeholder="Enter current password" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, padding: "16px 20px 14px" }}>
                  <div>
                    <InputLabel>New Password</InputLabel>
                    <OcInput type="password" value={settings.newPassword} onChange={v => set("newPassword", v)} placeholder="Min. 8 characters" />
                  </div>
                  <div>
                    <InputLabel>Confirm New Password</InputLabel>
                    <OcInput type="password" value={settings.confirmPassword} onChange={v => set("confirmPassword", v)} placeholder="Repeat new password" />
                  </div>
                </div>
                {passwordError && (
                  <div style={{ margin: "0 20px 14px", padding: "9px 12px", borderRadius: 8, background: "rgba(251,113,133,0.1)", border: "1px solid rgba(251,113,133,0.25)", fontSize: 12, color: "#fb7185" }}>
                    ⚠️ {passwordError}
                  </div>
                )}
                <div style={{ padding: "0 20px 14px" }}>
                  <div style={{ fontSize: 11, color: "#4a4a7a", lineHeight: 1.5 }}>
                    Leave the password fields blank if you don&apos;t want to change it.
                  </div>
                </div>
              </Section>

              {/* ── Focus Detection ── */}
              <Section title="Focus Detection" icon="🎯">
                <SettingRow
                  label="Enable Focus Detection"
                  desc="Automatically detects when you lose focus during study sessions and prompts you to return."
                >
                  <Toggle enabled={settings.focusDetection} onChange={v => set("focusDetection", v)} />
                </SettingRow>

                <SettingRow
                  label="Check-in Interval"
                  desc={settings.focusDetection
                    ? `You'll be checked on every ${settings.focusCheckInterval} minutes during a focus session.`
                    : "Enable focus detection to configure the interval."}
                >
                  <IntervalSlider
                    value={settings.focusCheckInterval}
                    onChange={v => set("focusCheckInterval", v)}
                    disabled={!settings.focusDetection}
                  />
                </SettingRow>

                {/* Info box */}
                <div style={{ margin: "4px 20px 14px", padding: "10px 14px", borderRadius: 9, background: "rgba(74,74,232,0.06)", border: "1px solid rgba(74,74,232,0.12)", fontSize: 11, color: "#8888bb", lineHeight: 1.6 }}>
                  💡 Shorter intervals keep you more accountable but can feel interruptive. 30 minutes is a good starting point.
                </div>
              </Section>

              {/* ── Notifications ── */}
              <Section title="Notifications" icon="🔔">
                <SettingRow
                  label="Enable Notifications"
                  desc="Receive browser notifications for reminders, deadlines, and focus check-ins."
                >
                  <Toggle enabled={settings.notificationsEnabled} onChange={v => set("notificationsEnabled", v)} />
                </SettingRow>

                <SettingRow
                  label="Streak Reminder"
                  desc="Get a daily reminder to study so you don't lose your streak. Sent at 8PM."
                >
                  <Toggle
                    enabled={settings.streakReminder && settings.notificationsEnabled}
                    onChange={v => set("streakReminder", v)}
                  />
                </SettingRow>

                {!settings.notificationsEnabled && (
                  <div style={{ margin: "4px 20px 14px", padding: "10px 14px", borderRadius: 9, background: "rgba(251,191,36,0.07)", border: "1px solid rgba(251,191,36,0.18)", fontSize: 11, color: "#fbbf24", lineHeight: 1.6 }}>
                    ⚠️ Notifications are disabled. Streak reminders won&apos;t fire until you turn them back on.
                  </div>
                )}
              </Section>

              {/* ── Danger Zone ── */}
              <div style={{
                background: "rgba(251,113,133,0.05)", border: "1px solid rgba(251,113,133,0.2)",
                borderRadius: 14, overflow: "hidden", marginBottom: 32,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", borderBottom: "1px solid rgba(251,113,133,0.12)" }}>
                  <span style={{ fontSize: 16 }}>⚠️</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#fb7185" }}>Danger Zone</span>
                </div>
                <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#e8e8ff" }}>Delete Account</div>
                    <div style={{ fontSize: 11, color: "#4a4a7a", marginTop: 3 }}>Permanently delete your account and all associated data. This cannot be undone.</div>
                  </div>
                  <button
                    className="danger-btn"
                    onClick={() => setShowDeleteConfirm(true)}
                    style={{
                      padding: "9px 16px", borderRadius: 9, flexShrink: 0,
                      background: "rgba(251,113,133,0.1)", border: "1px solid rgba(251,113,133,0.3)",
                      color: "#fb7185", fontSize: 12, fontWeight: 700,
                      cursor: "pointer", fontFamily: "'Outfit',sans-serif", transition: "all 0.2s",
                    }}
                  >Delete Account</button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ── Toast ── */}
      <Toast status={saveStatus} />

      {/* ── Delete confirm modal ── */}
      {showDeleteConfirm && (
        <DangerConfirm
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={() => {
            setShowDeleteConfirm(false);
            // TODO: call DELETE /api/user then redirect to login
          }}
        />
      )}
    </>
  );
}