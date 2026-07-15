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
import { takeTopCards } from "../../runtime/zone-order.ts";
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
import {
  buildTargetResolutionContext,
  computeEffectiveCostInTrash,
  getAvailableResources,
  isLinkUnit,
} from "../rules/derived-state.ts";
import {
  evaluateAttributeFilter,
  evaluateCondition,
  evaluateTargetFilter,
} from "../../runtime/target-dsl.ts";
import { emitGundamEvent } from "../events.ts";
import { emitGundamLog } from "../logging.ts";
import { EVENT_TIMING_MAP } from "./event-timings.ts";
import { executeCardEffect, type EffectExecutionContext } from "./executor.ts";
import { extractActionFilters } from "./target-legality.ts";

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
  const withMoveId: PendingEffect =
    entry.originatingMoveId === undefined && g.pendingEffectCurrentMoveId !== undefined
      ? { ...entry, originatingMoveId: g.pendingEffectCurrentMoveId }
      : entry;
  let priorityGeneration = entry.priorityGeneration;
  if (priorityGeneration === undefined && g.pendingEffectCurrentPriorityGeneration !== undefined) {
    priorityGeneration = g.pendingEffectCurrentPriorityGeneration;
  } else if (priorityGeneration === undefined && opts.preempt) {
    priorityGeneration = (g.eventCounters.pendingEffectPriorityGeneration ?? 0) + 1;
    g.eventCounters.pendingEffectPriorityGeneration = priorityGeneration;
  }
  const stamped: PendingEffect =
    priorityGeneration === undefined ? withMoveId : { ...withMoveId, priorityGeneration };
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

function pendingTargetResolutionOptions(pe: DeepReadonly<PendingEffect>) {
  const destroyedHostForPilot =
    pe.trigger?.type === "unitDestroyed" && pe.trigger.pairedPilotId === pe.sourceCardId
      ? (pe.trigger.cardId as string | undefined)
      : undefined;
  return {
    sourceCardId: pe.sourceCardId,
    eventSourceCardId: pe.trigger?.sourceCardId as string | undefined,
    ...(destroyedHostForPilot ? { selfIdentityCardId: destroyedHostForPilot } : {}),
  };
}

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

function hasLegalRequiredTargets(
  effect: CardEffect,
  kind: PendingEffect["kind"],
  g: GundamG,
  controllerId: string,
  sourceCardId: string,
  framework: FrameworkReadAPI,
  event?: TriggerEventLike,
  visitedTimingReplays: ReadonlySet<string> = new Set(),
): boolean {
  const probe: PendingEffect = {
    id: "target-legality-probe",
    controllerId,
    sourceCardId,
    effect,
    effectIndex: -1,
    kind,
    trigger: event,
  };
  const choice = findChoiceDirective(probe, { g, framework });
  const tgtCtx = buildTargetResolutionContext(
    g,
    controllerId,
    framework,
    pendingTargetResolutionOptions(probe),
  );
  if (choice?.kind === "targetSelection") {
    const candidates = gatherTargetableCards(framework, Object.keys(g.players));
    const filters = collectTargetSelectionFilters(
      effect.directives as readonly Directive[],
      tgtCtx,
      { requiredOnly: true },
    );
    const directTargetsExist = requiredTargetAssignmentExists(
      coalesceTargetGroups(
        filters.map(({ filter, actionType }) => {
          const { minTargets, maxTargets } = filterCountBounds(filter);
          return {
            filter,
            actionType,
            legalTargetIds: evaluateTargetFilter(filter, candidates, tgtCtx),
            minTargets,
            maxTargets,
          };
        }),
      ),
    );
    if (!directTargetsExist) return false;
  }

  const replayTimings = collectActivateTimingReplays(
    effect.directives as readonly Directive[],
    tgtCtx,
  );
  if (replayTimings.length === 0) return true;

  const source = framework.cards.getDefinition(sourceCardId) as Card | undefined;
  const sourceEffects = (source?.effects ?? []) as readonly CardEffect[];
  for (const timing of replayTimings) {
    const recursionKey = `${sourceCardId}:${timing}`;
    if (visitedTimingReplays.has(recursionKey)) continue;

    const matchingEffects = sourceEffects.filter((candidate) =>
      ((candidate.activation.timing ?? []) as readonly string[]).includes(timing),
    );
    if (matchingEffects.length === 0) return false;

    const nextVisited = new Set(visitedTimingReplays);
    nextVisited.add(recursionKey);
    if (
      matchingEffects.some(
        (candidate) =>
          !hasLegalRequiredTargets(
            candidate,
            kind,
            g,
            controllerId,
            sourceCardId,
            framework,
            event,
            nextVisited,
          ),
      )
    ) {
      return false;
    }
  }
  return true;
}

function collectActivateTimingReplays(
  directives: readonly Directive[],
  tgtCtx: ReturnType<typeof buildTargetResolutionContext>,
): Array<"main" | "action"> {
  const timings: Array<"main" | "action"> = [];
  for (const directive of directives) {
    if ("condition" in directive) {
      const branch = evaluateCondition(directive.condition as EffectCondition, tgtCtx)
        ? directive.thenDirectives
        : (directive.elseDirectives ?? []);
      timings.push(...collectActivateTimingReplays(branch, tgtCtx));
      continue;
    }
    if ("kind" in directive) continue;
    if (directive.action.action === "activateTiming") timings.push(directive.action.timing);
  }
  return timings;
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
    const kind = opts.kind ?? deriveKind(effect);
    // Rule 10-2-2: a triggered effect that requires a target does not
    // activate when the target cannot be chosen. Do this before consuming
    // once-per-turn use or adding an unanswerable simulator prompt.
    if (!hasLegalRequiredTargets(effect, kind, g, controllerId, sourceCardId, framework, event))
      continue;
    if (!markTriggeredOncePerTurnUse(effect, sourceCardId, i, framework)) continue;

    enqueuePendingEffect(
      g,
      {
        id: nextPendingEffectId(g),
        controllerId,
        sourceCardId,
        effect,
        effectIndex: i,
        kind,
        optionalActivation: kind === "burst",
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
 * Distinguish a source-owned 【Attack】 effect from printed observer text
 * such as "when one of your other Units attacks". Observer-shaped effects
 * explicitly qualify the attack event's source or player; their remaining
 * conditions still decide whether this particular attack is relevant.
 */
function explicitlyObservesAttackEvent(effect: CardEffect): boolean {
  return (
    effect.activation.conditions?.some((condition) => {
      switch ((condition as EffectCondition).type) {
        case "eventSourceIsSelf":
        case "eventSourceMatches":
        case "eventPlayerIsSelf":
        case "eventPlayerIsOpponent":
          return true;
        default:
          return false;
      }
    }) ?? false
  );
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
        // Rule 13-2-8: `destroyed` is the destroyed card's own keyword
        // timing, not a board-wide observer timing. The dying Unit/Base and
        // its paired Pilot are enqueued explicitly before they leave play.
        // Effects that observe a battle destruction use the distinct
        // `onDestroyByBattle` timing and `attackerDestroyedDefender` event.
        if (event.type === "unitDestroyed" && effectTimings.includes("destroyed")) continue;
        // Rules 8-2-2 and 13-2-7: plain `attack` is the attacking Unit's
        // own keyword timing, not a board-wide observer timing. The
        // attacker and its paired Pilot are enqueued explicitly by the
        // attack-step lifecycle. Printed observer text that explicitly
        // qualifies the attack event remains eligible for this scan.
        if (
          event.type === "attackDeclared" &&
          effectTimings.includes("attack") &&
          !explicitlyObservesAttackEvent(effect)
        ) {
          continue;
        }
        if (!matchesTimingForEvent(effectTimings, timings, event)) continue;
        // Rules 3-2-5 / 3-2-6: skip observers whose pilot qualification doesn't match.
        if (!effectQualificationMet(effect, g, pid, observerCardId, framework, event)) continue;
        // Rule 10-2-1: skip observers whose activation conditions don't hold.
        if (!effectConditionsMet(effect, g, pid, observerCardId, framework, event)) continue;

        const dedupKey = `${observerCardId}:${i}:${event.type}`;
        if (seen.has(dedupKey)) continue;
        seen.add(dedupKey);
        const kind = opts.kind ?? deriveKind(effect);
        if (!hasLegalRequiredTargets(effect, kind, g, pid, observerCardId, framework, event))
          continue;
        if (!markTriggeredOncePerTurnUse(effect, observerCardId, i, framework)) continue;
        enqueuePendingEffect(
          g,
          {
            id: nextPendingEffectId(g),
            controllerId: pid,
            sourceCardId: observerCardId,
            effect,
            effectIndex: i,
            kind,
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

export function enqueueDelayedTriggers(
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
    if (event.type === "turnEnded" && event.cardId !== sourceCardId) continue;
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
    if (
      !effectConditionsMet(entry.payload.effect, g, controllerId, sourceCardId, framework, event)
    ) {
      continue;
    }
    const kind = opts.kind ?? "triggered";
    if (
      !hasLegalRequiredTargets(
        entry.payload.effect,
        kind,
        g,
        controllerId,
        sourceCardId,
        framework,
        event,
      )
    ) {
      continue;
    }

    enqueuePendingEffect(
      g,
      {
        id: nextPendingEffectId(g),
        controllerId,
        sourceCardId,
        effect: entry.payload.effect,
        effectIndex: -1,
        kind,
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
 * Rule 11-1-2: rules management resolves immediately, even while another
 * action is being performed.
 * Rule 10-1-6-8: 【Burst】 resolves before any other triggered effect.
 * Rule 10-1-6-6: active player's triggered effects resolve before standby's.
 * Activated and command effects are never racing against triggered effects
 * in the queue — they are put on the queue by moves that the player just
 * executed — so their tier is moot when no triggered effects are present.
 */
export function tierOf(pe: DeepReadonly<PendingEffect>, turnPlayerId: string): number {
  if (pe.kind === "ruleManagement") return -1;
  if (pe.kind === "burst") return 0;
  if (pe.kind === "triggered") {
    return pe.controllerId === turnPlayerId ? 1 : 2;
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
export function priorityHeadIndex(g: ReadonlyGundamG, turnPlayerId: string): number {
  if (g.pendingEffects.length === 0) return -1;
  let bestIdx = 0;
  let bestGeneration = g.pendingEffects[0]!.priorityGeneration ?? 0;
  let bestTier = tierOf(g.pendingEffects[0]!, turnPlayerId);
  for (let i = 1; i < g.pendingEffects.length; i++) {
    const generation = g.pendingEffects[i]!.priorityGeneration ?? 0;
    const t = tierOf(g.pendingEffects[i]!, turnPlayerId);
    if (generation > bestGeneration || (generation === bestGeneration && t < bestTier)) {
      bestGeneration = generation;
      bestTier = t;
      bestIdx = i;
    }
  }
  return bestIdx;
}

export function priorityHead(
  g: ReadonlyGundamG,
  turnPlayerId: string,
): DeepReadonly<PendingEffect> | undefined {
  const idx = priorityHeadIndex(g, turnPlayerId);
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
  turnPlayerId: string,
): readonly DeepReadonly<PendingEffect>[] {
  const head = priorityHead(g, turnPlayerId);
  if (!head) return [];
  const headTier = tierOf(head, turnPlayerId);
  const headGeneration = head.priorityGeneration ?? 0;
  return g.pendingEffects.filter(
    (pe) =>
      (pe.priorityGeneration ?? 0) === headGeneration &&
      pe.controllerId === head.controllerId &&
      tierOf(pe, turnPlayerId) === headTier,
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
 *   - An unresolved bounded target filter halts for every effect kind,
 *     including triggered and Burst effects. Their controller answers
 *     through the same `resolveEffect` target channel used by Commands
 *     and activated effects (rule 10-3-3).
 *   - Unbounded filters (`count: "all"` or no count) still resolve
 *     automatically because they contain no player selection.
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
  const choice = findChoiceDirective(pe, runtime);
  if (choice?.kind === "targetSelection" && runtime) {
    const resolution = evaluateLegalTargets(pe, runtime.g, runtime.framework);
    return resolution !== null;
  }
  return choice !== null;
}

function shouldFizzleTargetSelectionHead(
  pe: DeepReadonly<PendingEffect>,
  runtime: ChoiceRuntimeContext,
): boolean {
  if (pe.kind === "sentinel") return false;
  const choice = findChoiceDirective(pe, runtime);
  if (choice?.kind !== "targetSelection") return false;
  const resolution = evaluateLegalTargets(pe, runtime.g, runtime.framework);
  return resolution !== null && !requiredTargetAssignmentExists(resolution.groups);
}

type ChoiceMatch =
  | { kind: "activationOptional" }
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
 * Every effect kind halts for an unresolved bounded target filter. The
 * pending-effect queue is the interaction boundary, so lifecycle-triggered
 * choices can pause and resume without asking the executor to guess which
 * legal target the controller intended.
 */
export function findChoiceDirective(
  pe: DeepReadonly<PendingEffect>,
  runtime?: ChoiceRuntimeContext,
): ChoiceDirective | null {
  if (pe.optionalActivation) {
    return { kind: "activationOptional", directiveIndex: -1 };
  }
  const directives = pe.effect.directives as readonly Directive[];
  // Every card effect with a bounded "choose" target or deck-routing
  // decision must halt for its controller. Triggered and Burst effects run
  // through the same `resolveEffect` interaction protocol as Commands and
  // activated abilities, so the simulator can render the printed choice.
  const canHaltForTargets = pe.chosenTargets === undefined;
  const canHaltForDeckLook = true;
  const tgtCtx = runtime
    ? buildTargetResolutionContext(
        runtime.g,
        pe.controllerId,
        runtime.framework,
        pendingTargetResolutionOptions(pe),
      )
    : undefined;
  let previousDeclined = false;

  for (let i = 0; i < directives.length; i++) {
    const directive = directives[i]!;
    if (!("condition" in directive) && !("kind" in directive)) {
      const effectDirective = directive as EffectDirective;
      if (effectDirective.dependsOnPrevious && previousDeclined) continue;
      const committedAnswer = pe.committedOptionalAnswers?.[i];
      if (
        effectDirective.optional &&
        committedAnswer === undefined &&
        runtime &&
        tgtCtx &&
        !optionalBranchCanResolve(directives, i, pe, runtime, tgtCtx)
      ) {
        previousDeclined = true;
        continue;
      }
      if (effectDirective.optional && committedAnswer === false) {
        previousDeclined = true;
        continue;
      }
    }
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
    const found = findChoiceInDirective(
      directive,
      canHaltForTargets,
      canHaltForDeckLook,
      tgtCtx,
      pe.committedOptionalAnswers?.[i],
      pe,
      runtime,
    );
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

function directiveCanResolve(
  directive: EffectDirective,
  pe: DeepReadonly<PendingEffect>,
  runtime: ChoiceRuntimeContext,
  tgtCtx: ReturnType<typeof buildTargetResolutionContext>,
): boolean {
  const action = directive.action;
  if (action.action === "payResources") {
    return getAvailableResources(pe.controllerId, runtime.g, runtime.framework) >= action.count;
  }
  if (action.action === "discard") {
    const hand = runtime.framework.zones.getCards({ zone: "hand", playerId: pe.controllerId });
    if (!action.filter) return hand.length >= action.count;
  }
  if (action.action === "deployFromTrash" && action.payCost) {
    const trashIds = runtime.framework.zones.getCards({
      zone: "trash",
      playerId: pe.controllerId,
    });
    const filter: TargetFilter = action.target ?? {
      owner: "friendly",
      cardType: "unit",
      zone: "trash",
    };
    const candidates = trashIds
      .map((id) => runtime.framework.cards.get(id))
      .filter((card): card is RuntimeCard => card !== undefined);
    const legalIds = evaluateTargetFilter(
      { ...filter, zone: filter.zone ?? "trash" },
      candidates,
      tgtCtx,
    );
    const available = getAvailableResources(pe.controllerId, runtime.g, runtime.framework);
    return legalIds.some((id) => {
      const definition = runtime.framework.cards.getDefinition(id) as Card | undefined;
      if (definition?.type !== "unit") return false;
      if (
        action.levelAtMost !== undefined &&
        typeof definition.level === "number" &&
        definition.level > action.levelAtMost
      ) {
        return false;
      }
      return (
        computeEffectiveCostInTrash(id, pe.controllerId, runtime.g, runtime.framework) <= available
      );
    });
  }

  const candidates = gatherTargetableCards(runtime.framework, Object.keys(runtime.g.players));
  return extractActionFilters(action).every((filter) => {
    const { minTargets } = filterCountBounds(filter);
    return evaluateTargetFilter(filter, candidates, tgtCtx).length >= minTargets;
  });
}

function optionalBranchCanResolve(
  directives: readonly Directive[],
  optionalIndex: number,
  pe: DeepReadonly<PendingEffect>,
  runtime: ChoiceRuntimeContext,
  tgtCtx: ReturnType<typeof buildTargetResolutionContext>,
): boolean {
  const optional = directives[optionalIndex];
  if (!optional || "condition" in optional || "kind" in optional) return false;
  if (!directiveCanResolve(optional as EffectDirective, pe, runtime, tgtCtx)) return false;

  for (let i = optionalIndex + 1; i < directives.length; i++) {
    const dependent = directives[i]!;
    if ("condition" in dependent || "kind" in dependent) break;
    const effectDirective = dependent as EffectDirective;
    if (!effectDirective.dependsOnPrevious) break;
    if (!directiveCanResolve(effectDirective, pe, runtime, tgtCtx)) return false;
  }
  return true;
}

function findChoiceInDirective(
  d: Directive,
  canHaltForTargets: boolean,
  canHaltForDeckLook: boolean,
  tgtCtx?: ReturnType<typeof buildTargetResolutionContext>,
  optionalAnswer?: boolean,
  pe?: DeepReadonly<PendingEffect>,
  runtime?: ChoiceRuntimeContext,
): ChoiceMatch | null {
  if ("condition" in d) {
    if (tgtCtx) {
      const branch = evaluateCondition(d.condition as EffectCondition, tgtCtx)
        ? d.thenDirectives
        : (d.elseDirectives ?? []);
      return findChoiceInList(
        branch,
        canHaltForTargets,
        canHaltForDeckLook,
        tgtCtx,
        optionalAnswer,
        pe,
        runtime,
      );
    }
    return (
      findChoiceInList(
        d.thenDirectives ?? [],
        canHaltForTargets,
        canHaltForDeckLook,
        tgtCtx,
        optionalAnswer,
        pe,
        runtime,
      ) ??
      findChoiceInList(
        d.elseDirectives ?? [],
        canHaltForTargets,
        canHaltForDeckLook,
        tgtCtx,
        optionalAnswer,
        pe,
        runtime,
      )
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
  if (ed.optional && optionalAnswer === false) return null;
  if (ed.optional && optionalAnswer === undefined) return { kind: "optional", directive: ed };
  if (canHaltForDeckLook && ed.action.action === "lookAtTopDeck") {
    return { kind: "deckLook", directive: ed };
  }
  if (!canHaltForTargets) return null;
  const filter = extractActionFilters(ed.action).find((candidate) => {
    const count = candidate.count;
    return candidate.owner !== "self" && count !== undefined && count !== "all";
  });
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
  optionalAnswer?: boolean,
  pe?: DeepReadonly<PendingEffect>,
  runtime?: ChoiceRuntimeContext,
): ChoiceMatch | null {
  let previousDeclined = false;
  for (let i = 0; i < directives.length; i++) {
    const d = directives[i]!;
    if (!("condition" in d) && !("kind" in d)) {
      const effectDirective = d as EffectDirective;
      if (effectDirective.dependsOnPrevious && previousDeclined) continue;
      if (
        effectDirective.optional &&
        optionalAnswer === undefined &&
        pe &&
        runtime &&
        tgtCtx &&
        !optionalBranchCanResolve(directives, i, pe, runtime, tgtCtx)
      ) {
        previousDeclined = true;
        continue;
      }
      if (effectDirective.optional && optionalAnswer === false) {
        previousDeclined = true;
        continue;
      }
    }
    const found = findChoiceInDirective(
      d,
      canHaltForTargets,
      canHaltForDeckLook,
      tgtCtx,
      optionalAnswer,
      pe,
      runtime,
    );
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
  turnPlayerId: string,
): PendingChoicePrompt | undefined {
  const head = priorityHead(g, turnPlayerId);
  if (!head) return undefined;
  // Completion fences are internal bookkeeping, never player decisions.
  // Multiple same-tier sentinels must drain in insertion order instead of
  // surfacing an ordering prompt with an "Unknown card" label.
  if (head.kind === "sentinel") return undefined;

  // PR F.3 (rule 10-1-6-5): when the head has same-tier same-controller
  // peers, surface an `ordering` prompt first so the controller can pick
  // resolution order before being asked about targets / optional. The
  // content prompt (targetSelection / optional) appears on the next
  // projection cycle once the queue is down to one peer at this tier.
  //
  // The choice is staged: selecting a peer marks it as next, then the
  // following projection presents that effect's own targets/options. This
  // makes ordering usable for triggered and Burst effects too, including two
  // Shields destroyed simultaneously by Suppression (rule 13-1-7-4).
  const peers = peersAtHead(g, turnPlayerId);
  if (!head.resolutionOrderSelected && peers.length >= 2) {
    return {
      kind: "ordering",
      effectId: head.id,
      controllerId: head.controllerId,
      candidateEffectIds: peers.map((p) => p.id),
      candidates: peers.map((pending) => {
        const definition = framework.cards.getDefinition(pending.sourceCardId) as
          | { name?: string }
          | undefined;
        const cardName = definition?.name ?? "Unknown card";
        const effectText = pending.effect.sourceText?.trim();
        return {
          effectId: pending.id,
          sourceCardId: pending.sourceCardId,
          label: effectText ? `${cardName}: ${effectText}` : cardName,
        };
      }),
      prompt: "Choose which pending effect to resolve next.",
    };
  }

  const choice = findChoiceDirective(head, { g, framework });
  if (!choice) return undefined;

  const prompt = head.effect.sourceText ?? "";

  if (choice.kind === "optional" || choice.kind === "activationOptional") {
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
    const deckCards = takeTopCards(
      framework.zones.getCards({ zone: "deck", playerId: head.controllerId }),
      action.count,
    );
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
      randomizeRemainingToBottom: action.randomizeRemainingToBottom === true,
      tutorDestination: action.tutorDestination ?? "hand",
      legalTutorCardIds,
      acceptOptionalDirectiveIndex: choice.acceptOptionalDirectiveIndex,
    };
  }

  const resolution = evaluateLegalTargets({ ...head, chosenTargets: undefined }, g, framework);
  if (!resolution) return undefined;
  if (!requiredTargetAssignmentExists(resolution.groups)) return undefined;

  return {
    kind: "targetSelection",
    effectId: head.id,
    controllerId: head.controllerId,
    sourceCardId: head.sourceCardId,
    directiveIndex: resolution.choice.directiveIndex,
    filter: resolution.choice.filter,
    minTargets: resolution.minTargets,
    maxTargets: resolution.maxTargets,
    legalTargetIds: resolution.legalTargetIds,
    groups: resolution.groups,
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

  // `directiveIndex` is the public, top-level index emitted by
  // buildPendingChoicePrompt. A deck-look can live inside that directive's
  // conditional branch, so resolve it through the same choice traversal
  // instead of indexing directly into the effect and rejecting conditionals.
  const choice = findChoiceDirective(pe, { g, framework });
  if (
    choice?.kind !== "deckLook" ||
    choice.directiveIndex !== directiveIndex ||
    choice.directive.action.action !== "lookAtTopDeck"
  ) {
    return {
      valid: false,
      error: `deckLookAnswers[${directiveIndex}] does not reference a lookAtTopDeck directive`,
      errorCode: "INVALID_DECK_LOOK_INDEX",
    };
  }
  const action = choice.directive.action;

  const revealed = takeTopCards(
    framework.zones.getCards({ zone: "deck", playerId: pe.controllerId }),
    action.count,
  );
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

  if (action.randomizeRemainingToBottom) {
    if (
      (answer.toTop?.length ?? 0) > 0 ||
      (answer.toBottom?.length ?? 0) > 0 ||
      (answer.toTrash?.length ?? 0) > 0
    ) {
      return invalidDeckLookRoute(
        "random-bottom deck-look effects do not accept player-ordered routing",
      );
    }
    return { valid: true };
  }

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
  const tgtCtx = buildTargetResolutionContext(
    g,
    pe.controllerId,
    framework,
    pendingTargetResolutionOptions(pe),
  );
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
  choice: Extract<ChoiceDirective, { kind: "targetSelection" }>;
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
  const tgtCtx = buildTargetResolutionContext(
    g,
    pe.controllerId,
    framework,
    pendingTargetResolutionOptions(pe),
  );
  const cards = gatherTargetableCards(framework, Object.keys(g.players));
  const filters = collectTargetSelectionFilters(
    pe.effect.directives as readonly Directive[],
    tgtCtx,
  );
  const groups = coalesceTargetGroups(
    filters.map(({ filter, actionType }) => {
      const legalTargetIds = evaluateTargetFilter(filter, cards, tgtCtx) as readonly string[];
      const { minTargets, maxTargets } = filterCountBounds(filter);
      return { filter, actionType, legalTargetIds, minTargets, maxTargets };
    }),
  );
  const legalTargetIds = [...new Set(groups.flatMap((group) => [...group.legalTargetIds]))];
  const minTargets = groups.reduce((sum, group) => sum + group.minTargets, 0);
  const maxTargets = groups.reduce((sum, group) => sum + group.maxTargets, 0);
  return { choice, legalTargetIds, minTargets, maxTargets, groups };
}

export interface LegalTargetGroup {
  readonly legalTargetIds: readonly string[];
  readonly minTargets: number;
  readonly maxTargets: number;
}

/** Return whether every group's required slots can receive distinct cards. */
export function requiredTargetAssignmentExists(groups: readonly LegalTargetGroup[]): boolean {
  const slots = groups.flatMap((group, groupIndex) =>
    Array.from({ length: group.minTargets }, () => groupIndex),
  );
  if (slots.length === 0) return true;

  const slotForTarget = new Map<string, number>();
  function assign(slotIndex: number, visitedTargets: Set<string>): boolean {
    const group = groups[slots[slotIndex]!]!;
    for (const targetId of group.legalTargetIds) {
      if (visitedTargets.has(targetId)) continue;
      visitedTargets.add(targetId);
      const previousSlot = slotForTarget.get(targetId);
      if (previousSlot === undefined || assign(previousSlot, visitedTargets)) {
        slotForTarget.set(targetId, slotIndex);
        return true;
      }
    }
    return false;
  }

  return slots.every((_groupIndex, slotIndex) => assign(slotIndex, new Set()));
}

/**
 * Assign a flat player selection to the printed target groups.
 *
 * A card can satisfy more than one group's filter (for example, a card with
 * both (Superpower Bloc) and (UN)). Counting that card independently in every
 * matching group incorrectly treats it as multiple choices. This backtracking
 * assignment gives every selected card exactly one role and returns the cards
 * in printed group order, which is also the order the directive executor
 * consumes them.
 *
 * `requireMinimums: false` is useful to validate an in-progress UI selection:
 * it enforces group capacities while allowing the player to add the remaining
 * required cards later.
 */
export function assignTargetsToGroups(
  targets: readonly string[],
  groups: readonly LegalTargetGroup[],
  options: { readonly requireMinimums?: boolean } = {},
): readonly (readonly string[])[] | null {
  if (new Set(targets).size !== targets.length) return null;

  const requireMinimums = options.requireMinimums ?? true;
  const legalSets = groups.map((group) => new Set(group.legalTargetIds));
  const assignments: string[][] = groups.map(() => []);

  function visit(targetIndex: number): boolean {
    if (targetIndex === targets.length) {
      return groups.every((group, groupIndex) => {
        const count = assignments[groupIndex]!.length;
        return count <= group.maxTargets && (!requireMinimums || count >= group.minTargets);
      });
    }

    const targetId = targets[targetIndex]!;
    for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
      const group = groups[groupIndex]!;
      const assigned = assignments[groupIndex]!;
      if (!legalSets[groupIndex]!.has(targetId) || assigned.length >= group.maxTargets) continue;

      assigned.push(targetId);
      if (visit(targetIndex + 1)) return true;
      assigned.pop();
    }
    return false;
  }

  return visit(0) ? assignments.map((group) => [...group]) : null;
}

function coalesceTargetGroups(
  groups: {
    filter: TargetFilter;
    actionType: string;
    legalTargetIds: readonly string[];
    minTargets: number;
    maxTargets: number;
  }[],
): {
  legalTargetIds: readonly string[];
  minTargets: number;
  maxTargets: number;
}[] {
  const out: {
    filter: TargetFilter;
    actionType: string;
    legalTargetIds: readonly string[];
    minTargets: number;
    maxTargets: number;
  }[] = [];
  for (const group of groups) {
    const candidateKey = `${[...group.legalTargetIds].sort().join("|")}:${group.minTargets}:${group.maxTargets}`;
    const sameCandidateGroup = out.find(
      (existing) =>
        `${[...existing.legalTargetIds].sort().join("|")}:${existing.minTargets}:${existing.maxTargets}` ===
        candidateKey,
    );
    if (sameCandidateGroup) {
      const repeatedActionWithDifferentFilter =
        sameCandidateGroup.actionType === group.actionType &&
        JSON.stringify(sameCandidateGroup.filter) !== JSON.stringify(group.filter);
      // Different sequential actions commonly apply to the same printed
      // "it" target (ready it, then it can't attack), so they share one
      // choice. Repeating the same action with a different filter represents
      // separate printed clauses (choose 1 A and 1 B); keep both even when
      // every current candidate happens to satisfy both filters.
      if (!repeatedActionWithDifferentFilter) continue;
    }
    out.push(group);
  }
  return out;
}

interface CollectedTargetFilter {
  filter: TargetFilter;
  actionType: string;
}

function collectTargetSelectionFilters(
  directives: readonly Directive[],
  tgtCtx: ReturnType<typeof buildTargetResolutionContext>,
  opts: { requiredOnly?: boolean } = {},
): CollectedTargetFilter[] {
  const filters: CollectedTargetFilter[] = [];
  let previousDirectiveProducesTargets = false;
  for (const directive of directives) {
    if ("condition" in directive) {
      const branch = evaluateCondition(directive.condition as EffectCondition, tgtCtx)
        ? directive.thenDirectives
        : (directive.elseDirectives ?? []);
      filters.push(...collectTargetSelectionFilters(branch, tgtCtx, opts));
      previousDirectiveProducesTargets = false;
      continue;
    }
    if ("kind" in directive) {
      previousDirectiveProducesTargets = false;
      continue;
    }

    if (opts.requiredOnly && directive.optional) {
      previousDirectiveProducesTargets = false;
      continue;
    }

    const actionFilters = extractActionFilters(directive.action);
    // drawIfTargetMatches consumes executor.previousResolvedTargets when
    // the preceding directive selected cards. Asking for its filter as a
    // second target group makes clients choose the same printed target
    // twice and can even force two distinct cards through uniqueness
    // validation. Only expose a new group when this directive has no
    // preceding target result to reuse.
    const reusesPreviousTargets =
      directive.action.action === "drawIfTargetMatches" && previousDirectiveProducesTargets;
    if (reusesPreviousTargets) {
      previousDirectiveProducesTargets = actionFilters.length > 0;
      continue;
    }

    for (const filter of actionFilters) {
      if (filter.owner === "self") continue;
      const count = filter.count;
      if (count === undefined || count === "all") continue;
      filters.push({ filter, actionType: directive.action.action });
    }
    previousDirectiveProducesTargets = actionFilters.length > 0;
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

  const turnPlayerId = (ctx.framework.state.status.turnPlayer ??
    ctx.framework.state.status.activePlayer) as unknown as string;
  let resolvedAny = false;

  while (g.pendingEffects.length > 0) {
    const idx = priorityHeadIndex(g, turnPlayerId);
    if (idx < 0) break;
    const head = g.pendingEffects[idx]!;
    if (shouldFizzleTargetSelectionHead(head, { g, framework: ctx.framework })) {
      g.pendingEffects.splice(idx, 1);
      resolvedAny = true;
      continue;
    }
    if (requiresPlayerChoice(head, { g, framework: ctx.framework })) break;
    // Rule 10-1-6-5 (PR F.3/F.4): when the head has same-tier same-
    // controller peers, the controller picks resolution order. Halt so
    // the `ordering` prompt (surfaced by buildPendingChoicePrompt) is
    // actionable — otherwise the drain would resolve the head in
    // insertion order before the player could supply a pendingEffectId.
    //
    if (
      head.kind !== "sentinel" &&
      !head.resolutionOrderSelected &&
      peersAtHead(g, turnPlayerId).length >= 2
    ) {
      break;
    }
    g.pendingEffects.splice(idx, 1);
    // Set `pendingEffectCurrentMoveId` for the duration of the head's
    // execution so any nested enqueue (rule 10-1-6-7 preempts, cascading
    // triggers from inside the effect body) inherits the parent's move
    // id. Restored after each head so peer heads don't bleed group ids.
    const prevMoveId = g.pendingEffectCurrentMoveId;
    const prevGeneration = g.pendingEffectCurrentPriorityGeneration;
    const childGeneration = (g.eventCounters.pendingEffectPriorityGeneration ?? 0) + 1;
    g.eventCounters.pendingEffectPriorityGeneration = childGeneration;
    g.pendingEffectCurrentMoveId = head.originatingMoveId;
    g.pendingEffectCurrentPriorityGeneration = childGeneration;
    try {
      // Sentinel entries are the move-completion fence — no card body
      // to execute, only the `postActions` (e.g. UNIT_DEPLOYED emit)
      // run when the fence's tier finally comes up.
      const execCtx = buildExecCtx(ctx, head);
      if (head.kind !== "sentinel") {
        executeCardEffect(head.effect as CardEffect, execCtx, {
          skipPairLinkRecheck: true,
        });
      }
      if (!execCtx.postActionState?.deferredToFollowUp) {
        runPostActions(head.postActions, ctx);
      }
    } finally {
      g.pendingEffectCurrentMoveId = prevMoveId;
      g.pendingEffectCurrentPriorityGeneration = prevGeneration;
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
  const turnPlayerId = (ctx.framework.state.status.turnPlayer ??
    ctx.framework.state.status.activePlayer) as unknown as string;
  const head = priorityHead(g, turnPlayerId);
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
    optionalAnswers: {
      ...pe.committedOptionalAnswers,
      ...opts.optionalAnswers,
    },
    chooseOneAnswers: opts.chooseOneAnswers,
    deckLookAnswers: opts.deckLookAnswers,
    postActions: pe.postActions,
    postActionState: {},
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
        // A prior effect may already have moved the source out of the
        // transient `removalArea`. Only retire a Command that is still
        // waiting there, so an explicit source-zone move is not clobbered.
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
