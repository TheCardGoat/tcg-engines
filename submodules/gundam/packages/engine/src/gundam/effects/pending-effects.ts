/**
 * Pending-effect queue mechanics (rules 10-1-6, 10-1-7, 10-1-8, 10-1-6-8).
 *
 * Implements the "foundation" half of the unified effect-resolution
 * redesign: a single queue on G.pendingEffects, engine-level auto-drain
 * invoked from the flow's onTransitionCheck, and helpers moves can call
 * to enqueue effects rather than running them inline.
 *
 * See docs/pending-effects-design.md for the full migration plan
 * (deploy-unit → play-command → activate-ability → attack-step / shield
 * bursts → delete `bag` + TriggerQueue). This file is PR A of that plan.
 */

import type {
  Card,
  CardEffect,
  ChooseOneDirective,
  Directive,
  EffectCondition,
  EffectDirective,
  TargetFilter,
  Zone,
} from "@tcg/gundam-types";
import type { LifecycleContext, TransitionCheckResult } from "../../types/index.ts";
import type { DeepReadonly, FrameworkReadAPI, FrameworkWriteAPI } from "../../types/move-types.ts";
import type { PlayerId } from "../../types/branded.ts";
import type { RuntimeCard } from "../../types/base-card.ts";
import type {
  DeckLookAnswer,
  GundamG,
  GundamCardMeta,
  ReadonlyGundamG,
  PendingChoicePrompt,
  PendingEffect,
  PostResolveAction,
} from "../types.ts";
import type { AttributeFilter } from "@tcg/gundam-types";
import { buildTargetResolutionContext, isLinkUnit } from "../rules/derived-state.ts";
import {
  evaluateAttributeFilter,
  evaluateCondition,
  evaluateTargetFilter,
} from "../../runtime/target-dsl.ts";
import { emitGundamEvent } from "../events.ts";
import { emitGundamLog } from "../logging.ts";
import { EVENT_TIMING_MAP } from "./event-timings.ts";
import { executeCardEffect, type EffectExecutionContext } from "./executor.ts";

/**
 * Generate a PendingEffect id from a counter that lives on `G` so it is
 * snapshotted alongside the queue. Previous implementations used a module
 * scoped counter which would collide across state rehydration (snapshot
 * restore, replay, per-match worker rehosting).
 */
export function nextPendingEffectId(g: GundamG): string {
  const next = (g.eventCounters.pendingEffect ?? 0) + 1;
  g.eventCounters.pendingEffect = next;
  return `pe_${next}`;
}

// =============================================================================
// Enqueue
// =============================================================================

export interface EnqueueOptions {
  /**
   * When true, insert at the front of the queue (rule 10-1-6-7: a new
   * effect triggered during resolution gets priority and is resolved
   * before the remainder of the queue). Within-tier ordering is broken
   * by priorityHead picking the earliest entry at the lowest tier, so a
   * preempted entry naturally wins over later same-tier entries.
   */
  preempt?: boolean;
}

export function enqueuePendingEffect(
  g: GundamG,
  entry: PendingEffect,
  framework: FrameworkWriteAPI,
  opts: EnqueueOptions = {},
): void {
  // Inherit the currently-resolving head's `originatingMoveId` when the
  // caller didn't provide one. This is what makes rule 10-1-6-7 preempts
  // (cascading triggers spawned during another effect's resolution)
  // share the parent move's group id without every enqueue site having
  // to thread it explicitly.
  const stamped: PendingEffect =
    entry.originatingMoveId === undefined && g.pendingEffectCurrentMoveId !== undefined
      ? { ...entry, originatingMoveId: g.pendingEffectCurrentMoveId }
      : entry;
  if (opts.preempt) {
    g.pendingEffects.unshift(stamped);
  } else {
    g.pendingEffects.push(stamped);
  }
  emitGundamLog(framework, {
    type: "gundam.pending.enqueued",
    values: {
      effectId: stamped.id,
      sourceCardId: stamped.sourceCardId,
      controllerId: stamped.controllerId,
      kind: stamped.kind,
      moveGroupId: stamped.originatingMoveId,
    },
    visibility: { mode: "PUBLIC" },
    category: "system",
  });
}

/**
 * Enqueue a "move-completion fence" — a sentinel PendingEffect that
 * carries no card-effect body, only `postActions`. Tier-sorted strictly
 * last (see `tierOf`), it resolves after every same-move trigger
 * (own-card + observer + any rule 10-1-6-7 preempts) has settled, so
 * its postActions fire at the natural "move fully complete" boundary.
 *
 * Used to defer "after-trigger" semantics like `UNIT_DEPLOYED`,
 * `BASE_DEPLOYED`, `PILOT_ASSIGNED` — events whose listeners want the
 * post-trigger board state, not the mid-execution state.
 *
 * For events whose listeners want the synchronous "card has entered
 * this zone" signal, the move should emit a placement event
 * (`UNIT_PLACED`, `BASE_PLACED`, `PILOT_PAIRED`) directly, before the
 * trigger enqueue calls.
 */
export function enqueueMoveCompletionFence(
  g: GundamG,
  controllerId: string,
  framework: FrameworkWriteAPI,
  postActions: readonly PostResolveAction[],
  originatingMoveId?: string,
): void {
  enqueuePendingEffect(
    g,
    {
      id: nextPendingEffectId(g),
      controllerId,
      sourceCardId: "__sentinel__",
      // Sentinel never executes the effect body; this shape is only
      // here to satisfy the typed PendingEffect contract.
      effect: {
        type: "triggered",
        activation: { timing: [] },
        directives: [],
      } as unknown as CardEffect,
      effectIndex: -1,
      kind: "sentinel",
      postActions,
      originatingMoveId,
    },
    framework,
  );
}

// =============================================================================
// Trigger-event enqueue helpers (replacement for TriggerQueue.publish / publishDirect)
// =============================================================================

/**
 * Event shape passed around while enqueuing triggered effects. Mirrors
 * the legacy TriggerEvent union from effects/trigger-queue.ts — we keep
 * it here so PRs migrating off TriggerQueue can drop that module.
 */
export type TriggerEventLike = {
  type: string;
  cardId?: string;
  playerId?: string;
  [k: string]: unknown;
};

/**
 * Per-event-type resolver: returns the runtime card that
 * `activation.qualification` should be evaluated against.
 *
 * Rule 3-2-5 (Pairing) / 3-2-6 (Link Conditions): `【When Paired･X Pilot】`
 * and `【When Linked】` check the **pilot** against the qualification —
 * the bracketed phrase qualifies which pilot triggers the ability.
 *
 * Events we don't have qualification data for resolve to `undefined`,
 * which means "no qualification check needed" — the caller treats that
 * as a pass. When a card ships with a qualification for an event type
 * not covered here, we fail closed (return null) so the trigger won't
 * silently fire ungated.
 */
function resolveQualificationActorId(event: TriggerEventLike): string | undefined | null {
  switch (event.type) {
    case "pilotPaired":
      // The qualification is on the pilot (e.g. "White Base Team Pilot").
      return (event as { pilotId?: string }).pilotId;
    case "attackDeclared":
      // Reserved: if any card prints a qualification on its attack
      // trigger, it would check the attacker. No catalog card uses this
      // today, but having the mapping keeps the fallback safe.
      return (event as { attackerId?: string }).attackerId;
    case "unitDestroyed":
      // `unitDestroyed.cardId` is the dying card. Qualifications on a
      // 【Destroyed】 trigger (e.g. gd02/003 Gundam Mk-II Titans:
      // "If this Unit has an X Pilot…") check the destroyed unit
      // itself — i.e. "if I am destroyed" — so the actor is the
      // source card.
      return (event as { cardId?: string }).cardId;
    default:
      return undefined;
  }
}

/**
 * Evaluate `activation.qualification` (rules 3-2-5, 3-2-6, 10-2-1): the
 * pilot-attribute predicate that gates pair/link triggers. Returns true
 * when no qualification is declared or when the predicate matches the
 * event's actor card. Returns false when the actor cannot be resolved —
 * a declared qualification with no identifiable actor must not fire.
 */
function effectQualificationMet(
  effect: CardEffect,
  g: GundamG,
  controllerId: string,
  sourceCardId: string,
  framework: FrameworkReadAPI,
  event: TriggerEventLike,
): boolean {
  const qualification = effect.activation.qualification as AttributeFilter | undefined;
  if (!qualification) return true;
  const actorId = resolveQualificationActorId(event);
  if (!actorId) return false;
  const actor = framework.cards.get(actorId);
  if (!actor) return false;
  const ctx = buildTargetResolutionContext(g, controllerId, framework, { sourceCardId });
  return evaluateAttributeFilter(qualification, actor, ctx);
}

/**
 * Evaluate an effect's `activation.conditions` before enqueueing so we
 * don't park dead entries on the queue (rule 10-2-1). A non-matching
 * effect that happens to have a target filter would otherwise halt the
 * flow waiting for a selection that will then be discarded.
 */
function effectConditionsMet(
  effect: CardEffect,
  g: GundamG,
  controllerId: string,
  sourceCardId: string,
  framework: FrameworkReadAPI,
  event: TriggerEventLike,
): boolean {
  const conditions = effect.activation.conditions;
  if (!conditions?.length) return true;
  const tgtCtx = buildTargetResolutionContext(g, controllerId, framework, { sourceCardId });
  return conditions.every((c) => {
    const condition = c as EffectCondition;
    if (condition.type === "duringPair" || condition.type === "duringLink") {
      return continuousStateConditionMet(condition.type, g, framework, sourceCardId);
    }
    if (condition.type === "deployedFromZone") {
      return event.fromZone === condition.zone;
    }
    if (condition.type === "eventCardIsSelf") {
      const selfId = sourceIdentityCardId(g, framework, sourceCardId);
      return selfId !== undefined && event.cardId === selfId;
    }
    if (condition.type === "eventSourceIsSelf") {
      const selfId = sourceIdentityCardId(g, framework, sourceCardId);
      return selfId !== undefined && event.sourceCardId === selfId;
    }
    if (condition.type === "eventCardMatches") {
      if (!event.cardId) return false;
      const eventCard = framework.cards.get(event.cardId);
      if (!eventCard) return false;
      const matches = evaluateTargetFilter(condition.target, [eventCard], tgtCtx);
      return matches.length > 0;
    }
    if (condition.type === "eventSourceMatches") {
      const sourceCardId = event.sourceCardId as string | undefined;
      if (!sourceCardId) return false;
      const sourceCard = framework.cards.get(sourceCardId);
      if (!sourceCard) return false;
      const matches = evaluateTargetFilter(condition.target, [sourceCard], tgtCtx);
      return matches.length > 0;
    }
    if (condition.type === "eventPlayerIsSelf") {
      return event.playerId === controllerId;
    }
    if (condition.type === "eventPlayerIsOpponent") {
      return event.playerId !== undefined && event.playerId !== controllerId;
    }
    if (condition.type === "eventPaidExResources") {
      const paid = Number(event.paidExResources ?? 0);
      switch (condition.comparison) {
        case "eq":
          return paid === condition.count;
        case "lt":
          return paid < condition.count;
        case "lte":
          return paid <= condition.count;
        case "gt":
          return paid > condition.count;
        case "gte":
          return paid >= condition.count;
      }
    }
    if (condition.type === "eventDamageSourceIsOpponent") {
      const damagedBy = event.damagedBy as string | undefined;
      if (damagedBy !== undefined) return damagedBy !== controllerId;
      return event.playerId !== undefined && event.playerId !== controllerId;
    }
    return evaluateCondition(condition, tgtCtx);
  });
}

function sourceIdentityCardId(
  g: GundamG,
  framework: FrameworkReadAPI,
  sourceCardId: string,
): string | undefined {
  const sourceDef = framework.cards.getDefinition(sourceCardId) as Card | undefined;
  if (sourceDef?.type !== "pilot") return sourceCardId;
  return Object.entries(g.pilotAssignments).find(([, pid]) => pid === sourceCardId)?.[0];
}

/**
 * Pair/link condition gates need the engine's source-card identity rather
 * than target enumeration. This preserves the old `duringPair` /
 * `duringLink` timing-marker behavior for event enqueueing while keeping
 * the public card data modeled as `EffectCondition`.
 */
function continuousStateConditionMet(
  condition: "duringPair" | "duringLink",
  g: GundamG,
  framework: FrameworkReadAPI,
  sourceCardId: string,
): boolean {
  const gateUnitId = sourceIdentityCardId(g, framework, sourceCardId);

  if (!gateUnitId) return false;
  if (condition === "duringPair") return Boolean(g.pilotAssignments[gateUnitId]);
  return isLinkUnit(gateUnitId, g, framework.cards);
}

/**
 * Default the priority tier from the effect's timing. Effects whose
 * timing includes "burst" (e.g. Shield Bursts) are tier 0 (rule
 * 10-1-6-8). Callers may still override via opts.kind.
 *
 */
function deriveKind(effect: CardEffect): PendingEffect["kind"] {
  const timings = (effect.activation.timing ?? []) as string[];
  if (timings.includes("burst")) return "burst";
  return "triggered";
}

function markTriggeredOncePerTurnUse(
  effect: CardEffect,
  sourceCardId: string,
  effectIndex: number,
  framework: FrameworkWriteAPI,
): boolean {
  const oncePerTurn = effect.activation.restrictions?.some((r) => r.type === "oncePerTurn");
  if (!oncePerTurn) return true;

  const meta = framework.cards.getMeta(sourceCardId) as GundamCardMeta | undefined;
  const uses = (meta?.abilityUsesThisTurn ?? {}) as Record<string, number>;
  const key = String(effectIndex);
  if ((uses[key] ?? 0) >= 1) return false;

  framework.cards.patchMeta(sourceCardId, {
    abilityUsesThisTurn: { ...uses, [key]: (uses[key] ?? 0) + 1 },
  });
  return true;
}

/**
 * Enqueue all of `sourceCardId`'s own triggered effects that match
 * `event.type`. Used when the triggering move already owns the source
 * card (e.g. deploy-unit enqueues its own Deploy triggers, optionally
 * with pre-chosen targets from the move's input).
 */
export function enqueueOwnCardTriggers(
  g: GundamG,
  event: TriggerEventLike,
  sourceCardId: string,
  controllerId: string,
  framework: FrameworkWriteAPI,
  opts: {
    chosenTargets?: readonly string[];
    kind?: PendingEffect["kind"];
    preempt?: boolean;
    /**
     * `commandID` of the move spawning these triggers. Stamped onto
     * every enqueued entry so replay tooling can group them with the
     * originating play. Falls back to inheriting from
     * `g.pendingEffectCurrentMoveId` inside `enqueuePendingEffect`.
     */
    originatingMoveId?: string;
  } = {},
): void {
  const timings = EVENT_TIMING_MAP[event.type];
  if (!timings) return;
  const def = framework.cards.getDefinition(sourceCardId) as Card | undefined;
  if (!def?.effects?.length) return;

  for (let i = 0; i < def.effects.length; i++) {
    const effect = def.effects[i]! as CardEffect;
    if (effect.type !== "triggered") continue;
    const effectTimings = (effect.activation.timing ?? []) as string[];
    if (!matchesTimingForEvent(effectTimings, timings, event)) continue;
    // Rules 3-2-5 / 3-2-6: skip effects whose pilot qualification doesn't match.
    if (!effectQualificationMet(effect, g, controllerId, sourceCardId, framework, event)) continue;
    // Rule 10-2-1: skip effects whose activation conditions don't hold.
    if (!effectConditionsMet(effect, g, controllerId, sourceCardId, framework, event)) continue;
    if (!markTriggeredOncePerTurnUse(effect, sourceCardId, i, framework)) continue;

    enqueuePendingEffect(
      g,
      {
        id: nextPendingEffectId(g),
        controllerId,
        sourceCardId,
        effect,
        effectIndex: i,
        kind: opts.kind ?? deriveKind(effect),
        trigger: event,
        chosenTargets: opts.chosenTargets,
        originatingMoveId: opts.originatingMoveId,
      },
      framework,
      { preempt: opts.preempt },
    );
  }
}

/**
 * Check whether any of an effect's declared timings is relevant to the
 * current event, applying per-timing gates. `whenLinked` (rule 3-2-6-2)
 * fires only when the pairing actually satisfies the unit's link
 * condition — the pilotPaired event carries `isLink: boolean` on its
 * payload for this check. All other event/timing pairs match whenever
 * the timing string overlaps `allowed`.
 */
function matchesTimingForEvent(
  effectTimings: readonly string[],
  allowed: readonly string[],
  event: TriggerEventLike,
): boolean {
  const eventIsLink = (event as { isLink?: boolean }).isLink === true;
  return effectTimings.some((t) => {
    if (!allowed.includes(t)) return false;
    if (t === "whenLinked" && !eventIsLink) return false;
    return true;
  });
}

/**
 * Scan every in-play observer (battleArea + baseSection on both sides)
 * for triggered effects whose timing matches `event.type` and enqueue
 * each one as a PendingEffect. Dedupes identical effects so a single
 * event can fire each (card × effectIndex × eventType) combo at most
 * once (rule 10-1-6-3).
 *
 * `sourceCardIdToSkip` is required rather than inferred from the event
 * because different event shapes carry the source under different keys
 * (`cardId` for deploy/destroy, `attackerId` for attackDeclared, etc.).
 * Pass `undefined` for events with no meaningful source to skip.
 */
export function enqueueObserverTriggers(
  g: GundamG,
  event: TriggerEventLike,
  framework: FrameworkWriteAPI,
  sourceCardIdToSkip: string | readonly string[] | undefined,
  opts: {
    kind?: PendingEffect["kind"];
    preempt?: boolean;
    /** See `enqueueOwnCardTriggers.opts.originatingMoveId`. */
    originatingMoveId?: string;
  } = {},
): void {
  const timings = EVENT_TIMING_MAP[event.type];
  if (!timings) return;

  enqueueDelayedTriggers(g, event, framework, opts);

  const seen = new Set<string>();
  const skipIds = new Set(
    Array.isArray(sourceCardIdToSkip)
      ? sourceCardIdToSkip
      : sourceCardIdToSkip
        ? [sourceCardIdToSkip]
        : [],
  );
  const playerIds = Object.keys(g.players);

  for (const pid of playerIds) {
    const battleCards = framework.zones.getCards({ zone: "battleArea", playerId: pid });
    const baseCards = framework.zones.getCards({ zone: "baseSection", playerId: pid });
    for (const observerCardId of [...battleCards, ...baseCards]) {
      if (skipIds.has(observerCardId)) continue;

      const def = framework.cards.getDefinition(observerCardId) as Card | undefined;
      if (!def?.effects?.length) continue;
      for (let i = 0; i < def.effects.length; i++) {
        const effect = def.effects[i]! as CardEffect;
        if (effect.type !== "triggered") continue;
        const effectTimings = (effect.activation.timing ?? []) as string[];
        if (!matchesTimingForEvent(effectTimings, timings, event)) continue;
        // Rules 3-2-5 / 3-2-6: skip observers whose pilot qualification doesn't match.
        if (!effectQualificationMet(effect, g, pid, observerCardId, framework, event)) continue;
        // Rule 10-2-1: skip observers whose activation conditions don't hold.
        if (!effectConditionsMet(effect, g, pid, observerCardId, framework, event)) continue;

        const dedupKey = `${observerCardId}:${i}:${event.type}`;
        if (seen.has(dedupKey)) continue;
        seen.add(dedupKey);
        if (!markTriggeredOncePerTurnUse(effect, observerCardId, i, framework)) continue;
        enqueuePendingEffect(
          g,
          {
            id: nextPendingEffectId(g),
            controllerId: pid,
            sourceCardId: observerCardId,
            effect,
            effectIndex: i,
            kind: opts.kind ?? deriveKind(effect),
            trigger: event,
            originatingMoveId: opts.originatingMoveId,
          },
          framework,
          { preempt: opts.preempt },
        );
      }
    }
  }
}

function enqueueDelayedTriggers(
  g: GundamG,
  event: TriggerEventLike,
  framework: FrameworkWriteAPI,
  opts: {
    kind?: PendingEffect["kind"];
    preempt?: boolean;
    originatingMoveId?: string;
  },
): void {
  if (!event.cardId) return;

  for (const entry of g.continuousEffects) {
    if (entry.payload.kind !== "delayed-trigger") continue;
    if (entry.payload.eventType !== event.type) continue;

    const controllerId = entry.targetId;
    const sourceCardId = entry.sourceId;
    const eventCard = framework.cards.get(event.cardId);
    if (!eventCard) continue;

    const tgtCtx = buildTargetResolutionContext(g, controllerId, framework, { sourceCardId });
    if (entry.payload.eventSourceIds) {
      const eventSourceId = event.sourceCardId as string | undefined;
      if (!eventSourceId || !entry.payload.eventSourceIds.includes(eventSourceId)) continue;
    } else if (entry.payload.eventSourceFilter) {
      const eventSourceId = event.sourceCardId as string | undefined;
      const eventSource = eventSourceId ? framework.cards.get(eventSourceId) : undefined;
      if (!eventSource) continue;
      const sourceMatches = evaluateTargetFilter(
        entry.payload.eventSourceFilter,
        [eventSource],
        tgtCtx,
      );
      if (sourceMatches.length === 0) continue;
    }
    const matches = evaluateTargetFilter(entry.payload.eventCardFilter, [eventCard], tgtCtx);
    if (matches.length === 0) continue;

    enqueuePendingEffect(
      g,
      {
        id: nextPendingEffectId(g),
        controllerId,
        sourceCardId,
        effect: entry.payload.effect,
        effectIndex: -1,
        kind: opts.kind ?? "triggered",
        trigger: event,
        originatingMoveId: opts.originatingMoveId,
      },
      framework,
      { preempt: opts.preempt },
    );
  }
}

// =============================================================================
// Priority (non-mutating lookup)
// =============================================================================

/**
 * Tier used for priority sort. Lower wins.
 *
 * Rule 10-1-6-8: 【Burst】 resolves before any other triggered effect.
 * Rule 10-1-6-6: active player's triggered effects resolve before standby's.
 * Activated and command effects are never racing against triggered effects
 * in the queue — they are put on the queue by moves that the player just
 * executed — so their tier is moot when no triggered effects are present.
 */
export function tierOf(pe: DeepReadonly<PendingEffect>, activePlayerId: string): number {
  if (pe.kind === "burst") return 0;
  if (pe.kind === "triggered") {
    return pe.controllerId === activePlayerId ? 1 : 2;
  }
  // Move-completion fence (kind === "sentinel") sorts strictly last so
  // every other entry — including standby observer triggers and any
  // rule 10-1-6-7 preempts that arrive later — resolves before the
  // completion postActions fire.
  if (pe.kind === "sentinel") return 4;
  return 3;
}

/**
 * Index of the highest-priority entry in the queue, or -1 if empty.
 * Non-mutating — safe to call from validate() paths.
 *
 * Ties: the lowest-index entry at the winning tier wins, which matches
 * stable-sort-on-insertion-order semantics. Callers that need "newest
 * within tier" should use enqueuePendingEffect with preempt:true at
 * insert time — nothing here reorders after the fact.
 */
export function priorityHeadIndex(g: ReadonlyGundamG, activePlayerId: string): number {
  if (g.pendingEffects.length === 0) return -1;
  let bestIdx = 0;
  let bestTier = tierOf(g.pendingEffects[0]!, activePlayerId);
  for (let i = 1; i < g.pendingEffects.length; i++) {
    const t = tierOf(g.pendingEffects[i]!, activePlayerId);
    if (t < bestTier) {
      bestTier = t;
      bestIdx = i;
    }
  }
  return bestIdx;
}

export function priorityHead(
  g: ReadonlyGundamG,
  activePlayerId: string,
): DeepReadonly<PendingEffect> | undefined {
  const idx = priorityHeadIndex(g, activePlayerId);
  return idx < 0 ? undefined : g.pendingEffects[idx];
}

/**
 * Same-tier same-controller peers at the current priority head, in queue
 * (insertion) order and including the head itself. Empty when the queue
 * is empty. Used by the ordering-prompt projection (rule 10-1-6-5) and
 * by resolveEffect.validate to check that a caller-supplied pendingEffectId
 * sits at the minimal tier.
 */
export function peersAtHead(
  g: ReadonlyGundamG,
  activePlayerId: string,
): readonly DeepReadonly<PendingEffect>[] {
  const head = priorityHead(g, activePlayerId);
  if (!head) return [];
  const headTier = tierOf(head, activePlayerId);
  return g.pendingEffects.filter(
    (pe) => pe.controllerId === head.controllerId && tierOf(pe, activePlayerId) === headTier,
  );
}

// =============================================================================
// Choice inspection
// =============================================================================

/**
 * Whether this pending effect still needs input from its controller
 * before it can be resolved.
 *
 * Semantics:
 *   - Any "you may" (optional) directive always halts until answered.
 *   - For `kind: "activated"` / `"command"` effects, an unresolved
 *     target filter also halts. Those kinds have an explicit
 *     `args.targets` channel on their move (activate-ability,
 *     play-command), so a missing `chosenTargets` indicates the
 *     controller hasn't committed yet and the flow must wait.
 *   - For `kind: "triggered"` / `"burst"` effects, target filters
 *     auto-pick candidates (legacy TriggerQueue/executor behavior).
 *     These are fired by the engine — attackers don't hand-pick
 *     targets for their own 【Attack】 trigger — so halting would
 *     deadlock the battle phase. A future PR can tighten this if we
 *     want rule-strict "choose at activation" (rule 10-3-3) for
 *     triggered effects.
 *
 * Kept as a thin boolean wrapper around `findChoiceDirective` so the
 * descriptor builder (`buildPendingChoicePrompt`) and the halt check
 * share one set of rules.
 */
interface ChoiceRuntimeContext {
  g: ReadonlyGundamG;
  framework: FrameworkReadAPI;
}

export function requiresPlayerChoice(
  pe: DeepReadonly<PendingEffect>,
  runtime?: ChoiceRuntimeContext,
): boolean {
  // Sentinel entries are pure cleanup — no card effect body, no
  // directives, never a player choice. Short-circuit so the drain
  // resolves them via their `postActions` path.
  if (pe.kind === "sentinel") return false;
  return findChoiceDirective(pe, runtime) !== null;
}

type ChoiceMatch =
  | { kind: "optional"; directive: EffectDirective }
  | {
      kind: "targetSelection";
      directive: EffectDirective;
      filter: TargetFilter;
    }
  | {
      kind: "chooseOne";
      directive: ChooseOneDirective;
    }
  | {
      kind: "deckLook";
      directive: EffectDirective;
      acceptOptionalDirectiveIndex?: number;
    };

export type ChoiceDirective = ChoiceMatch & { directiveIndex: number };

/**
 * Locate the first directive on `pe` that requires controller input, or
 * null if everything auto-resolves. Recurses into ConditionalDirective
 * branches so an `optional: true` or counted target filter nested inside
 * a then/else block is still surfaced — otherwise `requiresPlayerChoice`
 * would disagree with what the executor actually runs.
 *
 * `directiveIndex` is the **top-level** index of the enclosing directive
 * (the conditional itself when the match comes from a then/else branch).
 *
 * Conditional branches are unioned (then ∪ else) without evaluating the
 * condition. This is conservative: it can flag a prompt for a branch
 * that won't execute, but it never misses a prompt that will. Evaluating
 * the condition here would require a target-DSL context the boolean
 * `requiresPlayerChoice` callers (drain, resolveEffect.validate) don't
 * carry.
 *
 * Only `kind: "activated"` / `"command"` halt for unresolved target
 * filters — those effects are fired by a move the player just executed,
 * so they have an input channel (`args.targets`) to supply
 * `chosenTargets`. `triggered` / `burst` auto-pick deterministically in
 * the executor (first N candidates by enumeration order per rule 10-3-3)
 * because they fire from lifecycle hooks with an inline synchronous
 * drain — halting would deadlock the battle phase until a player-choice
 * refactor of those hooks (tracked as future work).
 */
export function findChoiceDirective(
  pe: DeepReadonly<PendingEffect>,
  runtime?: ChoiceRuntimeContext,
): ChoiceDirective | null {
  const directives = pe.effect.directives as readonly Directive[];
  const canHaltForTargets =
    (pe.kind === "activated" || pe.kind === "command") && pe.chosenTargets === undefined;
  const canHaltForDeckLook = pe.kind === "activated" || pe.kind === "command";
  const tgtCtx = runtime
    ? buildTargetResolutionContext(runtime.g, pe.controllerId, runtime.framework, {
        sourceCardId: pe.sourceCardId,
      })
    : undefined;

  for (let i = 0; i < directives.length; i++) {
    const directive = directives[i]!;
    const next = directives[i + 1];
    if (
      next !== undefined &&
      !("condition" in directive) &&
      !("kind" in directive) &&
      !("condition" in next) &&
      !("kind" in next)
    ) {
      const ed = directive as EffectDirective;
      const nextEd = next as EffectDirective;
      if (
        canHaltForDeckLook &&
        ed.optional &&
        nextEd.dependsOnPrevious &&
        nextEd.action.action === "lookAtTopDeck"
      ) {
        const found: ChoiceMatch = {
          kind: "deckLook",
          directive: nextEd,
          acceptOptionalDirectiveIndex: i,
        };
        if (runtime) {
          const deckCards = runtime.framework.zones.getCards({
            zone: "deck",
            playerId: pe.controllerId,
          });
          if (deckCards.length === 0 || nextEd.action.count <= 0) continue;
        }
        return { ...found, directiveIndex: i + 1 };
      }
    }
    const found = findChoiceInDirective(directive, canHaltForTargets, canHaltForDeckLook, tgtCtx);
    if (!found) continue;
    if (found.kind === "deckLook" && runtime) {
      const action = found.directive.action;
      if (action.action !== "lookAtTopDeck") continue;
      const deckCards = runtime.framework.zones.getCards({
        zone: "deck",
        playerId: pe.controllerId,
      });
      if (deckCards.length === 0 || action.count <= 0) continue;
    }
    return { ...found, directiveIndex: i };
  }
  return null;
}

function findChoiceInDirective(
  d: Directive,
  canHaltForTargets: boolean,
  canHaltForDeckLook: boolean,
  tgtCtx?: ReturnType<typeof buildTargetResolutionContext>,
): ChoiceMatch | null {
  if ("condition" in d) {
    if (tgtCtx) {
      const branch = evaluateCondition(d.condition as EffectCondition, tgtCtx)
        ? d.thenDirectives
        : (d.elseDirectives ?? []);
      return findChoiceInList(branch, canHaltForTargets, canHaltForDeckLook, tgtCtx);
    }
    return (
      findChoiceInList(d.thenDirectives ?? [], canHaltForTargets, canHaltForDeckLook, tgtCtx) ??
      findChoiceInList(d.elseDirectives ?? [], canHaltForTargets, canHaltForDeckLook, tgtCtx)
    );
  }
  if ("kind" in d && (d as { kind?: string }).kind === "chooseOne") {
    // Modal "do A or B" — always halts for player input, mirroring the
    // unconditional halt on `optional`. The executor falls back to
    // option 0 if no answer arrives, but the controller deserves the
    // chance to pick (the choice itself is the gameplay decision —
    // there's no game-state default that's right for every card).
    return { kind: "chooseOne", directive: d as ChooseOneDirective };
  }
  const ed = d as EffectDirective;
  if (ed.optional) return { kind: "optional", directive: ed };
  if (canHaltForDeckLook && ed.action.action === "lookAtTopDeck") {
    return { kind: "deckLook", directive: ed };
  }
  if (!canHaltForTargets) return null;
  const filter =
    ed.action.action === "copyKeywordEffects"
      ? ed.action.source
      : (ed.action as { target?: TargetFilter }).target;
  if (!filter) return null;
  if (filter.owner === "self") return null;
  // Filters without an explicit `count` (or `count: "all"`) hit every
  // matching candidate — the player doesn't pick a subset. These auto-
  // pick in the executor and don't require a resolveEffect hand-off.
  // Only filters with a specific numeric / ranged `count` halt the queue.
  const count = filter.count;
  if (count === undefined || count === "all") return null;
  return { kind: "targetSelection", directive: ed, filter };
}

function findChoiceInList(
  directives: readonly Directive[],
  canHaltForTargets: boolean,
  canHaltForDeckLook: boolean,
  tgtCtx?: ReturnType<typeof buildTargetResolutionContext>,
): ChoiceMatch | null {
  for (const d of directives) {
    const found = findChoiceInDirective(d, canHaltForTargets, canHaltForDeckLook, tgtCtx);
    if (found) return found;
  }
  return null;
}

// =============================================================================
// Choice descriptor (PR F.1 — player-choice UX projection surface)
// =============================================================================

/**
 * Derive a UI-agnostic descriptor of what the priority-head pending
 * effect needs from its controller, or `undefined` when nothing is
 * waiting on a choice.
 *
 * Pure with respect to game state: reads `g.pendingEffects` +
 * `framework` zones/cards, produces a descriptor, never mutates. Safe to
 * call from projection paths. Client UIs and bots consume this through
 * `GundamBoardView.pendingChoice`.
 *
 * F.1 emits `targetSelection` (activated/command waiting for targets)
 * and `optional` ("you may" directives). `PendingOrderingPrompt` is in
 * the type union for forward compatibility but not emitted yet — PR F.3
 * adds that when the `resolveEffect` move learns to accept a
 * `pendingEffectId`.
 */
export function buildPendingChoicePrompt(
  g: ReadonlyGundamG,
  framework: FrameworkReadAPI,
  activePlayerId: string,
): PendingChoicePrompt | undefined {
  const head = priorityHead(g, activePlayerId);
  if (!head) return undefined;

  // PR F.3 (rule 10-1-6-5): when the head has same-tier same-controller
  // peers, surface an `ordering` prompt first so the controller can pick
  // resolution order before being asked about targets / optional. The
  // content prompt (targetSelection / optional) appears on the next
  // projection cycle once the queue is down to one peer at this tier.
  //
  // Only for activated / command heads — triggered / burst fire from
  // lifecycle hooks (attack-step, resolve-direct) with no mid-step
  // player-input window, so `drainPendingEffects` can't honour an
  // ordering halt for them. Emitting an unanswerable prompt would be
  // misleading. Those fall back to deterministic insertion order.
  if (head.kind === "activated" || head.kind === "command") {
    const peers = peersAtHead(g, activePlayerId);
    if (peers.length >= 2) {
      return {
        kind: "ordering",
        effectId: head.id,
        controllerId: head.controllerId,
        candidateEffectIds: peers.map((p) => p.id),
        prompt: "Choose which pending effect to resolve next.",
      };
    }
  }

  const choice = findChoiceDirective(head, { g, framework });
  if (!choice) return undefined;

  const prompt = head.effect.sourceText ?? "";

  if (choice.kind === "optional") {
    return {
      kind: "optional",
      effectId: head.id,
      controllerId: head.controllerId,
      sourceCardId: head.sourceCardId,
      directiveIndex: choice.directiveIndex,
      prompt,
    };
  }

  if (choice.kind === "chooseOne") {
    return {
      kind: "chooseOne",
      effectId: head.id,
      controllerId: head.controllerId,
      sourceCardId: head.sourceCardId,
      directiveIndex: choice.directiveIndex,
      options: choice.directive.options.map((o, idx) => ({ index: idx, label: o.label ?? "" })),
      prompt,
    };
  }

  if (choice.kind === "deckLook") {
    const action = choice.directive.action;
    if (action.action !== "lookAtTopDeck") return undefined;
    const deckCards = framework.zones
      .getCards({ zone: "deck", playerId: head.controllerId })
      .slice(0, action.count);
    if (deckCards.length === 0) return undefined;
    const tgtCtx = buildTargetResolutionContext(g, head.controllerId, framework, {
      sourceCardId: head.sourceCardId,
    });
    const legalTutorCardIds = action.tutorFilter
      ? (evaluateTargetFilter(
          { ...action.tutorFilter, zone: action.tutorFilter.zone ?? "deck" },
          deckCards
            .map((id) => framework.cards.get(id))
            .filter((card): card is RuntimeCard => card !== undefined),
          tgtCtx,
        ) as readonly string[])
      : [];

    return {
      kind: "deckLook",
      effectId: head.id,
      controllerId: head.controllerId,
      sourceCardId: head.sourceCardId,
      directiveIndex: choice.directiveIndex,
      prompt,
      revealedCardIds: deckCards,
      returnMode: action.return,
      remainingDestination: action.remainingDestination,
      tutorDestination: action.tutorDestination ?? "hand",
      legalTutorCardIds,
      acceptOptionalDirectiveIndex: choice.acceptOptionalDirectiveIndex,
    };
  }

  const { minTargets, maxTargets } = filterCountBounds(choice.filter);
  const tgtCtx = buildTargetResolutionContext(g, head.controllerId, framework, {
    sourceCardId: head.sourceCardId,
  });
  const legalTargetIds = evaluateTargetFilter(
    choice.filter,
    gatherTargetableCards(framework, Object.keys(g.players)),
    tgtCtx,
  ) as readonly string[];

  return {
    kind: "targetSelection",
    effectId: head.id,
    controllerId: head.controllerId,
    sourceCardId: head.sourceCardId,
    directiveIndex: choice.directiveIndex,
    filter: choice.filter,
    minTargets,
    maxTargets,
    legalTargetIds,
    prompt,
  };
}

export function validateDeckLookAnswer(
  pe: DeepReadonly<PendingEffect>,
  directiveIndex: number,
  answer: DeckLookAnswer | undefined,
  g: ReadonlyGundamG,
  framework: FrameworkReadAPI,
): { valid: true } | { valid: false; error: string; errorCode: string } {
  if (!answer) {
    return {
      valid: false,
      error: "Pending effect requires a deck-look answer",
      errorCode: "MISSING_DECK_LOOK_ANSWER",
    };
  }

  const directive = pe.effect.directives[directiveIndex] as Directive | undefined;
  if (!directive || "condition" in directive || "kind" in directive) {
    return {
      valid: false,
      error: `deckLookAnswers[${directiveIndex}] does not reference a lookAtTopDeck directive`,
      errorCode: "INVALID_DECK_LOOK_INDEX",
    };
  }

  const action = (directive as EffectDirective).action;
  if (action.action !== "lookAtTopDeck") {
    return {
      valid: false,
      error: `deckLookAnswers[${directiveIndex}] does not reference a lookAtTopDeck directive`,
      errorCode: "INVALID_DECK_LOOK_INDEX",
    };
  }

  const revealed = framework.zones
    .getCards({ zone: "deck", playerId: pe.controllerId })
    .slice(0, action.count);
  const revealedSet = new Set(revealed);
  const legalTutorIds = legalDeckLookTutorIds(pe, action.tutorFilter, revealed, g, framework);
  if (answer.tutorCardId !== undefined && !legalTutorIds.has(answer.tutorCardId)) {
    return {
      valid: false,
      error: "deckLook tutorCardId is not a legal revealed tutor target",
      errorCode: "INVALID_DECK_LOOK_TUTOR",
    };
  }
  if (answer.tutorCardId !== undefined && !revealedSet.has(answer.tutorCardId)) {
    return {
      valid: false,
      error: "deckLook tutorCardId is not among the revealed cards",
      errorCode: "INVALID_DECK_LOOK_TUTOR",
    };
  }

  const remaining = revealed.filter((id) => id !== answer.tutorCardId);
  const remainingSet = new Set(remaining);
  const toTop = uniqueDeckLookIds(answer.toTop, remainingSet);
  const toBottom = uniqueDeckLookIds(answer.toBottom, remainingSet);
  const toTrash = uniqueDeckLookIds(answer.toTrash, remainingSet);
  const submittedCount =
    (answer.toTop?.length ?? 0) + (answer.toBottom?.length ?? 0) + (answer.toTrash?.length ?? 0);
  const uniqueSubmitted = new Set([...toTop, ...toBottom, ...toTrash]);

  if (
    submittedCount !== uniqueSubmitted.size ||
    toTop.length !== (answer.toTop?.length ?? 0) ||
    toBottom.length !== (answer.toBottom?.length ?? 0) ||
    toTrash.length !== (answer.toTrash?.length ?? 0)
  ) {
    return {
      valid: false,
      error: "deckLook answer contains duplicate or unknown card ids",
      errorCode: "INVALID_DECK_LOOK_CARD_IDS",
    };
  }

  const allRemainingRouted = remaining.every((id) => uniqueSubmitted.has(id));
  if (!allRemainingRouted || uniqueSubmitted.size !== remaining.length) {
    return {
      valid: false,
      error: "deckLook answer must route every non-tutored revealed card exactly once",
      errorCode: "INCOMPLETE_DECK_LOOK_ROUTING",
    };
  }

  if (action.return === "topOrTrash") {
    if (toBottom.length > 0) {
      return invalidDeckLookRoute("topOrTrash cannot route cards to bottom");
    }
    return { valid: true };
  }

  if (action.return === "topAndBottom") {
    if (toTrash.length > 0) {
      return invalidDeckLookRoute("topAndBottom cannot route cards to trash");
    }
    if (remaining.length > 1 && toBottom.length === 0) {
      return invalidDeckLookRoute("topAndBottom must route at least one card to bottom");
    }
    return { valid: true };
  }

  if (action.remainingDestination === "trash") {
    if (toBottom.length > 0 || toTop.length !== Math.min(1, remaining.length)) {
      return invalidDeckLookRoute(
        "chooseTop with trash remainder must keep exactly one card on top",
      );
    }
    return { valid: true };
  }

  if (action.remainingDestination === "bottom") {
    if (toTrash.length > 0 || toTop.length !== Math.min(1, remaining.length)) {
      return invalidDeckLookRoute(
        "chooseTop with bottom remainder must keep exactly one card on top",
      );
    }
    return { valid: true };
  }

  if (toTop.length > 0 || toTrash.length > 0) {
    return invalidDeckLookRoute(
      "legacy chooseTop tutor effects must return non-tutored cards to bottom",
    );
  }

  return { valid: true };
}

function legalDeckLookTutorIds(
  pe: DeepReadonly<PendingEffect>,
  tutorFilter: TargetFilter | undefined,
  revealedIds: readonly string[],
  g: ReadonlyGundamG,
  framework: FrameworkReadAPI,
): ReadonlySet<string> {
  if (!tutorFilter) return new Set();
  const tgtCtx = buildTargetResolutionContext(g, pe.controllerId, framework, {
    sourceCardId: pe.sourceCardId,
  });
  return new Set(
    evaluateTargetFilter(
      { ...tutorFilter, zone: tutorFilter.zone ?? "deck" },
      revealedIds
        .map((id) => framework.cards.get(id))
        .filter((card): card is RuntimeCard => card !== undefined),
      tgtCtx,
    ) as readonly string[],
  );
}

function uniqueDeckLookIds(
  ids: readonly string[] | undefined,
  allowed: ReadonlySet<string>,
): string[] {
  const out: string[] = [];
  for (const id of ids ?? []) {
    if (!allowed.has(id) || out.includes(id)) continue;
    out.push(id);
  }
  return out;
}

function invalidDeckLookRoute(message: string): { valid: false; error: string; errorCode: string } {
  return {
    valid: false,
    error: message,
    errorCode: "INVALID_DECK_LOOK_ROUTING",
  };
}

/**
 * Compute the legal candidate set for a pending effect's unresolved
 * target selection. Shared between `buildPendingChoicePrompt` (projection)
 * and `resolveEffect.validate` (move validation) so the prompt a client
 * reads and the validator a client submits against are backed by the
 * same DSL evaluation.
 *
 * Returns `null` when the priority head needs no target choice (nothing
 * to validate against) and a descriptor otherwise.
 */
export function evaluateLegalTargets(
  pe: DeepReadonly<PendingEffect>,
  g: ReadonlyGundamG,
  framework: FrameworkReadAPI,
): {
  choice: ChoiceDirective;
  legalTargetIds: readonly string[];
  minTargets: number;
  maxTargets: number;
  groups: readonly {
    legalTargetIds: readonly string[];
    minTargets: number;
    maxTargets: number;
  }[];
} | null {
  const choice = findChoiceDirective(pe, { g, framework });
  if (!choice || choice.kind !== "targetSelection") return null;
  const tgtCtx = buildTargetResolutionContext(g, pe.controllerId, framework, {
    sourceCardId: pe.sourceCardId,
  });
  const cards = gatherTargetableCards(framework, Object.keys(g.players));
  const filters = collectTargetSelectionFilters(
    pe.effect.directives as readonly Directive[],
    tgtCtx,
  );
  const groups = coalesceTargetGroups(
    filters.map((filter) => {
      const legalTargetIds = evaluateTargetFilter(filter, cards, tgtCtx) as readonly string[];
      const { minTargets, maxTargets } =
        legalTargetIds.length === 0 ? { minTargets: 0, maxTargets: 0 } : filterCountBounds(filter);
      return { legalTargetIds, minTargets, maxTargets };
    }),
  );
  const legalTargetIds = [...new Set(groups.flatMap((group) => [...group.legalTargetIds]))];
  const minTargets = groups.reduce((sum, group) => sum + group.minTargets, 0);
  const maxTargets = groups.reduce((sum, group) => sum + group.maxTargets, 0);
  return { choice, legalTargetIds, minTargets, maxTargets, groups };
}

function coalesceTargetGroups(
  groups: {
    legalTargetIds: readonly string[];
    minTargets: number;
    maxTargets: number;
  }[],
): {
  legalTargetIds: readonly string[];
  minTargets: number;
  maxTargets: number;
}[] {
  const seen = new Set<string>();
  const out: {
    legalTargetIds: readonly string[];
    minTargets: number;
    maxTargets: number;
  }[] = [];
  for (const group of groups) {
    const key = `${[...group.legalTargetIds].sort().join("|")}:${group.minTargets}:${group.maxTargets}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(group);
  }
  return out;
}

function collectTargetSelectionFilters(
  directives: readonly Directive[],
  tgtCtx: ReturnType<typeof buildTargetResolutionContext>,
): TargetFilter[] {
  const filters: TargetFilter[] = [];
  for (const directive of directives) {
    if ("condition" in directive) {
      const branch = evaluateCondition(directive.condition as EffectCondition, tgtCtx)
        ? directive.thenDirectives
        : (directive.elseDirectives ?? []);
      filters.push(...collectTargetSelectionFilters(branch, tgtCtx));
      continue;
    }
    if ("kind" in directive) continue;

    const filter = (directive.action as { target?: TargetFilter }).target;
    if (!filter || filter.owner === "self") continue;
    const count = filter.count;
    if (count === undefined || count === "all") continue;
    filters.push(filter);
  }
  return filters;
}

function filterCountBounds(filter: DeepReadonly<TargetFilter>): {
  minTargets: number;
  maxTargets: number;
} {
  const c = filter.count;
  if (typeof c === "number") return { minTargets: c, maxTargets: c };
  if (c && typeof c === "object" && "min" in c && "max" in c) {
    return { minTargets: c.min, maxTargets: c.max };
  }
  // `undefined` / "all" fall through — findChoiceDirective already
  // excludes those, but guard here so the helper is honest about bounds.
  return { minTargets: 0, maxTargets: Number.POSITIVE_INFINITY };
}

/**
 * Collect candidates from every zone a target filter might plausibly
 * consider. Mirrors the `gatherAllCards` helpers in executor.ts /
 * deploy-unit.ts / play-command.ts — kept local to avoid a cross-module
 * extraction until we're ready to consolidate all three call sites.
 */
const TARGETABLE_ZONES: readonly Zone[] = [
  "battleArea",
  "baseSection",
  "hand",
  "trash",
  "shieldArea",
  "resourceArea",
];

function gatherTargetableCards(
  framework: FrameworkReadAPI,
  playerIds: readonly string[],
): readonly RuntimeCard[] {
  const out: RuntimeCard[] = [];
  for (const pid of playerIds) {
    for (const zone of TARGETABLE_ZONES) {
      const ids = framework.zones.getCards({ zone, playerId: pid });
      for (const id of ids) {
        const card = framework.cards.get(id);
        if (card) out.push(card);
      }
    }
  }
  return out;
}

// =============================================================================
// Drain
// =============================================================================

/**
 * Auto-resolve every queue head that doesn't require player input, in
 * priority order. Returns a tri-state result consumed by the flow
 * engine's resolveOneTransition:
 *   - "restart": one or more effects resolved; the flow should restart
 *     its transition loop so endIf conditions re-evaluate against the
 *     post-resolution state.
 *   - "halt": the queue is non-empty and its priority head needs a
 *     choice from its controller — no flow transition may advance until
 *     a resolveEffect move drains it.
 *   - "continue": the queue is empty; proceed with normal transitions.
 *
 * Wired into gundamFlow.onTransitionCheck so drains happen at every
 * transition boundary (rule 10-1-6-7 — new triggers get priority after
 * the current directive finishes).
 */
export function drainPendingEffects(ctx: LifecycleContext): TransitionCheckResult {
  const g = ctx.G as GundamG;
  if (g.pendingEffects.length === 0) {
    restorePreHaltActor(ctx, g);
    return "continue";
  }

  const activePlayerId = ctx.framework.state.status.activePlayer as unknown as string;
  let resolvedAny = false;

  while (g.pendingEffects.length > 0) {
    const idx = priorityHeadIndex(g, activePlayerId);
    if (idx < 0) break;
    const head = g.pendingEffects[idx]!;
    if (requiresPlayerChoice(head, { g, framework: ctx.framework })) break;
    // Rule 10-1-6-5 (PR F.3/F.4): when the head has same-tier same-
    // controller peers, the controller picks resolution order. Halt so
    // the `ordering` prompt (surfaced by buildPendingChoicePrompt) is
    // actionable — otherwise the drain would resolve the head in
    // insertion order before the player could supply a pendingEffectId.
    //
    // Only applies to activated / command heads. Triggered and burst
    // effects fire from lifecycle hooks (attack-step, resolve-direct
    // shield bursts) with no player-input window mid-step — halting for
    // an ordering choice would deadlock combat. Those fall back to
    // deterministic insertion order (rule 13-1-7-4 Suppression shows
    // that two-burst ordering converges on the same outcome for
    // independent effects).
    if (
      (head.kind === "activated" || head.kind === "command") &&
      peersAtHead(g, activePlayerId).length >= 2
    ) {
      break;
    }
    g.pendingEffects.splice(idx, 1);
    // Set `pendingEffectCurrentMoveId` for the duration of the head's
    // execution so any nested enqueue (rule 10-1-6-7 preempts, cascading
    // triggers from inside the effect body) inherits the parent's move
    // id. Restored after each head so peer heads don't bleed group ids.
    const prevMoveId = g.pendingEffectCurrentMoveId;
    g.pendingEffectCurrentMoveId = head.originatingMoveId;
    try {
      // Sentinel entries are the move-completion fence — no card body
      // to execute, only the `postActions` (e.g. UNIT_DEPLOYED emit)
      // run when the fence's tier finally comes up.
      if (head.kind !== "sentinel") {
        executeCardEffect(head.effect as CardEffect, buildExecCtx(ctx, head), {
          skipPairLinkRecheck: true,
        });
      }
      runPostActions(head.postActions, ctx);
    } finally {
      g.pendingEffectCurrentMoveId = prevMoveId;
    }
    emitGundamLog(ctx.framework, {
      type: "gundam.pending.resolved",
      values: {
        effectId: head.id,
        sourceCardId: head.sourceCardId,
        moveGroupId: head.originatingMoveId,
      },
      visibility: { mode: "PUBLIC" },
      category: "system",
    });
    resolvedAny = true;
  }

  // Queue still has entries only reachable via a player decision → halt
  // the flow. endIf checks for phase/step must not advance past a pending
  // effect.
  if (g.pendingEffects.length > 0) {
    stashAndShiftForHalt(ctx, g);
    return "halt";
  }
  restorePreHaltActor(ctx, g);
  return resolvedAny ? "restart" : "continue";
}

/**
 * When the queue halts on a priority head whose controller isn't the
 * current `activePlayer`, shift `activePlayer` to the controller so the
 * runtime's active-player gate admits their `resolveEffect`. Stash the
 * pre-shift value on G so `restorePreHaltActor` can put it back once the
 * queue drains.
 *
 * Re-entrant: if a later halt in the same session finds the stash
 * already populated, don't overwrite it — the original pre-halt actor
 * is still what we want to return to.
 */
function stashAndShiftForHalt(ctx: LifecycleContext, g: GundamG): void {
  const currentActor = ctx.framework.state.status.activePlayer as unknown as string;
  const head = priorityHead(g, currentActor);
  if (!head) return;
  if (head.controllerId === currentActor) return;
  if (g.pendingEffectPreHaltActor === undefined) {
    g.pendingEffectPreHaltActor = currentActor;
  }
  ctx.framework.status.patch({ activePlayer: head.controllerId as unknown as PlayerId });
}

function restorePreHaltActor(ctx: LifecycleContext, g: GundamG): void {
  if (g.pendingEffectPreHaltActor === undefined) return;
  ctx.framework.status.patch({
    activePlayer: g.pendingEffectPreHaltActor as unknown as PlayerId,
  });
  g.pendingEffectPreHaltActor = undefined;
}

// =============================================================================
// Public helper: build an EffectExecutionContext from a LifecycleContext
// =============================================================================

export function buildExecCtx(
  ctx: LifecycleContext,
  pe: PendingEffect,
  opts: {
    optionalAnswers?: Record<number, boolean>;
    chooseOneAnswers?: Record<number, number>;
    deckLookAnswers?: Record<number, import("../types.ts").DeckLookAnswer>;
  } = {},
): EffectExecutionContext {
  return {
    G: ctx.G as GundamG,
    sourcePlayerId: pe.controllerId,
    sourceCardId: pe.sourceCardId,
    framework: ctx.framework,
    chosenTargets: pe.chosenTargets,
    optionalAnswers: opts.optionalAnswers,
    chooseOneAnswers: opts.chooseOneAnswers,
    deckLookAnswers: opts.deckLookAnswers,
    triggerContext:
      pe.trigger?.type === "unitDeployed" || pe.trigger?.type === "baseDeployed"
        ? {
            kind: pe.trigger.type,
            deployedCardId: pe.trigger.cardId as string,
            deployedByPlayerId: pe.trigger.playerId as string,
            fromZone: pe.trigger.fromZone as import("@tcg/gundam-types").Zone | undefined,
          }
        : pe.trigger
          ? {
              kind: "cardEvent",
              eventType: pe.trigger.type,
              cardId: pe.trigger.cardId as string | undefined,
              playerId: pe.trigger.playerId as string | undefined,
              eventSourceCardId: pe.trigger.sourceCardId as string | undefined,
              pairedPilotId: pe.trigger.pairedPilotId as string | undefined,
              paidResources: pe.trigger.paidResources as number | undefined,
              paidExResources: pe.trigger.paidExResources as number | undefined,
              damagedBy: pe.trigger.damagedBy as string | undefined,
            }
          : undefined,
  };
}

/**
 * Apply a PendingEffect's post-resolve cleanup actions in order. Called
 * by the drain loop and by resolveEffect.execute immediately after
 * executeCardEffect finishes — never in between directives — so rule
 * 3-4-4 (Command goes to trash *after* effect ends) is honoured.
 */
export function runPostActions(
  actions: readonly PostResolveAction[] | undefined,
  ctx: LifecycleContext,
): void {
  if (!actions) return;
  for (const action of actions) {
    switch (action.kind) {
      case "moveToTrash": {
        // The card may already have been moved out of the transient
        // `removalArea` by its own effect — e.g. a Command whose effect
        // `placeResource`s the card into `resourceArea`. Unconditionally
        // trashing it now would clobber the placement. Only retire the
        // card when it's still waiting in `removalArea`.
        const currentZone = ctx.framework.cards.getZone(action.cardId);
        if (currentZone === "removalArea") {
          ctx.framework.zones.moveCard(action.cardId, {
            zone: "trash",
            playerId: action.playerId,
          });
        }
        break;
      }
      case "emitEvent":
        emitGundamEvent(ctx.framework.events, action.event);
        break;
    }
  }
}
