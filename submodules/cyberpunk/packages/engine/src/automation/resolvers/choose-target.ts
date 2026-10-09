import type { ChoiceResolver, MoveDecision } from "../types.ts";
import type { ChooseTargetChoicePrompt } from "../../view/player-prompt.ts";
import type { FilteredCardView } from "../../view/filter.ts";
import { assertNever } from "../util/assert-never.ts";
import { planAdjustGig } from "./adjust-gig.ts";
import {
  DIE_MAX_VALUES,
  isDieType,
  isGigCopyPairAllowed,
  type DieType,
} from "@tcg/cyberpunk-types";

/**
 * Default chooseTarget resolver. Branches exhaustively on the sub-type so that
 * a new sub-type added to {@link import("../../types/match-state.ts").ChooseTargetSubType}
 * fails to compile until handled here too.
 */
export const chooseTargetResolver: ChoiceResolver<ChooseTargetChoicePrompt> = (choice, ctx) => {
  switch (choice.payload.type) {
    case "discardFromHand":
      return resolveDiscardFromHand(choice, ctx);
    case "adjustGig":
      return resolveAdjustGig(choice, ctx);
    case "effectTarget":
      return resolveEffectTarget(choice, ctx);
    default:
      return assertNever(choice.payload.type, "ChooseTargetSubType");
  }
};

const resolveEffectTarget: ChoiceResolver<ChooseTargetChoicePrompt> = (
  choice,
  ctx,
): MoveDecision => {
  const min = choice.payload.min ?? 1;
  const max = choice.payload.max ?? 1;
  const eligible = choice.payload.eligibleIds ?? [];
  if (eligible.length < min) {
    if (choice.payload.canDecline) {
      return {
        kind: "command",
        move: "resolveEffectTarget",
        args: { pass: true },
      };
    }
    return {
      kind: "stuck",
      reason: `effectTarget: need ${min} target(s), only ${eligible.length} eligible`,
    };
  }
  const adjustGig =
    choice.payload.adjustGig ??
    (choice.payload.effect?.effect === "adjustGig" ? choice.payload.effect : undefined);
  if (choice.payload.targetKind === "gig" && adjustGig && max === 1) {
    const plan = planAdjustGig({
      view: ctx.view,
      playerId: choice.chooserId,
      eligibleIds: eligible,
      direction: adjustGig.direction,
      maxAmount: adjustGig.maxAmount,
      allowUnchanged:
        adjustGig.chooseUpTo === true || choice.payload.canDecline === true || min === 0,
      sourceColor: choice.payload.source?.color,
    });
    if (!plan) {
      return {
        kind: "stuck",
        reason: "effectTarget: adjustGig candidates are missing from the player view",
      };
    }
    if (choice.payload.adjustGig === undefined) {
      // A direct effectTarget chooses the die first. Only an atomic prompt
      // permits resolveAdjustGig at this stage.
      return {
        kind: "command",
        move: "resolveEffectTarget",
        args:
          choice.payload.canDecline && !plan.changed ? { pass: true } : { targetIds: [plan.dieId] },
      };
    }
    return {
      kind: "command",
      move: "resolveAdjustGig",
      args:
        choice.payload.canDecline && !plan.changed
          ? { kind: "noAdjustment" }
          : { kind: "adjust", dieId: plan.dieId, value: plan.value },
    };
  }
  if (choice.payload.targetKind === "gig" && choice.payload.pairConstraint) {
    const pair = pickValidGigCopyPair(ctx, eligible, choice.payload.pairConstraint);
    if (pair) {
      return {
        kind: "command",
        move: "resolveEffectTarget",
        args: { targetIds: pair },
      };
    }
    if (choice.payload.canDecline) {
      return {
        kind: "command",
        move: "resolveEffectTarget",
        args: { pass: true },
      };
    }
    return { kind: "stuck", reason: "effectTarget: no legal Gig copy pair" };
  }
  const selected = pickEffectTargets(choice, ctx, eligible, max);
  return {
    kind: "command",
    move: "resolveEffectTarget",
    args: { targetIds: selected },
  };
};

function pickValidGigCopyPair(
  ctx: Parameters<ChoiceResolver<ChooseTargetChoicePrompt>>[1],
  eligible: string[],
  pairConstraint: NonNullable<ChooseTargetChoicePrompt["payload"]["pairConstraint"]>,
): [string, string] | null {
  const gigs = new Map<string, { ownerId: string; dieType: DieType; value: number }>();
  for (const [ownerId, player] of Object.entries(ctx.view.players)) {
    const gigArea = player.zones.gigArea;
    if (!Array.isArray(gigArea)) continue;
    for (const gig of gigArea) {
      if (!isDieType(gig.definitionId)) continue;
      gigs.set(gig.instanceId, {
        ownerId,
        dieType: gig.definitionId,
        value: gig.effectivePower,
      });
    }
  }

  let fallback: [string, string] | null = null;
  for (const sourceId of eligible) {
    const source = gigs.get(sourceId);
    if (!source) continue;
    for (const targetId of eligible) {
      const target = gigs.get(targetId);
      if (!target || sourceId === targetId) continue;
      if (!isGigCopyPairAllowed(source.ownerId, target.ownerId, pairConstraint)) continue;
      fallback ??= [sourceId, targetId];
      if (source.value !== target.value && source.value <= DIE_MAX_VALUES[target.dieType]) {
        return [sourceId, targetId];
      }
    }
  }
  return fallback;
}

function pickEffectTargets(
  choice: ChooseTargetChoicePrompt,
  ctx: Parameters<ChoiceResolver<ChooseTargetChoicePrompt>>[1],
  eligible: string[],
  max: number,
): string[] {
  const eligibleCards = choice.payload.cards ?? [];
  const chooserHand = ctx.view.players[choice.chooserId]?.zones.hand;
  const chooser = ctx.view.players[choice.chooserId];
  const eddies =
    choice.payload.availableEddiesAfterCosts ?? chooser?.availableEddies ?? chooser?.eddies ?? 0;
  const handIds = new Set(
    Array.isArray(chooserHand) ? chooserHand.map((card) => card.instanceId) : [],
  );
  const allEligibleFromChooserHand = eligible.length > 0 && eligible.every((id) => handIds.has(id));
  const shouldPayForPlayedCard = choice.payload.targetPurpose === "playCard";

  if ((allEligibleFromChooserHand || shouldPayForPlayedCard) && eligibleCards.length > 0) {
    const payableCards = shouldPayForPlayedCard
      ? eligibleCards.filter(
          (card) =>
            (choice.payload.effectiveCostsByCardId?.[card.instanceId] ??
              Number.POSITIVE_INFINITY) <= eddies,
        )
      : eligibleCards;
    const rankedCards = shouldPayForPlayedCard ? payableCards : eligibleCards;
    return [...rankedCards]
      .filter((card) => eligible.includes(card.instanceId))
      .sort((a, b) => {
        const ac = a.cost ?? Number.NEGATIVE_INFINITY;
        const bc = b.cost ?? Number.NEGATIVE_INFINITY;
        if (ac !== bc) return bc - ac;
        return a.instanceId.localeCompare(b.instanceId);
      })
      .slice(0, max)
      .map((card) => card.instanceId);
  }

  return eligible.slice(0, max);
}

const resolveDiscardFromHand: ChoiceResolver<ChooseTargetChoicePrompt> = (
  choice,
  ctx,
): MoveDecision => {
  const { amount = 1 } = choice.payload;
  // The pending-choice `payload.player` field stores the effect-relative
  // selector ("self"/"friendly"/"rival") — not a concrete player id. The
  // chooser is by definition the player who must discard, so use chooserId.
  const targetPlayer = choice.chooserId;
  const handZone = ctx.view.players[targetPlayer]?.zones.hand;
  const hand: FilteredCardView[] = Array.isArray(handZone) ? handZone : [];
  const eligibleIds = choice.payload.eligibleIds;
  const eligibleHand =
    eligibleIds === undefined ? hand : hand.filter((card) => eligibleIds.includes(card.instanceId));

  if (eligibleHand.length < amount) {
    if (choice.payload.canDecline) {
      return {
        kind: "command",
        move: "resolveDiscardFromHand",
        args: { pass: true },
      };
    }
    return {
      kind: "stuck",
      reason: `discardFromHand: need ${amount} cards but only ${eligibleHand.length} eligible`,
    };
  }

  // Pick the cheapest cards. Ties broken by id for determinism.
  const sorted = [...eligibleHand].sort((a, b) => {
    const ac = a.cost ?? Number.POSITIVE_INFINITY;
    const bc = b.cost ?? Number.POSITIVE_INFINITY;
    if (ac !== bc) return ac - bc;
    return a.instanceId.localeCompare(b.instanceId);
  });

  const cardIds = sorted.slice(0, amount).map((c) => c.instanceId);
  return {
    kind: "command",
    move: "resolveDiscardFromHand",
    args: { cardIds },
  };
};

/**
 * Resolve an `adjustGig` value choice with the same color-aware scorer used to
 * choose the target Gig. If the source is unavailable, the scorer preserves
 * the historical friendly-up / rival-down behavior.
 */
const resolveAdjustGig: ChoiceResolver<ChooseTargetChoicePrompt> = (choice, ctx): MoveDecision => {
  const { dieId, direction, maxAmount, currentValue, maxFaceValue, dieOwnerId } = choice.payload;
  if (
    !dieId ||
    currentValue === undefined ||
    maxFaceValue === undefined ||
    maxAmount === undefined
  ) {
    return { kind: "stuck", reason: "adjustGig: choice payload missing die context" };
  }

  const plan = planAdjustGig({
    view: ctx.view,
    playerId: choice.chooserId,
    eligibleIds: [dieId],
    direction,
    maxAmount,
    allowUnchanged: choice.payload.chooseUpTo === true,
    sourceColor: choice.payload.source?.color,
    focusedDie: {
      dieId,
      ownerId: dieOwnerId ?? choice.chooserId,
      currentValue,
      maxFaceValue,
    },
  });
  if (!plan) return { kind: "stuck", reason: "adjustGig: unable to score legal values" };
  return {
    kind: "command",
    move: "resolveAdjustGig",
    args:
      choice.payload.chooseUpTo && !plan.changed
        ? { kind: "noAdjustment" }
        : { kind: "adjust", dieId: plan.dieId, value: plan.value },
  };
};
