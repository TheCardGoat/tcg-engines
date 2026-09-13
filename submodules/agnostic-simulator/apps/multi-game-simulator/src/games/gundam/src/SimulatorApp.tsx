import type { MatchRuntime, MatchStaticResources } from "@tcg/gundam-engine";

import { HintsProvider } from "./lib/use-hints-enabled.ts";
import { GundamGame } from "./components/GundamGame.tsx";
import {
  AttackTargetingOverlayContainer,
  AutoPassActionStepContainer,
  BattleStepRibbonContainer,
  CombatIntentOverlayContainer,
  MatchOverviewModalContainer,
  PlayerSeatContainer,
  PromptContainer,
  SetupPromptContainer,
  SubmitErrorProvider,
  GundamTargetingProvider,
} from "./components/containers/index.ts";
import { SubmitErrorToast } from "./components/ui/SubmitErrorToast.tsx";
import { VsAiProvider } from "./game/bot/bot-context.tsx";
import { CardInspectProvider } from "./components/ui/card/card-inspect-context.tsx";
import { DualModeProvider } from "./components/ui/dual-mode-context.tsx";
import { GundamInteractionDraftProvider } from "./game/interaction-draft.tsx";
import { CardInspectDialog } from "./components/ui/CardInspectDialogContainer.tsx";
import { GundamSharedAnimationLayer } from "./animation/index.ts";
import { GundamBoardLayout } from "./components/ui/GundamBoardLayout.tsx";
import { GameTable } from "./components/ui/GameTable.tsx";
import type { DevRuntimeBotHandle } from "./game/dev-runtime.ts";
import type { GundamPresentation } from "@tcg/gundam-server-adapter";
import type { ViewerId } from "./game/types.ts";
import { GundamDragDropProvider } from "./components/ui/playerSeat/gundam-drag-drop-context.tsx";
import { GundamCardContextController } from "./components/GundamCardContextController.tsx";
import { AutoPassWhenNoValidActionProvider } from "./lib/auto-pass-settings.tsx";

export interface SimulatorAppProps {
  readonly runtime: MatchRuntime;
  readonly staticResources: MatchStaticResources;
  readonly viewerId: ViewerId;
  readonly presentation?: GundamPresentation;
  readonly bot?: DevRuntimeBotHandle;
  /** Rebuild a local VS-AI scenario from its original configuration. */
  readonly onRestartScenario?: () => void;
}

export function SimulatorApp({
  runtime,
  staticResources,
  viewerId,
  presentation,
  bot,
  onRestartScenario,
}: SimulatorAppProps) {
  const matchTree = (
    <GundamBoardLayout>
      <GameTable>
        <PlayerSeatContainer side="top" />
        <BattleStepRibbonContainer />
        <PlayerSeatContainer side="bottom" />

        <PromptContainer />
        <AutoPassActionStepContainer />
        <SetupPromptContainer />
        <AttackTargetingOverlayContainer />
        <CombatIntentOverlayContainer />
        <MatchOverviewModalContainer />
        <SubmitErrorToast />
      </GameTable>
    </GundamBoardLayout>
  );

  return (
    <GundamGame
      runtime={runtime}
      staticResources={staticResources}
      viewerId={viewerId}
      presentation={presentation}
    >
      <SubmitErrorProvider>
        <AutoPassWhenNoValidActionProvider>
          <HintsProvider>
            <GundamInteractionDraftProvider>
              <GundamTargetingProvider>
                <DualModeProvider>
                  <CardInspectProvider>
                    <GundamDragDropProvider>
                      <GundamSharedAnimationLayer runtime={runtime}>
                        <GundamCardContextController>
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
                        </GundamCardContextController>
                      </GundamSharedAnimationLayer>
                    </GundamDragDropProvider>
                    <CardInspectDialog />
                  </CardInspectProvider>
                </DualModeProvider>
              </GundamTargetingProvider>
            </GundamInteractionDraftProvider>
          </HintsProvider>
        </AutoPassWhenNoValidActionProvider>
      </SubmitErrorProvider>
    </GundamGame>
  );
}
