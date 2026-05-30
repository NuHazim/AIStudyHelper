"use client"
import Link from "next/link";
import { useState } from "react";

// Reusable input wrapper
function InputWrap({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 bg-white/5 border border-[rgba(165,165,255,0.15)] rounded-xl px-3.5 py-[11px] transition-all duration-200 focus-within:border-[rgba(165,165,255,0.45)] focus-within:shadow-[0_0_0_3px_rgba(74,74,232,0.12),0_0_12px_rgba(74,74,232,0.06)] cursor-text">
      <i className={`${icon} text-[#4a4ae8] text-sm w-4 text-center shrink-0`}></i>
      {children}
    </div>
  );
}

// Reusable field label
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[11px] font-semibold text-[#a0a0cc] uppercase tracking-widest">
      {children}
    </label>
  );
}

// Card shell shared by both panels
const cardClass = `
  w-full max-w-[440px]
  bg-[rgba(10,8,40,0.45)] backdrop-blur-2xl
  border border-[rgba(165,165,255,0.2)]
  rounded-3xl px-9 py-9
  shadow-[0_8px_48px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)]
  relative overflow-hidden
`.trim();

// Brand logo row (shared)
function Brand() {
  return (
    <div className="flex items-center gap-3 mb-7">
      <i className="fa-solid fa-bolt bg-gradient-to-br from-[#7c3aed] to-[#4a4ae8] text-white p-2.5 rounded-xl text-base shadow-[0_0_16px_rgba(108,108,245,0.4)]"></i>
      <span className="text-lg font-bold text-[#e8e8ff] tracking-wide">Clock In</span>
    </div>
  );
}

export default function AuthPage() {
  const [showLogin, setShowLogin] = useState(true);

  // ── Register form state ──
  const [username, setUsername]     = useState("");
  const [regEmail, setRegEmail]     = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [terms, setTerms]           = useState(false);
  const [showRegPw, setShowRegPw]   = useState(false);

  // ── Login form state ──
  const [loginEmail, setLoginEmail]       = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPw, setShowLoginPw]     = useState(false);

  // ── Errors ──
  const [loginErrors, setLoginErrors]     = useState<Record<string, string>>({});
  const [registerErrors, setRegisterErrors] = useState<Record<string, string>>({});

  // ── Password strength ──
  function getStrength(pw: string): { score: number; label: string; color: string } {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const map = [
      { label: "",            color: "" },
      { label: "Weak",        color: "#f06c80" },
      { label: "Medium",      color: "#e2ac24" },
      { label: "Strong",      color: "#32ce95" },
      { label: "Very strong", color: "#32ce95" },
    ];
    return { score, ...map[score] };
  }

  const strength = getStrength(regPassword);
  const strengthBarColors = ["#f06c80", "#f06c80", "#e2ac24", "#32ce95"];

  // ── Handlers ──
  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail)) errs.email = "Please enter a valid email.";
    if (!loginPassword) errs.password = "Password can't be empty.";
    setLoginErrors(errs);
    if (Object.keys(errs).length === 0) alert("✅ Signed in! (hook up your auth here)");
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!username) errs.username = "Required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail)) errs.email = "Please enter a valid email.";
    if (regPassword.length < 8) errs.password = "Password must be at least 8 characters.";
    if (!terms) errs.terms = "Please accept the terms to continue.";
    setRegisterErrors(errs);
    if (Object.keys(errs).length === 0) alert("🚀 Account created! (hook up your auth here)");
  }

  function switchTo(tab: "login" | "register") {
    setShowLogin(tab === "login");
    setLoginErrors({});
    setRegisterErrors({});
  }

  const inputClass = "flex-1 min-w-0 bg-transparent border-none outline-none text-sm text-[#e8e8ff] placeholder:text-[#6060a0]";
  const errorClass = "text-[11px] text-[#f06c80] mt-1";
  const primaryBtn = "w-full flex items-center justify-center gap-2 bg-gradient-to-br from-[#7c3aed] to-[#4a4ae8] text-white font-bold text-[15px] tracking-wide px-4 py-[13px] rounded-xl border-none cursor-pointer transition-all duration-200 hover:shadow-[0_0_24px_rgba(108,108,245,0.5)] active:scale-[0.98] relative overflow-hidden";

  return (
    <div className="h-screen overflow-y-auto flex flex-col justify-center items-center gap-5 px-4 py-6">

      {/* Back link */}
      <Link
        href="/"
        className="absolute left-5 top-5 text-sm text-[#6060a0] hover:text-[#a5a5ff] transition-colors duration-200 flex items-center gap-1.5"
      >
        <i className="fa-solid fa-arrow-left text-xs"></i> Back
      </Link>

      {/* ── Tab switcher ── */}
      <div className="flex bg-[rgba(10,8,40,0.4)] backdrop-blur-2xl border border-[rgba(165,165,255,0.18)] rounded-2xl p-[5px] gap-1">
        <button
          onClick={() => switchTo("login")}
          className={`text-[13px] font-semibold px-7 py-2 rounded-xl cursor-pointer transition-all duration-200 ease-in-out ${
            showLogin
              ? "bg-gradient-to-br from-[#7c3aed] to-[#4a4ae8] text-white shadow-[0_0_18px_rgba(108,108,245,0.35)]"
              : "bg-transparent text-[#9090c8] hover:text-[#a5a5ff]"
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => switchTo("register")}
          className={`text-[13px] font-semibold px-7 py-2 rounded-xl cursor-pointer transition-all duration-200 ease-in-out ${
            !showLogin
              ? "bg-gradient-to-br from-[#7c3aed] to-[#4a4ae8] text-white shadow-[0_0_18px_rgba(108,108,245,0.35)]"
              : "bg-transparent text-[#9090c8] hover:text-[#a5a5ff]"
          }`}
        >
          Create Account
        </button>
      </div>

      {/* ══════════ LOGIN CARD ══════════ */}
      <div className={cardClass} style={{ display: showLogin ? "block" : "none" }}>
        <Brand />

        <h1 className="text-3xl font-extrabold text-[#e8e8ff] mb-1 leading-tight">
          Welcome <span className="bg-gradient-to-r from-[#a5a5ff] to-[#e0e0ff] bg-clip-text text-transparent">back.</span>
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Email Address</FieldLabel>
            <InputWrap icon="fa-regular fa-envelope">
              <input
                className={inputClass}
                type="email"
                placeholder="you@university.edu"
                autoComplete="email"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
              />
            </InputWrap>
            {loginErrors.email && <p className={errorClass}>{loginErrors.email}</p>}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Password</FieldLabel>
            <InputWrap icon="fa-solid fa-lock">
              <input
                className={inputClass}
                type={showLoginPw ? "text" : "password"}
                placeholder="Your password"
                autoComplete="current-password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowLoginPw(p => !p)}
                className="text-[#6060a0] hover:text-[#a5a5ff] transition-colors text-sm cursor-pointer bg-transparent border-none p-0"
              >
                <i className={showLoginPw ? "fa-regular fa-eye-slash" : "fa-regular fa-eye"}></i>
              </button>
            </InputWrap>
            {loginErrors.password && <p className={errorClass}>{loginErrors.password}</p>}
          </div>

          {/* Forgot */}
          <div className="flex justify-end -mt-1">
            <span className="text-[12px] text-[#a5a5ff] cursor-pointer hover:underline">Forgot password?</span>
          </div>

          {/* Submit */}
          <button type="submit" className={primaryBtn}>
            <i className="fa-solid fa-bolt"></i> Sign In
          </button>
        </form>

        <p className="text-center text-[12px] text-[#6060a0] mt-1">
          Don't have an account?{" "}
          <span className="text-[#a5a5ff] cursor-pointer hover:underline" onClick={() => switchTo("register")}>
            Sign up free
          </span>
        </p>
      </div>

      {/* ══════════ REGISTER CARD ══════════ */}
      <div className={cardClass} style={{ display: showLogin ? "none" : "block" }}>
        <Brand />

        <h1 className="text-3xl font-extrabold text-[#e8e8ff] mb-1 leading-tight">
          Start <span className="bg-gradient-to-r from-[#a5a5ff] to-[#e0e0ff] bg-clip-text text-transparent">Clocking In.</span>
        </h1>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Username</FieldLabel>
            <InputWrap icon="fa-regular fa-user">
              <input
                className={inputClass}
                type="text"
                placeholder="your_username"
                autoComplete="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </InputWrap>
            {registerErrors.username && <p className={errorClass}>{registerErrors.username}</p>}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <FieldLabel>University Email</FieldLabel>
            <InputWrap icon="fa-regular fa-envelope">
              <input
                className={inputClass}
                type="email"
                placeholder="you@university.edu"
                autoComplete="email"
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
              />
            </InputWrap>
            {registerErrors.email && <p className={errorClass}>{registerErrors.email}</p>}
          </div>

          {/* Password + strength */}
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Password</FieldLabel>
            <InputWrap icon="fa-solid fa-lock">
              <input
                className={inputClass}
                type={showRegPw ? "text" : "password"}
                placeholder="Create a strong password"
                autoComplete="new-password"
                value={regPassword}
                onChange={e => setRegPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowRegPw(p => !p)}
                className="text-[#6060a0] hover:text-[#a5a5ff] transition-colors text-sm cursor-pointer bg-transparent border-none p-0"
              >
                <i className={showRegPw ? "fa-regular fa-eye-slash" : "fa-regular fa-eye"}></i>
              </button>
            </InputWrap>
            {registerErrors.password && <p className={errorClass}>{registerErrors.password}</p>}

            {/* Strength bar */}
            {regPassword && (
              <div className="mt-1">
                <div className="flex gap-1 mb-1">
                  {[0, 1, 2, 3].map(i => (
                    <div
                      key={i}
                      className="flex-1 h-[3px] rounded-full transition-all duration-300"
                      style={{
                        background: i < strength.score ? strengthBarColors[Math.min(strength.score - 1, 3)] : "rgba(165,165,255,0.1)"
                      }}
                    />
                  ))}
                </div>
                <p className="text-[11px]" style={{ color: strength.color }}>{strength.label}</p>
              </div>
            )}
          </div>

          {/* Submit */}
          <button type="submit" className={primaryBtn}>
            <i className="fa-solid fa-rocket"></i> Create Account
          </button>
        </form>

        <p className="text-center text-[12px] text-[#6060a0] mt-1">
          Already have an account?{" "}
          <span className="text-[#a5a5ff] cursor-pointer hover:underline" onClick={() => switchTo("login")}>
            Sign in
          </span>
        </p>
      </div>

      <p className="text-[11px] text-[#6060a0]">© 2025 Clock In · Survive your semester.</p>
    </div>
  );
}