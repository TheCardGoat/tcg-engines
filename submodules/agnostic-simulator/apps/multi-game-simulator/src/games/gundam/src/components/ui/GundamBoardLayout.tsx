import { useState, type CSSProperties, type ReactNode } from "react";
import { SimulatorSelfParticipantActions } from "../../../../../simulator/participant-actions";
import { useSimulatorRoute } from "../../../../../simulator/providers";
import { useLayoutMode } from "../../lib/use-layout-mode.ts";

import { SimulatorViewportShell } from "@tcg/simulator-ui";

import { GundamChatProvider, type GundamChatRemoteWiring } from "../../game/chat-context.tsx";
import { MobileTopHudContainer, MobileActionBarContainer } from "../containers/index.ts";
import { MatchSidebarContainer } from "../containers/MatchSidebarContainer.tsx";
import { GundamMobileActivityContainer } from "../containers/MatchSidebarContainer.tsx";

export interface GundamBoardLayoutProps {
  readonly children: ReactNode;
  readonly connectionPanel?: ReactNode;
  readonly connectionIndicator?: ReactNode;
  /**
   * Remote (server-authoritative) chat wiring for live matches. Omit for
   * local surfaces — they get local-only chat with free text enabled.
   */
  readonly chat?: GundamChatRemoteWiring;
}

export function GundamBoardLayout({
  children,
  connectionPanel,
  connectionIndicator,
  chat,
}: GundamBoardLayoutProps) {
  const [selfActionHost, setSelfActionHost] = useState<HTMLDivElement | null>(null);
  const route = useSimulatorRoute();
  const layoutMode = useLayoutMode();

  return (
    <GundamChatProvider {...chat}>
      <SimulatorSelfParticipantActions
        menuHost={selfActionHost}
        viewportLayout={layoutMode === "mobile" ? "mobile" : "desktop"}
        gameConfiguration={{
          title: "Configure a new Gundam game?",
          description: "Opening game configuration leaves the current battle and returns to setup.",
          confirmLabel: "Open configuration",
          onSelect: () => window.location.assign("/gundam/simulator"),
        }}
        support={{
          source: "gundam-participant-menu",
          gameSlug: "gundam",
          matchId: route.matchId,
          gameId: route.gameId,
          stateVersion: route.matchPageData?.game.stateVersion,
        }}
      />
      <SimulatorViewportShell
        className="simulator-shell gd-dark-surface relative h-svh max-h-svh min-h-0 w-full overflow-hidden bg-[var(--surface-soft)] text-[var(--text)]"
        data-game="gundam"
        data-theme="light"
        data-testid="gundam-shared-simulator-shell"
        style={
          {
            "--board-surface": "var(--color-hud-deep)",
            "--board-surface-soft": "var(--color-hud-surface-raised)",
            "--board-text": "var(--color-hud-text)",
            "--board-muted": "var(--color-hud-text-muted)",
            "--board-border": "var(--color-hud-border)",
            "--game-accent": "var(--color-hud-accent-deep)",
          } as CSSProperties
        }
        sidebar={
          <MatchSidebarContainer
            selfActions={<div ref={setSelfActionHost} />}
            connectionPanel={connectionPanel}
            connectionIndicator={connectionIndicator}
          />
        }
        mobilePanel={<GundamMobileActivityContainer connectionPanel={connectionPanel} />}
        mobilePanelLabel="Gundam activity and utilities"
        mobileTopRail={({ openSidebar }) => (
          <MobileTopHudContainer
            connectionIndicator={connectionIndicator}
            onOpenLog={openSidebar}
          />
        )}
        mobileBottomRail={<MobileActionBarContainer />}
        tabletop={
          <section className="h-full w-full overflow-hidden" aria-label="Gundam battlefield">
            {children}
          </section>
        }
      />
    </GundamChatProvider>
  );
}
