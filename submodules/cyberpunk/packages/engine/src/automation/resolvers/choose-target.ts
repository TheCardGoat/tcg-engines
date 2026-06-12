import type { ChoiceResolver, MoveDecision } from "../types.ts";
import type { ChooseTargetChoicePrompt } from "../../view/player-prompt.ts";
import type { FilteredCardView } from "../../view/filter.ts";
import { assertNever } from "../util/assert-never.ts";

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

const resolveEffectTarget: ChoiceResolver<ChooseTargetChoicePrompt> = (choice): MoveDecision => {
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
  return {
    kind: "command",
    move: "resolveEffectTarget",
    args: { targetIds: eligible.slice(0, max) },
  };
};

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

  if (hand.length < amount) {
    if (choice.payload.canDecline) {
      return {
        kind: "command",
        move: "resolveDiscardFromHand",
        args: { pass: true },
      };
    }
    return {
      kind: "stuck",
      reason: `discardFromHand: need ${amount} cards but hand has ${hand.length}`,
    };
  }

  // Pick the cheapest cards. Ties broken by id for determinism.
  const sorted = [...hand].sort((a, b) => {
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
 * Resolve an `adjustGig` chooseTarget by picking the new face value that
 * favors the chooser. Own dice → max out (push Street Cred up); rival dice →
 * minimum out (push Street Cred down). For `direction: "either"`, fall back
 * to ownership; if ownership is unknown, default to increase. Always clamps
 * within the die's face range and the effect's `maxAmount`.
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

  const ownsDie = dieOwnerId !== undefined && dieOwnerId === (ctx.playerId as string);
  const wantsIncrease =
    direction === "increase"
      ? true
      : direction === "decrease"
        ? false
        : ownsDie || dieOwnerId === undefined;

  const target = wantsIncrease ? currentValue + maxAmount : currentValue - maxAmount;
  const clamped = Math.max(1, Math.min(maxFaceValue, target));
  return {
    kind: "command",
    move: "resolveAdjustGig",
    args: { value: clamped },
  };
};
