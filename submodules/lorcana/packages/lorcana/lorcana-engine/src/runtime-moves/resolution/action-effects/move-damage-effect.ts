import type { CardInstanceId, PlayerId } from "#core";
import type { MoveDamageEffect } from "@tcg/lorcana-types";
import { isUpToAmount, unwrapAmount } from "@tcg/lorcana-types";
import type { CardPlayedPayload } from "../../../types";
import type { ActionResolutionInput, PlayCardExecutionContext } from "./types";
import { effectTargetUsesSelectionContext, getEffectTargetSelectionInput } from "./selection-state";
import { normalizeSelectedTargets, resolveEffectTargets } from "../../../targeting/runtime";
import { isSlotted } from "../../../targeting/slotted-targets";
import { applyReplacementEffects } from "../../effects/replacement-effects";
import { moveCardOutOfPlayWithStack } from "../../state/shift-stack";
import { getKeywordsBeforeBanish } from "../../shared/banish-snapshot";
import {
  emitTriggeredLorcanaEvent,
  snapshotTriggeredCandidatesForCard,
} from "../../effects/triggered-abilities";
import {
  recordBanishedCharacterThisTurn,
  recordDamageRemovedThisTurn,
} from "../../state/turn-metrics";
import { queueTriggeredEvent } from "../../../triggered-abilities";

export const DEFERRED_LETHAL_DAMAGE_SWEEP_FLAG = "__deferredLethalDamageSweep";

export function isMoveDamageEffect(effect: unknown): effect is MoveDamageEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "move-damage"
  );
}

function resolveEffectAmount(effect: MoveDamageEffect): number | undefined {
  if (effect.amount === undefined || effect.amount === "all") {
    return undefined;
  }

  // Peek through an "up-to" wrapper to find the concrete numeric cap.
  const { inner } = unwrapAmount(effect.amount);

  if (typeof inner !== "number" || !Number.isFinite(inner) || inner <= 0) {
    return undefined;
  }

  return Math.floor(inner);
}

function getCardDamage(ctx: PlayCardExecutionContext, cardId: CardInstanceId): number {
  const damage = Number(ctx.cards.require(cardId).meta?.damage ?? 0);
  return Number.isFinite(damage) && damage > 0 ? Math.floor(damage) : 0;
}

function setCardDamage(
  ctx: PlayCardExecutionContext,
  cardId: CardInstanceId,
  damage: number,
): void {
  ctx.cards.patchMeta(cardId, { damage });
}

export function resolveMoveDamageEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: MoveDamageEffect,
  resolutionInput: ActionResolutionInput,
): void {
  // Slot-aware path: when the caller supplied a `move-damage` slotted input,
  // read source and destination directly by slot key — no positional guessing,
  // no need to filter source out of destination candidates.
  if (isSlotted(resolutionInput.slottedTargets, "move-damage")) {
    const slottedFromInput = [...resolutionInput.slottedTargets.from];
    const slottedToInput = [...resolutionInput.slottedTargets.to];
    const sourceTargets =
      resolveEffectTargets(
        ctx,
        cardPlayed,
        effect.from ?? "ALL_CHARACTERS",
        slottedFromInput,
        undefined,
        { skipWardExclusion: true },
      ) ?? [];
    if (sourceTargets.length === 0) {
      return;
    }
    const toTarget = effect.to ?? "chosen-for-effect";
    const destinationSelectionInput =
      slottedToInput.length > 0
        ? slottedToInput
        : effectTargetUsesSelectionContext(effect.to)
          ? getEffectTargetSelectionInput(toTarget, resolutionInput)
          : slottedToInput;
    const destinationTargets =
      resolveEffectTargets(ctx, cardPlayed, toTarget, destinationSelectionInput) ?? [];
    const destinationId = destinationTargets[0];
    if (!destinationId) {
      return;
    }
    applyMoveDamage(ctx, cardPlayed, effect, resolutionInput, sourceTargets, destinationId);
    return;
  }

  // Legacy positional path: targets is a flat array where (by convention) the
  // UI collected source at index 0 and destination at later indices. Kept for
  // back-compat until all call sites emit slotted inputs.
  const sourceTargets =
    resolveEffectTargets(
      ctx,
      cardPlayed,
      effect.from ?? "ALL_CHARACTERS",
      resolutionInput.targets,
      undefined,
      { skipWardExclusion: true },
    ) ?? [];
  if (sourceTargets.length === 0) {
    return;
  }

  const selectedTargets = normalizeSelectedTargets(resolutionInput.targets);
  const remainingTargets = selectedTargets
    ? selectedTargets.filter((id) => !sourceTargets.includes(id))
    : undefined;
  const destinationTargetInput =
    remainingTargets !== undefined && remainingTargets.length > 0
      ? remainingTargets
      : resolutionInput.targets;
  const toTarget = effect.to ?? "chosen-for-effect";
  const destinationSelectionInput = effectTargetUsesSelectionContext(effect.to)
    ? getEffectTargetSelectionInput(toTarget, resolutionInput)
    : destinationTargetInput;
  const destinationTargets =
    resolveEffectTargets(ctx, cardPlayed, toTarget, destinationSelectionInput) ?? [];
  const destinationId = destinationTargets[0];
  if (!destinationId) {
    return;
  }

  applyMoveDamage(ctx, cardPlayed, effect, resolutionInput, sourceTargets, destinationId);
}

function applyMoveDamage(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: MoveDamageEffect,
  resolutionInput: ActionResolutionInput,
  sourceTargets: CardInstanceId[],
  destinationId: CardInstanceId,
): void {
  const effectAmount = resolveEffectAmount(effect);
  const allowsUpTo = isUpToAmount(effect.amount);
  const selectedAmount =
    allowsUpTo &&
    typeof resolutionInput.amount === "number" &&
    Number.isFinite(resolutionInput.amount) &&
    resolutionInput.amount >= 0
      ? Math.floor(resolutionInput.amount)
      : undefined;
  const amount =
    selectedAmount !== undefined
      ? effectAmount !== undefined
        ? Math.min(selectedAmount, effectAmount)
        : selectedAmount
      : effectAmount;
  const distribution = effect.distribution ?? "from-each-source";
  const destinationDamage = getCardDamage(ctx, destinationId);
  let movedTotal = 0;

  if (amount !== undefined && distribution === "aggregate") {
    let remaining = amount;
    for (const sourceId of sourceTargets) {
      if (sourceId === destinationId || remaining <= 0) {
        continue;
      }

      const sourceDamage = getCardDamage(ctx, sourceId);
      if (sourceDamage <= 0) {
        continue;
      }

      const raw = Math.min(sourceDamage, remaining);
      const replacedEvent = applyReplacementEffects(ctx, {
        kind: "remove-damage",
        eventId: `move-damage-source:${cardPlayed.cardId}:${sourceId}`,
        sourceId: cardPlayed.cardId,
        controllerId: cardPlayed.playerId,
        targetId: sourceId,
        amount: raw,
      });
      const moved = replacedEvent.amount;
      if (moved > 0) {
        setCardDamage(ctx, sourceId, sourceDamage - moved);
        movedTotal += moved;
        remaining -= moved;
        queueTriggeredEvent(ctx, {
          event: "remove-damage",
          playerId: ctx.framework.state.currentPlayer,
          subjectCardId: sourceId,
          triggerSourceCardId: cardPlayed.cardId,
          eventSnapshot: {
            healedAmount: moved,
            triggerAmount: moved,
          },
        });
        emitTriggeredLorcanaEvent(ctx, "damageMoved", {
          sourceCharacterId: sourceId,
          targetId: destinationId,
          amount: moved,
          abilitySourceId: cardPlayed.cardId,
        });
      }
    }
  } else {
    for (const sourceId of sourceTargets) {
      if (sourceId === destinationId) {
        continue;
      }

      const sourceDamage = getCardDamage(ctx, sourceId);
      if (sourceDamage <= 0) {
        continue;
      }

      const raw = amount === undefined ? sourceDamage : Math.min(sourceDamage, amount);
      const replacedEvent = applyReplacementEffects(ctx, {
        kind: "remove-damage",
        eventId: `move-damage-source:${cardPlayed.cardId}:${sourceId}`,
        sourceId: cardPlayed.cardId,
        controllerId: cardPlayed.playerId,
        targetId: sourceId,
        amount: raw,
      });
      const moved = replacedEvent.amount;
      if (moved > 0) {
        setCardDamage(ctx, sourceId, sourceDamage - moved);
        movedTotal += moved;
        queueTriggeredEvent(ctx, {
          event: "remove-damage",
          playerId: ctx.framework.state.currentPlayer,
          subjectCardId: sourceId,
          triggerSourceCardId: cardPlayed.cardId,
          eventSnapshot: {
            healedAmount: moved,
            triggerAmount: moved,
          },
        });
        emitTriggeredLorcanaEvent(ctx, "damageMoved", {
          sourceCharacterId: sourceId,
          targetId: destinationId,
          amount: moved,
          abilitySourceId: cardPlayed.cardId,
        });
      }
    }
  }

  if (movedTotal > 0) {
    // Per release-notes ruling: moving damage counts as removing damage from
    // the source. Track it on the turn metric so abilities keying off
    // "damage-removed-by-player this turn" (e.g. Isabela — Such a Lovely
    // Voice's New Motif, Julieta's Arepas — That Did the Trick) see this
    // as a remove event in addition to the queued remove-damage triggered
    // events above.
    recordDamageRemovedThisTurn(ctx, cardPlayed.playerId, movedTotal);

    // The destination "takes" the moved damage. Emit a put-damage replaceable
    // event so prevent-damage replacements (e.g. Lilo — Bundled Up EXTRA LAYERS)
    // can fire. If a replacement reduces the amount to 0, no damage lands on
    // the destination (source damage removal still stands).
    const replacedPut = applyReplacementEffects(ctx, {
      kind: "put-damage",
      eventId: `move-damage-destination:${cardPlayed.cardId}:${destinationId}`,
      sourceId: cardPlayed.cardId,
      controllerId: cardPlayed.playerId,
      targetId: destinationId,
      amount: movedTotal,
    });
    const applied = replacedPut.amount;
    if (applied <= 0) {
      if (resolutionInput.eventSnapshot) {
        resolutionInput.eventSnapshot.healedAmount = movedTotal;
      }
      return;
    }
    const newDamage = destinationDamage + applied;
    setCardDamage(ctx, destinationId, newDamage);

    // Check for lethal damage on the destination and banish if needed.
    // Some printed effects immediately move that damage away in the same
    // instruction sequence, so they opt out and let the full effect finish.
    const destDefinition = ctx.cards.getDefinition(destinationId) as
      | ({ willpower?: number; cardType?: string } & Record<string, unknown>)
      | undefined;
    const willpower = destDefinition?.willpower;
    if (
      effect.deferLethalBanish !== true &&
      typeof willpower === "number" &&
      newDamage >= willpower
    ) {
      const ownerId = ctx.framework.zones.getCardOwner(destinationId) as PlayerId | undefined;
      if (ownerId) {
        const keywordsBeforeBanish = getKeywordsBeforeBanish(
          ctx,
          destinationId,
          cardPlayed.playerId,
        );
        const subjectAtLocationId = ctx.cards.get(destinationId)?.meta?.atLocationId as
          | CardInstanceId
          | undefined;
        const triggerCandidates = snapshotTriggeredCandidatesForCard(ctx, destinationId);
        moveCardOutOfPlayWithStack(ctx, destinationId, {
          zone: "discard",
          playerId: ownerId,
        });
        emitTriggeredLorcanaEvent(
          ctx,
          "cardBanished",
          {
            cardId: destinationId,
            sourceId: cardPlayed.cardId,
            snapshot: { damageDealt: applied, keywordsBeforeBanish, subjectAtLocationId },
            reason: "lethal damage",
          },
          {
            event: "banish",
            playerId: ownerId,
            subjectCardId: destinationId,
            triggerSourceCardId: destinationId,
            triggerCandidates,
            eventSnapshot: { keywordsBeforeBanish, subjectAtLocationId },
          },
        );
        recordBanishedCharacterThisTurn(ctx, destinationId);
      }
    }

    if (effect.deferLethalBanish === true && resolutionInput.eventSnapshot) {
      (resolutionInput.eventSnapshot as Record<string, unknown>)[
        DEFERRED_LETHAL_DAMAGE_SWEEP_FLAG
      ] = true;
    }
  }

  if (resolutionInput.eventSnapshot) {
    resolutionInput.eventSnapshot.healedAmount = movedTotal;
  }
}
