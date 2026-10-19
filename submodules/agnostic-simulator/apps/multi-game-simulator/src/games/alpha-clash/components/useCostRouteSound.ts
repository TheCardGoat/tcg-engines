import { useEffect, useRef } from "react";
import type { InteractionSubmissionValue } from "@tcg/protocol";
import { playSimulatorSound } from "@tcg/simulator-presentation/audio/sound-service";
import type { ArenaProps } from "./board-types";

/** Cue only a committed native payment, never a tentative selection or a retry. */
export function useCostRouteSound(
  draft: { actionId?: string; values: Readonly<Record<string, InteractionSubmissionValue>> },
  board: ArenaProps["board"],
  stateVersion: number,
  sound: boolean,
) {
  const previous = useRef<{ sourceId: string; version: number; resources: boolean } | undefined>(
    undefined,
  );
  useEffect(() => {
    const paid = previous.current;
    if (paid && paid.version !== stateVersion) {
      previous.current = undefined;
      if (
        sound &&
        !document.hidden &&
        board.cards.some((card) => card.instanceId === paid.sourceId && card.zone === "standby")
      )
        playSimulatorSound(paid.resources ? "resource.spend" : "card.move");
    }
    if (draft.actionId && draft.values.costRoute)
      previous.current = {
        sourceId: draft.actionId.slice(draft.actionId.indexOf(":") + 1),
        version: stateVersion,
        resources:
          Array.isArray(draft.values.costResources) && draft.values.costResources.length > 0,
      };
    else previous.current = undefined;
  }, [draft.actionId, draft.values, board.cards, stateVersion, sound]);
}
