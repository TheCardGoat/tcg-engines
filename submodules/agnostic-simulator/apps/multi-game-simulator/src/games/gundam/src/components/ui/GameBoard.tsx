import type { ReactNode } from "react";

import {
  MatchSidebarContainer,
  MobileActionBarContainer,
  MobileTopHudContainer,
} from "../containers/index.ts";
import { MatchSidebarRailContainer } from "../containers/MatchSidebarRailContainer.tsx";
import { MobileSidebarDrawer } from "./MobileSidebarDrawer.tsx";

export interface GameBoardProps {
  children: ReactNode;
  isMobile: boolean;
  drawerOpen: boolean;
  onDrawerOpenChange: (open: boolean) => void;
}

export function GameBoard({ children, isMobile, drawerOpen, onDrawerOpenChange }: GameBoardProps) {
  if (isMobile) {
    return (
      <main className="flex flex-1 min-h-0 min-w-0 overflow-x-hidden">
        <div className="flex flex-col flex-1 min-h-0 min-w-0 overflow-x-hidden">
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

  // Desktop: keep the sidebar in normal flex layout so opening it
  // resizes the battlefield instead of covering it with a modal sheet.
  return (
    <main className="flex flex-1 min-h-0">
      {drawerOpen ? (
        <MatchSidebarContainer onCollapse={() => onDrawerOpenChange(false)} />
      ) : (
        <MatchSidebarRailContainer onOpenDrawer={() => onDrawerOpenChange(true)} />
      )}
      {children}
    </main>
  );
}
