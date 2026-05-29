"use client";

import { useState } from "react";

type Page =
  | "dashboard"
  | "tasks"
  | "reminders"
  | "ai"
  | "focus"
  | "analytics"
  | "settings";

interface SidebarProps {
  activePage?: Page;
  onNavigate?: (page: Page) => void;
  onLogout?: () => void;
}

const NAV_ITEMS: {
  section: string;
  links: { id: Page; icon: string; label: string; badge?: number }[];
}[] = [
  {
    section: "Main",
    links: [
      { id: "dashboard", icon: "⊞", label: "Dashboard" },
      { id: "tasks", icon: "✓", label: "Tasks", badge: 5 },
      { id: "reminders", icon: "◫", label: "Reminders" },
    ],
  },
  {
    section: "Tools",
    links: [
      { id: "ai", icon: "◈", label: "AI Assistant" },
      { id: "focus", icon: "◎", label: "Focus Mode" },
      { id: "analytics", icon: "∿", label: "Analytics" },
    ],
  },
  {
    section: "Account",
    links: [{ id: "settings", icon: "⚙", label: "Settings" }],
  },
];

export default function Sidebar({
  activePage = "dashboard",
  onNavigate,
  onLogout,
}: SidebarProps) {
  const [active, setActive] = useState<Page>(activePage);
  const [collapsed, setCollapsed] = useState(false);

  const handleNav = (page: Page) => {
    setActive(page);
    onNavigate?.(page);
  };

  return (
    <aside
      className={[
        "flex flex-col h-full overflow-hidden bg-[#0f0f14] border-r border-white/[0.06]",
        "transition-all duration-300 ease-in-out",
        collapsed ? "w-[64px]" : "w-[250px]",
      ].join(" ")}
    >
      {/* Top */}
      <div className="flex-shrink-0 px-[14px] pt-[22px]">
        {/* Logo row + toggle button */}
        <div className="flex items-center justify-between mb-4">
          {!collapsed && (
            <div className="flex gap-2 items-center hover:cursor-pointer">
              <i className="fa-solid fa-book-open-reader bg-gradient-to-br from-[#7c3aed] to-[#4a4ae8] text-white p-2.5 rounded-lg text-2xl font-medium shadow-[0_0_18px_rgba(108,108,245,0.5)]" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#a5a5ff] to-[#e0e0ff] bg-clip-text text-transparent">
                Clock In
              </h1>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={[
              "flex items-center justify-center w-8 h-8 rounded-lg text-white/40",
              "hover:bg-white/[0.06] hover:text-white/70 transition-all duration-150 shrink-0",
              collapsed ? "mx-auto" : "",
            ].join(" ")}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              // open/expand icon
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="1" y="3" width="14" height="1.5" rx="0.75" />
                <rect x="1" y="7.25" width="14" height="1.5" rx="0.75" />
                <rect x="1" y="11.5" width="14" height="1.5" rx="0.75" />
              </svg>
            ) : (
              // collapse/close icon (arrow left)
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            )}
          </button>
        </div>

        {/* User card — hidden when collapsed */}
        {!collapsed && (
          <div className="flex items-center gap-[9px] p-3 bg-white/[0.04] border border-white/[0.06] rounded-xl mb-1.5">
            <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center text-xs font-bold text-white shrink-0">
              NF
            </div>
            <div>
              <div className="text-[12px] font-semibold text-white">Nufail Hazim</div>
              <div className="text-[10px] text-white/30">CS Year 2 · Level 12</div>
            </div>
          </div>
        )}

        {/* Collapsed: just avatar */}
        {collapsed && (
          <div className="flex justify-center mb-2">
            <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center text-xs font-bold text-white shrink-0">
              NF
            </div>
          </div>
        )}
      </div>

      {/* Scrollable nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-1.5 [scrollbar-width:thin]">
        {NAV_ITEMS.map(({ section, links }) => (
          <div key={section}>
            {/* Section label — hidden when collapsed */}
            {!collapsed && (
              <div className="text-[9px] font-bold tracking-widest uppercase text-white/30 px-2 pb-1.5">
                {section}
              </div>
            )}
            {collapsed && <div className="pt-3" />}

            {links.map(({ id, icon, label, badge }) => (
              <div
                key={id}
                onClick={() => handleNav(id)}
                title={collapsed ? label : undefined}
                className={[
                  "flex items-center gap-[9px] px-2.5 py-2.5 rounded-[9px] text-[13px]",
                  "cursor-pointer transition-all duration-150 mb-px whitespace-nowrap select-none",
                  collapsed ? "justify-center" : "",
                  active === id
                    ? "bg-violet-500/[0.12] text-violet-400"
                    : "text-white/50 hover:bg-white/[0.04] hover:text-white/80",
                ].join(" ")}
              >
                <span
                  className={[
                    "text-[15px] w-5 text-center shrink-0",
                    active === id ? "opacity-100" : "opacity-75",
                  ].join(" ")}
                >
                  {icon}
                </span>
                {!collapsed && label}
                {!collapsed && badge !== undefined && (
                  <span className="ml-auto bg-violet-600 text-white text-[10px] font-bold px-1.5 py-px rounded-full">
                    {badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </nav>

      {/* Bottom: streak + logout */}
      <div className="flex-shrink-0 p-3.5 border-t border-white/[0.06] space-y-2">
        {/* Streak — hidden when collapsed */}
        {!collapsed && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gradient-to-br from-violet-500/10 to-cyan-400/5 border border-violet-500/[0.18]">
            <span className="text-xl shrink-0">🔥</span>
            <div>
              <strong className="text-[13px] font-semibold text-white block">
                14-Day Streak
              </strong>
              <span className="text-[10px] text-white/50">
                Don&apos;t break the chain!
              </span>
            </div>
          </div>
        )}

        {/* Logout button */}
        <div
          onClick={onLogout}
          title={collapsed ? "Logout" : undefined}
          className={[
            "flex items-center gap-[9px] px-2.5 py-2.5 rounded-[9px] text-[13px]",
            "cursor-pointer transition-all duration-150 whitespace-nowrap select-none",
            "text-red-400/80 hover:bg-red-500/10 hover:text-red-400",
            collapsed ? "justify-center" : "",
          ].join(" ")}
        >
          <span className="text-[15px] w-5 text-center shrink-0 opacity-90">⏻</span>
          {!collapsed && "Logout"}
        </div>
      </div>
    </aside>
  );
}