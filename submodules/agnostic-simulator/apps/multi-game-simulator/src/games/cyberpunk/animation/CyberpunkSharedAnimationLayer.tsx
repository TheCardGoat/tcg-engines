import { useMemo, type ReactNode } from "react";
import { SimulatorAnimationLayer } from "@tcg/simulator-ui";

import { PLAYER_SIDE_TO_ID, useEngine } from "../engine";
import { projectEntityForCard } from "../engine/projectSimulator";
import { cyberpunkAnimationScriptToSimulatorEvents } from "./sharedEvents";

export function CyberpunkSharedAnimationLayer({ children }: { children: ReactNode }) {
  const { humanSide, matchState, rawEngineEvents } = useEngine();
  const viewerSeatId = String(PLAYER_SIDE_TO_ID[humanSide]);

  const events = useMemo(
    () =>
      rawEngineEvents.flatMap((entry) =>
        cyberpunkAnimationScriptToSimulatorEvents(entry.animationScript, {
          viewerSeatId,
          resolveEntity: (cardId) => projectEntityForCard(cardId, matchState, humanSide),
          idPrefix: String(entry.id),
        }),
      ),
    [matchState, rawEngineEvents, viewerSeatId, humanSide],
  );

  return <SimulatorAnimationLayer events={events}>{children}</SimulatorAnimationLayer>;
}
