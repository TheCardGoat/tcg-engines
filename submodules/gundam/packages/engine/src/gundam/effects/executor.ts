/**
 * Gundam TCG — Effect Executor
 *
 * Executes a CardEffect's steps against live game state, mutating GundamG
 * through the framework's write APIs.
 *
 * This is the WRITE layer, complementing the READ-ONLY effect-resolver.ts in
 * the engine's runtime (which only pre-computes targets without mutating state).
 *
 * Usage inside a move:
 *   const effect = definition.effects?.[i];
 *   if (effect) executeCardEffect(effect, buildEffectCtx(G, playerId, cardId, framework));
 */

import type {
  Card,
  CardEffect,
  ChooseOneDirective,
  Directive,
  EffectDirective,
  EffectAction,
  ConditionalDirective,
  EffectCondition,
  TargetFilter,
  Zone,
} from "@tcg/gundam-types";
import { exbpExBase001, exrpExResource003 } from "@tcg/gundam-token-data";
import type { CardInstanceId, PlayerId } from "../../types/branded.ts";
import type { FrameworkWriteAPI } from "../../types/move-types.ts";
import type { GundamG, ContinuousEffectEntry, ContinuousEffectPayload } from "../types.ts";
import {
  buildTargetResolutionContext,
  getAvailableResources,
  getEffectiveStats,
  isSupportActivatedEffect,
} from "../rules/derived-state.ts";
import { evaluateCondition, evaluateTargetFilter } from "../../runtime/target-dsl.ts";
import { emitGundamLog } from "../logging.ts";
import { handleDrawAction, handleDiscardAction, handleMillDeckAction } from "./handlers/draw.ts";
import {
  handleDealDamageAction,
  handleRecoverHPAction,
  handleRestAction,
  handleSetActiveAction,
  handleDestroyAction,
  handleExileAction,
} from "./handlers/combat.ts";
import {
  handleReturnToHandAction,
  handleReturnPairedPilotToHandAction,
  handleReturnToDeckAction,
  handleDeployAction,
  handleDeployTokenAction,
  handleDeploySelfAction,
} from "./handlers/movement.ts";
import {
  handleGrantKeywordAction,
  handleStatModifierAction,
  handlePairPilotAction,
  mapDuration,
} from "./handlers/modifiers.ts";
import { handleLookAtTopDeckAction, handleDeployFromTrashAction } from "./handlers/deck.ts";
import {
  canPlaceResource,
  isExResourceToken,
  payCost as payEffectCost,
} from "../moves/core/play-card-shared.ts";
import { emitGundamEvent } from "../events.ts";
import {
  enqueueMoveCompletionFence,
  enqueueObserverTriggers,
  enqueueOwnCardTriggers,
} from "./pending-effects.ts";
import { getFilterCountBounds } from "./target-legality.ts";

let exResourceTokenCounter = 0;
let exBaseTokenCounter = 0;

// =============================================================================
// Execution Context
// =============================================================================

export interface EffectExecutionContext {
  /** Game state draft (mutable) */
  G: GundamG;
  /** Player whose effect is firing */
  sourcePlayerId: string;
  /** Card whose effect is firing (undefined for anonymous effects) */
  sourceCardId?: string;
  /** Current structured effect being executed. */
  currentEffect?: CardEffect;
  /** Top-level directive index currently being executed. */
  currentDirectiveIndex?: number;
  /** Framework write API for zone/card/event access */
  framework: FrameworkWriteAPI;
  /**
   * Instance IDs explicitly chosen by the player as targets for this effect.
   * When provided, the executor must use these IDs verbatim for any action
   * whose target filter produced candidates — target filters are only used
   * to validate membership, not to auto-pick.
   *
   * Rule 10-1-8-1-1: "If a command effect requires choosing a target, playing
   * that Command card is not possible if that target cannot be chosen."
   */
  chosenTargets?: readonly string[];
  /** Last target ids resolved by the previous executed action in this directive list. */
  previousResolvedTargets?: readonly string[];
  /**
   * Answers to "you may" optional directives (rule 10-1-3), keyed by the
   * top-level directive index. `true` activates the directive, `false`
   * skips it. Missing entries default to activating the directive
   * (backwards-compat with pre-PR-F.2 behaviour where optional directives
   * always ran). Surfaced via `PendingOptionalPrompt` and plumbed through
   * by `resolveEffect`.
   */
  optionalAnswers?: Record<number, boolean>;
  /**
   * Answers to `ChooseOneDirective` prompts (modal "do A or B" effects),
   * keyed by the top-level directive index and storing the index into
   * `options[]` the controller picked. Missing entries default to option 0
   * so triggered/burst effects (which auto-resolve without a player input
   * window) still execute deterministically. Surfaced via
   * `PendingChooseOnePrompt` and plumbed through by `resolveEffect`.
   */
  chooseOneAnswers?: Record<number, number>;
  /** Answers to `lookAtTopDeck` routing prompts, keyed by top-level directive index. */
  deckLookAnswers?: Record<number, import("../types.ts").DeckLookAnswer>;
  /**
   * Injected when this effect fires as an observer of a game event (rule 10-1-6-1).
   * Carries context about the triggering event for future use.
   *
   * NOTE: this field is not yet wired into TargetResolutionContext, so observer
   * effects cannot currently filter on the deployed card via the DSL. Wiring it
   * through requires extending TargetResolutionContext and updating
   * buildTargetResolutionContext — tracked as a follow-up.
   */
  triggerContext?: {
    kind: "unitDeployed" | "baseDeployed" | "cardEvent";
    deployedCardId?: string;
    deployedByPlayerId?: string;
    fromZone?: Zone;
    cardId?: string;
    eventType?: string;
    playerId?: string;
    eventSourceCardId?: string;
    pairedPilotId?: string;
    paidResources?: number;
    paidExResources?: number;
    damagedBy?: string;
  };
}

// =============================================================================
// Public API
// =============================================================================

export interface ExecuteCardEffectOptions {
  /**
   * Set by the pending-effect drain / resolveEffect paths to suppress
   * re-evaluating `duringPair` / `duringLink` gates at execution time
   * — those were already checked at enqueue (see
   * `pending-effects.effectConditionsMet`), and a delayed Destroyed
   * trigger's source has typically left the battle area by the time
   * the queue drains it.
   *
   * Default `false` so direct call sites (deploy observers,
   * `activateTiming` re-fires, etc.) still respect pair/link
   * preconditions.
   */
  skipPairLinkRecheck?: boolean;
}

function targetResolutionOptions(ctx: EffectExecutionContext): {
  sourceCardId?: string;
  selfIdentityCardId?: string;
  eventSourceCardId?: string;
} {
  const destroyedHostForPilot =
    ctx.triggerContext?.kind === "cardEvent" &&
    ctx.triggerContext.eventType === "unitDestroyed" &&
    ctx.triggerContext.pairedPilotId === ctx.sourceCardId
      ? ctx.triggerContext.cardId
      : undefined;
  return {
    sourceCardId: ctx.sourceCardId,
    eventSourceCardId: ctx.triggerContext?.eventSourceCardId,
    ...(destroyedHostForPilot ? { selfIdentityCardId: destroyedHostForPilot } : {}),
  };
}

function triggerCardId(ctx: EffectExecutionContext): string | undefined {
  return ctx.triggerContext?.cardId ?? ctx.triggerContext?.deployedCardId;
}

function triggerPlayerId(ctx: EffectExecutionContext): string | undefined {
  return ctx.triggerContext?.playerId ?? ctx.triggerContext?.deployedByPlayerId;
}

/**
 * Execute a full CardEffect (condition check + directives).
 * Returns false and skips execution if conditions are not met.
 */
export function executeCardEffect(
  effect: CardEffect,
  ctx: EffectExecutionContext,
  opts: ExecuteCardEffectOptions = {},
): boolean {
  // Check conditions
  if (effect.activation.conditions && effect.activation.conditions.length > 0) {
    const tgtCtx = buildTargetResolutionContext(
      ctx.G,
      ctx.sourcePlayerId,
      ctx.framework,
      targetResolutionOptions(ctx),
    );
    for (const cond of effect.activation.conditions) {
      const condition = cond as EffectCondition;
      if (
        opts.skipPairLinkRecheck &&
        (condition.type === "duringPair" ||
          condition.type === "duringLink" ||
          condition.type === "selfPairedPilotHasTrait")
      ) {
        continue;
      }
      if (condition.type === "deployedFromZone") {
        if (ctx.triggerContext?.fromZone !== condition.zone) return false;
        continue;
      }
      if (condition.type === "eventCardIsSelf") {
        if (triggerCardId(ctx) !== sourceIdentityCardId(ctx)) return false;
        continue;
      }
      if (condition.type === "eventSourceIsSelf") {
        if (ctx.triggerContext?.eventSourceCardId !== sourceIdentityCardId(ctx)) return false;
        continue;
      }
      if (condition.type === "eventCardMatches") {
        const cardId = triggerCardId(ctx);
        if (!cardId) return false;
        const eventCard = ctx.framework.cards.get(cardId);
        if (!eventCard) return false;
        const matches = evaluateTargetFilter(condition.target, [eventCard], tgtCtx);
        if (matches.length === 0) return false;
        continue;
      }
      if (condition.type === "eventSourceMatches") {
        if (!ctx.triggerContext?.eventSourceCardId) return false;
        const eventSourceCard = ctx.framework.cards.get(ctx.triggerContext.eventSourceCardId);
        if (!eventSourceCard) return false;
        const matches = evaluateTargetFilter(condition.target, [eventSourceCard], tgtCtx);
        if (matches.length === 0) return false;
        continue;
      }
      if (condition.type === "eventPlayerIsSelf") {
        if (triggerPlayerId(ctx) !== ctx.sourcePlayerId) return false;
        continue;
      }
      if (condition.type === "eventPlayerIsOpponent") {
        if (triggerPlayerId(ctx) === ctx.sourcePlayerId) return false;
        continue;
      }
      if (condition.type === "eventPaidExResources") {
        const paid = ctx.triggerContext?.paidExResources ?? 0;
        switch (condition.comparison) {
          case "eq":
            if (paid !== condition.count) return false;
            break;
          case "lt":
            if (paid >= condition.count) return false;
            break;
          case "lte":
            if (paid > condition.count) return false;
            break;
          case "gt":
            if (paid <= condition.count) return false;
            break;
          case "gte":
            if (paid < condition.count) return false;
            break;
        }
        continue;
      }
      if (condition.type === "eventDamageSourceIsOpponent") {
        const damagedBy = ctx.triggerContext?.damagedBy;
        if (damagedBy !== undefined) {
          if (damagedBy === ctx.sourcePlayerId) return false;
        } else if (ctx.triggerContext?.playerId === ctx.sourcePlayerId) {
          return false;
        }
        continue;
      }
      if (!evaluateCondition(condition, tgtCtx)) {
        return false;
      }
    }
  }

  executeDirectives(effect.directives, { ...ctx, currentEffect: effect });
  return true;
}

function sourceIdentityCardId(ctx: EffectExecutionContext): string | undefined {
  if (!ctx.sourceCardId) return undefined;
  const sourceDef = ctx.framework.cards.getDefinition(ctx.sourceCardId) as Card | undefined;
  if (sourceDef?.type !== "pilot") return ctx.sourceCardId;
  return Object.entries(ctx.G.pilotAssignments).find(([, pid]) => pid === ctx.sourceCardId)?.[0];
}

/**
 * Execute an array of Directives, handling conditional branches.
 *
 * `topLevelIndex` is the index into the effect's top-level directive list
 * of the directive currently being evaluated (or, when recursing into a
 * conditional's then/else branches, the index of the enclosing
 * conditional). This matches `findChoiceDirective`'s semantics so
 * `ctx.optionalAnswers` can be keyed by top-level index.
 */
export function executeDirectives(
  directives: readonly Directive[],
  ctx: EffectExecutionContext,
  topLevelIndex?: number,
): boolean {
  // Tracks whether the immediately preceding directive in **this list**
  // actually "resolved" — see `EffectDirective.dependsOnPrevious` docs for
  // per-action-kind definition. States:
  //   - `null` = no prior directive at this list level.
  //   - `"conditional"` = prior was a conditional branch (dependency across
  //     conditional branches is intentionally not modelled).
  //   - `true` = prior resolved (ran + produced effect).
  //   - `false` = prior did not resolve (optional declined, or targeted
  //     action found no legal targets).
  //
  // Returns the final `prevResolved` value normalised to a boolean: empty
  // list / final-conditional both map to `true` (vacuous resolution, no
  // dependent directive should skip on them); explicit `false` means the
  // last meaningful directive failed to resolve. Used by the chooseOne
  // dispatch below to propagate inner-branch resolution outward, so a
  // following `dependsOnPrevious` directive sees the real result of the
  // chosen branch (e.g. its inner optional was declined, or its targeted
  // action found no legal target) rather than always-`true`.
  let prevResolved: "conditional" | boolean | null = null;
  for (let i = 0; i < directives.length; i++) {
    const directive = directives[i]!;
    const idx = topLevelIndex ?? i;
    if (isConditionalDirective(directive)) {
      const tgtCtx = buildTargetResolutionContext(
        ctx.G,
        ctx.sourcePlayerId,
        ctx.framework,
        targetResolutionOptions(ctx),
      );
      const condMet = evaluateCondition(directive.condition as EffectCondition, tgtCtx);
      if (condMet) {
        executeDirectives(directive.thenDirectives, ctx, idx);
      } else if (directive.elseDirectives) {
        executeDirectives(directive.elseDirectives, ctx, idx);
      }
      // Conditional branches don't carry "resolved" state across siblings.
      prevResolved = "conditional";
    } else if (isChooseOneDirective(directive)) {
      // Modal "do A or B" — pick the option the controller selected (or
      // option 0 by default for triggered/burst auto-drain). Out-of-range
      // answers fall back to 0 rather than crashing a live game.
      const answer = ctx.chooseOneAnswers?.[idx];
      const optionIdx =
        typeof answer === "number" && answer >= 0 && answer < directive.options.length ? answer : 0;
      const option = directive.options[optionIdx];
      // Propagate the inner branch's actual resolved state — if the
      // chosen option's last directive declined an optional or had no
      // legal target, a following `dependsOnPrevious` directive at this
      // list level should skip. Falls back to `false` when no option
      // matched (defensive — clamp above ensures `option` is defined).
      prevResolved = option ? executeDirectives(option.directives, ctx, idx) : false;
    } else {
      const effDirective = directive as EffectDirective;

      // `dependsOnPrevious` ("If you do, ...") — rule-less card-text
      // connective encoded on the directive. Skip when the immediately
      // preceding directive did not resolve. When there's no prior
      // directive (or prior was a conditional), fall through + warn so
      // card-data bugs remain visible.
      if (effDirective.dependsOnPrevious) {
        if (prevResolved === false) {
          // Preceding did not resolve — skip this dependent directive.
          // Don't touch the tracker: chained "If you do"s at the same
          // list level all skip together if the original didn't resolve.
          continue;
        }
        if (prevResolved === null || prevResolved === "conditional") {
          // Card-data bug: `dependsOnPrevious` without a resolvable
          // predecessor. Fall through and execute, but warn so data
          // owners can fix it. Use console.warn rather than throwing so
          // a malformed card doesn't crash a live game.
          // eslint-disable-next-line no-console
          console.warn(
            `[executor] directive has dependsOnPrevious but no resolvable predecessor (sourceCardId=${String(
              ctx.sourceCardId,
            )})`,
          );
        }
      }

      // Optional directives ("you may") — rule 10-1-3. Respect the
      // controller's answer if one was supplied via ctx.optionalAnswers;
      // otherwise default to running the directive (pre-PR-F.2 behaviour).
      if (effDirective.optional) {
        const answer = ctx.optionalAnswers?.[idx];
        if (answer === false) {
          prevResolved = false;
          continue;
        }
        // Preflight targeted-resolution BEFORE execution so we can
        // record whether the action produced an effect. Executing even
        // when the target set is empty is preserved for parity with
        // pre-change behaviour (handlers no-op on empty lists); the
        // preflight probe is read-only.
        const resolved = preflightResolved(effDirective.action, ctx);
        try {
          ctx.currentDirectiveIndex = idx;
          executeAction(effDirective.action, ctx);
        } finally {
          ctx.currentDirectiveIndex = undefined;
        }
        prevResolved = resolved;
        continue;
      }

      const resolved = preflightResolved(effDirective.action, ctx);
      try {
        ctx.currentDirectiveIndex = idx;
        executeAction(effDirective.action, ctx);
      } finally {
        ctx.currentDirectiveIndex = undefined;
      }
      prevResolved = resolved;
    }
  }
  // Normalise to boolean for the chooseOne dispatch path. `null` (empty
  // list) and `"conditional"` (final was a conditional branch) both map
  // to `true` — neither warrants skipping a dependent directive.
  return prevResolved !== false;
}

/**
 * Pre-flight read-only check: did this action's target filter find ≥1
 * legal candidate? Used to compute the "resolved" state that a following
 * `dependsOnPrevious` directive gates on. Non-targeted actions always
 * report resolved. The probe is read-only — it never mutates state, and
 * is called in addition to (not instead of) the handler dispatch, so
 * existing handler semantics are unchanged.
 */
function preflightResolved(action: EffectAction, ctx: EffectExecutionContext): boolean {
  const tgtCtx = buildTargetResolutionContext(
    ctx.G,
    ctx.sourcePlayerId,
    ctx.framework,
    targetResolutionOptions(ctx),
  );
  switch (action.action) {
    case "dealDamageEventSource":
      return eventSourceMatches(action.sourceFilter, ctx, tgtCtx);
    case "recoverHPEventCard":
      return eventCardMatches(action.sourceFilter, ctx, tgtCtx);
    case "destroyEventCard":
      return Boolean(ctx.triggerContext?.cardId);
    case "returnPairedPilotToHand":
      return Boolean(
        ctx.triggerContext?.pairedPilotId ??
        (ctx.sourceCardId ? ctx.G.pilotAssignments[ctx.sourceCardId] : undefined),
      );
    case "payResources":
      return getAvailableResources(ctx.sourcePlayerId, ctx.G, ctx.framework) >= action.count;
    case "dealDamage":
    case "dealDamageThenDrawIfDestroyed":
    case "dealDamageByCount":
    case "dealDamageBySourceStat":
    case "dealDamageByChosenUnitLevel":
    case "dealDamageAll":
    case "drawIfTargetMatches":
    case "copyKeywordEffects":
    case "recoverHP":
    case "rest":
    case "setActive":
    case "destroy":
    case "exile":
    case "returnToHand":
    case "returnToDeck":
    case "deploy":
    case "changeAttackTarget":
    case "addFromTrash":
    case "millDeckThenDamageIfTrait":
    case "millDeckThenDamageByTraitCount":
    case "millDeckThenStatModifierIfTrait":
    case "statModifierByCount":
    case "statModifierByUniqueNameCount": {
      const target =
        action.action === "addFromTrash"
          ? { ...action.target, zone: "trash" as const }
          : action.action === "copyKeywordEffects"
            ? action.source
            : action.target;
      const targets =
        action.action === "dealDamageByChosenUnitLevel"
          ? resolveChosenUnitLevelDamageTargets(action, ctx, tgtCtx)
          : resolveActionTargets(target, ctx, tgtCtx);
      const min = requiredResolvedTargetCount(target);
      if (action.action === "changeAttackTarget") {
        const combat = ctx.G.turnMetadata.pendingCombat;
        const attackerOwner = combat?.attackerId
          ? ctx.framework.cards.getOwner(combat.attackerId)
          : undefined;
        return (
          targets.length >= min &&
          attackerOwner !== undefined &&
          attackerOwner !== ctx.sourcePlayerId
        );
      }
      return targets.length >= min;
    }
    case "preventStatReduction": {
      // Must match `handlePreventiveAction`'s routing through
      // resolveActionTargets so the "resolved" probe honours chosenTargets
      // + count clamp, matching what execution actually applies.
      const targets = resolveActionTargets(action.target, ctx, tgtCtx);
      const min = requiredResolvedTargetCount(action.target);
      return targets.length >= min;
    }
    case "grantKeyword":
    case "grantTrait":
    case "statModifier":
    case "statModifierByEventPaidCost":
    case "pairPilot":
    case "pairEventCardAsPilot":
    case "preventDamage":
    case "reduceNextDamage":
    case "redirectBattleDamage":
    case "preventDestroy":
    case "preventActive":
    case "cantAttack":
    case "allowAttackDeployedThisTurn": {
      // Must match the handlers' routing (all five route through
      // resolveActionTargets in the dispatcher / handlePreventiveAction)
      // so the "resolved" probe doesn't drift from what's actually
      // applied. resolveActionTargets intersects any `chosenTargets` and
      // clamps by `count`, so a stale chosenTargets entry that filters
      // to the empty set reports `not resolved` — matching execution
      // semantics and preventing a `dependsOnPrevious` follower from
      // running spuriously.
      const targets = resolveActionTargets(action.target, ctx, tgtCtx);
      const min = requiredResolvedTargetCount(action.target);
      return targets.length >= min;
    }
    case "chooseAttackTarget": {
      // Must match `handlePreventiveAction`'s routing through
      // resolveActionTargets so the "resolved" probe honours chosenTargets
      // + count clamp on the `unit` filter, matching execution.
      const targets = resolveActionTargets(action.unit, ctx, tgtCtx);
      const min = requiredResolvedTargetCount(action.unit);
      return targets.length >= min;
    }
    case "forceAttackTarget": {
      const targets = resolveActionTargets(action.attackTarget, ctx, tgtCtx);
      const min = requiredResolvedTargetCount(action.attackTarget);
      return targets.length >= min;
    }
    case "discard": {
      if (!action.filter) return true;
      const handCards = tgtCtx.getCardsInZone(ctx.sourcePlayerId as PlayerId, "hand");
      const eligibleCards = evaluateTargetFilter(
        { ...action.filter, owner: "friendly", zone: "hand" },
        handCards,
        tgtCtx,
      );
      return eligibleCards.length >= action.count;
    }
    // Non-targeted / always-resolve actions.
    default:
      return true;
  }
}

function requiredResolvedTargetCount(filter: TargetFilter): number {
  const { min } = getFilterCountBounds(filter);
  return min > 0 ? min : 1;
}

// =============================================================================
// Action Dispatcher
// =============================================================================

/**
 * Resolve targets for an action's target filter, honoring any user-chosen
 * targets carried on the EffectExecutionContext.
 *
 * When `ctx.chosenTargets` is set, we return the intersection of the
 * player-chosen IDs with the candidates produced by the filter. This lets a
 * player pick a specific subset instead of the executor auto-picking every
 * match (which violated rules 10-1-8-1-1 and the semantics of "Choose N").
 */
function resolveActionTargets(
  filter: import("@tcg/gundam-types").TargetFilter,
  ctx: EffectExecutionContext,
  tgtCtx: ReturnType<typeof buildTargetResolutionContext>,
): ReturnType<typeof evaluateTargetFilter> {
  const candidates = evaluateTargetFilter(filter, gatherAllCards(tgtCtx), tgtCtx);
  // Rule 10-3-3 (PR F.4): honour the filter's `count`. The pre-F.4
  // executor returned every matching candidate, which silently violated
  // effects like "Choose 1 enemy Unit" — they applied to every enemy
  // unit instead of 1. Apply the count clamp in both paths:
  //
  // - No chosenTargets: pick a deterministic subset — first N in
  //   enumeration order. Used by triggered / burst that can't halt
  //   (inline drain in lifecycle hooks; see findChoiceDirective).
  // - With chosenTargets: intersect with candidates (drops stale IDs
  //   from state mutations since play-time validation), then clamp.
  //   Defense-in-depth — resolveEffect.validate enforces count on
  //   user-supplied targets, but a play-time committer shouldn't be
  //   able to over-apply either.
  if (ctx.chosenTargets === undefined || filter.owner === "self" || filter.count === "all") {
    // `owner: "self"` targets are never player-chosen — they resolve
    // uniquely to the source card. Intersecting with `chosenTargets`
    // (which carries the enemy-unit targets for a *different* directive
    // on the same effect) would incorrectly produce an empty set and
    // silently skip the action. Bypass the intersection for self-targets.
    // Likewise, `count: "all"` targets are not player-selected; they
    // intentionally apply to every legal candidate after any previous
    // chosen directive has resolved.
    return clampToFilterCount(candidates, filter);
  }
  const candidateSet = new Set<string>(candidates as readonly string[]);
  const intersected = (ctx.chosenTargets as readonly string[]).filter((id) =>
    candidateSet.has(id),
  ) as typeof candidates;
  return clampToFilterCount(intersected, filter);
}

function clampToFilterCount<T>(
  candidates: readonly T[],
  filter: import("@tcg/gundam-types").TargetFilter,
): T[] {
  const count = filter.count;
  if (count === undefined || count === "all") return candidates as T[];
  if (typeof count === "number") return candidates.slice(0, count);
  // Ranged `{ min, max }` — take up to max. `min` is a lower-bound guard
  // that's the caller's responsibility (resolveEffect.validate enforces
  // min on player-supplied answers); the executor just clamps to max.
  return candidates.slice(0, count.max);
}

function executeAction(action: EffectAction, ctx: EffectExecutionContext): void {
  const tgtCtx = buildTargetResolutionContext(
    ctx.G,
    ctx.sourcePlayerId,
    ctx.framework,
    targetResolutionOptions(ctx),
  );

  switch (action.action) {
    // ── Resource ────────────────────────────────────────────────────────────
    case "draw":
      drawByEffect(action.count, ctx.sourcePlayerId, ctx);
      break;

    case "drawIfTargetMatches": {
      const targets =
        ctx.previousResolvedTargets !== undefined
          ? ctx.previousResolvedTargets.filter((id) => {
              const card = ctx.framework.cards.get(id);
              if (!card) return false;
              return evaluateTargetFilter(action.target, [card], tgtCtx).length > 0;
            })
          : resolveActionTargets(action.target, ctx, tgtCtx);
      if (targets.length >= requiredResolvedTargetCount(action.target)) {
        drawByEffect(action.count, ctx.sourcePlayerId, ctx);
      }
      break;
    }

    case "drawAll":
      for (const playerId of Object.keys(ctx.G.players)) {
        drawByEffect(action.count, playerId, ctx);
      }
      break;

    case "createDelayedTrigger":
      {
        const eventSourceIds = action.eventSourceFilter
          ? (resolveActionTargets(action.eventSourceFilter, ctx, tgtCtx) as string[])
          : undefined;
        ctx.G.continuousEffects.push({
          id: `delayed_${ctx.G.continuousEffects.length + 1}_${ctx.framework.state.status.turn}`,
          sourceId: ctx.sourceCardId ?? "",
          targetId: ctx.sourcePlayerId,
          payload: {
            kind: "delayed-trigger",
            eventType: action.eventType,
            eventCardFilter: action.eventCardFilter,
            eventSourceFilter: action.eventSourceFilter,
            eventSourceIds,
            effect: action.effect,
          },
          duration: mapDuration(action.duration),
          createdAtTurn: ctx.framework.state.status.turn,
        });
      }
      break;

    case "payResources":
      if (getAvailableResources(ctx.sourcePlayerId, ctx.G, ctx.framework) >= action.count) {
        payEffectCost(
          { payResources: action.count },
          ctx.sourceCardId ?? "",
          ctx.sourcePlayerId,
          ctx.G,
          ctx.framework,
        );
      }
      break;

    case "discard":
      handleDiscardAction(action.count, ctx.sourcePlayerId, ctx.framework, action.filter, tgtCtx);
      break;

    case "millDeck": {
      // Resolve which player's deck to mill. `self`/`friendly` → source
      // controller; `opponent` → the opposing player; `any` falls back to
      // self (no printed card uses `any` for mill — see type docs).
      const millPlayerId =
        action.owner === "opponent" ? (tgtCtx.opponentPlayerId as string) : ctx.sourcePlayerId;
      handleMillDeckAction(action.count, millPlayerId, ctx.framework);
      break;
    }

    case "millDeckThenDrawIfTrait": {
      const deckCards = ctx.framework.zones
        .getCards({ zone: "deck", playerId: ctx.sourcePlayerId })
        .slice(0, action.count);
      let matchedTrait = false;
      for (const cardId of deckCards) {
        const def = ctx.framework.cards.getDefinition(cardId) as Card | undefined;
        if (def?.traits.some((trait) => trait.toLowerCase() === action.trait.toLowerCase())) {
          matchedTrait = true;
        }
        ctx.framework.zones.moveCard(cardId, { zone: "trash", playerId: ctx.sourcePlayerId });
      }
      if (matchedTrait) {
        drawByEffect(action.drawCount, ctx.sourcePlayerId, ctx);
      }
      break;
    }

    case "millDeckThenDamageIfTrait": {
      const millPlayerId =
        action.owner === "opponent" ? (tgtCtx.opponentPlayerId as string) : ctx.sourcePlayerId;
      const milledIds = handleMillDeckAction(action.count, millPlayerId, ctx.framework);
      const traits = Array.isArray(action.traits) ? action.traits : [action.traits];
      const matchedTrait = milledIds.some((cardId) => {
        const def = ctx.framework.cards.getDefinition(cardId) as Card | undefined;
        return traits.some((trait) =>
          def?.traits.some((cardTrait) => cardTrait.toLowerCase() === trait.toLowerCase()),
        );
      });
      if (matchedTrait) {
        const targets = resolveActionTargets(action.target, ctx, tgtCtx);
        handleDealDamageAction(targets, action.damage, ctx);
      }
      break;
    }

    case "millDeckThenDamageByTraitCount": {
      const millPlayerId =
        action.owner === "opponent" ? (tgtCtx.opponentPlayerId as string) : ctx.sourcePlayerId;
      const milledIds = handleMillDeckAction(action.count, millPlayerId, ctx.framework);
      const traits = Array.isArray(action.traits) ? action.traits : [action.traits];
      const matchedCount = milledIds.filter((cardId) => {
        const def = ctx.framework.cards.getDefinition(cardId) as Card | undefined;
        return traits.some((trait) =>
          def?.traits.some((cardTrait) => cardTrait.toLowerCase() === trait.toLowerCase()),
        );
      }).length;
      if (matchedCount > 0) {
        const targets = resolveActionTargets(action.target, ctx, tgtCtx);
        handleDealDamageAction(targets, matchedCount, ctx);
      }
      break;
    }

    case "millDeckThenStatModifierIfTrait": {
      const millPlayerId =
        action.owner === "opponent" ? (tgtCtx.opponentPlayerId as string) : ctx.sourcePlayerId;
      const milledIds = handleMillDeckAction(action.count, millPlayerId, ctx.framework);
      const traits = Array.isArray(action.traits) ? action.traits : [action.traits];
      const matchedTrait = milledIds.some((cardId) => {
        const def = ctx.framework.cards.getDefinition(cardId) as Card | undefined;
        return traits.some((trait) =>
          def?.traits.some((cardTrait) => cardTrait.toLowerCase() === trait.toLowerCase()),
        );
      });
      if (matchedTrait) {
        const targets = resolveActionTargets(action.target, ctx, tgtCtx);
        handleStatModifierAction(targets, action.stat, action.amount, action.duration, ctx);
      }
      break;
    }

    // ── Damage / status ─────────────────────────────────────────────────────
    case "dealDamage":
    case "dealDamageThenDrawIfDestroyed":
    case "dealDamageByCount":
    case "dealDamageBySourceStat":
    case "dealDamageAll": {
      const targets = resolveActionTargets(action.target, ctx, tgtCtx);
      const amount =
        action.action === "dealDamageByCount"
          ? evaluateTargetFilter(action.countFilter, gatherAllCards(tgtCtx), tgtCtx).length
          : action.action === "dealDamageBySourceStat"
            ? sourceStatDamageAmount(action, ctx)
            : action.amount;
      const targetZonesBefore =
        action.action === "dealDamageThenDrawIfDestroyed"
          ? new Map(
              targets.map((targetId) => [
                targetId,
                ctx.framework.zones.getCardZone(targetId as string)?.split(":")[0],
              ]),
            )
          : undefined;
      handleDealDamageAction(targets, amount, ctx);
      if (action.action === "dealDamageThenDrawIfDestroyed") {
        const destroyedAny = targets.some((targetId) => {
          const beforeZone = targetZonesBefore?.get(targetId);
          const afterZone = ctx.framework.zones.getCardZone(targetId as string)?.split(":")[0];
          return beforeZone === "battleArea" && afterZone === "trash";
        });
        if (destroyedAny) {
          drawByEffect(action.drawCount, ctx.sourcePlayerId, ctx);
        }
      }
      break;
    }

    case "dealDamageByChosenUnitLevel": {
      const targets = resolveChosenUnitLevelDamageTargets(action, ctx, tgtCtx);
      handleDealDamageAction(targets, action.amount, ctx);
      break;
    }

    case "dealDamageEventSource": {
      if (eventSourceMatches(action.sourceFilter, ctx, tgtCtx)) {
        handleDealDamageAction(
          [ctx.triggerContext!.eventSourceCardId! as CardInstanceId],
          action.amount,
          ctx,
        );
      }
      break;
    }

    case "recoverHP": {
      const targets = resolveActionTargets(action.target, ctx, tgtCtx);
      handleRecoverHPAction(targets, action.amount, ctx);
      break;
    }

    case "recoverHPEventCard": {
      if (eventCardMatches(action.sourceFilter, ctx, tgtCtx)) {
        handleRecoverHPAction([ctx.triggerContext!.cardId! as CardInstanceId], action.amount, ctx);
      }
      break;
    }

    case "rest": {
      const targets = resolveActionTargets(action.target, ctx, tgtCtx);
      handleRestAction(targets, ctx);
      break;
    }

    case "setActive": {
      const targets = resolveActionTargets(action.target, ctx, tgtCtx);
      handleSetActiveAction(targets, ctx);
      break;
    }

    case "changeAttackTarget": {
      const targets = resolveActionTargets(action.target, ctx, tgtCtx);
      const combat = ctx.G.turnMetadata.pendingCombat;
      const attackerOwner = combat?.attackerId
        ? ctx.framework.cards.getOwner(combat.attackerId)
        : undefined;
      if (
        combat &&
        targets[0] &&
        attackerOwner !== undefined &&
        attackerOwner !== ctx.sourcePlayerId
      ) {
        combat.target = targets[0] as string;
      }
      break;
    }

    case "destroy": {
      const targets = resolveActionTargets(action.target, ctx, tgtCtx);
      handleDestroyAction(targets, ctx);
      break;
    }

    case "destroyEventCard": {
      const eventCardId = ctx.triggerContext?.cardId;
      if (eventCardId) handleDestroyAction([eventCardId as CardInstanceId], ctx);
      break;
    }

    case "exile": {
      const targets = resolveActionTargets(action.target, ctx, tgtCtx);
      handleExileAction(targets, ctx.framework);
      break;
    }

    // ── Zone movement ────────────────────────────────────────────────────────
    case "returnToHand": {
      const targets = resolveActionTargets(action.target, ctx, tgtCtx);
      handleReturnToHandAction(targets, ctx);
      break;
    }

    case "returnEventCardToHand": {
      const eventCardId = ctx.triggerContext?.cardId;
      if (eventCardId) handleReturnToHandAction([eventCardId as CardInstanceId], ctx);
      break;
    }

    case "returnPairedPilotToHand":
      handleReturnPairedPilotToHandAction(ctx);
      break;

    case "returnToDeck": {
      const targets = resolveActionTargets(action.target, ctx, tgtCtx);
      handleReturnToDeckAction(targets, action.position, ctx, action.shuffle);
      break;
    }

    case "deploy": {
      const targets = resolveActionTargets(action.target, ctx, tgtCtx);
      handleDeployAction(targets, ctx);
      break;
    }

    case "deployToken":
      handleDeployTokenAction(action.token, action.count ?? 1, ctx);
      break;

    case "deploySelf":
      if (ctx.sourceCardId) {
        handleDeploySelfAction(ctx.sourceCardId, ctx);
      }
      break;

    case "deployExBase": {
      const count = action.count ?? 1;
      for (let i = 0; i < count; i++) {
        const existingBases = ctx.framework.zones.getCards({
          zone: "baseSection",
          playerId: ctx.sourcePlayerId,
        });
        if (existingBases.length >= 1) break;

        const tokenId = `ex_base_token_${++exBaseTokenCounter}`;
        ctx.framework.cards.registerDefinition(
          tokenId,
          exbpExBase001,
          ctx.sourcePlayerId as PlayerId,
        );
        ctx.framework.zones.placeToken(
          tokenId,
          { zone: "baseSection", playerId: ctx.sourcePlayerId },
          ctx.sourcePlayerId as PlayerId,
          { isToken: true },
        );
        ctx.G.turnMetadata.deployedThisTurn.push(tokenId);
        ctx.framework.cards.patchMeta(tokenId, { deployedThisTurn: true, exhausted: false });

        emitGundamEvent(ctx.framework.events, {
          kind: "BASE_PLACED",
          payload: { cardId: tokenId, playerId: ctx.sourcePlayerId, isToken: true },
        });
        emitGundamLog(ctx.framework, {
          type: "gundam.effect.movedToZone",
          values: { cardId: tokenId, from: "token", to: "baseSection" },
          visibility: { mode: "PUBLIC" },
          category: "action",
        });
        enqueueMoveCompletionFence(ctx.G, ctx.sourcePlayerId, ctx.framework, [
          {
            kind: "emitEvent",
            event: {
              kind: "BASE_DEPLOYED",
              payload: { cardId: tokenId, playerId: ctx.sourcePlayerId, isToken: true },
            },
          },
        ]);
      }
      break;
    }

    case "addSelfToHand":
      if (ctx.sourceCardId) {
        const ownerId = ctx.framework.cards.getOwner(ctx.sourceCardId);
        if (ownerId) {
          ctx.framework.zones.moveCard(ctx.sourceCardId, {
            zone: "hand",
            playerId: ownerId as string,
          });
        }
      }
      break;

    case "addShieldToHand":
      handleAddShieldToHandAction(action.count, ctx.sourcePlayerId, ctx.framework);
      break;

    case "addFromTrash": {
      // Route trash-zone tutoring through the shared resolver so `count` +
      // `chosenTargets` are honoured identically to other counted filters.
      // `EffectAction` target shapes don't require `zone`, so we defensively
      // validate (and force-set) `zone: "trash"` here rather than trusting
      // card data — a missing/incorrect zone would otherwise let
      // `gatherAllCards` tutor from hand/battle/resource. Counted filters on
      // activated/command effects halt via `findChoiceDirective` so the
      // controller can pick; triggered/burst fall through to the
      // deterministic first-N clamp inside `resolveActionTargets`.
      if (action.target.zone && action.target.zone !== "trash") {
        throw new Error(
          `Invalid addFromTrash target zone: ${String(action.target.zone)} (must be "trash")`,
        );
      }
      const targets = resolveActionTargets({ ...action.target, zone: "trash" }, ctx, tgtCtx);
      for (const cardId of targets) {
        ctx.framework.zones.moveCard(cardId as string, {
          zone: "hand",
          playerId: ctx.sourcePlayerId,
        });
      }
      break;
    }

    case "placeResource": {
      // Place the source card as a resource. Enforces caps (Rules 4-4-2, 4-4-2-1).
      // Honours `action.state` — `"rested"` marks the placed resource as
      // exhausted, so "Place 1 rested Resource." doesn't yield a free
      // on-play resource that can be tapped the same turn.
      if (ctx.sourceCardId) {
        const isEX = isExResourceToken(ctx.sourceCardId, ctx.framework);
        if (canPlaceResource(ctx.sourcePlayerId, isEX, ctx.framework)) {
          ctx.framework.zones.moveCard(ctx.sourceCardId, {
            zone: "resourceArea",
            playerId: ctx.sourcePlayerId,
          });
          if (action.state === "rested") {
            ctx.G.exhausted[ctx.sourceCardId] = true;
            ctx.framework.cards.patchMeta(ctx.sourceCardId, { exhausted: true });
          }
          emitGundamLog(ctx.framework, {
            type: "gundam.effect.resourcePlaced",
            values: {
              playerId: ctx.sourcePlayerId,
              cardId: ctx.sourceCardId,
              state: action.state === "rested" ? "rested" : "active",
            },
            visibility: { mode: "PUBLIC" },
            category: "action",
          });

          // Reactive trigger: "When you place an EX Resource"
          if (isEX) {
            const exEvent = {
              type: "exResourcePlaced" as const,
              cardId: ctx.sourceCardId,
              playerId: ctx.sourcePlayerId,
              ownerId: ctx.sourcePlayerId,
            };
            enqueueObserverTriggers(ctx.G, exEvent, ctx.framework, undefined);

            emitGundamEvent(ctx.framework.events, {
              kind: "EX_RESOURCE_PLACED",
              payload: {
                playerId: ctx.sourcePlayerId,
                cardId: ctx.sourceCardId,
              },
            });
          }
        }
      }
      break;
    }

    case "placeExResource": {
      const count = action.count ?? 1;
      for (let i = 0; i < count; i++) {
        if (!canPlaceResource(ctx.sourcePlayerId, true, ctx.framework)) break;
        const tokenId = `ex_resource_token_${++exResourceTokenCounter}`;
        ctx.framework.cards.registerDefinition(
          tokenId,
          exrpExResource003,
          ctx.sourcePlayerId as PlayerId,
        );
        ctx.framework.zones.placeToken(
          tokenId,
          { zone: "resourceArea", playerId: ctx.sourcePlayerId },
          ctx.sourcePlayerId as PlayerId,
          { isToken: true },
        );
        if (action.state === "rested") {
          ctx.G.exhausted[tokenId] = true;
          ctx.framework.cards.patchMeta(tokenId, { exhausted: true });
        }
        emitGundamLog(ctx.framework, {
          type: "gundam.effect.resourcePlaced",
          values: {
            playerId: ctx.sourcePlayerId,
            cardId: tokenId,
            state: action.state === "rested" ? "rested" : "active",
          },
          visibility: { mode: "PUBLIC" },
          category: "action",
        });

        const exEvent = {
          type: "exResourcePlaced" as const,
          cardId: tokenId,
          playerId: ctx.sourcePlayerId,
          ownerId: ctx.sourcePlayerId,
        };
        enqueueObserverTriggers(ctx.G, exEvent, ctx.framework, undefined);

        emitGundamEvent(ctx.framework.events, {
          kind: "EX_RESOURCE_PLACED",
          payload: {
            playerId: ctx.sourcePlayerId,
            cardId: tokenId,
          },
        });
      }
      break;
    }

    case "lookAtTopDeck": {
      handleLookAtTopDeckAction(
        action.count,
        action.return,
        action.remainingDestination,
        action.tutorFilter,
        action.tutorDestination,
        ctx,
      );
      break;
    }

    // ── Modifiers ────────────────────────────────────────────────────────────
    case "grantKeyword": {
      // Route through resolveActionTargets so `count` + `chosenTargets` are
      // honoured (rule 10-3-3). Without the clamp, activated abilities like
      // Gamow's "Choose 1 friendly (ZAFT) Unit. It gains <Breach 3>" would
      // buff every matching friendly instead of the chosen one.
      const targets = resolveActionTargets(action.target, ctx, tgtCtx);
      ctx.previousResolvedTargets = targets;
      handleGrantKeywordAction(targets, action.keyword, action.duration, ctx);
      break;
    }

    case "copyKeywordEffects": {
      const sources = resolveActionTargets(action.source, ctx, tgtCtx);
      const targets = resolveActionTargets(action.target, ctx, tgtCtx);
      ctx.previousResolvedTargets = targets;
      const sourceDef = sources[0]
        ? (ctx.framework.cards.getDefinition(sources[0] as string) as Card | undefined)
        : undefined;
      for (const keyword of sourceDef?.keywordEffects ?? []) {
        handleGrantKeywordAction(targets, keyword.keyword, action.duration, ctx);
      }
      break;
    }

    case "grantTrait": {
      const targets = resolveActionTargets(action.target, ctx, tgtCtx);
      ctx.previousResolvedTargets = targets;
      for (const cardId of targets) {
        ctx.G.continuousEffects.push({
          id: `trait_${ctx.G.continuousEffects.length + 1}_${ctx.framework.state.status.turn}`,
          sourceId: ctx.sourceCardId ?? "",
          targetId: cardId as string,
          payload: { kind: "trait-grant", trait: action.trait },
          duration: mapDuration(action.duration),
          createdAtTurn: ctx.framework.state.status.turn,
        });
      }
      break;
    }

    case "statModifier": {
      // Route through resolveActionTargets so `count` + `chosenTargets` are
      // honoured (rule 10-3-3). Critical for <Support N> (synthesised to
      // `statModifier { count: 1 }`) and activated bases/units whose
      // printed text reads "Choose 1 ... Unit. It gets AP+/-N".
      const targets = resolveActionTargets(action.target, ctx, tgtCtx);
      handleStatModifierAction(targets, action.stat, action.amount, action.duration, ctx);
      if (
        ctx.sourceCardId &&
        action.stat === "ap" &&
        action.amount > 0 &&
        ctx.currentEffect !== undefined &&
        isSupportActivatedEffect(ctx.currentEffect)
      ) {
        for (const targetId of targets) {
          const event = {
            type: "supportUsed",
            cardId: targetId as string,
            playerId: ctx.sourcePlayerId,
            supportSourceId: ctx.sourceCardId,
            amount: action.amount,
          };
          enqueueOwnCardTriggers(ctx.G, event, ctx.sourceCardId, ctx.sourcePlayerId, ctx.framework);
        }
      }
      break;
    }

    case "statModifierByEventPaidCost": {
      const targets = resolveActionTargets(action.target, ctx, tgtCtx);
      const amount = ctx.triggerContext?.paidResources ?? 0;
      if (amount > 0) {
        handleStatModifierAction(targets, action.stat, amount, action.duration, ctx);
      }
      break;
    }

    case "statModifierByCount": {
      const targets = resolveActionTargets(action.target, ctx, tgtCtx);
      const count = evaluateTargetFilter(action.countFilter, gatherAllCards(tgtCtx), tgtCtx).length;
      handleStatModifierAction(
        targets,
        action.stat,
        action.amountPerMatch * count,
        action.duration,
        ctx,
      );
      break;
    }

    case "statModifierByUniqueNameCount": {
      const targets = resolveActionTargets(action.target, ctx, tgtCtx);
      const count = countUniqueNames(action.countFilter, ctx, tgtCtx);
      handleStatModifierAction(
        targets,
        action.stat,
        action.amountPerUniqueName * count,
        action.duration,
        ctx,
      );
      break;
    }

    case "pairPilot": {
      const targets = resolveActionTargets(action.target, ctx, tgtCtx);
      if (ctx.sourceCardId && targets.length > 0) {
        handlePairPilotAction(targets[0]! as string, ctx.sourceCardId, ctx);
      }
      break;
    }

    case "pairEventCardAsPilot": {
      const eventCardId = ctx.triggerContext?.cardId;
      const eventCardDef = eventCardId ? ctx.framework.cards.getDefinition(eventCardId) : undefined;
      const targets = resolveActionTargets(action.target, ctx, tgtCtx);
      if (!eventCardId || eventCardDef?.type !== "command" || !eventCardDef.pilotName) break;
      if (targets.length > 0) {
        handlePairPilotAction(eventCardId, targets[0]! as string, ctx);
      }
      break;
    }

    // ── Continuous / preventive effects ─────────────────────────────────────
    case "preventActive":
    case "preventStatReduction":
    case "preventDamage":
    case "reduceNextDamage":
    case "redirectBattleDamage":
    case "preventDestroy":
    case "preventDamageToZone":
    case "cantAttack":
    case "allowAttackDeployedThisTurn":
    case "cantTargetPlayer":
    case "chooseAttackTarget":
    case "forceAttackTarget":
      // These effects set up restrictions tracked in continuousEffects or meta.
      // Simplified: add a restriction to affected cards.
      handlePreventiveAction(action, ctx, tgtCtx);
      break;

    // ── Timing redirect ──────────────────────────────────────────────────────
    case "activateTiming": {
      // "Activate this card's 【Main】/【Action】" — re-trigger effects
      // at the given timing. Used by Burst effects that replay a command.
      // Targets flow through ctx.chosenTargets from fireShieldBurst.
      if (ctx.sourceCardId) {
        const def = ctx.framework.cards.getDefinition(ctx.sourceCardId) as Card | undefined;
        if (def?.effects?.length) {
          for (const effect of def.effects as CardEffect[]) {
            const effectTimings = (effect.activation.timing ?? []) as string[];
            if (effectTimings.includes(action.timing)) {
              executeCardEffect(effect, ctx);
            }
          }
        }
      }
      break;
    }

    case "deployFromTrash": {
      handleDeployFromTrashAction(action.levelAtMost, action.payCost, action.target, ctx);
      break;
    }

    default:
      // Unknown action — silently skip
      break;
  }
}

// =============================================================================
// Helpers
// =============================================================================

function sourceStatDamageAmount(
  action: Extract<EffectAction, { action: "dealDamageBySourceStat" }>,
  ctx: EffectExecutionContext,
): number {
  if (!ctx.sourceCardId) return 0;
  const def = ctx.framework.cards.getDefinition(ctx.sourceCardId) as Card | undefined;
  if (def?.type !== "unit") return 0;
  const stats = getEffectiveStats(ctx.sourceCardId, ctx.G, ctx.framework.cards, ctx.framework);
  const divisor = Math.max(1, action.divisor);
  return Math.floor(stats[action.stat] / divisor) * action.damagePerStep;
}

function resolveChosenUnitLevelDamageTargets(
  action: Extract<EffectAction, { action: "dealDamageByChosenUnitLevel" }>,
  ctx: EffectExecutionContext,
  tgtCtx: ReturnType<typeof buildTargetResolutionContext>,
): ReturnType<typeof evaluateTargetFilter> {
  const referenceIds = resolveActionTargets(action.referenceTarget, ctx, tgtCtx);
  const referenceCard = referenceIds
    .map((id) => tgtCtx.getCardById(id as CardInstanceId))
    .find((card) => card !== undefined);
  if (!referenceCard) return [];

  const referenceLevel = tgtCtx.getCardLevel(referenceCard);
  return resolveActionTargets(action.target, ctx, tgtCtx).filter((targetId) => {
    const targetCard = tgtCtx.getCardById(targetId as CardInstanceId);
    return targetCard !== undefined && tgtCtx.getCardLevel(targetCard) <= referenceLevel;
  }) as ReturnType<typeof evaluateTargetFilter>;
}

function drawByEffect(count: number, playerId: string, ctx: EffectExecutionContext): string[] {
  const drawnIds = handleDrawAction(count, playerId, ctx.framework);
  if (drawnIds.length === 0) return drawnIds;
  enqueueObserverTriggers(
    ctx.G,
    {
      type: "drawByEffect" as const,
      playerId,
      ownerId: playerId,
      count: drawnIds.length,
      cardIds: drawnIds,
      sourceCardId: ctx.sourceCardId,
    },
    ctx.framework,
    ctx.sourceCardId,
  );
  return drawnIds;
}

function eventSourceMatches(
  sourceFilter: Extract<EffectAction, { action: "dealDamageEventSource" }>["sourceFilter"],
  ctx: EffectExecutionContext,
  tgtCtx: ReturnType<typeof buildTargetResolutionContext>,
): boolean {
  const eventSourceCardId = ctx.triggerContext?.eventSourceCardId;
  if (!eventSourceCardId) return false;
  if (!sourceFilter) return true;
  const eventSourceCard = ctx.framework.cards.get(eventSourceCardId);
  if (!eventSourceCard) return false;
  return evaluateTargetFilter(sourceFilter, [eventSourceCard], tgtCtx).includes(
    eventSourceCardId as CardInstanceId,
  );
}

function eventCardMatches(
  sourceFilter: Extract<EffectAction, { action: "recoverHPEventCard" }>["sourceFilter"],
  ctx: EffectExecutionContext,
  tgtCtx: ReturnType<typeof buildTargetResolutionContext>,
): boolean {
  const eventCardId = ctx.triggerContext?.cardId;
  if (!eventCardId) return false;
  if (!sourceFilter) return true;
  const eventCard = ctx.framework.cards.get(eventCardId);
  if (!eventCard) return false;
  return evaluateTargetFilter(sourceFilter, [eventCard], tgtCtx).includes(
    eventCardId as CardInstanceId,
  );
}

function isConditionalDirective(directive: Directive): directive is ConditionalDirective {
  return "condition" in directive && "thenDirectives" in directive;
}

function isChooseOneDirective(directive: Directive): directive is ChooseOneDirective {
  return "kind" in directive && (directive as { kind?: string }).kind === "chooseOne";
}

function gatherAllCards(tgtCtx: ReturnType<typeof buildTargetResolutionContext>) {
  // Collect cards from all battle-relevant zones
  const zones = [
    "battleArea",
    "baseSection",
    "hand",
    "trash",
    "shieldArea",
    "resourceArea",
  ] as const;
  const playerIds = [tgtCtx.sourcePlayerId as string, tgtCtx.opponentPlayerId as string];
  const cards = [];
  for (const playerId of playerIds) {
    for (const zone of zones) {
      cards.push(...tgtCtx.getCardsInZone(playerId as typeof tgtCtx.sourcePlayerId, zone));
    }
  }
  return cards;
}

function countUniqueNames(
  filter: import("@tcg/gundam-types").TargetFilter,
  ctx: EffectExecutionContext,
  tgtCtx: ReturnType<typeof buildTargetResolutionContext>,
): number {
  const matchedIds = evaluateTargetFilter(filter, gatherAllCards(tgtCtx), tgtCtx);
  const names = new Set<string>();
  for (const id of matchedIds) {
    const def = ctx.framework.cards.getDefinition(id as string) as Card | undefined;
    if (def) names.add(def.name.toLowerCase());
  }
  return names.size;
}

function handleAddShieldToHandAction(
  count: number,
  playerId: string,
  framework: FrameworkWriteAPI,
): void {
  const shields = framework.zones.getCards({ zone: "shieldArea", playerId });
  const toMove = shields.slice(0, count);
  for (const cardId of toMove) {
    framework.zones.moveCard(cardId, { zone: "hand", playerId });
  }
}

let preventiveEffectIdCounter = 0;

function pushPreventiveEffect(
  payload: ContinuousEffectPayload,
  targetId: string,
  duration: ContinuousEffectEntry["duration"],
  ctx: EffectExecutionContext,
): void {
  ctx.G.continuousEffects.push({
    id: `prev_${++preventiveEffectIdCounter}`,
    sourceId: ctx.sourceCardId ?? "",
    targetId,
    payload,
    duration,
    createdAtTurn: ctx.framework.state.status.turn,
  });
}

function handlePreventiveAction(
  action: EffectAction,
  ctx: EffectExecutionContext,
  tgtCtx: ReturnType<typeof buildTargetResolutionContext>,
): void {
  switch (action.action) {
    case "preventActive": {
      // "It won't be set as active during the start phase of your opponent's next turn."
      // Push a prevent-active restriction on each target, lasting until the start of
      // next turn (cleaned up after the active step processes it).
      const targets = resolveActionTargets(action.target, ctx, tgtCtx);
      for (const cardId of targets) {
        pushPreventiveEffect(
          { kind: "restriction", restriction: "prevent-active" },
          cardId as string,
          "until-start-of-next-turn",
          ctx,
        );
      }
      break;
    }

    case "preventStatReduction": {
      // Push a restriction onto each target that blocks negative modifiers for `stat`.
      // Route through resolveActionTargets so `count` + `chosenTargets` are
      // honoured (rule 10-3-3) — "Choose 1 friendly Unit. It can't get AP-"
      // would otherwise protect every matching friendly.
      const targets = resolveActionTargets(action.target, ctx, tgtCtx);
      for (const cardId of targets) {
        pushPreventiveEffect(
          { kind: "restriction", restriction: `prevent-stat-reduction-${action.stat}` },
          cardId as string,
          "permanent",
          ctx,
        );
      }
      break;
    }

    case "preventDamage": {
      // Push a prevent-damage entry on each target; unitFilter describes which attackers are blocked.
      // Route through resolveActionTargets so `count` + `chosenTargets` are
      // honoured (rule 10-3-3) — otherwise "Choose 1 friendly Unit" would
      // protect every matching friendly Unit instead of just the chosen one.
      const targets = resolveActionTargets(action.target, ctx, tgtCtx);
      for (const cardId of targets) {
        pushPreventiveEffect(
          {
            kind: "prevent-damage",
            unitFilter: action.unitFilter,
            damageType: action.damageType,
            sourceCardType: action.sourceCardType,
          },
          cardId as string,
          // Honor card-data `duration` when supplied — most cards print
          // "during this turn" or "during this battle". Default to
          // "permanent" so existing card data without an explicit
          // duration keeps its previous semantics.
          action.duration ? mapDuration(action.duration) : "permanent",
          ctx,
        );
      }
      break;
    }

    case "reduceNextDamage": {
      const targets = resolveActionTargets(action.target, ctx, tgtCtx);
      const amount =
        action.exResourceAmount !== undefined && (ctx.triggerContext?.paidExResources ?? 0) > 0
          ? action.exResourceAmount
          : action.amount;
      for (const cardId of targets) {
        pushPreventiveEffect(
          {
            kind: "damage-reduction",
            amount,
            damageType: action.damageType,
            source: action.source,
          },
          cardId as string,
          mapDuration(action.duration),
          ctx,
        );
      }
      break;
    }

    case "redirectBattleDamage": {
      const targets = resolveActionTargets(action.target, ctx, tgtCtx);
      const redirectTargets = resolveActionTargets(action.redirectTo, ctx, tgtCtx);
      const redirectToId = redirectTargets[0] as string | undefined;
      if (!redirectToId) break;
      for (const cardId of targets) {
        pushPreventiveEffect(
          { kind: "battle-damage-redirect", redirectToId },
          cardId as string,
          mapDuration(action.duration),
          ctx,
        );
      }
      break;
    }

    case "preventDestroy": {
      const targets = resolveActionTargets(action.target, ctx, tgtCtx);
      for (const cardId of targets) {
        pushPreventiveEffect(
          { kind: "prevent-destroy", source: action.source },
          cardId as string,
          mapDuration(action.duration),
          ctx,
        );
      }
      break;
    }

    case "cantAttack": {
      // The existing canAttack() check already enforces "cannot-attack" restrictions.
      // Route through resolveActionTargets so `count` + `chosenTargets` are
      // honoured (rule 10-3-3) — otherwise "Choose 1 Blocker" would gag
      // every Blocker instead of just the chosen one.
      const targets = resolveActionTargets(action.target, ctx, tgtCtx);
      for (const cardId of targets) {
        pushPreventiveEffect(
          { kind: "restriction", restriction: "cannot-attack" },
          cardId as string,
          mapDuration(action.duration),
          ctx,
        );
      }
      break;
    }

    case "allowAttackDeployedThisTurn": {
      const targets = resolveActionTargets(action.target, ctx, tgtCtx);
      for (const cardId of targets) {
        pushPreventiveEffect(
          { kind: "allow-attack-deployed-this-turn" },
          cardId as string,
          mapDuration(action.duration),
          ctx,
        );
      }
      break;
    }

    case "preventDamageToZone": {
      // Zone-level protection — targetId is the source player who owns the zone
      pushPreventiveEffect(
        { kind: "prevent-damage-to-zone", zone: action.zone, unitFilter: action.unitFilter },
        ctx.sourcePlayerId,
        mapDuration(action.duration),
        ctx,
      );
      break;
    }

    case "chooseAttackTarget": {
      // Grant units matching `action.unit` the *option* to attack targets
      // matching `action.attackTarget` (may-choose / permissive semantics).
      // Route through resolveActionTargets so `count` + `chosenTargets` are
      // honoured (rule 10-3-3) — a card reading "Choose 1 friendly Unit.
      // It may choose an active enemy Unit …" must bind to the picked
      // unit only, not every matching friendly.
      const unitFilter =
        action.exResourceUnitCount !== undefined && (ctx.triggerContext?.paidExResources ?? 0) > 0
          ? { ...action.unit, count: action.exResourceUnitCount }
          : action.unit;
      const unitTargets = resolveActionTargets(unitFilter, ctx, tgtCtx);
      for (const cardId of unitTargets) {
        pushPreventiveEffect(
          { kind: "grant-attack-target-option", attackTarget: action.attackTarget },
          cardId as string,
          mapDuration(action.duration ?? "permanent"),
          ctx,
        );
      }
      break;
    }

    case "forceAttackTarget": {
      const forcedTargets = resolveActionTargets(action.attackTarget, ctx, tgtCtx);
      if (forcedTargets.length === 0) break;
      const attackTargetId = forcedTargets[0] as string;
      const unitTargets = resolveActionTargets(action.unit, ctx, tgtCtx);
      for (const cardId of unitTargets) {
        pushPreventiveEffect(
          {
            kind: "force-attack-target",
            attackTarget: action.attackTarget,
            attackTargetId,
          },
          cardId as string,
          mapDuration(action.duration ?? "permanent"),
          ctx,
        );
      }
      break;
    }

    default:
      break;
  }
}
