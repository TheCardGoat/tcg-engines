/**
 * EffectResolver — Pre-computes what an effect will do before executing it.
 *
 * Takes an array of Directives (actions + conditional branches) and resolves
 * them against the current game state, producing a flat list of concrete
 * ResolvedActions with real card instance IDs.
 *
 * This is the "read-optimized" evaluation layer: the UI can call this to
 * enumerate targetable cards and preview effect outcomes without mutating
 * game state.
 */

import type {
  ConditionalDirective,
  Directive,
  EffectAction,
  EffectCondition,
  EffectDirective,
  TargetFilter,
  Zone,
} from "@tcg/gundam-types";

import type { CardInstanceId, PlayerId } from "../types/branded.ts";
import type { RuntimeCard } from "../types/base-card.ts";

import {
  evaluateCondition,
  evaluateTargetFilter,
  type TargetResolutionContext,
} from "./target-dsl.ts";

// ── Resolved Action Types ───────────────────────────────────────────────────

/**
 * A resolved action is the original EffectAction enriched with concrete
 * target card IDs (where applicable). Actions that don't target cards
 * (e.g. "draw") pass through unchanged.
 */
export interface ResolvedAction {
  /** The original action descriptor */
  action: EffectAction;
  /**
   * Concrete card instance IDs that matched the action's target filter.
   * Undefined for actions that have no target filter (draw, discard, etc.)
   */
  resolvedTargets?: CardInstanceId[];
  /**
   * For actions with a secondary filter (e.g. chooseAttackTarget.attackTarget,
   * preventDamage.unitFilter), the resolved IDs for that secondary filter.
   */
  resolvedSecondaryTargets?: CardInstanceId[];
  /**
   * For tutorFilter inside lookAtTopDeck, the resolved matching cards.
   */
  resolvedTutorTargets?: CardInstanceId[];
}

/**
 * Result of resolving a full effect (all steps).
 */
export interface EffectResolution {
  /** Ordered list of resolved actions */
  actions: ResolvedAction[];
  /**
   * True if all preconditions were met and the effect can legally be
   * executed. False if a required condition failed or a mandatory target
   * had zero matches.
   */
  canExecute: boolean;
  /**
   * Reasons the effect cannot execute, if any.
   */
  blockedReasons: string[];
}

// ── Target Extraction ───────────────────────────────────────────────────────

/**
 * Extract the primary TargetFilter from an EffectAction, if it has one.
 */
function getActionTargetFilter(action: EffectAction): TargetFilter | undefined {
  if (action.action === "forceAttackTarget") {
    return action.attackTarget;
  }
  if ("target" in action && action.target !== undefined) {
    return action.target as TargetFilter;
  }
  return undefined;
}

/**
 * Extract a secondary TargetFilter from actions that have one.
 */
function getSecondaryTargetFilter(action: EffectAction): TargetFilter | undefined {
  if (action.action === "chooseAttackTarget") {
    return action.attackTarget;
  }
  if (action.action === "forceAttackTarget") {
    return action.unit;
  }
  if (action.action === "preventDamage" && action.unitFilter !== undefined) {
    return action.unitFilter;
  }
  if (action.action === "preventDamageToZone") {
    return action.unitFilter;
  }
  return undefined;
}

// ── Card Collection Helpers ─────────────────────────────────────────────────

/** Standard zones where targetable cards can live. */
const TARGETABLE_ZONES: readonly Zone[] = [
  "battleArea",
  "baseSection",
  "hand",
  "trash",
  "shieldArea",
  "resourceArea",
];

/**
 * Gather all cards visible to the effect resolver for target evaluation.
 * Pulls from both players across all targetable zones.
 */
function gatherAllCards(ctx: TargetResolutionContext): RuntimeCard[] {
  const cards: RuntimeCard[] = [];
  const players: PlayerId[] = [ctx.sourcePlayerId, ctx.opponentPlayerId];

  for (const playerId of players) {
    for (const zone of TARGETABLE_ZONES) {
      const zoneCards = ctx.getCardsInZone(playerId, zone);
      for (const card of zoneCards) {
        cards.push(card);
      }
    }
  }

  return cards;
}

// ── Action Resolution ───────────────────────────────────────────────────────

/**
 * Resolve a single EffectAction into a ResolvedAction by evaluating its
 * target filters against the current game state.
 */
function resolveAction(
  action: EffectAction,
  allCards: readonly RuntimeCard[],
  ctx: TargetResolutionContext,
): ResolvedAction {
  const resolved: ResolvedAction = { action };

  // Primary target filter
  const primaryFilter = getActionTargetFilter(action);
  if (primaryFilter !== undefined) {
    resolved.resolvedTargets = evaluateTargetFilter(primaryFilter, allCards, ctx);
  }

  // Secondary target filter
  const secondaryFilter = getSecondaryTargetFilter(action);
  if (secondaryFilter !== undefined) {
    resolved.resolvedSecondaryTargets = evaluateTargetFilter(secondaryFilter, allCards, ctx);
  }

  // Tutor filter inside lookAtTopDeck
  if (action.action === "lookAtTopDeck" && action.tutorFilter !== undefined) {
    resolved.resolvedTutorTargets = evaluateTargetFilter(action.tutorFilter, allCards, ctx);
  }

  return resolved;
}

// ── Step Resolution ─────────────────────────────────────────────────────────

/**
 * Type guard: checks whether a directive is a ConditionalDirective.
 */
function isConditionalDirective(directive: Directive): directive is ConditionalDirective {
  return "condition" in directive && "thenDirectives" in directive;
}

/**
 * Recursively resolve an array of Directives, evaluating conditional
 * branches and collecting all resulting actions.
 */
function resolveDirectives(
  directives: readonly Directive[],
  allCards: readonly RuntimeCard[],
  ctx: TargetResolutionContext,
): ResolvedAction[] {
  const result: ResolvedAction[] = [];

  for (const directive of directives) {
    if (isConditionalDirective(directive)) {
      const conditionMet = evaluateCondition(directive.condition, ctx);
      if (conditionMet) {
        result.push(...resolveDirectives(directive.thenDirectives, allCards, ctx));
      } else if (directive.elseDirectives !== undefined) {
        result.push(...resolveDirectives(directive.elseDirectives, allCards, ctx));
      }
    } else if ("kind" in directive && (directive as { kind?: string }).kind === "chooseOne") {
      // ChooseOne is a player-decision branch — the picked option isn't
      // known at preview/resolve time. Skipping it here keeps `canExecute`
      // honest: aggregating actions from every option would AND their
      // target-availability checks and report `canExecute = false` for
      // modal cards whenever ANY branch lacked legal targets, even when
      // another branch is perfectly playable. The runtime halts on the
      // chooseOne prompt anyway, so the controller's actual pick drives
      // execution — preview just doesn't speculate across options.
    } else {
      result.push(resolveAction((directive as EffectDirective).action, allCards, ctx));
    }
  }

  return result;
}

// ── Validation ──────────────────────────────────────────────────────────────

/**
 * Check whether a resolved action has valid targets. Actions with a count
 * requirement of at least 1 must have at least 1 matching card.
 *
 * Returns a reason string if the action is blocked, or undefined if OK.
 */
function validateAction(resolved: ResolvedAction): string | undefined {
  const action = resolved.action;
  const filter = getActionTargetFilter(action);

  if (filter === undefined) {
    // Actions without targets (draw, discard, etc.) are always valid
    return undefined;
  }

  const targets = resolved.resolvedTargets ?? [];

  // "all" count is always valid (even if 0 matches — it just does nothing)
  if (filter.count === "all") {
    return undefined;
  }

  // Range count: must have at least min matches
  if (typeof filter.count === "object" && filter.count !== null) {
    if (targets.length < filter.count.min) {
      return `Action "${action.action}" requires at least ${filter.count.min} target(s), found ${targets.length}`;
    }
    return undefined;
  }

  // Exact count: must have at least that many matches for the player to choose from
  if (typeof filter.count === "number" && filter.count > 0) {
    if (targets.length < filter.count) {
      return `Action "${action.action}" requires ${filter.count} target(s), found ${targets.length}`;
    }
    return undefined;
  }

  // No count specified — action is valid if there are any matches
  // (single-target implicit)
  return undefined;
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Resolve a full effect (array of Directives) against the current game state.
 *
 * Evaluates all conditional branches, resolves all target filters to concrete
 * card instance IDs, and validates that required targets exist.
 *
 * @param directives - The effect's directive sequence from a CardEffect
 * @param ctx - Game state context for evaluation
 * @returns An EffectResolution with resolved actions and validity info
 */
export function resolveEffect(
  directives: readonly Directive[],
  ctx: TargetResolutionContext,
): EffectResolution {
  const allCards = gatherAllCards(ctx);
  const actions = resolveDirectives(directives, allCards, ctx);

  const blockedReasons: string[] = [];
  for (const action of actions) {
    const reason = validateAction(action);
    if (reason !== undefined) {
      blockedReasons.push(reason);
    }
  }

  return {
    actions,
    canExecute: blockedReasons.length === 0,
    blockedReasons,
  };
}

/**
 * Check whether an effect's preconditions are all met.
 *
 * @param preconditions - Array of EffectCondition from CardEffect.preconditions
 * @param ctx - Game state context
 * @returns true if all preconditions pass (or if there are none)
 */
export function checkPreconditions(
  preconditions: readonly EffectCondition[] | undefined,
  ctx: TargetResolutionContext,
): boolean {
  if (preconditions === undefined || preconditions.length === 0) {
    return true;
  }
  return preconditions.every((cond) => evaluateCondition(cond, ctx));
}

/**
 * Enumerate which cards can be targeted by a specific action within an effect.
 * Useful for the UI to highlight valid targets before the player makes a choice.
 *
 * @param action - A single EffectAction to inspect
 * @param ctx - Game state context
 * @returns Array of card instance IDs that are valid targets, or empty if
 *          the action does not target cards
 */
export function enumerateTargetsForAction(
  action: EffectAction,
  ctx: TargetResolutionContext,
): CardInstanceId[] {
  const filter = getActionTargetFilter(action);
  if (filter === undefined) {
    return [];
  }

  const allCards = gatherAllCards(ctx);
  return evaluateTargetFilter(filter, allCards, ctx);
}

/**
 * Resolve a full CardEffect: check conditions, then resolve directives.
 * Convenience wrapper that combines checkPreconditions + resolveEffect.
 *
 * @param effect - A CardEffect object (with activation.conditions and directives)
 * @param ctx - Game state context
 * @returns EffectResolution, with canExecute=false if conditions fail
 */
export function resolveCardEffect(
  effect: {
    activation: { conditions?: readonly EffectCondition[] };
    directives: readonly Directive[];
  },
  ctx: TargetResolutionContext,
): EffectResolution {
  if (!checkPreconditions(effect.activation.conditions, ctx)) {
    return {
      actions: [],
      canExecute: false,
      blockedReasons: ["Effect preconditions not met"],
    };
  }

  return resolveEffect(effect.directives, ctx);
}
