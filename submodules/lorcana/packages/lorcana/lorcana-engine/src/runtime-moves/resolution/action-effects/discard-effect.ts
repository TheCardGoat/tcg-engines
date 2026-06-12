import type { CardInstanceId, PlayerId } from "#core";
import type { CardSelectionFilter, DiscardEffect, LorcanaTargetDSL } from "@tcg/lorcana-types";
import type { CardPlayedPayload, TargetResolutionSelectionContext } from "../../../types";
import { emitTriggeredLorcanaEvent, queueTriggeredEvent } from "../../effects/triggered-abilities";
import { applyReplacementEffects } from "../../effects/replacement-effects";
import { resolveTargetPlayerIds } from "./player-target-resolver";
import { createPendingActionEffect, enqueuePendingActionEffect } from "./pending-action-effects";
import { markLastEffectPerformed } from "./event-snapshot-utils";
import type {
  ActionEffectResolutionOptions,
  ActionResolutionInput,
  ActionResolutionResult,
  PlayCardExecutionContext,
} from "./types";
import { getCombinedSelectionInput, getCurrentSelectionTargets } from "./selection-state";

type ResolvedDiscardEffectInput = {
  discardAmount?: number;
  discardAll?: boolean;
  selectedTargets?: CardInstanceId[];
  variableSelection?: boolean;
};

type CardDefinitionLike = {
  cardType?: string;
  actionSubtype?: string;
  classifications?: string[];
  cost?: number;
};

export function isDiscardEffect(effect: unknown): effect is DiscardEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "discard"
  );
}

function matchesDiscardFilter(
  ctx: PlayCardExecutionContext,
  cardId: CardInstanceId,
  effect: DiscardEffect,
): boolean {
  const rawFilter = effect.filter;
  const filter =
    rawFilter &&
    !Array.isArray(rawFilter) &&
    !("type" in rawFilter && typeof rawFilter.type === "string")
      ? (rawFilter as CardSelectionFilter)
      : undefined;
  if (!filter) {
    return true;
  }

  const definition = ctx.cards.getDefinition(cardId) as CardDefinitionLike | undefined;
  if (!definition) {
    return false;
  }

  if (typeof filter.cardType === "string") {
    if (filter.cardType === "song") {
      if (definition.cardType !== "action" || definition.actionSubtype !== "song") {
        return false;
      }
    } else if (definition.cardType !== filter.cardType) {
      return false;
    }
  }

  if (typeof filter.notCardType === "string") {
    if (filter.notCardType === "song") {
      if (definition.actionSubtype === "song") {
        return false;
      }
    } else if (definition.cardType === filter.notCardType) {
      return false;
    }
  }

  if (typeof filter.maxCost === "number") {
    const cost = Number(definition.cost ?? 0);
    if (!Number.isFinite(cost) || cost > filter.maxCost) {
      return false;
    }
  }

  if (typeof filter.classification === "string") {
    const classifications = definition.classifications ?? [];
    if (!classifications.includes(filter.classification)) {
      return false;
    }
  }

  return true;
}

function pickRandomCards<T>(
  ctx: PlayCardExecutionContext,
  cards: readonly T[],
  count: number,
): T[] {
  return ctx.framework.random.shuffle([...cards]).slice(0, count);
}

export function resolveDiscardEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: DiscardEffect,
  resolutionInput: ActionResolutionInput,
  resolvedInput: ResolvedDiscardEffectInput,
  options?: ActionEffectResolutionOptions,
): ActionResolutionResult {
  const selectedTargets =
    resolvedInput.selectedTargets ??
    getCurrentSelectionTargets(resolutionInput).filter(
      (targetId): targetId is CardInstanceId => typeof targetId === "string",
    );
  // When target is CARD_OWNER, derive the owner from selectedTargets.
  // If selectedTargets is empty (e.g. in a sequence where the prior step resolved
  // the card via an event-snapshot ref like "trigger-source" rather than passing it
  // through currentTargets), fall back to eventSnapshot.chosenCardId which
  // return-to-hand (and similar effects) write after resolving their ref target.
  const cardOwnerSourceIds: CardInstanceId[] =
    selectedTargets.length > 0
      ? selectedTargets
      : effect.target === "CARD_OWNER" && resolutionInput.eventSnapshot?.chosenCardId != null
        ? [resolutionInput.eventSnapshot.chosenCardId as CardInstanceId]
        : [];
  const targetPlayerIds =
    effect.target === "CARD_OWNER"
      ? [
          ...new Set(
            cardOwnerSourceIds
              .map((cardId) => ctx.framework.zones.getCardOwner(cardId) as string | undefined)
              .filter(
                (playerId): playerId is string =>
                  typeof playerId === "string" &&
                  ctx.framework.state.playerIds.includes(
                    playerId as (typeof ctx.framework.state.playerIds)[number],
                  ),
              ),
          ),
        ]
      : resolveTargetPlayerIds(
          ctx,
          cardPlayed,
          effect.target,
          getCombinedSelectionInput(resolutionInput),
          resolutionInput.eventSnapshot,
        );

  const discardAll = resolvedInput.discardAll === true;
  const amount = discardAll
    ? Number.POSITIVE_INFINITY
    : typeof resolvedInput.discardAmount === "number" &&
        Number.isFinite(resolvedInput.discardAmount) &&
        resolvedInput.discardAmount >= 0
      ? Math.floor(resolvedInput.discardAmount)
      : 1;

  if (targetPlayerIds.length === 0 || (amount <= 0 && resolvedInput.variableSelection !== true)) {
    markLastEffectPerformed(resolutionInput.eventSnapshot, false);
    return { status: "resolved" };
  }

  const sourceZone = effect.from ?? "hand";
  const actorId = (ctx.playerId ??
    ctx.framework.state.currentPlayer ??
    ctx.framework.state.priority.holder) as PlayerId | undefined;
  let discardedAny = false;

  for (const targetPlayerId of targetPlayerIds) {
    // Check if a replacement effect prevents this player from discarding
    const discardEvent = applyReplacementEffects(ctx, {
      kind: "discard",
      eventId: `discard:${targetPlayerId}:${cardPlayed.cardId}`,
      sourceId: cardPlayed.cardId,
      controllerId: cardPlayed.playerId,
      targetPlayerId: targetPlayerId as PlayerId,
      amount,
      prevented: false,
    });
    if (discardEvent.prevented) {
      continue;
    }

    const candidates = (
      ctx.framework.zones.getCards({
        zone: sourceZone,
        playerId: targetPlayerId,
      }) as CardInstanceId[]
    ).filter(
      (cardId) =>
        !(
          sourceZone === "hand" &&
          cardId === cardPlayed.cardId &&
          targetPlayerId === cardPlayed.playerId
        ) && matchesDiscardFilter(ctx, cardId, effect),
    );
    if (candidates.length === 0) {
      continue;
    }

    const effectiveAmount =
      resolvedInput.variableSelection === true
        ? candidates.length
        : discardAll
          ? candidates.length
          : Math.min(amount, candidates.length);
    const candidateSet = new Set<CardInstanceId>(candidates);
    const selectedFromCandidates = selectedTargets.filter((cardId) => candidateSet.has(cardId));
    const chooserId =
      effect.chosenBy === "you"
        ? cardPlayed.playerId
        : effect.chosenBy === "opponent"
          ? ((ctx.framework.state.playerIds.find((playerId) => playerId !== cardPlayed.playerId) ??
              targetPlayerId) as PlayerId)
          : targetPlayerId;
    const requiresExplicitSelectionByRules =
      sourceZone === "hand" && !discardAll && (effect.random !== true || effect.chosen === true);
    const requiresExplicitSelection =
      requiresExplicitSelectionByRules &&
      (resolvedInput.variableSelection === true ||
        actorId !== chooserId ||
        selectedFromCandidates.length < effectiveAmount);
    if (requiresExplicitSelection) {
      const selectionAmount = Math.min(effectiveAmount, candidates.length);
      if (selectionAmount === 0) {
        continue;
      }
      const minSelections = resolvedInput.variableSelection === true ? 0 : selectionAmount;
      const maxSelections =
        resolvedInput.variableSelection === true ? candidates.length : selectionAmount;
      const currentTargets = getCurrentSelectionTargets(resolutionInput);
      const discardSelectionContext: TargetResolutionSelectionContext = {
        origin: "pending-effect",
        requestId: `discard:${targetPlayerId}:${cardPlayed.cardId}`,
        kind: "discard-choice",
        sourceCardId: cardPlayed.cardId,
        chooserId: chooserId as PlayerId,
        currentSelection: currentTargets.length > 0 ? { targets: [...currentTargets] } : {},
        submitField: "targets",
        targetDsl: [
          {
            selector: "chosen",
            count:
              resolvedInput.variableSelection === true
                ? { upTo: candidates.length }
                : selectionAmount,
          } as LorcanaTargetDSL,
        ],
        cardCandidateIds: [...candidates],
        playerCandidateIds: [],
        allowedZones: [sourceZone as "deck" | "hand" | "play" | "discard" | "inkwell" | "limbo"],
        minSelections,
        maxSelections,
        ordered: false,
        autoRejected: false,
      };
      const pendingEffect = createPendingActionEffect(ctx, {
        kind: "discard-choice",
        sourceCardId: cardPlayed.cardId,
        controllerId: cardPlayed.playerId,
        chooserId: chooserId as PlayerId,
        abilityIndex: options?.sourceAbilityIndex,
        cardPlayed,
        effect,
        continuation: options?.continuation,
        resolutionInput,
        selectionContext: discardSelectionContext,
      });
      enqueuePendingActionEffect(ctx, pendingEffect);
      return {
        status: "suspended",
        pendingEffect,
      };
    }

    const cardsToDiscard =
      effect.random === true && effect.chosen !== true
        ? pickRandomCards(ctx, candidates, effectiveAmount)
        : selectedFromCandidates.length > 0
          ? selectedFromCandidates.slice(0, effectiveAmount)
          : candidates.slice(0, effectiveAmount);

    for (const cardId of cardsToDiscard) {
      ctx.framework.zones.moveCard(cardId, {
        zone: "discard",
        playerId: targetPlayerId,
      });
    }

    if (cardsToDiscard.length > 0) {
      discardedAny = true;
      emitTriggeredLorcanaEvent(ctx, "cardsDiscarded", {
        playerId: targetPlayerId as PlayerId,
        amount: cardsToDiscard.length,
        cardIds: cardsToDiscard,
      });
      // Accumulate discarded card IDs for downstream count effects (e.g. "count action cards discarded")
      if (!resolutionInput.eventSnapshot) {
        resolutionInput.eventSnapshot = {};
      }
      const existing = resolutionInput.eventSnapshot.discardedCardIds ?? [];
      resolutionInput.eventSnapshot.discardedCardIds = [
        ...existing,
        ...cardsToDiscard,
      ] as import("#core").CardInstanceId[];
      const triggerBatchKey = cardsToDiscard.join("|");
      for (const cardId of cardsToDiscard) {
        queueTriggeredEvent(ctx, {
          event: "discard",
          playerId: targetPlayerId as PlayerId,
          subjectCardId: cardId,
          triggerSourceCardId: cardId,
          eventSnapshot: {
            triggerBatchKey,
            triggerAmount: cardsToDiscard.length,
          },
        });
      }
    }
  }

  markLastEffectPerformed(resolutionInput.eventSnapshot, discardedAny);
  return { status: "resolved" };
}
