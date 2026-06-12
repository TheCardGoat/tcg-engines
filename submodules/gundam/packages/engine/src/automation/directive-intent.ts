/**
 * Directive-intent classifier — used by `defaultResolveEffect` to
 * decide whether to accept or decline an `optional` ("you may ...")
 * pending-effect directive.
 *
 * The heuristic is deliberately conservative:
 *   - **`accept`**: the directive's action is unambiguously good for
 *     the bot (draws cards, deploys units, deals damage to opponent,
 *     adds resources, recovers HP on friendlies, etc.).
 *   - **`decline`**: the action is unambiguously bad for the bot
 *     (discards from own hand, deals damage to friendlies, mills own
 *     deck, destroys own units, etc.).
 *   - **`neutral`**: ambiguous or context-dependent (modal effects,
 *     stat modifiers, keyword grants — the value depends on which
 *     friendly is targeted, board state, deck profile). Fall through
 *     to a safe default at the call site.
 *
 * The classifier inspects only `EffectAction.action` and (where
 * present) the `target.owner` discriminator from the `TargetFilter`.
 * No state-level reasoning, no opponent modelling — that lives in
 * smarter strategies that override `resolveEffect` with their own
 * policy.
 */

import type { EffectAction } from "@tcg/gundam-types";

import { assertNever } from "../utils/assert-never.ts";

export type DirectiveIntent = "accept" | "decline" | "neutral";

/**
 * Pull the target owner from any action that carries one. Returns
 * `null` for actions without a `target` field (deck-level / self-only
 * actions). The output drives the accept/decline branch when the
 * action's intent is owner-dependent (e.g. `dealDamage` is good vs
 * opponent, bad vs self).
 */
function targetOwnerOf(action: EffectAction): "self" | "friendly" | "opponent" | "any" | null {
  const withTarget = action as { target?: { owner?: string } };
  const owner = withTarget.target?.owner;
  if (owner === "self" || owner === "friendly" || owner === "opponent" || owner === "any") {
    return owner;
  }
  return null;
}

/**
 * Classify the bot's preference for activating the supplied
 * optional-directive action. The function is total over
 * `EffectAction["action"]` strings — adding a new action variant in
 * `@tcg/gundam-types` requires extending this switch (compile-checked
 * via the const-array `KNOWN_ACTIONS` parity test).
 */
export function classifyDirectiveIntent(action: EffectAction): DirectiveIntent {
  switch (action.action) {
    // Always-good for self.
    case "draw":
    case "drawIfTargetMatches":
    case "drawAll":
    case "createDelayedTrigger":
    case "deploy":
    case "deployExBase":
    case "deployFromTrash":
    case "deployToken":
    case "deploySelf":
    case "addSelfToHand":
    case "returnPairedPilotToHand":
    case "addShieldToHand":
    case "addFromTrash":
    case "millDeckThenDrawIfTrait":
    case "millDeckThenDamageIfTrait":
    case "millDeckThenDamageByTraitCount":
    case "millDeckThenStatModifierIfTrait":
    case "placeResource":
    case "placeExResource":
    case "payResources":
    case "lookAtTopDeck":
    case "pairPilot":
    case "pairEventCardAsPilot":
    case "activateTiming":
    case "recoverHPEventCard":
      return "accept";

    // Always-bad for self.
    case "discard":
      return "decline";

    // Owner-dependent: good when targeting opponent, bad when self/
    // friendly. `any` is treated as accept on the bet that the bot can
    // pick the opponent's card.
    case "dealDamage":
    case "dealDamageThenDrawIfDestroyed":
    case "dealDamageEventSource":
    case "dealDamageByCount":
    case "dealDamageBySourceStat":
    case "dealDamageByChosenUnitLevel":
    case "dealDamageAll":
    case "rest":
    case "returnToHand":
    case "returnToDeck":
    case "destroy":
    case "destroyEventCard":
    case "exile": {
      if (action.action === "destroyEventCard") return "accept";
      const owner = targetOwnerOf(action);
      if (owner === "opponent" || owner === "any") return "accept";
      if (owner === "self" || owner === "friendly") return "decline";
      return "neutral";
    }

    // Recovery: good on self/friendly, no-op on opponent (rare).
    case "recoverHP": {
      const owner = targetOwnerOf(action);
      if (owner === "self" || owner === "friendly" || owner === "any") return "accept";
      return "neutral";
    }

    // Wakes up a card — good on friendlies (re-attack), bad on
    // opponents (you'd let them block / counter-attack on their turn).
    case "setActive": {
      const owner = targetOwnerOf(action);
      if (owner === "self" || owner === "friendly") return "accept";
      if (owner === "opponent") return "decline";
      return "neutral";
    }

    // Mill: depends on the deck owner.
    case "millDeck":
      return action.owner === "opponent" ? "accept" : "decline";

    // Buffs: good when targeting friendly, neutral otherwise (no
    // "debuff" action — negative stat mods are encoded by sign of
    // `amount`).
    case "statModifier": {
      const owner = targetOwnerOf(action);
      const positive = action.amount >= 0;
      if (owner === "self" || owner === "friendly") return positive ? "accept" : "decline";
      if (owner === "opponent") return positive ? "decline" : "accept";
      return "neutral";
    }
    case "statModifierByCount": {
      const owner = targetOwnerOf(action);
      const positive = action.amountPerMatch >= 0;
      if (owner === "self" || owner === "friendly") return positive ? "accept" : "decline";
      if (owner === "opponent") return positive ? "decline" : "accept";
      return "neutral";
    }
    case "statModifierByEventPaidCost": {
      const owner = targetOwnerOf(action);
      if (owner === "self" || owner === "friendly") return "accept";
      if (owner === "opponent") return "decline";
      return "neutral";
    }
    case "statModifierByUniqueNameCount": {
      const owner = targetOwnerOf(action);
      const positive = action.amountPerUniqueName >= 0;
      if (owner === "self" || owner === "friendly") return positive ? "accept" : "decline";
      if (owner === "opponent") return positive ? "decline" : "accept";
      return "neutral";
    }

    // Keyword grants and stat-protection are almost always positive
    // when they target friendlies; `target` direction sets the sign.
    case "grantKeyword":
    case "copyKeywordEffects":
    case "grantTrait":
    case "preventStatReduction":
    case "preventDamage":
    case "reduceNextDamage":
    case "redirectBattleDamage":
    case "preventDestroy":
    case "preventDestruction":
    case "preventDamageToZone":
    case "preventActive":
    case "costReduction":
    case "costReductionByCount":
    case "levelReductionByCount": {
      const owner = targetOwnerOf(action);
      if (owner === "self" || owner === "friendly") return "accept";
      if (owner === "opponent") return "decline";
      return "neutral";
    }

    // Lock-down actions: good vs opponent, bad vs self/friendly.
    case "cantAttack":
    case "restrictUnit": {
      const owner = targetOwnerOf(action);
      if (owner === "opponent") return "accept";
      if (owner === "self" || owner === "friendly") return "decline";
      return "neutral";
    }

    // Limits the opponent's targeting — directly defensive when
    // targeting `friendly` (the bot's seat); irrelevant when
    // targeting `opponent` (we'd be limiting our own targeting).
    case "cantTargetPlayer":
      return action.whose === "friendly" ? "accept" : "decline";

    // Attack-target manipulation is defensive or permissive depending
    // on board state. Conservative default: accept.
    case "chooseAttackTarget":
    case "allowAttackDeployedThisTurn":
    case "forceAttackTarget":
    case "changeAttackTarget":
      return "accept";

    case "unparsedText":
    case "deployRested":
    case "returnEventCardToHand":
      return "neutral";

    default:
      return assertNever(action, "classifyDirectiveIntent");
  }
}
