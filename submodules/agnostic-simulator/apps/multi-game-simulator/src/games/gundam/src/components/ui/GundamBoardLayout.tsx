import type { ReactNode } from "react";

import { MobileShell } from "@tcg/simulator-ui";

import { useLayoutMode } from "../../lib/use-layout-mode.ts";
import { MobileTopHudContainer, MobileActionBarContainer } from "../containers/index.ts";
import { MatchSidebarContainer } from "../containers/MatchSidebarContainer.tsx";

export interface GundamBoardLayoutProps {
  readonly children: ReactNode;
}

export function GundamBoardLayout({ children }: GundamBoardLayoutProps) {
  const layoutMode = useLayoutMode();
  const isMobile = layoutMode === "mobile";

  return (
    <main
      className="simulator-shell relative min-h-svh w-full overflow-x-hidden bg-[var(--surface-soft)] text-[var(--text)]"
      data-game="gundam"
      data-theme="light"
      data-testid="gundam-shared-simulator-shell"
    >
      <MobileShell
        layout="drawer-rail"
        sidebar={<MatchSidebarContainer />}
        board={
          <section className="h-full w-full overflow-hidden" aria-label="Gundam battlefield">
            {children}
          </section>
        }
        interactions={null}
        log={null}
        mobileTopBar={
          isMobile
            ? ({ openDrawer }) => <MobileTopHudContainer onOpenDrawer={openDrawer} />
            : undefined
        }
        mobileBottomBar={isMobile ? <MobileActionBarContainer /> : undefined}
      />
    </main>
  );
}
