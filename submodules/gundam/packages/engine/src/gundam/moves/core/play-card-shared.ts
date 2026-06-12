/**
 * Play Card — Shared Validation & Cost Payment
 *
 * Common steps for all "play card from hand" moves (rules 7-5-2-2):
 *   1. Card must be in the player's hand
 *   2. Player's resource level (= count of cards in resource area) must meet the card's level
 *   3. Player must have enough active (non-exhausted) resources to pay the card's cost
 *   4. Rest individual resource cards to pay the cost (EX tokens removed from game instead)
 *
 * Resource caps (Rules 4-4-2, 4-4-2-1):
 *   - Maximum 15 total resource cards in resource area
 *   - Maximum 5 EX resource tokens in resource area
 */

import type {
  Card,
  EffectAction,
  EffectCondition,
  EffectCost,
  EffectDirective,
  TargetFilter,
} from "@tcg/gundam-types";
import type {
  MoveValidationResult,
  FrameworkReadAPI,
  FrameworkWriteAPI,
} from "../../../types/move-types.ts";
import type { PlayerId } from "../../../types/branded.ts";
import type { GundamCardMeta, GundamG, ReadonlyGundamG } from "../../types.ts";
import {
  buildTargetResolutionContext,
  computeEffectiveCostInHand,
  computeEffectiveLevelInHand,
  getAvailableResources,
  getResourceLevel,
} from "../../rules/derived-state.ts";
import { gatherAllCardsForTargeting, getFilterCountBounds } from "../../effects/target-legality.ts";
import { evaluateCondition, evaluateTargetFilter } from "../../../runtime/target-dsl.ts";
import { emitGundamLog } from "../../logging.ts";
import { rejectWithKey } from "./validation-error.ts";

/** Maximum total resource cards allowed in resource area (Rule 4-4-2) */
const MAX_RESOURCE_TOTAL = 15;
/** Maximum EX resource tokens allowed in resource area (Rule 4-4-2-1) */
const MAX_EX_RESOURCE_TOKENS = 5;

/**
 * Whether a card in the resource area is an EX Resource token.
 * Identified by isToken meta flag on a "resource" type card.
 */
export function isExResourceToken(cardId: string, framework: FrameworkReadAPI): boolean {
  const def = framework.cards.getDefinition(cardId) as Card | undefined;
  if (!def || def.type !== "resource") return false;
  const meta = framework.cards.getMeta(cardId) as GundamCardMeta | undefined;
  return meta?.isToken === true;
}

/**
 * Whether a resource card can be placed into the player's resource area.
 * Enforces the 15-total and 5-EX-token caps (Rules 4-4-2, 4-4-2-1).
 *
 * @param isEXToken - true if the card being placed is an EX resource token
 */
export function canPlaceResource(
  playerId: string,
  isEXToken: boolean,
  framework: FrameworkReadAPI,
): boolean {
  const resourceIds = framework.zones.getCards({ zone: "resourceArea", playerId });

  if (resourceIds.length >= MAX_RESOURCE_TOTAL) return false;

  if (isEXToken) {
    const exCount = resourceIds.filter((id) => isExResourceToken(id, framework)).length;
    if (exCount >= MAX_EX_RESOURCE_TOKENS) return false;
  }

  return true;
}

/**
 * Validate that a card can be played from hand (common checks for all card types).
 *
 * Checks:
 *  - Card is in the player's hand
 *  - Resource level (total cards in resource area) meets the card's level requirement
 *  - Player has enough active (non-exhausted) resources to pay the card's cost
 */
export function validatePlayFromHand(
  cardId: string,
  playerId: string,
  G: ReadonlyGundamG,
  framework: FrameworkReadAPI,
): MoveValidationResult {
  const handCards = framework.zones.getCards({ zone: "hand", playerId });
  if (!handCards.includes(cardId)) {
    return { valid: false, error: "Card not in hand", errorCode: "CARD_NOT_IN_HAND" };
  }

  const definition = framework.cards.getDefinition(cardId) as Card | undefined;
  if (!definition) {
    return { valid: false, error: "Card definition not found", errorCode: "UNKNOWN_CARD" };
  }

  const resourceLevel = getResourceLevel(playerId, framework);
  const effectiveLevel = computeEffectiveLevelInHand(cardId, playerId, G, framework);
  if (effectiveLevel > resourceLevel) {
    return rejectWithKey(
      "gundam.error.play.insufficientResourceLevel",
      { required: effectiveLevel, have: resourceLevel },
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
  }

  const available = getAvailableResources(playerId, G, framework);
  const effectiveCost = computeEffectiveCostInHand(cardId, playerId, G, framework);
  if (available < effectiveCost) {
    return rejectWithKey(
      "gundam.error.play.insufficientResources",
      { required: effectiveCost, have: available },
      "INSUFFICIENT_RESOURCES",
    );
  }

  return { valid: true };
}

/**
 * Rest individual resource cards to pay a card's cost.
 * Must be called during move execution, after validation has passed.
 *
 * `framework` is `FrameworkWriteAPI` (which extends `FrameworkReadAPI`),
 * so both the read-only `computeEffectiveCostInHand` lookup and the
 * mutating payment use the same handle.
 *
 * Returns the effective cost actually paid, so callers (e.g., log
 * emitters) can record the paid amount after any in-hand cost
 * modifiers have been applied.
 */
export function payCardCost(
  cardId: string,
  playerId: string,
  G: GundamG,
  framework: FrameworkWriteAPI,
): number {
  return payCardCostWithDetails(cardId, playerId, G, framework).total;
}

export function payCardCostWithDetails(
  cardId: string,
  playerId: string,
  G: GundamG,
  framework: FrameworkWriteAPI,
): { total: number; regularCount: number; exRemovedCount: number } {
  const effectiveCost = computeEffectiveCostInHand(cardId, playerId, G, framework);
  const paid = payCost({ payResources: effectiveCost }, cardId, playerId, G, framework);
  return {
    total: effectiveCost,
    regularCount: paid.regularCount,
    exRemovedCount: paid.exRemovedCount,
  };
}

/**
 * Pay every component of an {@link EffectCost}.
 *
 * Single entry point for all cost payment during a move — play-from-hand,
 * activated abilities, future cost-bearing moves — so rules that apply to
 * cost payment are enforced in exactly one place:
 *
 *   - Rule 5-17-3-2-3: when EX Resources are used to pay, they are removed
 *     from the game. Regular resources are preferred; EX tokens are tapped
 *     only when regular resources run out.
 *   - Rule: resting a card (restSelf / restFriendlyUnits) sets both
 *     `G.exhausted` and the meta mirror.
 *
 * New cost components must be added here — never inline in a move — so
 * future additions can't silently bypass any of these rules.
 *
 * `sourceCardId` is the card whose effect is being activated; used for
 * `restSelf`. Ignored for card-play costs (which have no restSelf).
 */
export function payCost(
  cost: EffectCost | undefined,
  sourceCardId: string,
  playerId: string,
  G: GundamG,
  framework: FrameworkWriteAPI,
): { regularCount: number; exRemovedCount: number } {
  let paidResources = { regularCount: 0, exRemovedCount: 0 };
  if (!cost) return paidResources;

  if (cost.restSelf) {
    G.exhausted[sourceCardId] = true;
    framework.cards.patchMeta(sourceCardId, { exhausted: true });
  }

  if (cost.payResources !== undefined && cost.payResources > 0) {
    paidResources = exhaustResources(cost.payResources, playerId, G, framework);
    emitGundamLog(framework, {
      type: "gundam.cost.resourcesSpent",
      values: {
        playerId,
        regularCount: paidResources.regularCount,
        exRemovedCount: paidResources.exRemovedCount,
      },
      visibility: { mode: "PUBLIC" },
      category: "action",
    });
  }

  if (cost.discardCount) {
    const handCards = framework.zones.getCards({ zone: "hand", playerId });
    const toDiscard = selectDiscardCostCards(
      handCards,
      cost.discardCount,
      cost.discardFilter,
      playerId,
      sourceCardId,
      G,
      framework,
    );
    for (const cid of toDiscard) {
      framework.zones.moveCard(cid, { zone: "trash", playerId });
    }
    if (toDiscard.length > 0) {
      emitGundamLog(framework, {
        type: "gundam.cost.cardsDiscarded",
        values: { playerId, cardIds: toDiscard },
        visibility: { mode: "PUBLIC" },
        category: "action",
      });
    }
  }

  if (cost.restFriendlyUnits) {
    const battlefield = framework.zones.getCards({ zone: "battleArea", playerId });
    const rested: string[] = [];
    for (const unitId of battlefield) {
      if (rested.length >= cost.restFriendlyUnits) break;
      const meta = framework.cards.getMeta(unitId) as GundamCardMeta | undefined;
      if (!meta?.exhausted && !G.exhausted[unitId]) {
        G.exhausted[unitId] = true;
        framework.cards.patchMeta(unitId, { exhausted: true });
        rested.push(unitId);
      }
    }
    if (rested.length > 0) {
      emitGundamLog(framework, {
        type: "gundam.cost.unitsRested",
        values: { playerId, cardIds: rested },
        visibility: { mode: "PUBLIC" },
        category: "action",
      });
    }
  }

  if (cost.restTarget) {
    const tgtCtx = buildTargetResolutionContext(G, playerId, framework, {
      sourceCardId,
    });
    const candidates = evaluateTargetFilter(
      cost.restTarget,
      gatherAllCardsForTargeting(tgtCtx),
      tgtCtx,
    );
    const [cardId] = candidates;
    if (cardId) {
      G.exhausted[cardId as string] = true;
      framework.cards.patchMeta(cardId as string, { exhausted: true });
      emitGundamLog(framework, {
        type: "gundam.cost.unitsRested",
        values: { playerId, cardIds: [cardId as string] },
        visibility: { mode: "PUBLIC" },
        category: "action",
      });
    }
  }

  if (cost.exileFromTrash) {
    const tgtCtx = buildTargetResolutionContext(G, playerId, framework, {
      sourceCardId,
    });
    const filter: TargetFilter = { ...cost.exileFromTrash, zone: "trash" };
    const candidates = evaluateTargetFilter(filter, gatherAllCardsForTargeting(tgtCtx), tgtCtx);
    const [cardId] = candidates;
    if (cardId) {
      framework.zones.moveCard(cardId as string, { zone: "removalArea" });
      emitGundamLog(framework, {
        type: "gundam.effect.movedToZone",
        values: { cardId: cardId as string, from: "trash", to: "removalArea" },
        visibility: { mode: "PUBLIC" },
        category: "action",
      });
    }
  }

  // `destroySelf` MUST run last. Printed costs like "Destroy this Unit：
  // ..." (GD02-011 Moebius Peacemaker Team) read naturally as "pay the
  // rest of the cost, then send yourself to the trash". Executing it
  // after `restSelf` / `payResources` / `discardCount` /
  // `restFriendlyUnits` ensures those observable side effects happen
  // on the source card before it leaves play, rather than being
  // silently dropped when the card's meta disappears. In practice a
  // printed cost never both rests and destroys the source — but if
  // both flags are ever set on the same cost, destroySelf wins
  // (restSelf's mutation is harmless noise — the card is about to move
  // zones regardless). The card's controller for the effect is the
  // `playerId` passed in, but the trash destination is the source
  // card's _owner_ (rule 5-2-2: cards return to their owner's zone on
  // leaving play) — mirrors the pattern used by handleUnitDefeated.
  if (cost.destroySelf) {
    const ownerId = (framework.cards.getOwner(sourceCardId) as string | undefined) ?? playerId;
    framework.zones.moveCard(sourceCardId, { zone: "trash", playerId: ownerId });
  }

  return paidResources;
}

export function countPayableDiscardCostCards(
  cost: EffectCost | undefined,
  sourceCardId: string,
  playerId: string,
  G: GundamG | ReadonlyGundamG,
  framework: FrameworkReadAPI,
): number {
  if (!cost?.discardCount) return 0;
  const handCards = framework.zones.getCards({ zone: "hand", playerId });
  return selectDiscardCostCards(
    handCards,
    cost.discardCount,
    cost.discardFilter,
    playerId,
    sourceCardId,
    G,
    framework,
  ).length;
}

function selectDiscardCostCards(
  handCards: readonly string[],
  count: number,
  filter: TargetFilter | undefined,
  playerId: string,
  sourceCardId: string,
  G: GundamG | ReadonlyGundamG,
  framework: FrameworkReadAPI,
): string[] {
  if (!filter) return handCards.slice(0, count);
  const tgtCtx = buildTargetResolutionContext(G, playerId, framework, {
    sourceCardId,
  });
  const discardFilter: TargetFilter = {
    ...filter,
    owner: filter.owner ?? "friendly",
    zone: filter.zone ?? "hand",
  };
  const eligibleCards = evaluateTargetFilter(
    discardFilter,
    tgtCtx.getCardsInZone(playerId as PlayerId, "hand"),
    tgtCtx,
  );
  return eligibleCards.slice(0, count);
}

/**
 * Rest N active resource cards from the player's resource area.
 *
 * Two-pass strategy (Rule 5-17-3-2-3):
 *   Pass 1 — exhaust regular (non-EX) resource cards
 *   Pass 2 — remove EX resource tokens from the game (removalArea) as fallback
 *
 * This ensures regular resources are preferred over EX tokens so EX tokens
 * are only consumed when no regular resources can cover the cost.
 *
 * Returns the split between regular exhausts and EX removals so callers
 * (currently just {@link payCost}) can log the exact counts — the
 * `exRemovedCount` is the observable signal that rule 5-17-3-2-3 fired.
 *
 * Internal: callers outside this file must route through {@link payCost}
 * so new cost-payment sites can't bypass the EX-removal rule.
 */
function exhaustResources(
  count: number,
  playerId: string,
  G: GundamG,
  framework: FrameworkWriteAPI,
): { regularCount: number; exRemovedCount: number } {
  if (count <= 0) return { regularCount: 0, exRemovedCount: 0 };

  const resourceIds = framework.zones.getCards({ zone: "resourceArea", playerId });
  const activeIds = resourceIds.filter((id) => !G.exhausted[id]);
  const regularActive = activeIds.filter((id) => !isExResourceToken(id, framework));
  const exActive = activeIds.filter((id) => isExResourceToken(id, framework));

  let remaining = count;
  let regularCount = 0;
  let exRemovedCount = 0;

  // Pass 1: exhaust regular resources
  for (const resId of regularActive) {
    if (remaining <= 0) break;
    G.exhausted[resId] = true;
    // Mirror the exhausted flag into cardMeta so projections that read
    // `meta.exhausted` (e.g. the simulator's `countActiveResources`) see
    // the state change. Parallel to the `restSelf` cost path above.
    framework.cards.patchMeta(resId, { exhausted: true });
    remaining--;
    regularCount++;
  }

  // Pass 2: remove EX resource tokens from the game
  for (const resId of exActive) {
    if (remaining <= 0) break;
    framework.zones.moveCard(resId, { zone: "removalArea" });
    remaining--;
    exRemovedCount++;
  }

  return { regularCount, exRemovedCount };
}

// =============================================================================
// Deploy-trigger target pre-validation (shared by deploy-unit + deploy-base)
// =============================================================================

/**
 * Pre-validate targets supplied on a deploy move's input against the card's
 * own 【Deploy】 triggered effects. When the card has targeted Deploy
 * directives, the caller must supply `chosenTargets` that satisfy every
 * such directive's filter (count + filter match). This mirrors rule
 * 10-1-8-1-1 (targets declared at activation) and lets the engine skip
 * the pending-effect halt for triggers whose targets were already chosen
 * at play time.
 *
 * Returns `{ valid: true }` when there are no targeted Deploy directives
 * or when the supplied targets satisfy every such directive.
 */
export function validateDeployTriggerTargets(
  cardId: string,
  playerId: string,
  chosenTargets: readonly string[],
  G: ReadonlyGundamG,
  framework: FrameworkReadAPI,
): MoveValidationResult {
  const def = framework.cards.getDefinition(cardId) as Card | undefined;
  if (!def?.effects?.length) return { valid: true };

  const tgtCtx = buildTargetResolutionContext(G, playerId, framework, {
    sourceCardId: cardId,
  });
  const matchedChosenTargetIds = new Set<string>();
  let hasTargetedDeployAction = false;

  for (const effect of def.effects) {
    if (
      effect.type !== "triggered" ||
      !((effect.activation.timing ?? []) as string[]).includes("deploy")
    ) {
      continue;
    }

    // Skip effects whose activation conditions aren't met — when the
    // condition fails the effect won't fire, so no targets are needed.
    if (effect.activation.conditions && effect.activation.conditions.length > 0) {
      const condsMet = effect.activation.conditions.every((c) =>
        evaluateCondition(c as EffectCondition, tgtCtx),
      );
      if (!condsMet) continue;
    }

    for (const directive of effect.directives) {
      if (!isEffectDirective(directive)) continue;
      const action = directive.action;
      if (!hasTarget(action)) continue;

      const filter: TargetFilter = action.target;
      const gather = gatherAllCardsForTargeting(tgtCtx);
      const candidates = evaluateTargetFilter(filter, gather, tgtCtx) as string[];
      const candidateSet = new Set(candidates);
      const picked = chosenTargets.filter((id) => candidateSet.has(id));

      // Optional directives ("you may") — skip target validation when no
      // candidates exist and no targets were supplied. The player chose
      // not to (or cannot) exercise the option.
      if (directive.optional && picked.length === 0 && candidates.length === 0) {
        continue;
      }

      hasTargetedDeployAction = true;

      for (const id of picked) {
        matchedChosenTargetIds.add(id);
      }

      const { min, max } = getFilterCountBounds(filter);
      if (picked.length < min) {
        return {
          valid: false,
          error: `Too few targets: need at least ${min}, got ${picked.length}`,
          errorCode: "INVALID_TARGET",
        };
      }
      if (picked.length > max) {
        return {
          valid: false,
          error: `Too many targets: max ${max}, got ${picked.length}`,
          errorCode: "INVALID_TARGET",
        };
      }
    }
  }

  if (hasTargetedDeployAction) {
    for (const id of chosenTargets) {
      if (!matchedChosenTargetIds.has(id)) {
        return {
          valid: false,
          error: "Chosen target does not match deploy effect filter",
          errorCode: "INVALID_TARGET",
        };
      }
    }
  }

  return { valid: true };
}

function isEffectDirective(directive: unknown): directive is EffectDirective {
  return typeof directive === "object" && directive !== null && "action" in (directive as object);
}

function hasTarget(action: EffectAction): action is EffectAction & { target: TargetFilter } {
  return "target" in (action as object) && (action as { target?: unknown }).target !== undefined;
}
