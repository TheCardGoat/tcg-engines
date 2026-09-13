/**
 * Target-legality shared primitives.
 *
 * Rule 10-2-2-1 defines "choosing a target" as picking a player or a card
 * in a public location (battle area, base section, resource area, trash).
 * That classification plus the first-segment walk (10-1-8-1-2 / 10-3-3)
 * is the activation gate shared by:
 *
 *   1. `play-command.ts` — cannot play a Command if the first segment's
 *      required public target cannot be chosen.
 *   2. `pending-effects.ts:hasLegalRequiredTargets` — a triggered /
 *      activated effect does not activate when that same gate fails.
 *   3. `pending-effects.ts:evaluateLegalTargets` — resolve-time candidate
 *      set for the next printed choose instruction (10-3-3).
 *
 * Deploy pre-commit (`validateDeployTriggerTargets`) only checks supplied
 * IDs. Omitting targets is not an activation gate — the trigger either
 * enqueues or is skipped by (2).
 */

import type {
  ConditionalDirective,
  Directive,
  EffectAction,
  EffectDirective,
  TargetFilter,
  Zone,
} from "@tcg/gundam-types";
import type { buildTargetResolutionContext } from "../rules/derived-state.ts";
import {
  evaluateCondition,
  evaluateTargetFilter,
  type TargetResolutionContext,
} from "../../runtime/target-dsl.ts";

/**
 * Decode a TargetFilter's `count` into inclusive {min, max} integers.
 *
 *   - `undefined` / `"all"` → unbounded (`[0, +∞]`). Filters with these
 *      counts apply to every match; no min/max pick check is needed.
 *   - `number n` → exact (`[n, n]`).
 *   - `{ min, max }` → inclusive range.
 */
export function getFilterCountBounds(filter: TargetFilter): { min: number; max: number } {
  const c = filter.count;
  if (c === undefined) return { min: 0, max: Number.POSITIVE_INFINITY };
  if (c === "all") return { min: 0, max: Number.POSITIVE_INFINITY };
  if (typeof c === "number") return { min: c, max: c };
  return { min: c.min, max: c.max };
}

/**
 * Collect every card the target DSL might evaluate against. Mirrors
 * `executor.gatherAllCards` — kept in one place so play-time and
 * resolve-time evaluations never disagree about which zone is in scope.
 *
 * The DSL itself filters by zone via the filter's `zone` field; this
 * helper just supplies the candidate universe.
 */
export function gatherAllCardsForTargeting(
  tgtCtx: ReturnType<typeof buildTargetResolutionContext>,
): ReturnType<ReturnType<typeof buildTargetResolutionContext>["getCardsInZone"]> {
  const zones = [
    "battleArea",
    "baseSection",
    "hand",
    "trash",
    "shieldArea",
    "resourceArea",
  ] as const;
  const playerIds = [tgtCtx.sourcePlayerId as string, tgtCtx.opponentPlayerId as string];
  type CardLike = ReturnType<typeof tgtCtx.getCardsInZone>[number];
  const cards: CardLike[] = [];
  for (const playerId of playerIds) {
    for (const zone of zones) {
      cards.push(...tgtCtx.getCardsInZone(playerId as typeof tgtCtx.sourcePlayerId, zone));
    }
  }
  return cards;
}

/**
 * Return every required-choice TargetFilter carried by an EffectAction.
 *
 * Rule 10-1-8-1-1 keys off "target that cannot be chosen", so we evaluate
 * legality against every filter the player is *required* to pick from at
 * play time. "May"-style filters are intentionally excluded — the action
 * is legal to play even when the optional pool is empty:
 *   - `lookAtTopDeck.tutorFilter` (player *may* reveal a match)
 *   - `chooseAttackTarget.attackTarget` — granted unit *may* choose this
 *     target later, at attack time; not a play-time requirement
 *
 * `chooseAttackTarget.unit` IS gated: the card text "Choose 1 friendly
 * (Clan) Unit" is a hard play-time choice, distinct from the unit's later
 * "may choose ... as its attack target".
 *
 * `forceAttackTarget.attackTarget` is also gated: the chosen Unit is the
 * play-time target that enemy Units must attack later.
 *
 * Redirect effects can make either `target` or `redirectTo` the player's
 * explicit choice. Include both filters: `findChoiceInDirective` selects the
 * non-self filter with a concrete count, covering both field orientations.
 */
export function extractActionFilters(action: EffectAction): TargetFilter[] {
  if (action.action === "discard") {
    return [
      {
        ...action.filter,
        owner: "friendly",
        zone: "hand",
        count: action.count,
      },
    ];
  }

  if (action.action === "restThenDamageByChosenUnitLevel") {
    return [action.referenceTarget];
  }

  if (action.action === "resolveThenQueue") {
    return action.first ? extractActionFilters(action.first) : [];
  }

  // These compound actions change public state before their conditional
  // target exists. Their first step auto-resolves, then the executor
  // enqueues an ordinary targeted follow-up against the updated board.
  // Treating the embedded filter as an up-front choice would expose hidden
  // deck information and force a meaningless target when the trait misses.
  if (
    action.action === "millDeckThenAddToHand" ||
    action.action === "millDeckThenDamageIfTrait" ||
    action.action === "millDeckThenDamageByTraitCount" ||
    action.action === "millDeckThenStatModifierIfTrait" ||
    action.action === "millDeckThenStatModifierIfLevel"
  ) {
    return [];
  }

  const filters: TargetFilter[] = [];
  const a = action as { target?: unknown; unit?: unknown };
  if (a.target !== undefined) filters.push(a.target as TargetFilter);
  if (action.action === "chooseAttackTarget" && a.unit !== undefined) {
    filters.push(a.unit as TargetFilter);
  }
  if (action.action === "copyKeywordEffects") {
    filters.push(action.source);
  }
  if (action.action === "createDelayedTrigger" && action.eventSourceFilter !== undefined) {
    filters.push(action.eventSourceFilter);
  }
  if (action.action === "redirectBattleDamage") {
    filters.push(action.redirectTo);
  }
  if (action.action === "forceAttackTarget") {
    filters.push(action.attackTarget);
  }
  return filters;
}

/** Public locations listed in rule 10-2-2-1. */
const PUBLIC_TARGET_ZONES = new Set<Zone>(["battleArea", "baseSection", "resourceArea", "trash"]);

/** Private / hidden locations — selecting from these is not 10-2-2-1 targeting. */
const PRIVATE_TARGET_ZONES = new Set<Zone>(["hand", "deck", "shieldArea", "resourceDeck"]);

/**
 * How a filter participates in activation vs resolution.
 *
 *   - `targetChoice` — "choose (something)" / "you may choose" against a
 *     public location or a player (10-2-2-1). Empty set blocks activation.
 *   - `privateSelection` — hand / deck / shield section. 1-3-2 applies;
 *     missing cards do not block play or trigger activation.
 *   - `implicitSelf` — the source card (10-3-4). Not a player choice.
 *   - `massAction` — `count: "all"` / no count / min 0. Do as much as
 *     possible (1-3-2, 10-1-3); zero matches is legal.
 */
export type TargetSelectionClass =
  | "targetChoice"
  | "privateSelection"
  | "implicitSelf"
  | "massAction";

export function classifyTargetFilter(filter: TargetFilter): TargetSelectionClass {
  if (filter.owner === "self") return "implicitSelf";

  const { min } = getFilterCountBounds(filter);
  if (filter.count === undefined || filter.count === "all" || min <= 0) {
    return "massAction";
  }

  const zone = filter.zone;
  if (zone !== undefined && PRIVATE_TARGET_ZONES.has(zone)) return "privateSelection";
  if (zone === undefined || PUBLIC_TARGET_ZONES.has(zone) || zone === "removalArea") {
    return "targetChoice";
  }
  return "privateSelection";
}

/** Required public choose that gates activation (10-2-2, 10-1-8-1-1). */
export function isActivationGateFilter(filter: TargetFilter): boolean {
  return classifyTargetFilter(filter) === "targetChoice";
}

function isEffectDirective(directive: Directive): directive is EffectDirective {
  return (
    typeof directive === "object" &&
    directive !== null &&
    "action" in directive &&
    !("condition" in directive) &&
    !("kind" in directive)
  );
}

function isConditionalDirective(directive: Directive): directive is ConditionalDirective {
  return (
    typeof directive === "object" &&
    directive !== null &&
    "condition" in directive &&
    "thenDirectives" in directive
  );
}

export interface FirstSegmentAction {
  action: EffectAction;
  filters: TargetFilter[];
}

type SegmentWalkState = "start" | "inFirstTargets" | "afterPreamble";

/**
 * Walk the printed first portion of an effect — the text preceding
 * "Then" / "If you do" (rules 10-1-8-1-2, 5-20) — and return every
 * required public target filter in that portion.
 *
 * Segment breaks:
 *   - `dependsOnPrevious` without `sharesTargetChoiceWithPrevious` (If you do)
 *   - `resolveThenQueue` after its `first` action
 *   - `optional` after the first portion has started
 *   - a public choose that follows a non-targeting preamble (Then, choose)
 *   - `chooseOne` (caller evaluates each option's first segment)
 */
export function collectFirstSegmentActivationActions(
  directives: readonly Directive[],
  tgtCtx?: TargetResolutionContext,
): FirstSegmentAction[] {
  const out: FirstSegmentAction[] = [];
  walkFirstSegment(directives, tgtCtx, out, "start");
  return out;
}

function walkFirstSegment(
  directives: readonly Directive[],
  tgtCtx: TargetResolutionContext | undefined,
  out: FirstSegmentAction[],
  state: SegmentWalkState,
): SegmentWalkState | "stop" {
  for (const directive of directives) {
    if (isConditionalDirective(directive)) {
      const branch = tgtCtx
        ? evaluateCondition(directive.condition, tgtCtx)
          ? directive.thenDirectives
          : (directive.elseDirectives ?? [])
        : directive.thenDirectives;
      const next = walkFirstSegment(branch, tgtCtx, out, state);
      if (next === "stop") return "stop";
      state = next;
      continue;
    }

    if ("kind" in directive && directive.kind === "chooseOne") {
      return "stop";
    }

    if (!isEffectDirective(directive)) continue;

    if (directive.optional) {
      if (state === "start") continue;
      return "stop";
    }
    if (directive.dependsOnPrevious && !directive.sharesTargetChoiceWithPrevious) {
      return "stop";
    }
    // "Choose 1 A and 1 B" is one printed selection even when encoded as
    // two sibling actions (Mikazuki Augus ST05-010 and siblings).
    if (directive.sharesTargetChoiceWithPrevious && state === "afterPreamble") {
      state = "inFirstTargets";
    }

    const action = directive.action;
    // drawIfTargetMatches inspects the previous printed selection. It is
    // not a new 10-2-2-1 choose and must not join the activation gate.
    if (action.action === "drawIfTargetMatches") {
      continue;
    }
    const actionFilters = extractActionFilters(action);
    const publicFilters = actionFilters.filter(isActivationGateFilter);

    if (action.action === "resolveThenQueue") {
      if (action.first) {
        if (publicFilters.length > 0) {
          if (state === "afterPreamble") return "stop";
          out.push({ action, filters: publicFilters });
        }
        return "stop";
      }
      // Staged continuation with no `first` step: the follow-up is the
      // first printed choose of this segment.
      walkFirstSegment(action.followUp.directives, tgtCtx, out, state);
      return "stop";
    }

    if (publicFilters.length > 0) {
      if (state === "afterPreamble") return "stop";
      out.push({ action, filters: publicFilters });
      state = "inFirstTargets";
      continue;
    }

    // "Destroy this and choose 1 enemy" is one first portion. Implicit
    // self is not a Then-preamble the way draw / add-to-hand is.
    const isImplicitSelfOnly =
      actionFilters.length > 0 &&
      actionFilters.every((filter) => classifyTargetFilter(filter) === "implicitSelf");
    if (isImplicitSelfOnly && (state === "start" || state === "inFirstTargets")) {
      continue;
    }

    state = "afterPreamble";
  }
  return state;
}

/**
 * True when every first-segment activation-gate filter has enough
 * public candidates. Empty first segment (draw, discard, Then-only
 * choose) is legal — later chooses are 10-3-3 resolution, not a gate.
 */
export function firstSegmentActivationGateSatisfied(
  directives: readonly Directive[],
  tgtCtx: TargetResolutionContext,
): boolean {
  const actions = collectFirstSegmentActivationActions(directives, tgtCtx);
  const cards = gatherAllCardsForTargeting(tgtCtx);
  for (const { filters } of actions) {
    for (const filter of filters) {
      const { min } = getFilterCountBounds(filter);
      if (evaluateTargetFilter(filter, cards, tgtCtx).length < min) return false;
    }
  }
  return true;
}
