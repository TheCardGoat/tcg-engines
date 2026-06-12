import type { MatchRuntime, MatchStaticResources } from "@tcg/gundam-engine";

import { HintsProvider } from "./lib/use-hints-enabled.ts";
import { GundamGame } from "./components/GundamGame.tsx";
import { SubmitErrorProvider } from "./components/containers/index.ts";
import { VsAiProvider } from "./game/bot/bot-context.tsx";
import { CardHoverPreview } from "./components/ui/card/CardHoverPreview.tsx";
import { CardInspectProvider } from "./components/ui/card/card-inspect-context.tsx";
import { TargetingProvider } from "./components/ui/targeting-context.tsx";
import { DualModeProvider } from "./components/ui/dual-mode-context.tsx";
import { PendingEffectSelectionProvider } from "./components/ui/pending-effect-selection-context.tsx";
import { CardInspectDialog } from "./components/ui/CardInspectDialogContainer.tsx";
import { GundamSharedAnimationLayer } from "./animation/index.ts";
import { GundamSimulatorShell } from "./components/GundamSimulatorShell.tsx";
import type { DevRuntimeBotHandle } from "./game/dev-runtime.ts";
import type { ViewerId } from "./game/types.ts";

export interface SimulatorAppProps {
  readonly runtime: MatchRuntime;
  readonly staticResources: MatchStaticResources;
  readonly viewerId: ViewerId;
  readonly bot?: DevRuntimeBotHandle;
}

export function SimulatorApp({ runtime, staticResources, viewerId, bot }: SimulatorAppProps) {
  const matchTree = <GundamSimulatorShell />;

  return (
    <GundamGame runtime={runtime} staticResources={staticResources} viewerId={viewerId}>
      <SubmitErrorProvider>
        <HintsProvider>
          <TargetingProvider>
            <PendingEffectSelectionProvider>
              <DualModeProvider>
                <CardInspectProvider>
                  <GundamSharedAnimationLayer>
                    {bot ? <VsAiProvider bot={bot}>{matchTree}</VsAiProvider> : matchTree}
                  </GundamSharedAnimationLayer>
                  <CardHoverPreview />
                  <CardInspectDialog />
                </CardInspectProvider>
              </DualModeProvider>
            </PendingEffectSelectionProvider>
          </TargetingProvider>
        </HintsProvider>
      </SubmitErrorProvider>
    </GundamGame>
  );
}
