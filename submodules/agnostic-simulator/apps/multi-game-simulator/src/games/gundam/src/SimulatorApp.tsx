import type { MatchRuntime, MatchStaticResources } from "@tcg/gundam-engine";

import { HintsProvider } from "./lib/use-hints-enabled.ts";
import { useLayoutMode } from "./lib/use-layout-mode.ts";
import { GundamGame } from "./components/GundamGame.tsx";
import {
  AttackTargetingOverlayContainer,
  MatchOverviewModalContainer,
  MatchStatusBarContainer,
  PendingEffectsContainer,
  PlayerSeatContainer,
  PromptContainer,
  SetupPromptContainer,
  SubmitErrorProvider,
  GundamTargetingProvider,
} from "./components/containers/index.ts";
import { SubmitErrorToast } from "./components/ui/SubmitErrorToast.tsx";
import { VsAiProvider } from "./game/bot/bot-context.tsx";
import { CardHoverPreview } from "./components/ui/card/CardHoverPreview.tsx";
import { CardInspectProvider } from "./components/ui/card/card-inspect-context.tsx";
import { DualModeProvider } from "./components/ui/dual-mode-context.tsx";
import { PendingEffectSelectionProvider } from "./components/ui/pending-effect-selection-context.tsx";
import { CardInspectDialog } from "./components/ui/CardInspectDialogContainer.tsx";
import { GundamSharedAnimationLayer } from "./animation/index.ts";
import { GundamBoardLayout } from "./components/ui/GundamBoardLayout.tsx";
import { GameTable } from "./components/ui/GameTable.tsx";
import { FloatingUndoButton } from "./components/ui/FloatingUndoButton.tsx";
import { PriorityActionButton } from "./components/ui/PriorityActionButton.tsx";
import type { DevRuntimeBotHandle } from "./game/dev-runtime.ts";
import type { ViewerId } from "./game/types.ts";
import { GundamDragDropProvider } from "./components/ui/playerSeat/gundam-drag-drop-context.tsx";

export interface SimulatorAppProps {
  readonly runtime: MatchRuntime;
  readonly staticResources: MatchStaticResources;
  readonly viewerId: ViewerId;
  readonly bot?: DevRuntimeBotHandle;
  /** Rebuild a local VS-AI scenario from its original configuration. */
  readonly onRestartScenario?: () => void;
}

export function SimulatorApp({
  runtime,
  staticResources,
  viewerId,
  bot,
  onRestartScenario,
}: SimulatorAppProps) {
  const layoutMode = useLayoutMode();
  const isMobile = layoutMode === "mobile";

  const matchTree = (
    <GundamBoardLayout>
      <GameTable>
        <PlayerSeatContainer side="top" />
        {!isMobile && (
          <div
            className="gd-dark-surface relative z-20 mx-3 flex h-12 flex-none items-stretch gap-2 border-y border-hud-border/60 bg-hud-deep/95 p-1.5 shadow-[0_8px_22px_rgba(5,10,24,.28)]"
            data-testid="desktop-match-rail"
          >
            <MatchStatusBarContainer embedded />
            <PriorityActionButton embedded />
            <FloatingUndoButton embedded />
          </div>
        )}
        <PlayerSeatContainer side="bottom" />

        <PromptContainer />
        <SetupPromptContainer />
        <AttackTargetingOverlayContainer />
        <PendingEffectsContainer />
        <MatchOverviewModalContainer />
        <SubmitErrorToast />
      </GameTable>
    </GundamBoardLayout>
  );

  return (
    <GundamGame runtime={runtime} staticResources={staticResources} viewerId={viewerId}>
      <SubmitErrorProvider>
        <HintsProvider>
          <GundamTargetingProvider>
            <PendingEffectSelectionProvider>
              <DualModeProvider>
                <CardInspectProvider>
                  <GundamSharedAnimationLayer runtime={runtime}>
                    <GundamDragDropProvider>
                      {bot ? (
                        <VsAiProvider
                          bot={bot}
                          runtime={runtime}
                          onRestartScenario={onRestartScenario}
                        >
                          {matchTree}
                        </VsAiProvider>
                      ) : (
                        matchTree
                      )}
                    </GundamDragDropProvider>
                  </GundamSharedAnimationLayer>
                  <CardHoverPreview />
                  <CardInspectDialog />
                </CardInspectProvider>
              </DualModeProvider>
            </PendingEffectSelectionProvider>
          </GundamTargetingProvider>
        </HintsProvider>
      </SubmitErrorProvider>
    </GundamGame>
  );
}
