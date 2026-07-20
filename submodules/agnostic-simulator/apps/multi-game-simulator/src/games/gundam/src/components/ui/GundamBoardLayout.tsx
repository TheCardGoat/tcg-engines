import { useEffect, useState, type ReactNode } from "react";

import { MobileShell } from "@tcg/simulator-ui";

import { useLayoutMode } from "../../lib/use-layout-mode.ts";
import {
  MatchLogContainer,
  MobileTopHudContainer,
  MobileActionBarContainer,
} from "../containers/index.ts";
import { MatchSidebarContainer } from "../containers/MatchSidebarContainer.tsx";
import { MatchSidebarRailContainer } from "../containers/MatchSidebarRailContainer.tsx";

export interface GundamBoardLayoutProps {
  readonly children: ReactNode;
  readonly connectionPanel?: ReactNode;
  readonly connectionIndicator?: ReactNode;
}

export function GundamBoardLayout({
  children,
  connectionPanel,
  connectionIndicator,
}: GundamBoardLayoutProps) {
  const layoutMode = useLayoutMode();
  const isMobile = layoutMode === "mobile";
  // Keep match context and the comms log visible on desktop by default.
  // Mobile uses MobileShell's own closed drawer state, so this preference
  // does not consume playfield space on compact screens.
  const [drawerOpen, setDrawerOpen] = useState(true);

  // Tablet keeps the desktop board model but cannot fit a 312px sidebar and
  // the center action rail at once. Start that intermediate layout on the
  // narrow log rail; full desktop still opens the complete log by default.
  useEffect(() => {
    if (layoutMode === "tablet") setDrawerOpen(false);
  }, [layoutMode]);

  if (!isMobile) {
    return (
      <main
        className="simulator-shell relative flex h-svh max-h-svh min-h-0 w-full overflow-hidden bg-[var(--surface-soft)] text-[var(--text)]"
        data-game="gundam"
        data-theme="light"
        data-testid="gundam-shared-simulator-shell"
      >
        {drawerOpen ? (
          <MatchSidebarContainer
            connectionPanel={connectionPanel}
            onCollapse={() => setDrawerOpen(false)}
          />
        ) : (
          <MatchSidebarRailContainer
            connectionIndicator={connectionIndicator}
            onOpenDrawer={() => setDrawerOpen(true)}
          />
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
          sidebar={<MatchSidebarContainer connectionPanel={connectionPanel} />}
          board={
            <section className="h-full w-full overflow-hidden" aria-label="Gundam battlefield">
              {children}
            </section>
          }
          // This branch also serves short-height phone landscape, whose
          // width can exceed the portrait breakpoint.
          layoutBreakpoint={1023}
          interactions={null}
          log={<MatchLogContainer />}
          mobileTopBar={
            isMobile
              ? ({ openLog }) => (
                  <MobileTopHudContainer
                    connectionIndicator={connectionIndicator}
                    onOpenLog={openLog}
                  />
                )
              : undefined
          }
          mobileBottomBar={isMobile ? <MobileActionBarContainer /> : undefined}
        />
      </div>
    </main>
  );
}
