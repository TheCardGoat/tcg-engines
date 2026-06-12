import { useMemo, type ReactNode } from "react";
import { defOf } from "@tcg/cyberpunk-engine";
import { SimulatorAnimationLayer } from "@tcg/simulator-ui";
import type { SimulatorEntity } from "@tcg/simulator-contract";

import { PLAYER_SIDE_TO_ID, useEngine } from "../engine";
import { cyberpunkAnimationScriptToSimulatorEvents } from "./sharedEvents";

export function CyberpunkSharedAnimationLayer({ children }: { children: ReactNode }) {
  const { humanSide, matchState, rawEngineEvents } = useEngine();
  const viewerSeatId = String(PLAYER_SIDE_TO_ID[humanSide]);

  const events = useMemo(
    () =>
      rawEngineEvents.flatMap((entry) =>
        cyberpunkAnimationScriptToSimulatorEvents(entry.animationScript, {
          viewerSeatId,
          resolveEntity: (cardId) => simulatorEntityForCard(cardId, matchState),
          idPrefix: String(entry.id),
        }),
      ),
    [matchState, rawEngineEvents, viewerSeatId],
  );

  return <SimulatorAnimationLayer events={events}>{children}</SimulatorAnimationLayer>;
}

function simulatorEntityForCard(
  cardId: string,
  matchState: ReturnType<typeof useEngine>["matchState"],
) {
  const instance = matchState.G.cardIndex[cardId];
  if (!instance) {
    return null;
  }

  const definition = defOf(instance);
  return {
    id: cardId,
    title: definition.displayName ?? definition.name,
    subtitle: definition.type,
    kind: simulatorEntityKind(definition.type),
    ownerId: String(instance.ownerId),
    face: instance.meta.faceDown ? "hidden" : "public",
    states: instance.meta.spent ? ["rested"] : [],
    stats: [],
    traits: [...(definition.classifications ?? [])],
    imageUrl: definition.imageUrl,
  } satisfies SimulatorEntity;
}

function simulatorEntityKind(type: string): SimulatorEntity["kind"] {
  switch (type) {
    case "legend":
      return "leader";
    case "unit":
      return "unit";
    case "gear":
    case "program":
      return "card";
    default:
      return "card";
  }
}
