import type { ReactNode } from "react";

import {
  MatchSidebarContainer,
  MobileActionBarContainer,
  MobileTopHudContainer,
} from "../containers/index.ts";
import { MatchSidebarRailContainer } from "../containers/MatchSidebarRailContainer.tsx";
import { MobileSidebarDrawer } from "./MobileSidebarDrawer.tsx";

export interface GameBoardProps {
  readonly children: ReactNode;
  readonly isMobile: boolean;
  readonly drawerOpen: boolean;
  readonly onDrawerOpenChange: (open: boolean) => void;
}

export function GameBoard({ children, isMobile, drawerOpen, onDrawerOpenChange }: GameBoardProps) {
  if (isMobile) {
    return (
      <main className="flex min-h-0 min-w-0 flex-1 overflow-x-hidden">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden">
          <MobileTopHudContainer onOpenDrawer={() => onDrawerOpenChange(true)} />
          {children}
          <MobileActionBarContainer />
        </div>
        <MobileSidebarDrawer open={drawerOpen} onOpenChange={onDrawerOpenChange}>
          <MatchSidebarContainer />
        </MobileSidebarDrawer>
      </main>
    );
  }

  return (
    <main className="flex min-h-0 flex-1">
      {drawerOpen ? (
        <MatchSidebarContainer onCollapse={() => onDrawerOpenChange(false)} />
      ) : (
        <MatchSidebarRailContainer onOpenDrawer={() => onDrawerOpenChange(true)} />
      )}
      {children}
    </main>
  );
}
