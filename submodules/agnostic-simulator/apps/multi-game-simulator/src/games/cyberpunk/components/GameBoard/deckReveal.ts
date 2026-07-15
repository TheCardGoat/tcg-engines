import { useMemo } from "react";
import type { EngineInteractionView, EntitySelectionInput, InteractionAction } from "@tcg/protocol";
import type { SimulatorDeckReveal } from "@tcg/simulator-contract";

import {
  PLAYER_SIDE_TO_ID,
  useEngine,
  type MoveLog,
  type MoveLogEntry,
  type Side,
} from "../../engine";
import { buildCyberpunkDeckReveal } from "../../engine/deckRevealProjection";

type CyberpunkMatchState = ReturnType<typeof useEngine>["matchState"];

export function useDeckRevealForSide(side: Side): SimulatorDeckReveal | undefined {
  const { humanSide, interactionViews, matchState, moveLogs } = useEngine();
  const turnNumber = matchState.G.turnMetadata.turnNumber;

  return useMemo(() => {
    const pending = pendingDeckRevealForSide({
      side,
      humanSide,
      interactionViews,
      matchState,
      turnNumber,
    });
    if (pending) {
      return pending;
    }
    return loggedDeckRevealForSide({
      side,
      matchState,
      moveLogs,
      turnNumber,
    });
  }, [humanSide, interactionViews, matchState, moveLogs, side, turnNumber]);
}

function pendingDeckRevealForSide(input: {
  side: Side;
  humanSide: Side;
  interactionViews: Readonly<Record<Side, EngineInteractionView>>;
  matchState: CyberpunkMatchState;
  turnNumber: number;
}): SimulatorDeckReveal | undefined {
  const ownerId = String(PLAYER_SIDE_TO_ID[input.side]);
  const zoneId = deckZoneIdForSide(input.side);

  const searchAction = input.interactionViews[input.side].actions.find(
    (action) => action.id === "resolveScry",
  );
  if (searchAction) {
    const cardIds = entityInput(searchAction, "selectedCardIds")?.candidates.flatMap((candidate) =>
      candidate.entity.kind === "card" ? [String(candidate.entity.instanceId)] : [],
    );
    const identityVisible = input.side === input.humanSide;
    const count = cardIds?.length ?? numberParam(searchAction, "lookCount") ?? 0;
    if (count > 0) {
      const reveal = buildCyberpunkDeckReveal({
        id: `${zoneId}:pending-search:${searchAction.requestId}`,
        zoneId,
        ownerId,
        position: "top",
        visibility: identityVisible ? "public" : "private",
        turnNumber: input.turnNumber,
        cardIds: identityVisible ? (cardIds ?? []) : [],
        count,
        matchState: input.matchState,
        requireDeckPosition: true,
      });
      if (reveal) return reveal;
    }
  }

  for (const view of Object.values(input.interactionViews)) {
    const revealAction = view.actions.find((action) => action.id === "resolveRevealDestination");
    if (!revealAction || textParam(revealAction, "destinationOwnerId") !== ownerId) {
      continue;
    }
    const cardIds = delimitedTextParam(revealAction, "revealedCardIds");
    const count = cardIds.length || numberParam(revealAction, "revealedCount") || 0;
    if (count <= 0) {
      continue;
    }
    const reveal = buildCyberpunkDeckReveal({
      id: `${zoneId}:pending-reveal:${revealAction.requestId}`,
      zoneId,
      ownerId,
      position: "top",
      visibility: cardIds.length > 0 ? "public" : "private",
      turnNumber: input.turnNumber,
      cardIds,
      count,
      matchState: input.matchState,
      requireDeckPosition: true,
    });
    if (reveal) return reveal;
  }

  return undefined;
}

function loggedDeckRevealForSide(input: {
  side: Side;
  matchState: CyberpunkMatchState;
  moveLogs: ReadonlyArray<MoveLogEntry>;
  turnNumber: number;
}): SimulatorDeckReveal | undefined {
  const zoneId = deckZoneIdForSide(input.side);
  const ownerId = String(PLAYER_SIDE_TO_ID[input.side]);
  const revealLog = [...input.moveLogs]
    .reverse()
    .find(
      (entry) =>
        entry.side === input.side &&
        entry.log.type === "searchDeck" &&
        entry.log.turnNumber === input.turnNumber,
    );

  if (!revealLog || revealLog.log.type !== "searchDeck" || revealLog.log.revealedCount <= 0) {
    return undefined;
  }

  const revealedIds = visibleRevealedIds(revealLog.log);
  if (revealedIds.length === 0) {
    return undefined;
  }
  return buildCyberpunkDeckReveal({
    id: `${zoneId}:logged:${revealLog.id}`,
    zoneId,
    ownerId,
    position: "top",
    visibility: revealedIds.length > 0 ? "public" : "private",
    turnNumber: input.turnNumber,
    cardIds: revealedIds,
    count: revealLog.log.revealedCount,
    matchState: input.matchState,
    requireDeckPosition: true,
  });
}

function visibleRevealedIds(log: Extract<MoveLog, { type: "searchDeck" }>): string[] {
  return Array.isArray(log.revealed) ? log.revealed.map(String) : [];
}

function entityInput(action: InteractionAction, id: string): EntitySelectionInput | undefined {
  return action.inputs.find(
    (input): input is EntitySelectionInput => input.kind === "entity-selection" && input.id === id,
  );
}

function textParam(action: InteractionAction, key: string): string | undefined {
  const value = action.text.params?.[key];
  return typeof value === "string" ? value : undefined;
}

function numberParam(action: InteractionAction, key: string): number | undefined {
  const value = action.text.params?.[key];
  return typeof value === "number" ? value : undefined;
}

function delimitedTextParam(action: InteractionAction, key: string): string[] {
  return (
    textParam(action, key)
      ?.split(",")
      .map((value) => value.trim())
      .filter((value) => value.length > 0) ?? []
  );
}

function deckZoneIdForSide(side: Side): string {
  return side === "opponent" ? "opp-deck" : "p-deck";
}
