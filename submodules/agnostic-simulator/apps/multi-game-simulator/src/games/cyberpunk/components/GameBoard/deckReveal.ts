import { useMemo } from "react";
import type { EngineInteractionView, EntitySelectionInput, InteractionAction } from "@tcg/protocol";
import {
  PLAYER_SIDE_TO_ID,
  useEngine,
  type MoveLog,
  type MoveLogEntry,
  type Side,
} from "../../engine";
import {
  buildCyberpunkDeckReveal,
  type CyberpunkDeckReveal,
  deckRevealSourceFromCardId,
  type DeckRevealSourceInfo,
} from "../../engine/deckRevealProjection";

type CyberpunkMatchState = ReturnType<typeof useEngine>["matchState"];

export function useDeckRevealForSide(side: Side): CyberpunkDeckReveal | undefined {
  return useDeckRevealProjection(side, false);
}

/** Only the live choice may start a reveal cue before its transition plan exists. */
export function usePendingDeckRevealForSide(side: Side): CyberpunkDeckReveal | undefined {
  return useDeckRevealProjection(side, true);
}

function useDeckRevealProjection(
  side: Side,
  pendingOnly: boolean,
): CyberpunkDeckReveal | undefined {
  const { humanSide, interactionViews, matchState, moveLogs } = useEngine();
  const turnNumber = matchState.G.turnMetadata.turnNumber;

  return useMemo(() => {
    const pending = pendingDeckRevealForSide({
      side,
      humanSide,
      interactionViews,
      matchState,
      moveLogs,
      turnNumber,
    });
    if (pending) {
      return pending;
    }
    return pendingOnly
      ? undefined
      : loggedDeckRevealForSide({
          side,
          matchState,
          moveLogs,
          turnNumber,
        });
  }, [humanSide, interactionViews, matchState, moveLogs, pendingOnly, side, turnNumber]);
}

function pendingDeckRevealForSide(input: {
  side: Side;
  humanSide: Side;
  interactionViews: Readonly<Record<Side, EngineInteractionView>>;
  matchState: CyberpunkMatchState;
  moveLogs: ReadonlyArray<MoveLogEntry>;
  turnNumber: number;
}): CyberpunkDeckReveal | undefined {
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
        id:
          matchingRevealLogId(input.moveLogs, input.side, input.turnNumber, cardIds ?? [], count) ??
          `${zoneId}:pending-search:${searchAction.requestId}`,
        zoneId,
        ownerId,
        position: "top",
        visibility: identityVisible ? "public" : "private",
        turnNumber: input.turnNumber,
        cardIds: identityVisible ? (cardIds ?? []) : [],
        count,
        matchState: input.matchState,
        requireDeckPosition: true,
        source: revealSource(searchAction, input.matchState),
        // resolveScry lives in the acting side's own interaction view, so the
        // searcher is always the deck owner here.
        actor: input.side,
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
    // The deck owner and the destination chooser both legally see the
    // identities; take-control seats chooser side flips humanSide away from
    // the owner, so test the chooser explicitly instead of ownership alone.
    const chooser = String(view.actorId ?? "");
    const chooserSide =
      chooser === String(PLAYER_SIDE_TO_ID.player)
        ? ("player" as const)
        : chooser === String(PLAYER_SIDE_TO_ID.opponent)
          ? ("opponent" as const)
          : null;
    const identityVisible =
      input.side === input.humanSide || (chooserSide !== null && chooserSide === input.humanSide);
    const reveal = buildCyberpunkDeckReveal({
      id:
        matchingRevealLogId(input.moveLogs, input.side, input.turnNumber, cardIds, count) ??
        `${zoneId}:pending-reveal:${revealAction.requestId}`,
      zoneId,
      ownerId,
      position: "top",
      visibility: identityVisible && cardIds.length > 0 ? "public" : "private",
      turnNumber: input.turnNumber,
      cardIds: identityVisible ? cardIds : [],
      count,
      matchState: input.matchState,
      requireDeckPosition: true,
      source: revealSource(revealAction, input.matchState),
      actor: chooserSide ?? undefined,
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
}): CyberpunkDeckReveal | undefined {
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
    actor: sideForPlayerId(revealLog.log.playerId),
  });
}

function sideForPlayerId(playerId: string): "player" | "opponent" | undefined {
  if (playerId === String(PLAYER_SIDE_TO_ID.player)) return "player";
  if (playerId === String(PLAYER_SIDE_TO_ID.opponent)) return "opponent";
  return undefined;
}

function visibleRevealedIds(log: Extract<MoveLog, { type: "searchDeck" }>): string[] {
  return Array.isArray(log.revealed) ? log.revealed.map(String) : [];
}

function matchingRevealLogId(
  moveLogs: ReadonlyArray<MoveLogEntry>,
  side: Side,
  turnNumber: number,
  cardIds: readonly string[],
  count: number,
): string | undefined {
  if (cardIds.length === 0) return undefined;
  const revealLog = [...moveLogs].reverse().find((entry) => {
    if (
      entry.side !== side ||
      entry.log.type !== "searchDeck" ||
      entry.log.turnNumber !== turnNumber ||
      entry.log.revealedCount !== count
    ) {
      return false;
    }
    const loggedIds = visibleRevealedIds(entry.log);
    return (
      loggedIds.length === cardIds.length && loggedIds.every((id, index) => id === cardIds[index])
    );
  });
  return revealLog ? `${deckZoneIdForSide(side)}:logged:${revealLog.id}` : undefined;
}

/**
 * The ability card behind a pending reveal, resolved to caption-ready art.
 * Both the scry and reveal-destination actions carry the source card; the
 * name param is the fallback when the card is no longer in the index.
 */
function revealSource(
  action: InteractionAction,
  matchState: CyberpunkMatchState,
): DeckRevealSourceInfo | undefined {
  const fromCard = deckRevealSourceFromCardId(matchState, textParam(action, "sourceCardId"));
  if (fromCard) return fromCard;
  const fallbackName = textParam(action, "sourceDisplayName");
  return fallbackName ? { title: fallbackName } : undefined;
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
