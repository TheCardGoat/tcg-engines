import { useState, type ReactNode } from "react";

import { MobileShell } from "@tcg/simulator-ui";

import { useLayoutMode } from "../../lib/use-layout-mode.ts";
import { MobileTopHudContainer, MobileActionBarContainer } from "../containers/index.ts";
import { MatchSidebarContainer } from "../containers/MatchSidebarContainer.tsx";
import { MatchSidebarRailContainer } from "../containers/MatchSidebarRailContainer.tsx";

export interface GundamBoardLayoutProps {
  readonly children: ReactNode;
}

export function GundamBoardLayout({ children }: GundamBoardLayoutProps) {
  const layoutMode = useLayoutMode();
  const isMobile = layoutMode === "mobile";
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!isMobile) {
    return (
      <main
        className="simulator-shell relative flex h-svh max-h-svh min-h-0 w-full overflow-hidden bg-[var(--surface-soft)] text-[var(--text)]"
        data-game="gundam"
        data-theme="light"
        data-testid="gundam-shared-simulator-shell"
      >
        {drawerOpen ? (
          <MatchSidebarContainer onCollapse={() => setDrawerOpen(false)} />
        ) : (
          <MatchSidebarRailContainer onOpenDrawer={() => setDrawerOpen(true)} />
        )}
        <section
          className="h-full min-h-0 min-w-0 flex-1 overflow-hidden"
          aria-label="Gundam battlefield"
        >
          {children}
        </section>
      </main>
    );
  }

  return (
    <main
      className="simulator-shell relative flex h-svh max-h-svh min-h-0 w-full overflow-hidden bg-[var(--surface-soft)] text-[var(--text)]"
      data-game="gundam"
      data-theme="light"
      data-testid="gundam-shared-simulator-shell"
    >
      <div className="h-full min-h-0 min-w-0 w-full flex-1 overflow-hidden">
        <MobileShell
          layout="drawer-rail"
          sidebar={<MatchSidebarContainer />}
          board={
            <section className="h-full w-full overflow-hidden" aria-label="Gundam battlefield">
              {children}
            </section>
          }
          layoutBreakpoint={767}
          interactions={null}
          log={null}
          mobileTopBar={
            isMobile
              ? ({ openDrawer }) => <MobileTopHudContainer onOpenDrawer={openDrawer} />
              : undefined
          }
          mobileBottomBar={isMobile ? <MobileActionBarContainer /> : undefined}
        />
      </div>
    </main>
  );
}
