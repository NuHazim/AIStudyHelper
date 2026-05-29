"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface SidebarProps {
  onLogout?: () => void;
}

const NAV_ITEMS = [
  {
    section: "Main",
    links: [
      { id: "Dashboard", icon: "⊞", label: "Dashboard" },
      { id: "Tasks", icon: "✓", label: "Tasks" },
      { id: "Reminders", icon: "◫", label: "Reminders" },
    ],
  },
  {
    section: "Tools",
    links: [
      { id: "AIAssistant", icon: "◈", label: "AI Assistant" },
      { id: "FocusMode", icon: "◎", label: "Focus Mode" },
      { id: "Notes", icon: "∿", label: "Notes" },
    ],
  },
  {
    section: "Account",
    links: [
      { id: "Settings", icon: "⚙", label: "Settings" },
    ],
  },
];

export default function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (id: string) => pathname === `/${id}`;

  return (
    <aside
      className={[
        "flex flex-col h-full overflow-hidden bg-[#0c0e1e] border-r border-white/[0.06]",
        "transition-all duration-300 ease-in-out",
        collapsed ? "w-[64px]" : "w-[250px]",
      ].join(" ")}
    >
      {/* TOP */}
      <div className="flex-shrink-0 px-[14px] pt-[22px]">
        <div className="flex items-center justify-between mb-4">
          {!collapsed && (
            <div className="flex gap-2 items-center hover:cursor-pointer">
                <i className="fa-solid fa-book-open-reader bg-gradient-to-br from-[#7c3aed] to-[#4a4ae8] text-white p-2.5 rounded-lg text-2xl font-medium shadow-[0_0_18px_rgba(108,108,245,0.5)]"></i>
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#a5a5ff] to-[#e0e0ff] bg-clip-text text-transparent">Clock In</h1>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="cursor-pointer w-8 h-8 text-white/60 hover:text-white"
          >
            {collapsed ? "☰" : "‹"}
          </button>
        </div>
      </div>

      {/* NAV */}
      <nav className="flex-1 overflow-y-auto px-2 py-1.5">
        {NAV_ITEMS.map(({ section, links }) => (
          <div key={section}>
            {!collapsed && (
              <div className="text-[9px] font-bold uppercase text-white/30 px-2 py-2">
                {section}
              </div>
            )}

            {links.map(({ id, icon, label }) => (
              <Link
                key={id}
                href={`/${id}`}
                className={[
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition",
                  collapsed ? "justify-center" : "",
                  isActive(id)
                    ? "bg-violet-500/20 text-violet-400"
                    : "text-white/60 hover:bg-white/5 hover:text-white",
                ].join(" ")}
              >
                <span className="w-5 text-center">{icon}</span>

                {!collapsed && label}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* BOTTOM */}
        <div className="p-3 border-t border-white/10 space-y-2">
            <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer"
            >
                <span className="w-5 text-center">⏻</span>
                {!collapsed && "Logout"}
            </Link>
        </div>
    </aside>
  );
}