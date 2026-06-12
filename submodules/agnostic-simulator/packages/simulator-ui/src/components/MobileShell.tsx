import { useState } from "react";

import { cx } from "../class-names";

export interface MobileShellProps {
  hasLog?: boolean;
  sidebar: React.ReactNode;
  board: React.ReactNode;
  interactions: React.ReactNode;
  log?: React.ReactNode;
}

export function MobileShell({
  hasLog = false,
  sidebar,
  board,
  interactions,
  log,
}: MobileShellProps) {
  const [activeTab, setActiveTab] = useState<"board" | "log" | "interactions">("board");

  const tabButtonClass = (isActive: boolean) =>
    cx(
      "flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-black uppercase tracking-wide transition-colors",
      isActive
        ? "text-[var(--game-accent)]"
        : "text-[var(--board-muted)] hover:text-[var(--board-text)]",
    );

  const tabIndicatorClass = (isActive: boolean) =>
    cx(
      "h-0.5 w-6 rounded-full transition-colors",
      isActive ? "bg-[var(--game-accent)]" : "bg-transparent",
    );

  return (
    <>
      <div className="mobile-shell-desktop hidden grid-cols-[minmax(260px,320px)_minmax(0,1fr)_minmax(280px,360px)] items-start gap-4 max-[1280px]:hidden">
        {sidebar}
        {board}
        {interactions}
      </div>

      <div className="mobile-shell-mobile flex flex-col gap-3 max-[1280px]:flex min-[1281px]:hidden">
        <div className="mobile-main-content min-h-0 flex-1 overflow-hidden rounded-lg border border-[var(--board-border)] bg-[var(--board-surface-soft)]">
          {activeTab === "board" && board}
          {activeTab === "interactions" && <div className="p-3">{interactions}</div>}
          {activeTab === "log" && log && <div className="h-[60vh]">{log}</div>}
        </div>

        <nav
          className="mobile-action-rail sticky bottom-0 z-20 grid grid-cols-3 rounded-t-xl border-t border-[var(--board-border)] bg-[var(--board-surface)]/95 backdrop-blur-md"
          aria-label="Mobile navigation"
        >
          <button
            className={tabButtonClass(activeTab === "board")}
            onClick={() => setActiveTab("board")}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            <span>Board</span>
            <div className={tabIndicatorClass(activeTab === "board")}></div>
          </button>

          {hasLog && (
            <button
              className={tabButtonClass(activeTab === "log")}
              onClick={() => setActiveTab("log")}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <span>Log</span>
              <div className={tabIndicatorClass(activeTab === "log")}></div>
            </button>
          )}

          <button
            className={tabButtonClass(activeTab === "interactions")}
            onClick={() => setActiveTab("interactions")}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>Actions</span>
            <div className={tabIndicatorClass(activeTab === "interactions")}></div>
          </button>
        </nav>
      </div>
    </>
  );
}
