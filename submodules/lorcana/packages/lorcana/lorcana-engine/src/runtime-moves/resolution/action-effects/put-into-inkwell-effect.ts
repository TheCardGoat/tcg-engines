import type { CardInstanceId, PlayerId } from "#core";
import type { PutIntoInkwellEffect } from "@tcg/lorcana-types";
import type { CardPlayedPayload } from "../../../types";
import {
  emitTriggeredLorcanaEvent,
  snapshotTriggeredCandidatesForCard,
} from "../../../triggered-abilities";
import { moveCardOutOfPlayWithStack } from "../../state/shift-stack";
import { resolveTargetPlayerIds } from "./player-target-resolver";
import type { ActionResolutionInput, PlayCardExecutionContext } from "./types";
import { markLastEffectPerformed } from "./event-snapshot-utils";
import { handleUnsupportedActionEffect } from "./unsupported-action-effect";
import {
  isDiscardZoneKey,
  recordCardPutIntoInkwellThisTurn,
  recordDiscardExitThisTurn,
} from "../../state/turn-metrics";
import { resolveEffectTargets } from "../../../targeting/runtime";
import { runGameStateCheck } from "../../state/game-state-check";

export function isPutIntoInkwellEffect(effect: unknown): effect is PutIntoInkwellEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "put-into-inkwell"
  );
}

function normalizeSelectedTargets(targets: ActionResolutionInput["targets"]): CardInstanceId[] {
  if (!targets) {
    return [];
  }

  if (Array.isArray(targets)) {
    return [
      ...new Set(
        targets.filter((targetId): targetId is CardInstanceId => typeof targetId === "string"),
      ),
    ];
  }

  return typeof targets === "string" ? [targets as CardInstanceId] : [];
}

type PlayerTargetLike = Parameters<typeof resolveTargetPlayerIds>[2];

function isPlayerTargetLike(target: unknown): target is PlayerTargetLike {
  return (
    target === "SELF" ||
    target === "CONTROLLER" ||
    target === "OPPONENT" ||
    target === "OPPONENTS" ||
    target === "EACH_PLAYER" ||
    target === "EACH_OPPONENT" ||
    target === "ALL_PLAYERS" ||
    target === "CURRENT_TURN"
  );
}

function resolveCardOwnerId(
  ctx: PlayCardExecutionContext,
  cardId: CardInstanceId,
  fallbackPlayerId: PlayerId,
): PlayerId {
  const ownerId = ctx.framework.zones.getCardOwner(cardId);
  return typeof ownerId === "string" ? (ownerId as PlayerId) : fallbackPlayerId;
}

function isPrivateSourceZone(sourceZoneKey: string | undefined): boolean {
  if (typeof sourceZoneKey !== "string") return false;
  return (
    sourceZoneKey === "hand" ||
    sourceZoneKey.startsWith("hand:") ||
    sourceZoneKey === "deck" ||
    sourceZoneKey.startsWith("deck:")
  );
}

function moveCardIntoInkwell(
  ctx: PlayCardExecutionContext,
  cardId: CardInstanceId,
  destinationPlayerId: PlayerId,
  effect: PutIntoInkwellEffect,
): void {
  const sourceZoneKey = ctx.framework.zones.getCardZone(cardId);
  const state = effect.exerted === false ? "ready" : "exerted";
  const publicFaceState = effect.facedown === false ? "faceUp" : "faceDown";
  const isFromPlay =
    typeof sourceZoneKey === "string" &&
    (sourceZoneKey === "play" || sourceZoneKey.startsWith("play:"));
  const isPrivateSource = isPrivateSourceZone(sourceZoneKey);

  if (isFromPlay) {
    const triggerCandidates = snapshotTriggeredCandidatesForCard(ctx, cardId);
    const ownerId =
      (ctx.framework.zones.getCardOwner(cardId) as PlayerId | undefined) ?? destinationPlayerId;

    const movedCardIds = moveCardOutOfPlayWithStack(ctx, cardId, {
      zone: "inkwell",
      playerId: destinationPlayerId,
    });

    for (const movedCardId of movedCardIds) {
      ctx.cards.patchMeta(movedCardId, { state, publicFaceState });
    }

    // Reveal the moved card (face-down in inkwell) to all players for the rest
    // of the turn so both players understand what was put into the inkwell.
    // Only reveal the top card of a shift stack — cards previously under it
    // were face-down in play and must remain hidden (THE-1029 F-14).
    if (movedCardIds.includes(cardId)) {
      const revealUntilStateID = (ctx.framework.state.stateID ?? 0) + 3;
      ctx.framework.zones.reveal([cardId], "all", {
        stateID: revealUntilStateID,
        affectsUndo: false,
      });
    }

    emitTriggeredLorcanaEvent(
      ctx,
      "cardInked",
      {
        playerId: ownerId,
        cardId,
        from: sourceZoneKey,
        to: "inkwell",
        exerted: state === "exerted",
        private: isPrivateSource,
      },
      {
        event: "ink",
        playerId: ownerId,
        subjectCardId: cardId,
        fromZone: sourceZoneKey,
        triggerCandidates,
      },
    );
    return;
  }

  ctx.framework.zones.moveCard(cardId, {
    zone: "inkwell",
    playerId: destinationPlayerId,
  });
  recordCardPutIntoInkwellThisTurn(ctx, cardId);
  ctx.cards.patchMeta(cardId, { state, publicFaceState });

  if (isDiscardZoneKey(sourceZoneKey)) {
    recordDiscardExitThisTurn(ctx);
    // Reveal from discard to all players for the rest of the turn
    const revealUntilStateID = (ctx.framework.state.stateID ?? 0) + 3;
    ctx.framework.zones.reveal([cardId], "all", {
      stateID: revealUntilStateID,
      affectsUndo: false,
    });
    const ownerId = resolveCardOwnerId(ctx, cardId, destinationPlayerId);
    emitTriggeredLorcanaEvent(
      ctx,
      "cardLeftDiscard",
      { cardId, ownerId, toZone: "inkwell" },
      {
        event: "leave-discard",
        playerId: ownerId,
        subjectCardId: cardId,
        fromZone: "discard",
        toZone: "inkwell",
      },
    );
  }

  emitTriggeredLorcanaEvent(
    ctx,
    "cardInked",
    {
      playerId: destinationPlayerId,
      cardId,
      from: sourceZoneKey ?? "unknown",
      to: `inkwell:${destinationPlayerId}`,
      exerted: state === "exerted",
      private: isPrivateSource,
    },
    {
      event: "ink",
      playerId: destinationPlayerId,
      subjectCardId: cardId,
      fromZone: sourceZoneKey,
    },
  );
}

function getSourceCards(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: PutIntoInkwellEffect,
  resolutionInput: ActionResolutionInput,
  destinationPlayerId: string,
  consumedSelectedTargets: ReadonlySet<CardInstanceId>,
): CardInstanceId[] {
  const source = effect.source ?? "top-of-deck";
  const selectedTargets = normalizeSelectedTargets(resolutionInput.targets).filter(
    (cardId) => !consumedSelectedTargets.has(cardId),
  );

  if (source === "this-card") {
    return [cardPlayed.cardId];
  }

  if (source === "revealed") {
    return (resolutionInput.eventSnapshot?.revealedCardIds as CardInstanceId[] | undefined) ?? [];
  }

  if (typeof source === "object" && source !== null) {
    return (
      resolveEffectTargets(
        ctx,
        cardPlayed,
        source,
        resolutionInput.targets,
        resolutionInput.eventSnapshot,
      ) ?? []
    );
  }

  if (source === "chosen-card-in-play" || source === "chosen-character") {
    if (selectedTargets.length > 0) {
      return selectedTargets;
    }

    return (
      resolveEffectTargets(
        ctx,
        cardPlayed,
        effect.target,
        resolutionInput.targets,
        resolutionInput.eventSnapshot,
      ) ?? []
    );
  }

  if (source === "top-of-deck") {
    return (
      ctx.framework.zones.getCards({
        zone: "deck",
        playerId: destinationPlayerId,
      }) as CardInstanceId[]
    ).slice(0, 1);
  }

  if (source === "deck" || source === "hand" || source === "discard") {
    const cardsInZone = ctx.framework.zones.getCards({
      zone: source,
      playerId: destinationPlayerId,
    }) as CardInstanceId[];
    if (selectedTargets.length > 0) {
      const zoneSet = new Set(cardsInZone);
      const selectedInZone = selectedTargets.filter((cardId) => zoneSet.has(cardId));
      if (selectedInZone.length > 0) {
        return selectedInZone;
      }
    }

    return [];
  }

  if (typeof source === "string") {
    handleUnsupportedActionEffect(
      "put-into-inkwell",
      `Unsupported source "${source}" in put-into-inkwell effect`,
    );
    return [];
  }
  return [];
}

export function resolvePutIntoInkwellEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: PutIntoInkwellEffect,
  resolutionInput: ActionResolutionInput,
): void {
  const consumedSelectedTargets = new Set<CardInstanceId>();
  let movedAny = false;
  const source = effect.source ?? "top-of-deck";
  if (
    (source === "chosen-card-in-play" || source === "chosen-character") &&
    !isPlayerTargetLike(effect.target)
  ) {
    const sourceCards = getSourceCards(
      ctx,
      cardPlayed,
      effect,
      resolutionInput,
      cardPlayed.playerId,
      consumedSelectedTargets,
    );
    const cardsToMove = [...new Set(sourceCards)];

    for (const cardId of cardsToMove) {
      const ownerId = resolveCardOwnerId(ctx, cardId, cardPlayed.playerId);
      moveCardIntoInkwell(ctx, cardId, ownerId, effect);
      consumedSelectedTargets.add(cardId);
      movedAny = true;
    }
    markLastEffectPerformed(resolutionInput.eventSnapshot, movedAny);
    if (movedAny) {
      runGameStateCheck(ctx, { reasonCardId: cardPlayed.cardId });
    }
    return;
  }

  const destinationPlayerIds = isPlayerTargetLike(effect.target)
    ? resolveTargetPlayerIds(ctx, cardPlayed, effect.target, resolutionInput.targets)
    : [cardPlayed.playerId];

  const resolvedDestinationPlayerIds =
    destinationPlayerIds.length > 0 ? destinationPlayerIds : [cardPlayed.playerId];

  for (const destinationPlayerId of resolvedDestinationPlayerIds) {
    const sourceCards = getSourceCards(
      ctx,
      cardPlayed,
      effect,
      resolutionInput,
      destinationPlayerId,
      consumedSelectedTargets,
    );
    const cardsToMove = [...new Set(sourceCards)];

    for (const cardId of cardsToMove) {
      moveCardIntoInkwell(ctx, cardId, destinationPlayerId as PlayerId, effect);
      consumedSelectedTargets.add(cardId);
      movedAny = true;
    }
  }

  markLastEffectPerformed(resolutionInput.eventSnapshot, movedAny);
  if (movedAny) {
    runGameStateCheck(ctx, { reasonCardId: cardPlayed.cardId });
  }
}
