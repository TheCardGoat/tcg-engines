import { useEffect, useState } from "react";

import { cx } from "../class-names";
import { useActiveLayout } from "../hooks/useActiveLayout";
import classes from "./MobileShell.module.css";

export interface MobileShellProps {
  hasLog?: boolean;
  sidebar: React.ReactNode;
  board: React.ReactNode;
  /**
   * Optional right-hand interactions column. When omitted/null the desktop
   * grid collapses to two columns (sidebar + board) so the board can host its
   * own inline interaction overlay instead of reserving an empty third track.
   */
  interactions?: React.ReactNode;
  log?: React.ReactNode;
  /**
   * Layout mode.
   * - `"tabbed"` (default): mobile uses bottom tabs; desktop uses the full sidebar.
   * - `"drawer-rail"`: mobile uses a drawer; desktop uses a collapsed rail that
   *   expands to the full sidebar.
   */
  layout?: "tabbed" | "drawer-rail";
  /**
   * Viewport width where the shell switches from mobile to desktop layout.
   */
  layoutBreakpoint?: number;
  /**
   * Whether drawer-rail desktop mode starts with the sidebar expanded.
   */
  defaultSidebarOpen?: boolean;
  /**
   * Optional content for the collapsed desktop rail (drawer-rail mode only).
   * Receives controls so the rail can expand the sidebar.
   */
  railCollapsedContent?: (controls: { openSidebar: () => void }) => React.ReactNode;
  /**
   * Optional top bar rendered in mobile drawer-rail mode. Receives controls
   * so Gundam can place its own drawer trigger inside the HUD.
   */
  mobileTopBar?: (controls: { openDrawer: () => void }) => React.ReactNode;
  /**
   * Optional bottom bar rendered in mobile drawer-rail mode.
   */
  mobileBottomBar?: React.ReactNode;
  /**
   * Mobile tab navigation mode. Use `"none"` when the embedded board owns its
   * own mobile controls and needs the full viewport for play.
   */
  mobileNavigation?: "tabs" | "none";
  /**
   * Optional viewport width where `"none"` navigation starts applying. This
   * lets an embedded board keep shell tabs available until its own mobile
   * replacement controls are active.
   */
  mobileNavigationBreakpoint?: number;
}

export function MobileShell({
  hasLog = false,
  sidebar,
  board,
  interactions,
  log,
  layout = "tabbed",
  layoutBreakpoint,
  defaultSidebarOpen = false,
  railCollapsedContent,
  mobileTopBar,
  mobileBottomBar,
  mobileNavigation = "tabs",
  mobileNavigationBreakpoint,
}: MobileShellProps) {
  const [activeTab, setActiveTab] = useState<"board" | "log" | "interactions">("board");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [railExpanded, setRailExpanded] = useState(defaultSidebarOpen);
  const activeLayout = useActiveLayout(layoutBreakpoint);
  const activeNavigationLayout = useActiveLayout(mobileNavigationBreakpoint);
  const hasInteractions = Boolean(interactions);
  const mobileColumnCount = hasLog && hasInteractions ? 3 : hasLog || hasInteractions ? 2 : 1;
  const effectiveMobileNavigation =
    mobileNavigation === "none" && activeNavigationLayout === "mobile" ? "none" : "tabs";

  useEffect(() => {
    if (activeTab === "log" && !hasLog) {
      setActiveTab("board");
      return;
    }
    if (activeTab === "interactions" && !hasInteractions) {
      setActiveTab("board");
    }
  }, [activeTab, hasInteractions, hasLog]);

  const tabButtonClass = (isActive: boolean) =>
    cx(
      classes.mobileTabButton,
      "flex flex-1 flex-col items-center gap-0.5 py-1.5 text-[9px] font-black uppercase tracking-wide transition-colors",
      isActive
        ? "text-[var(--game-accent)]"
        : "text-[var(--board-muted)] hover:text-[var(--board-text)]",
    );

  const tabIndicatorClass = (isActive: boolean) =>
    cx(
      classes.mobileTabIndicator,
      "h-0.5 w-6 rounded-full transition-colors",
      isActive ? "bg-[var(--game-accent)]" : "bg-transparent",
    );

  // Desktop drawer-rail layout.
  if (activeLayout === "desktop" && layout === "drawer-rail") {
    const hasInteractionsColumn = Boolean(interactions);
    return (
      <div
        className={cx(
          "mobile-shell-desktop",
          classes.desktop,
          railExpanded
            ? hasInteractionsColumn
              ? classes.drawerRailExpandedWithInteractions
              : classes.drawerRailExpanded
            : hasInteractionsColumn
              ? classes.drawerRailCollapsedWithInteractions
              : classes.drawerRailCollapsed,
        )}
        data-active-shell="true"
        data-layout="drawer-rail"
      >
        <div className={classes.desktopRail}>
          <button
            type="button"
            className={classes.railToggle}
            onClick={() => setRailExpanded((open) => !open)}
            aria-label={railExpanded ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={railExpanded}
          >
            <ChevronIcon direction={railExpanded ? "left" : "right"} />
          </button>
          <div className={classes.railCollapsedContent}>
            {railCollapsedContent?.({ openSidebar: () => setRailExpanded(true) })}
          </div>
        </div>
        {railExpanded && <div className={classes.sidebarContainer}>{sidebar}</div>}
        {board}
        {interactions}
      </div>
    );
  }

  // Desktop tabbed layout (default).
  if (activeLayout === "desktop") {
    const hasInteractionsColumn = Boolean(interactions);
    return (
      <div
        className={cx(
          "mobile-shell-desktop",
          classes.desktop,
          hasInteractionsColumn ? classes.desktopThreeColumns : classes.desktopTwoColumns,
        )}
        data-active-shell="true"
        data-layout="tabbed"
      >
        {sidebar}
        {board}
        {interactions}
      </div>
    );
  }

  // Mobile drawer-rail layout.
  if (layout === "drawer-rail") {
    return (
      <div
        className={cx("mobile-shell-mobile", classes.mobileDrawer)}
        data-active-shell="true"
        data-layout="drawer-rail"
      >
        {mobileTopBar && (
          <div className={classes.mobileTopBar}>
            {mobileTopBar({ openDrawer: () => setDrawerOpen(true) })}
          </div>
        )}
        <div className={classes.mobileBoard}>{board}</div>
        {mobileBottomBar && <div className={classes.mobileBottomBar}>{mobileBottomBar}</div>}
        {drawerOpen && (
          <>
            <div
              className={classes.drawerOverlay}
              onClick={() => setDrawerOpen(false)}
              aria-hidden="true"
            />
            <div className={classes.drawerSheet} role="dialog" aria-modal="true">
              <button
                type="button"
                className={classes.drawerClose}
                onClick={() => setDrawerOpen(false)}
                aria-label="Close sidebar"
              >
                <ChevronIcon direction="left" />
              </button>
              {sidebar}
            </div>
          </>
        )}
      </div>
    );
  }

  if (effectiveMobileNavigation === "none") {
    return (
      <div
        className={cx("mobile-shell-mobile flex min-h-0", classes.mobileTabbed)}
        data-active-shell="true"
        data-layout="tabbed"
        data-mobile-navigation="none"
      >
        <div
          className={cx(
            "mobile-main-content min-h-0 flex-1 overflow-hidden rounded-lg border border-[var(--board-border)] bg-[var(--board-surface-soft)]",
            classes.mobileMainContent,
          )}
        >
          {board}
        </div>
      </div>
    );
  }

  // Mobile tabbed layout (default).
  return (
    <div
      className={cx("mobile-shell-mobile flex flex-col gap-3", classes.mobileTabbed)}
      data-active-shell="true"
      data-layout="tabbed"
    >
      <div
        className={cx(
          "mobile-main-content min-h-0 flex-1 overflow-hidden rounded-lg border border-[var(--board-border)] bg-[var(--board-surface-soft)]",
          classes.mobileMainContent,
        )}
      >
        {activeTab === "board" && board}
        {activeTab === "interactions" && hasInteractions && (
          <div className="p-3">{interactions}</div>
        )}
        {activeTab === "log" && log && <div className="h-[60vh]">{log}</div>}
      </div>

      <nav
        className={cx(
          classes.mobileActionRail,
          "mobile-action-rail sticky bottom-0 z-20 grid rounded-t-xl border-t border-[var(--board-border)] bg-[var(--board-surface)]/95 backdrop-blur-md",
          mobileColumnCount === 3
            ? "grid-cols-3"
            : mobileColumnCount === 2
              ? "grid-cols-2"
              : "grid-cols-1",
        )}
        aria-label="Mobile navigation"
      >
        <button
          className={tabButtonClass(activeTab === "board")}
          onClick={() => setActiveTab("board")}
        >
          <BoardIcon />
          <span className={classes.mobileTabLabel}>Board</span>
          <div className={tabIndicatorClass(activeTab === "board")}></div>
        </button>

        {hasLog && (
          <button
            className={tabButtonClass(activeTab === "log")}
            onClick={() => setActiveTab("log")}
          >
            <LogIcon />
            <span className={classes.mobileTabLabel}>Log</span>
            <div className={tabIndicatorClass(activeTab === "log")}></div>
          </button>
        )}

        {hasInteractions && (
          <button
            className={tabButtonClass(activeTab === "interactions")}
            onClick={() => setActiveTab("interactions")}
          >
            <ActionsIcon />
            <span className={classes.mobileTabLabel}>Actions</span>
            <div className={tabIndicatorClass(activeTab === "interactions")}></div>
          </button>
        )}
      </nav>
    </div>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: direction === "left" ? "rotate(0deg)" : "rotate(180deg)" }}
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function BoardIcon() {
  return (
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
  );
}

function LogIcon() {
  return (
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
  );
}

function ActionsIcon() {
  return (
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
  );
}
