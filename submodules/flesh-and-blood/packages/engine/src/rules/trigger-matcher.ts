import type {
  FabAbilityLimit,
  FabCondition,
  FabCardFilter,
  FabComparison,
  FabAmount,
  FabEventTargetPattern,
  FabObjectRelationship,
  FabSingleTriggerEventPattern,
  FabTrigger,
  FabTriggerActor,
  FabTriggerEventExpression,
  FabZone,
} from "@tcg/flesh-and-blood-types";
import { fabAllDefenders, fabPrimaryDefenders } from "../game/combat.ts";
import type {
  CommittedEvent,
  FabCommittedEventBatch,
  FabEventBindings,
  FabObjectSnapshot,
} from "./events.ts";
import type { FabTriggeredResolution } from "./layers.ts";
import type { FabPendingTrigger } from "./process.ts";
import type { FabRulesSnapshot } from "../kernel/transaction-kernel.ts";
import {
  buildFabRulesViewWithLki,
  findObjectZone,
  matchesFabSnapshotFilter,
} from "./state-rules-view.ts";
import { snapshotObject } from "./snapshots.ts";
import { normalizeToCatalogZone } from "./zones.ts";
import { comparePrimitive } from "./evaluation/compare.ts";
import type { FabZoneKind } from "../state.ts";
import { fabActiveAttackIdentity } from "../game/combat.ts";
import { reanchorFabBindingsThroughCommittedMoves } from "./binding-reanchor.ts";
import { isEligibleOptionalTriggerSource } from "./optional-trigger-eligibility.ts";
import { bindingForObservedAttack } from "./exact-attack.ts";

export interface FabTriggerSource {
  readonly abilityId: string;
  readonly controllerId: string;
  /** Immutable event-boundary snapshot, also used as LKI after the source leaves. */
  readonly source: FabObjectSnapshot;
  readonly trigger: FabTrigger;
  readonly abilityCondition?: FabCondition;
  readonly resolution: FabTriggeredResolution;
  readonly layerKeywords: readonly string[];
  readonly limit?: FabAbilityLimit;
  readonly functionalZones: readonly FabZone[];
  readonly origin: "static" | "inline" | "granted" | "delayed" | "keyword";
  /** Optional resolved bindings (combat LKI) for resolution-time condition re-checks. */
  readonly bindings?: import("./continuous/ir.ts").FabResolvedBindings;
  /** Flat bindings captured when a delayed clause was armed. */
  readonly triggerBindings?: FabEventBindings;
}

export interface FabTriggerMatchContext {
  readonly evaluateStateCondition: (
    state: FabRulesSnapshot,
    condition: FabCondition,
    source: FabTriggerSource,
    event: CommittedEvent | null,
  ) => boolean;
  readonly isTriggerPrevented?: (
    state: FabRulesSnapshot,
    source: FabTriggerSource,
    event: CommittedEvent | null,
  ) => boolean;
}

export interface FabTriggerCollectionResult {
  readonly pendingTriggers: readonly FabPendingTrigger[];
  readonly triggerLimitUsage: Readonly<Record<string, number>>;
}

function automationForSource(
  state: FabRulesSnapshot,
  source: FabTriggerSource,
): import("./process.ts").FabOptionalTriggerAutomation | undefined {
  const ownerId = source.source.ownerId;
  const mode = state.optionalTriggerAutomation[ownerId]?.[source.source.instanceId];
  if (!isEligibleOptionalTriggerSource(source) || source.controllerId !== ownerId || !mode) {
    return undefined;
  }
  return {
    ownerId,
    ownerChoice: mode === "auto-accept" ? "accept" : "decline",
    autoPassWhileTop: true,
  };
}

function triggerStateCondition(trigger: FabTrigger): FabCondition | null {
  return trigger.kind === "event" ? null : trigger.state;
}

function triggerEventPatterns(trigger: FabTrigger): readonly FabSingleTriggerEventPattern[] {
  if (trigger.kind === "state") return [];
  return eventExpressionPatterns(trigger.event);
}

function eventExpressionPatterns(
  expression: FabTriggerEventExpression,
): readonly FabSingleTriggerEventPattern[] {
  return "patterns" in expression ? expression.patterns : [expression];
}

export function collectStateTriggers(
  state: FabRulesSnapshot,
  sources: readonly FabTriggerSource[],
  suppressedSourceAbilityKeys: ReadonlySet<string>,
  context: FabTriggerMatchContext,
  simultaneousGroupId: string,
): FabTriggerCollectionResult {
  const usage = { ...state.triggerLimitUsage };
  const pendingTriggers: FabPendingTrigger[] = [];

  // CR 6.6.5d (state-trigger mirror): advance a window-global occurrence
  // counter once per state-scan pass per (controller, abilityId, window) when
  // at least one matching source is present, deduped across sources sharing a
  // key. Pure state triggers carry no event name; no current card combines a
  // state trigger with ordinals, so this branch is defensive and mirrors the
  // event-trigger ordinal semantics for symmetry.
  const stateOccurrenceKeys = new Set<string>();
  for (const source of sources) {
    const stateCondition = triggerStateCondition(source.trigger);
    if (source.trigger.kind !== "state" || !stateCondition) continue;
    const sourceAbilityKey = `${source.source.instanceId}:${source.abilityId}`;
    if (suppressedSourceAbilityKeys.has(sourceAbilityKey)) continue;
    if (!context.evaluateStateCondition(state, stateCondition, source, null)) continue;
    if (
      source.abilityCondition &&
      !context.evaluateStateCondition(state, source.abilityCondition, source, null)
    )
      continue;
    stateOccurrenceKeys.add(globalStateOccurrenceKey(state, source));
  }
  for (const key of stateOccurrenceKeys) {
    usage[key] = (usage[key] ?? 0) + 1;
  }

  for (const source of sources) {
    const stateCondition = triggerStateCondition(source.trigger);
    if (source.trigger.kind !== "state" || !stateCondition) continue;
    // CR 6.6.2/6.6.2a: an inline-triggered effect is discrete — it may only
    // trigger in its generation window, i.e. the first boundary it is observed
    // in. Consume the window on first observation whether or not the state
    // condition holds, so a state that turns true afterwards never fires it.
    // Stack-functional sources are inside their generation (resolution)
    // window and keep the ordinary lifetime semantics.
    if (source.origin === "inline" && !source.functionalZones.includes("stack" as FabZone)) {
      const inlineWindowKey = `${source.source.instanceId}:${source.abilityId}:inline-window`;
      if (usage[inlineWindowKey]) continue;
      usage[inlineWindowKey] = 1;
    }
    const sourceAbilityKey = `${source.source.instanceId}:${source.abilityId}`;
    if (suppressedSourceAbilityKeys.has(sourceAbilityKey)) continue;
    if (!context.evaluateStateCondition(state, stateCondition, source, null)) continue;
    if (
      source.abilityCondition &&
      !context.evaluateStateCondition(state, source.abilityCondition, source, null)
    )
      continue;
    const occurrenceKey = globalStateOccurrenceKey(state, source);
    const occurrence = usage[occurrenceKey] ?? 0;
    if (source.limit?.ordinals?.length && !source.limit.ordinals.includes(occurrence)) continue;
    const usagePrefix = triggerUsagePrefix(state, source);
    const triggerKey = `${usagePrefix}:triggers`;
    const priorTriggers = usage[triggerKey] ?? 0;
    usage[triggerKey] = priorTriggers + 1;
    if (source.limit && priorTriggers >= source.limit.count) continue;
    if (context.isTriggerPrevented?.(state, source, null)) continue;
    const automation = automationForSource(state, source);
    pendingTriggers.push({
      pendingTriggerId: `${simultaneousGroupId}:${source.source.instanceId}:${source.abilityId}`,
      abilityId: source.abilityId,
      controllerId: source.controllerId,
      source: source.source,
      trigger: source.trigger,
      abilityCondition: source.abilityCondition,
      resolution: source.resolution,
      layerKeywords: source.layerKeywords,
      triggeringEvent: null,
      bindings: { ...capturedAbilityBindings(state, source), ...source.triggerBindings },
      simultaneousGroupId,
      declaredModes: [],
      modesDeclared: false,
      declaredTargets: {},
      ...(automation ? { optionalTriggerAutomation: automation } : {}),
    });
  }
  return { pendingTriggers, triggerLimitUsage: usage };
}

/**
 * Matches canonical trigger structures against one committed atomic batch.
 * Each source can create at most one pending trigger for the batch, preserving
 * CR 1.9.2a while still retaining the exact child event as context.
 */
export function collectEventTriggers(
  state: FabRulesSnapshot,
  batch: FabCommittedEventBatch,
  sources: readonly FabTriggerSource[],
  context: FabTriggerMatchContext,
): FabTriggerCollectionResult {
  const usage = { ...state.triggerLimitUsage };
  const pendingTriggers: FabPendingTrigger[] = [];

  // CR 6.6.5d: ordinals are relative to the window, not any one source's
  // lifetime. The seed ledger records events that occurred before a matching
  // source was functional; source-pattern counters then advance once per
  // matching event. The per-source
  // `:triggers` limit counter below is intentionally left keyed per source
  // (instanceId:abilityId): "once per turn" limits track how many times THIS
  // ability has fired, which is distinct from the ordinal-position semantics.
  //
  // Events themselves also advance the actor-keyed turn ledger even when no
  // source is functional yet. That is the CR example: a "first each turn"
  // source that enters after occurrence 1 must see occurrence 2, not reset.
  bumpUnobservedEventOccurrences(state, batch, sources, usage, new Set());
  const bumpedOccurrenceKeys = new Set<string>();

  for (const source of sources) {
    const patterns = triggerEventPatterns(source.trigger);
    if (patterns.length === 0) continue;
    // CR 6.6.2/6.6.2a: an inline-triggered effect is discrete — it may only
    // trigger when generated, i.e. in the first boundary it is observed in.
    // Consume the generation window on first observation whether or not this
    // batch matches, so a later matching event never fires it retroactively.
    // A source functional on the stack is still INSIDE its generation
    // (resolution) window — its lifetime is the card's own resolution flow —
    // so transiently-functional sources keep the ordinary lifetime semantics.
    if (source.origin === "inline" && !source.functionalZones.includes("stack" as FabZone)) {
      const inlineWindowKey = `${source.source.instanceId}:${source.abilityId}:inline-window`;
      if (usage[inlineWindowKey]) continue;
      usage[inlineWindowKey] = 1;
    }
    // CR 1.9.2a: at most one pending trigger per source per batch. When the
    // batch contains multiple matching events (e.g. Draw 2 → two `draw`
    // events), sum their amounts so "create that many" / "for each card drawn
    // this way" (Valda) still scales with the batch.
    const matchingEntries = batch.events.flatMap((candidate) => {
      const pattern = patterns.find((entry) =>
        matchesTriggerEvent(
          state,
          candidate,
          entry,
          source.controllerId,
          source.source,
          source.triggerBindings,
        ),
      );
      return pattern ? [{ event: candidate, pattern }] : [];
    });
    const matchesByOccurrence = new Map<string, typeof matchingEntries>();
    for (const entry of matchingEntries) {
      const occurrenceId = entry.event.occurrence.occurrenceId;
      const group = matchesByOccurrence.get(occurrenceId) ?? [];
      group.push(entry);
      matchesByOccurrence.set(occurrenceId, group);
    }
    for (const occurrenceMatches of matchesByOccurrence.values()) {
      const firstMatch = occurrenceMatches[0];
      if (!firstMatch) continue;
      const { event, pattern: matchedPattern } = firstMatch;
      const usagePrefix = triggerUsagePrefix(state, source, event.actorId);
      const triggerKey = `${usagePrefix}:triggers`;
      const occurrenceKey = globalOccurrenceKey(state, source, patterns, event.actorId);
      const triggerState = triggerStateCondition(source.trigger);
      if (triggerState && !context.evaluateStateCondition(state, triggerState, source, event)) {
        continue;
      }
      if (source.abilityCondition && !abilityConditionHolds(state, source, event, context))
        continue;

      const occurrenceClaim = `${occurrenceKey}:${event.occurrence.occurrenceId}`;
      if (!bumpedOccurrenceKeys.has(occurrenceClaim)) {
        usage[occurrenceKey] =
          Math.max(
            usage[occurrenceKey] ?? 0,
            usage[
              unobservedOccurrenceKey(
                state,
                source.limit?.scope === "actor" && event.actorId
                  ? event.actorId
                  : source.controllerId,
                patterns.map((entry) => entry.name),
              )
            ] ?? 0,
          ) + 1;
        bumpedOccurrenceKeys.add(occurrenceClaim);
      }

      const occurrence = usage[occurrenceKey] ?? 0;
      if (source.limit?.ordinals?.length && !source.limit.ordinals.includes(occurrence)) continue;

      const priorTriggers = usage[triggerKey] ?? 0;
      usage[triggerKey] = priorTriggers + 1;
      if (source.limit && priorTriggers >= source.limit.count) continue;
      if (context.isTriggerPrevented?.(state, source, event)) continue;

      const batchEventAmount = occurrenceMatches.reduce(
        (total, candidate) => total + eventAmount(candidate.event),
        0,
      );

      const bindings: FabEventBindings = reanchorFabBindingsThroughCommittedMoves(
        state,
        {
          ...capturedAbilityBindings(state, source),
          ...source.triggerBindings,
          ...declarationBindings(state, source.source),
          ...bindTriggerObservation(state, event, matchedPattern, source.triggerBindings),
          ...(eventActorId(event) ? { "event-actor": eventActorId(event)! } : {}),
          // Populate `event-amount` from the matching batch so that effects
          // referencing `{ type: "event-amount" }` resolve correctly. Without
          // this, many triggered effects (e.g. Valda Seismic Impact, Sigil of
          // Permafrost) would throw `missing number binding event-amount`.
          "event-amount": batchEventAmount,
          ...triggerEventProvenance(event),
          // Preserve defending-hero identity from combat events for create-token
          // after the combat state is cleared, plus defended-from-hand LKI for
          // resolution-time abilityCondition re-checks (runtime re-evaluates).
          ...(event.name === "attack" || event.name === "chain-link-resolve"
            ? {
                "defending-hero": event.data.defendingPlayerId,
                "attacking-hero":
                  "attackingPlayerId" in event.data
                    ? (event.data as { attackingPlayerId: string }).attackingPlayerId
                    : event.data.actorId,
                ...(event.name === "chain-link-resolve"
                  ? {
                      "defended-from-hand":
                        state.combat?.activeLink &&
                        fabPrimaryDefenders(state.combat.activeLink).some(
                          (id) => state.combat?.activeLink?.defendingOrigins[id]?.kind === "hand",
                        )
                          ? "true"
                          : "false",
                    }
                  : {}),
              }
            : {}),
        },
        batch.events,
      );
      const automation = automationForSource(state, source);
      pendingTriggers.push({
        pendingTriggerId: `${event.occurrence.occurrenceId}:${source.source.instanceId}:${source.abilityId}`,
        abilityId: source.abilityId,
        controllerId: source.controllerId,
        source: source.source,
        trigger: source.trigger,
        abilityCondition: source.abilityCondition,
        resolution: source.resolution,
        layerKeywords: source.layerKeywords,
        triggeringEvent: event,
        bindings,
        simultaneousGroupId: batch.batchId,
        declaredModes: [],
        modesDeclared: false,
        declaredTargets: {},
        ...(automation ? { optionalTriggerAutomation: automation } : {}),
      });
    }
  }

  return { pendingTriggers, triggerLimitUsage: usage };
}

/** Promote typed play-time declaration references into the binding context of
 * later observations (for example a hit after a charge additional cost). */
/** Carry the granting layer's frozen values into the triggered resolution. */
function capturedAbilityBindings(
  state: FabRulesSnapshot,
  source: FabTriggerSource,
): FabEventBindings {
  if (!source.bindings) return {};
  const objects: Record<string, readonly FabObjectSnapshot[]> = {};
  for (const [key, refs] of Object.entries(source.bindings.objects)) {
    objects[key] = refs.flatMap((ref) => {
      const record = state.objects[ref.instanceId];
      const zone = findObjectZone(state, ref.instanceId);
      return record && zone && record.incarnation === ref.incarnation
        ? [snapshotObject(state, ref.instanceId, record.ownerId, zone.zone)]
        : [];
    });
  }
  return { ...objects, ...source.bindings.numbers, ...source.bindings.strings };
}

function declarationBindings(state: FabRulesSnapshot, source: FabObjectSnapshot): FabEventBindings {
  const fact = source.declarationFacts?.find((entry) => entry.kind === "charge");
  const ref = fact?.kind === "charge" ? fact.chargedCard : undefined;
  if (!ref) return {};
  const record = state.objects[ref.instanceId];
  const zone = findObjectZone(state, ref.instanceId);
  if (!record || !zone) return {};
  return { chargedCard: snapshotObject(state, ref.instanceId, record.ownerId, zone.zone) };
}

/** Exact event-scoped values used by printed "that much" and target-relative
 * clauses. These are deliberately distinct from the CR 1.9.2a batch amount. */
function triggerEventProvenance(event: CommittedEvent): FabEventBindings {
  if (event.name === "hit") {
    const targetController = damageTargetController(event.data.target);
    return {
      "trigger-event-damage": event.data.damage,
      "damage-target-controller": targetController,
      "hit-target-controller": targetController,
      ...("ref" in event.data.target ? { "hit-target": event.data.target } : {}),
    };
  }
  if (event.name === "deal-damage" || event.name === "dealt-damage") {
    return {
      "trigger-event-damage": event.data.amount,
      "damage-target-controller": damageTargetController(event.data.target),
    };
  }
  return {};
}

function damageTargetController(
  target: FabObjectSnapshot | { readonly kind: "hero"; readonly playerId: string },
): string {
  return "ref" in target ? (target.controllerId ?? target.ownerId) : target.playerId;
}

function triggerUsagePrefix(
  state: FabRulesSnapshot,
  source: FabTriggerSource,
  actorId?: string | null,
): string {
  const actorScope = source.limit?.scope === "actor" ? `:actor-${actorId ?? "none"}` : "";
  return `${source.source.instanceId}:${source.abilityId}:${windowScope(state, source.limit?.per)}${actorScope}`;
}

/**
 * Shared rules-window scoping (CR 6.6.5d) used by both the per-source
 * `:triggers` limit counter and the window-global occurrence counter. The
 * window boundary is derived from the trigger's `limit.per`.
 */
function windowScope(state: FabRulesSnapshot, per: FabAbilityLimit["per"] | undefined): string {
  switch (per) {
    case "turn":
      return `turn-${state.turnNumber}`;
    case "chain-link":
      return `turn-${state.turnNumber}:link-${state.combat?.chainLinkNumber ?? 0}`;
    case "combat-chain":
      return `turn-${state.turnNumber}:combat`;
    case "attack":
      return `attack-${fabActiveAttackIdentity(state.combat?.activeLink?.activeAttack) ?? "none"}`;
    default:
      return "game";
  }
}

/**
 * CR 6.6.5d backfill: an event that no functional source observed still
 * consumes the ordinal for that actor + event name in the turn window.
 * A source that becomes functional later seeds its matching counter from this
 * ledger instead of treating the next event as its own "first".
 */
function bumpUnobservedEventOccurrences(
  state: FabRulesSnapshot,
  batch: FabCommittedEventBatch,
  sources: readonly FabTriggerSource[],
  usage: Record<string, number>,
  claimed: ReadonlySet<string>,
): void {
  // When a source for this event name is already functional, only the
  // filter-aware matching pass may advance the ordinal. Otherwise an
  // attack play would consume Briar's "second non-attack action" slot.
  // The empty-source backfill remains: CR 6.6.5d late arrival.
  const observedNames = new Set<string>();
  for (const source of sources) {
    for (const pattern of triggerEventPatterns(source.trigger)) observedNames.add(pattern.name);
  }
  const seen = new Set<string>();
  for (const event of batch.events) {
    if (observedNames.has(event.name)) continue;
    const actorId = committedEventActorId(event);
    if (!actorId) continue;
    const key = unobservedOccurrenceKey(state, actorId, event.name);
    const claim = `${key}::${event.eventId}`;
    if (claimed.has(claim) || seen.has(claim)) continue;
    seen.add(claim);
    usage[key] = (usage[key] ?? 0) + 1;
  }
}

function unobservedOccurrenceKey(
  state: FabRulesSnapshot,
  controllerId: string,
  eventName: string | readonly string[],
): string {
  const name =
    typeof eventName === "string"
      ? eventName
      : [...eventName].sort((left, right) => left.localeCompare(right)).join("|");
  return `global:${controllerId}:${name}:${windowScope(state, "turn")}:occurrences`;
}

function committedEventActorId(event: CommittedEvent): string | null {
  return event.actorId;
}

/**
 * CR 6.6.5d: ordinals are relative to the window, not any one source's
 * lifetime. The matching counter is scoped to a trigger pattern (not merely
 * its event name), keeping filtered ordinal sources independent; it is seeded
 * from the source-independent backfill for late-arriving sources.
 *
 * Matching sources advance the counter through `matchesTriggerEvent` (filter-
 * aware). Events with no observing source still advance the actor-keyed turn
 * ledger so late-arriving "first each turn" sources do not reset.
 */
function globalOccurrenceKey(
  state: FabRulesSnapshot,
  source: FabTriggerSource,
  patterns: readonly FabSingleTriggerEventPattern[],
  actorId?: string | null,
): string {
  const selfSubject = patterns.some((pattern) => pattern.observes.kind === "source")
    ? source.source.instanceId
    : "shared";
  const actorScope = source.limit?.scope === "actor" ? `:actor-${actorId ?? "none"}` : "";
  return `global:${source.controllerId}:${source.abilityId}:${eventNameKey(patterns.map((pattern) => pattern.name))}:${selfSubject}:${windowScope(state, source.limit?.per)}${actorScope}:occurrences`;
}

/**
 * Stable string form of a trigger event-name pattern (which may be a single
 * name or an array of alternatives) for use as a counter-key segment. The
 * alternatives are sorted so `["hit","attack"]` and `["attack","hit"]` collapse
 * to the same key.
 */
function eventNameKey(name: string | readonly string[]): string {
  // `Array.isArray` does not narrow the `readonly` array half of the union on
  // this TypeScript version, so widen the scalar branch explicitly. The scalar
  // half is a union of string literals, making this cast sound.
  return Array.isArray(name)
    ? [...name].sort((a, b) => a.localeCompare(b)).join("|")
    : (name as string);
}

/**
 * Occurrence key for a state trigger. State triggers carry no event name, so
 * the occurrence is scoped per (controller, abilityId, window): instances of
 * the same card share a counter (the analog of "same event name" for event
 * triggers), which keeps a fresh copy from resetting the ordinal window. No
 * current card combines a pure state trigger with ordinals, so this branch is
 * defensive — it mirrors the event-trigger semantics for symmetry.
 */
function globalStateOccurrenceKey(state: FabRulesSnapshot, source: FabTriggerSource): string {
  return `global-state:${source.controllerId}:${source.abilityId}:${windowScope(state, source.limit?.per)}:occurrences`;
}

interface TriggerConstraintView {
  readonly name?: string;
  readonly actor?: FabTriggerActor;
  readonly observes?: unknown;
  readonly damageType?: string;
  readonly from?: readonly string[];
  readonly excludeFrom?: readonly FabZone[];
  readonly to?: FabZone;
  readonly random?: boolean;
  readonly position?: "top" | "bottom";
  readonly faceDown?: boolean;
  readonly fused?: true;
  readonly amount?: FabComparison;
  readonly delta?: FabComparison;
  readonly result?: FabComparison;
  readonly target?: FabEventTargetPattern;
  readonly abilityType?: import("@tcg/flesh-and-blood-types").FabAbilityType;
  readonly counter?: import("@tcg/flesh-and-blood-types").FabCounter;
  readonly remaining?: number;
  readonly origin?: readonly string[];
  readonly cohort?:
    | { readonly kind: "alone" }
    | {
        readonly kind: "together-with";
        readonly filter: FabCardFilter;
        readonly count?: FabComparison;
      }
    | { readonly kind: "together-with-each"; readonly filters: readonly FabCardFilter[] };
  readonly defendedAttack?: FabCardFilter;
  readonly bindDefendedAttackAs?: string;
  readonly transformPartner?: FabCardFilter;
}

interface NormalizedTriggerPattern extends TriggerConstraintView {
  readonly name: FabSingleTriggerEventPattern["name"];
  readonly actor: FabTriggerActor;
  readonly observedObject: string | null;
  readonly filter?: FabCardFilter;
  readonly binding?: string;
  readonly subject: "self" | { readonly binding: string } | null;
  readonly relationship: FabObjectRelationship | null;
  readonly pluralObservation: boolean;
  readonly quantifier: "any" | "all" | null;
  readonly phase?: "start" | "action" | "end";
  readonly combatStep?:
    | "layer"
    | "attack"
    | "defend"
    | "reaction"
    | "damage"
    | "resolution"
    | "close";
  readonly comparison?: FabComparison;
  readonly alone?: boolean;
  readonly togetherWith?: FabCardFilter;
  readonly togetherWithCount?: FabComparison;
  readonly togetherWithEach?: readonly FabCardFilter[];
}

function normalizeTriggerPattern(pattern: FabSingleTriggerEventPattern): NormalizedTriggerPattern {
  const constraints: TriggerConstraintView = { ...pattern };
  const observation = pattern.observes;
  const observationWithFilter =
    observation.kind === "event-object" || observation.kind === "event-objects"
      ? observation
      : null;
  const cohort = constraints.cohort;
  return {
    ...constraints,
    name: pattern.name,
    actor: pattern.actor,
    observedObject: observation.kind === "none" ? null : observation.selector,
    ...(observationWithFilter?.filter ? { filter: observationWithFilter.filter } : {}),
    ...(observation.kind === "event-object" && observation.bindAs
      ? { binding: observation.bindAs }
      : observation.kind === "event-objects" && observation.bindAllAs
        ? { binding: observation.bindAllAs }
        : {}),
    subject:
      observation.kind === "source"
        ? "self"
        : observation.kind === "bound-object"
          ? { binding: observation.binding }
          : null,
    relationship: observationWithFilter?.relationship ?? null,
    pluralObservation: observation.kind === "event-objects",
    quantifier: observation.kind === "event-objects" ? observation.quantifier : null,
    ...(pattern.during?.kind === "phase" ? { phase: pattern.during.phase } : {}),
    ...(pattern.during?.kind === "combat-step" ? { combatStep: pattern.during.step } : {}),
    ...(constraints.amount
      ? { comparison: constraints.amount }
      : constraints.delta
        ? { comparison: constraints.delta }
        : constraints.result
          ? { comparison: constraints.result }
          : {}),
    ...(constraints.origin ? { from: constraints.origin } : {}),
    ...(cohort?.kind === "alone" ? { alone: true } : {}),
    ...(cohort?.kind === "together-with"
      ? {
          togetherWith: cohort.filter,
          ...(cohort.count ? { togetherWithCount: cohort.count } : {}),
        }
      : {}),
    ...(cohort?.kind === "together-with-each" ? { togetherWithEach: cohort.filters } : {}),
  };
}

function bindTriggerObservation(
  state: FabRulesSnapshot,
  event: CommittedEvent,
  pattern: FabSingleTriggerEventPattern,
  existing: FabEventBindings | undefined,
): FabEventBindings {
  const normalized = normalizeTriggerPattern(pattern);
  const object = observedTriggerObject(event, normalized);
  const objects = observedTriggerObjects(event, normalized);
  const binding = normalized.binding;
  const defendedAttackBinding = normalized.bindDefendedAttackAs;
  const turnPlayerId =
    (event.name === "start-phase" ||
      event.name === "end-phase" ||
      event.name === "action-phase-start") &&
    typeof event.data.turnPlayerId === "string"
      ? event.data.turnPlayerId
      : null;
  // `resultingEvent` is an observation marker on derived events, not a game
  // binding — never let it inherit into trigger-layer bindings (proposed
  // events would wrongly skip their physical moves as "already happened").
  const { resultingEvent: _observationMarker, ...eventBindings } = event.bindings;
  return {
    ...eventBindings,
    ...(turnPlayerId ? { "turn-player": turnPlayerId } : {}),
    ...existing,
    ...(binding && normalized.pluralObservation
      ? { [binding]: objects }
      : binding && object
        ? { [binding]: bindingForObservedAttack(state, eventBindings, object) }
        : {}),
    ...(defendedAttackBinding && event.name === "defend"
      ? { [defendedAttackBinding]: event.data.attack }
      : {}),
  };
}

export function matchesTriggerEvent(
  state: FabRulesSnapshot,
  event: CommittedEvent,
  pattern: FabSingleTriggerEventPattern,
  controllerId: string,
  source?: FabObjectSnapshot,
  triggerBindings?: FabEventBindings,
): boolean {
  return matchesNormalizedTriggerEvent(
    state,
    event,
    normalizeTriggerPattern(pattern),
    controllerId,
    source,
    triggerBindings,
  );
}

function matchesNormalizedTriggerEvent(
  state: FabRulesSnapshot,
  event: CommittedEvent,
  pattern: NormalizedTriggerPattern,
  controllerId: string,
  source?: FabObjectSnapshot,
  triggerBindings?: FabEventBindings,
): boolean {
  if (!matchesEventName(event.name, pattern.name)) return false;
  // Play-time crank intent records pending crank choice only — it is not the
  // CR 8.3.29 "you crank" observation. Triggers (Puffin second crank, …) must
  // match the resolution crank (intent: false / omitted).
  if (
    event.name === "crank" &&
    "data" in event &&
    event.data &&
    typeof event.data === "object" &&
    "intent" in event.data &&
    (event.data as { intent?: boolean }).intent === true
  ) {
    return false;
  }
  if (!matchesActor(state, pattern.actor, eventActorId(event), controllerId, event)) return false;
  if (
    pattern.abilityType !== undefined &&
    (event.name !== "activate" || event.data.ability?.abilityType !== pattern.abilityType)
  ) {
    return false;
  }
  if (
    "damageType" in pattern &&
    pattern.damageType &&
    eventDamageType(event) !== pattern.damageType
  )
    return false;
  if (
    "from" in pattern &&
    pattern.from?.length &&
    !pattern.from.includes(eventFromZone(event) ?? "inventory")
  ) {
    return false;
  }
  if (
    "excludeFrom" in pattern &&
    pattern.excludeFrom?.length &&
    pattern.excludeFrom.includes(eventFromZone(event) ?? "inventory")
  ) {
    return false;
  }
  if ("to" in pattern && pattern.to && eventToZone(event) !== pattern.to) return false;
  if (pattern.defendedAttack) {
    // "When this defends a [filtered] attack" (Blunten): the defend event
    // carries the defended attack object; reject any other event or attack.
    if (event.name !== "defend") return false;
    const defendedAttack = event.data.attack;
    if (
      !defendedAttack ||
      !matchesFabSnapshotFilter(
        state,
        defendedAttack,
        pattern.defendedAttack,
        undefined,
        controllerId,
      )
    ) {
      return false;
    }
  }
  if (pattern.random !== undefined && eventRandom(event) !== pattern.random) return false;
  // Orientation constraint on physical zone moves ("put into your arsenal
  // face up"): move-zone / banish / enter-arena events stamp their visibility
  // as data.faceDown; an event without the flag is a face-up move.
  if (
    pattern.faceDown !== undefined &&
    (event.name === "move-zone" || event.name === "banish" || event.name === "enter-arena") &&
    ("faceDown" in event.data ? event.data.faceDown === true : false) !== pattern.faceDown
  ) {
    return false;
  }
  if (pattern.combatStep && event.context.combatStep !== pattern.combatStep) return false;
  if (pattern.phase && event.context.phase !== pattern.phase) return false;
  const observedObjects = observedTriggerObjects(event, pattern);
  const primary = pattern.pluralObservation ? null : (observedObjects[0] ?? null);
  const hitAttack = event.name === "hit" ? primaryEventObject(event) : null;
  // A defending or earlier-link Attack card remains physically on the combat
  // chain, but its intrinsic "when this hits" ability must only observe that
  // exact card's hit. Older authored cards used `observes: none` for this
  // shape, so enforce the attack-source identity at the engine boundary too.
  if (
    event.name === "hit" &&
    source?.zoneRef.zone === "combatChain" &&
    source.current.typeBox.types.includes("Action") &&
    source.current.typeBox.subtypes.includes("Attack") &&
    (!hitAttack || !sameObjectIdentity(hitAttack, source))
  ) {
    return false;
  }
  if (pattern.subject === "self" && (!source || !primary || !sameObjectIdentity(primary, source)))
    return false;
  if (pattern.fused === true && !objectWasFused(state, primary ?? source ?? null)) return false;
  if (pattern.subject !== null && typeof pattern.subject === "object") {
    const bound = triggerBindings?.[pattern.subject.binding];
    const boundObject = Array.isArray(bound) ? null : bound;
    if (
      !boundObject ||
      typeof boundObject !== "object" ||
      !("ref" in boundObject) ||
      !primary ||
      !sameObjectIdentity(primary, boundObject)
    )
      return false;
  }
  if (pattern.relationship) {
    if (pattern.pluralObservation) {
      if (observedObjects.length === 0) return false;
      const relationshipMatches = observedObjects.map((object) =>
        matchesObjectRelationship(object, pattern.relationship!, controllerId),
      );
      if (
        pattern.quantifier === "all"
          ? !relationshipMatches.every(Boolean)
          : !relationshipMatches.some(Boolean)
      )
        return false;
    } else if (!matchesObjectRelationship(primary, pattern.relationship, controllerId)) {
      return false;
    }
  }
  if (pattern.filter) {
    if (pattern.pluralObservation) {
      const filtered = observedObjects.map((object) =>
        matchesFabSnapshotFilter(state, object, pattern.filter!, undefined, controllerId),
      );
      if (pattern.quantifier === "all" ? !filtered.every(Boolean) : !filtered.some(Boolean)) {
        return false;
      }
    } else {
      const observed = observedTriggerObject(event, pattern);
      if (pattern.observedObject === "defended-attack") {
        if (
          filterAppliesToHeroTarget(pattern.filter) &&
          filterIsHeroIdentityOnDefendedAttack(pattern.filter)
        ) {
          // "defends a Reviled/Revered hero's attack" is the attacking hero.
          // "defends a Shadow/Brute attack" still matches the attack card.
          const attack =
            event.name === "defend" && "attack" in event.data ? event.data.attack : observed;
          const attackingPlayerId = attack?.controllerId ?? attack?.ownerId;
          const heroId = attackingPlayerId
            ? state.containers.zonesByPlayerId[attackingPlayerId]?.heroZone[0]
            : undefined;
          const hero =
            heroId && attackingPlayerId
              ? snapshotObject(state, heroId, attackingPlayerId, "heroZone")
              : null;
          if (
            !hero ||
            !matchesFabSnapshotFilter(state, hero, pattern.filter, undefined, controllerId)
          ) {
            return false;
          }
        } else if (
          !observed ||
          !matchesFabSnapshotFilter(state, observed, pattern.filter, undefined, controllerId)
        ) {
          return false;
        }
      } else // When the trigger targets a hero, identity/status filters apply to the
      // targeted hero (not the attack/source primary). Covers groundbreaker-crix
      // "whenever you attack a Guardian hero" (supertypes) and marked-hero
      // triggers (hasStatus: marked). Card identity on the same filter
      // ("hit a marked hero with a dagger") still matches the hitting object.
      if (pattern.target?.kind === "hero" && pattern.filter.hasStatus === "marked") {
        if (!matchesHeroTargetStatus(state, event, "marked")) return false;
        const { hasStatus: _marked, ...attackFilter } = pattern.filter;
        if (filterHasCardIdentity(attackFilter) || attackFilter.and || attackFilter.or) {
          const hitting = observedTriggerObject(event, pattern);
          if (
            !hitting ||
            !matchesFabSnapshotFilter(state, hitting, attackFilter, undefined, controllerId)
          ) {
            return false;
          }
        }
      } else if (pattern.target?.kind === "hero" && filterAppliesToHeroTarget(pattern.filter)) {
        const heroObject = heroTargetObject(state, event);
        if (
          !heroObject ||
          !matchesFabSnapshotFilter(state, heroObject, pattern.filter, undefined, controllerId)
        ) {
          return false;
        }
      } else if (event.name === "fuse" && "revealed" in event.data) {
        // CR 8.3.17 "Ice fuse": match when either the fused card or any revealed
        // fuse cost card satisfies the filter (Insidious Chill, etc.).
        const candidates = [primaryEventObject(event), ...event.data.revealed].filter(
          (object): object is FabObjectSnapshot => object !== null,
        );
        if (
          !candidates.some((object) =>
            matchesFabSnapshotFilter(state, object, pattern.filter!, undefined, controllerId),
          )
        ) {
          return false;
        }
      } else if (
        pattern.filter.hasStatus === "not-controlled-by-destroyer" &&
        event.name === "destroy"
      ) {
        // Theryon JDG006 (and similar): the destroyed card is NOT controlled by
        // the destroyer (the destroy event's actor). The default filter path
        // can't see the destroyer, so evaluate it here where the event is.
        const object = primaryEventObject(event);
        const destroyer = eventActorId(event);
        if (!object || !destroyer || object.controllerId === destroyer) return false;
      } else if (
        (pattern.filter.hasStatus === "face-up" || pattern.filter.hasStatus === "face-down") &&
        (event.name === "move-zone" || event.name === "banish" || event.name === "enter-arena")
      ) {
        // "Puts this face up into a zone" is destination visibility, not the
        // pre-move deck LKI (deck cards are private / face-down).
        const faceDown = "faceDown" in event.data && event.data.faceDown === true;
        if (pattern.filter.hasStatus === "face-up" ? faceDown : !faceDown) return false;
        const rest = { ...pattern.filter, hasStatus: undefined };
        if (Object.keys(rest).some((key) => rest[key as keyof typeof rest] !== undefined)) {
          const object = primaryEventObject(event);
          if (!object || !matchesFabSnapshotFilter(state, object, rest, undefined, controllerId)) {
            return false;
          }
        }
      } else if (pattern.filter.hasStatus === "from-action-card-effect" && event.name === "draw") {
        // Earthlore Bounty (EVR020): "draw … from an action card effect".
        // The drawn card is the primary event object; the Action identity is the
        // proposing layer's source (event.source), not the drawn card.
        const effectSource = event.source;
        const isActionCard = effectSource?.current.typeBox.types.includes("Action") === true;
        if (!isActionCard) return false;
        // Remaining filter fields (if any) still match the drawn card.
        const rest = { ...pattern.filter, hasStatus: undefined };
        if (Object.keys(rest).some((key) => rest[key as keyof typeof rest] !== undefined)) {
          const object = primaryEventObject(event);
          if (!object || !matchesFabSnapshotFilter(state, object, rest, undefined, controllerId)) {
            return false;
          }
        }
      } else {
        const object = primaryEventObject(event);
        if (
          !object ||
          !matchesFabSnapshotFilter(state, object, pattern.filter, undefined, controllerId)
        )
          return false;
      }
    }
  }
  if (pattern.comparison) {
    const comparisonValue = resolveTriggerComparisonValue(
      state,
      event,
      pattern.comparison.value,
      controllerId,
      source,
      triggerBindings,
    );
    if (
      comparisonValue === null ||
      !comparePrimitive(eventAmount(event), pattern.comparison.op, comparisonValue)
    ) {
      return false;
    }
  }
  if (pattern.target && !matchesTargetPattern(state, event, pattern.target, controllerId))
    return false;
  if (
    pattern.alone !== undefined ||
    pattern.togetherWith ||
    pattern.togetherWithCount ||
    (pattern.togetherWithEach && pattern.togetherWithEach.length > 0)
  ) {
    // "When this defends alone / together with …" — partners are other cards
    // declared as defenders on the active chain link (cohort is set before
    // defend events are committed).
    if (event.name !== "defend") return false;
    const link = state.combat?.activeLink;
    const cohortIds = link
      ? fabPrimaryDefenders(link)
      : state.lastClosedCombat
        ? fabAllDefenders(state.lastClosedCombat)
        : [];
    const origins = link?.defendingOrigins ?? {};
    const selfId = primary?.ref.instanceId;
    const partnerIds = cohortIds.filter((id) => id !== selfId);
    if (pattern.alone !== undefined) {
      const isAlone = partnerIds.length === 0;
      if (pattern.alone !== isAlone) return false;
    }
    const partnerMatchesFilter = (
      partnerId: string,
      filter: NonNullable<typeof pattern.togetherWith>,
    ): boolean => {
      const zoneRef = findObjectZone(state, partnerId);
      if (!zoneRef) return false;
      let object: FabObjectSnapshot;
      try {
        object = snapshotObject(state, partnerId, controllerId, zoneRef.zone as FabZoneKind);
      } catch {
        return false;
      }
      // playedFromZones on defend-together means "defended from that zone".
      if (filter.playedFromZones && filter.playedFromZones.length > 0) {
        const originKind = origins[partnerId]?.kind;
        const originTokens: readonly string[] =
          originKind === "hand"
            ? ["hand"]
            : originKind === "arsenal"
              ? ["arsenal"]
              : originKind === "equipment"
                ? [
                    "permanent",
                    "equipment-head",
                    "equipment-chest",
                    "equipment-arms",
                    "equipment-legs",
                  ]
                : [];
        if (!filter.playedFromZones.some((zone) => originTokens.includes(zone))) {
          return false;
        }
      }
      const { playedFromZones: _zones, ...rest } = filter;
      if (Object.keys(rest).length === 0) return true;
      return matchesFabSnapshotFilter(state, object, rest, undefined, controllerId);
    };
    if (pattern.togetherWith || pattern.togetherWithCount) {
      const matchingPartners = partnerIds.filter((partnerId) =>
        partnerMatchesFilter(partnerId, pattern.togetherWith ?? {}),
      );
      if (pattern.togetherWith && matchingPartners.length === 0) return false;
      if (
        pattern.togetherWithCount &&
        (typeof pattern.togetherWithCount.value !== "number" ||
          !comparePrimitive(
            matchingPartners.length,
            pattern.togetherWithCount.op,
            pattern.togetherWithCount.value,
          ))
      ) {
        return false;
      }
    }
    // Face Purgatory: each listed filter must match ≥1 co-defender.
    if (pattern.togetherWithEach && pattern.togetherWithEach.length > 0) {
      for (const filter of pattern.togetherWithEach) {
        if (!partnerIds.some((partnerId) => partnerMatchesFilter(partnerId, filter))) {
          return false;
        }
      }
    }
  }
  if (pattern.transformPartner) {
    // CR 8.5.36a "transforms from or into" (Release Notes — Bright Lights):
    // the constraint filters the OPPOSITE identity of the transform relative
    // to the observed object. Observing the transformed object means the
    // source transformed INTO the partner (incoming identity); observing the
    // incoming identity means something transformed INTO the source, i.e. the
    // source transformed FROM the transformed object.
    if (event.name !== "transform") return false;
    const partner =
      pattern.observedObject === "incoming-object"
        ? primaryEventObject(event)
        : "intoObject" in event.data && isObjectSnapshot(event.data.intoObject)
          ? event.data.intoObject
          : null;
    if (!partner) return false;
    const { hasStatus, ...rest } = pattern.transformPartner;
    if (hasStatus === "different-name") {
      const selfNames = (primary ?? source)?.current.names ?? [];
      if (partner.current.names.some((name) => selfNames.includes(name))) return false;
    }
    if (
      Object.keys(rest).length > 0 &&
      !matchesFabSnapshotFilter(state, partner, rest, undefined, controllerId)
    ) {
      return false;
    }
  }
  if (pattern.counter) {
    // Verify the event is about the matching counter type.
    const eventCounter =
      "counter" in event.data && typeof event.data.counter === "string" ? event.data.counter : null;
    const patternCounterName = pattern.counter.kind === "named" ? pattern.counter.name : null;
    if (eventCounter !== patternCounterName) return false;
  }
  if (pattern.remaining !== undefined) {
    // Check the source object's remaining counter count in the current state.
    if (!source) return false;
    const currentObject = state.objects[source.ref.instanceId];
    if (!currentObject) return false;
    const remaining = currentObject.counters
      .filter((c) =>
        pattern.counter
          ? c.kind === "named" &&
            pattern.counter!.kind === "named" &&
            c.name === pattern.counter!.name
          : true,
      )
      .reduce((sum, c) => sum + c.count, 0);
    if (remaining !== pattern.remaining) return false;
  }
  if ("position" in pattern && pattern.position) {
    // Deck position needs its dedicated event payload before it can safely match.
    return false;
  }
  return true;
}

/**
 * Trigger comparisons share the full FabAmount vocabulary with effects. A
 * delayed trigger must therefore evaluate a bound X/Y/Z (and any other
 * dynamic amount) from the bindings captured when it was generated instead
 * of rejecting every non-literal comparison value.
 */
function resolveTriggerComparisonValue(
  state: FabRulesSnapshot,
  event: CommittedEvent,
  value: number | FabAmount,
  controllerId: string,
  source: FabObjectSnapshot | undefined,
  triggerBindings: FabEventBindings | undefined,
): number | null {
  if (typeof value === "number") return value;
  const bindings = { ...event.bindings, ...triggerBindings };
  const objects: Record<string, readonly { instanceId: string; incarnation: number }[]> = {};
  const numbers: Record<string, number> = {};
  const strings: Record<string, string> = {};
  const lki: FabObjectSnapshot[] = source ? [source] : [];

  for (const [key, binding] of Object.entries(bindings)) {
    if (isObjectSnapshot(binding)) {
      objects[key] = [binding.ref];
      lki.push(binding);
    } else if (Array.isArray(binding) && binding.every(isObjectSnapshot)) {
      objects[key] = binding.map((object) => object.ref);
      lki.push(...binding);
    } else if (typeof binding === "number") {
      numbers[key] = binding;
    } else if (typeof binding === "string") {
      strings[key] = binding;
    }
  }

  try {
    const resolved = buildFabRulesViewWithLki(state, lki).evaluateAmount(value, {
      controllerId,
      source: source?.ref ?? null,
      bindings: { objects, numbers, strings },
    });
    return Number.isFinite(resolved.value) ? resolved.value : null;
  } catch {
    return null;
  }
}

function observedTriggerObject(
  event: CommittedEvent,
  pattern: NormalizedTriggerPattern,
): FabObjectSnapshot | null {
  const selector = pattern.observedObject;
  if (!selector) return null;
  switch (selector) {
    case "prevention-source":
      return event.source;
    case "damage-source":
      return "source" in event.data && isObjectSnapshot(event.data.source)
        ? event.data.source
        : null;
    case "damage-target":
      return "target" in event.data && isObjectSnapshot(event.data.target)
        ? event.data.target
        : null;
    case "defended-attack":
      return event.name === "defend" ? event.data.attack : null;
    case "previous-object":
      return "previous" in event.data && isObjectSnapshot(event.data.previous)
        ? event.data.previous
        : null;
    case "incoming-object":
      return "intoObject" in event.data && isObjectSnapshot(event.data.intoObject)
        ? event.data.intoObject
        : null;
    case "attack":
      return "attack" in event.data && isObjectSnapshot(event.data.attack)
        ? event.data.attack
        : "object" in event.data && isObjectSnapshot(event.data.object)
          ? event.data.object
          : null;
    case "defender":
    case "moved-object":
    case "played-card":
    case "pitched-card":
    case "discarded-card":
    case "drawn-card":
    case "boosted-card":
    case "fused-card":
    case "charging-card":
    case "charged-card":
    case "object":
    case "created-object":
    case "trigger-source":
    case "activated-card":
    case "looked-at-card":
    case "modified-object":
      return "object" in event.data && isObjectSnapshot(event.data.object)
        ? event.data.object
        : null;
    case "revealed-card":
      if ("object" in event.data && isObjectSnapshot(event.data.object)) return event.data.object;
      // CR 8.5.45a: clash-win/lose stamp the matching reveal on `affected`.
      if (event.name === "clash-win" || event.name === "clash-lose") {
        return event.affected[0] ?? null;
      }
      return null;
    case "banished-card":
      return "banished" in event.data && isObjectSnapshot(event.data.banished)
        ? event.data.banished
        : null;
    default:
      return null;
  }
}

function observedTriggerObjects(
  event: CommittedEvent,
  pattern: NormalizedTriggerPattern,
): readonly FabObjectSnapshot[] {
  if (!pattern.pluralObservation) {
    const object = observedTriggerObject(event, pattern);
    return object ? [object] : [];
  }
  switch (pattern.observedObject) {
    case "found-cards":
      return event.name === "search" ? event.data.found : [];
    case "revealed-cards":
      return event.name === "fuse" ? event.data.revealed : [];
    case "discarded-cards":
      return event.name === "beat-chest" ? event.data.discarded : [];
    default:
      return [];
  }
}

function matchesEventName(
  eventName: CommittedEvent["name"],
  patternName: FabSingleTriggerEventPattern["name"],
): boolean {
  return eventName === patternName;
}

function matchesActor(
  state: FabRulesSnapshot,
  actor: FabTriggerActor,
  eventActor: string | null,
  controllerId: string,
  event: CommittedEvent,
): boolean {
  if (actor.kind === "any") return true;
  if (actor.kind === "none") return eventActor === null;
  if (!eventActor) return false;
  switch (actor.player) {
    case "ability-controller":
      return eventActor === controllerId;
    case "opponent":
    case "other-hero":
      return eventActor !== controllerId;
    case "turn-player":
      return eventActor === state.activePlayerId;
    case "non-turn-player":
      return eventActor !== state.activePlayerId;
    case "attacking-hero":
      return eventActor === eventAttackingPlayerId(event);
    case "defending-hero":
      return eventActor === eventDefendingPlayerId(event);
  }
}

function isObjectSnapshot(value: unknown): value is FabObjectSnapshot {
  return typeof value === "object" && value !== null && "ref" in value && "instanceId" in value;
}

function sameObjectIdentity(left: FabObjectSnapshot, right: FabObjectSnapshot): boolean {
  return (
    left.ref.instanceId === right.ref.instanceId && left.ref.incarnation === right.ref.incarnation
  );
}

function matchesObjectRelationship(
  object: FabObjectSnapshot | null,
  relationship: FabObjectRelationship,
  controllerId: string,
): boolean {
  if (relationship.kind === "any") return object !== null;
  if (!object) return false;
  const expected = relationship.player === "ability-controller" ? controllerId : null;
  const actual =
    relationship.kind === "controller"
      ? object.controllerId
      : relationship.kind === "owner"
        ? object.ownerId
        : object.zoneRef.playerId;
  return expected === null ? actual !== null && actual !== controllerId : actual === expected;
}

function abilityConditionHolds(
  state: FabRulesSnapshot,
  source: FabTriggerSource,
  event: CommittedEvent,
  context: FabTriggerMatchContext,
): boolean {
  const condition = source.abilityCondition;
  if (!condition) return true;
  // First-class fused on attack/play: the fusion declaration fact lives on the
  // live attack incarnation (CR 8.3.17). Pre-fuse LKI used as the trigger
  // source must not suppress collection.
  if (
    condition.type === "has-status" &&
    condition.status === "fused" &&
    (event.name === "attack" || event.name === "play") &&
    objectWasFused(state, primaryEventObject(event) ?? source.source)
  ) {
    return true;
  }
  return context.evaluateStateCondition(state, condition, source, event);
}

function objectWasFused(
  state: FabRulesSnapshot,
  object: FabObjectSnapshot | null | undefined,
): boolean {
  if (!object) return false;
  if (object.declarationFacts?.some((fact) => fact.kind === "fusion") === true) return true;
  const live = state.objects[object.instanceId];
  return live?.declarationFacts?.some((fact) => fact.kind === "fusion") === true;
}

function primaryEventObject(event: CommittedEvent): FabObjectSnapshot | null {
  // Prevent: "this prevents damage" (Alluvion Constellas) identity is the
  // prevention source (event.source = barrier/spellvoid equipment), not the
  // damage-dealing card stored as data.source from the replaced deal-damage.
  if (event.name === "prevent" && event.source) return event.source;
  if ("object" in event.data) return event.data.object;
  if ("attack" in event.data && typeof event.data.attack === "object") return event.data.attack;
  if (
    "source" in event.data &&
    event.data.source &&
    typeof event.data.source === "object" &&
    "instanceId" in event.data.source
  ) {
    return event.data.source;
  }
  return event.affected[0] ?? null;
}

function eventActorId(event: CommittedEvent): string | null {
  return event.actorId;
}

function eventDamageType(event: CommittedEvent): string | null {
  return "damageType" in event.data && typeof event.data.damageType === "string"
    ? event.data.damageType
    : null;
}

function eventAmount(event: CommittedEvent): number {
  if (event.name === "modify-power") return event.data.to - event.data.from;
  // Each draw event represents one card drawn; without this, comparison
  // guards like Valda's `comparison: { op: "gte", value: 1 }` never match.
  if (event.name === "draw") return 1;
  // Each create event represents one token/card created; without this,
  // comparison guards like viserai-between-worlds'
  // `comparison: { op: "gte", value: 1 }` ("whenever you create 1 or more
  // Runechants") never match — the create event carries no `amount` field
  // (see reducers/zone-moves/create-search.ts), so it would default to 0.
  // Multi-token creates emit one create event per token, and the batch
  // summation above still scales "for each" effects correctly.
  // Each defend event represents one card declared as a defender; without
  // this, comparison guards like "defend with 1 or more attack action cards"
  // (Spider's Bite / Nerve Scalpel family) never match — the defend event
  // carries no `amount` field, so it would default to 0. Multi-defender
  // declarations emit one defend event per card and the batch summation in
  // collectEventTriggers still scales "for each" effects correctly.
  if (event.name === "defend") return 1;
  if (event.name === "create") return 1;
  if (
    event.name === "go-again" ||
    event.name === "gain-keyword" ||
    event.name === "crowd-cheers" ||
    event.name === "equip"
  )
    return 1;
  // CR 8.5.22 opt: number of cards looked at (Blaze "looked at this way").
  if (event.name === "opt") {
    if (typeof event.data.count === "number") return event.data.count;
    const top = Array.isArray(event.data.top) ? event.data.top.length : 0;
    const bottom = Array.isArray(event.data.bottom) ? event.data.bottom.length : 0;
    return top + bottom;
  }
  // Die face for "whenever you roll a 5 or 6" / "whenever you roll a 1"
  // (Skull Crushers). Committed roll carries `result`, not `amount`.
  if (event.name === "roll" && typeof event.data.result === "number") {
    return event.data.result;
  }
  if ("amount" in event.data && typeof event.data.amount === "number") return event.data.amount;
  if ("damage" in event.data && typeof event.data.damage === "number") return event.data.damage;
  return 0;
}

function eventFromZone(event: CommittedEvent): FabZone | null {
  if (event.name === "defend") return toCanonicalZone(event.data.origin);
  return "from" in event.data && typeof event.data.from === "string"
    ? toCanonicalZone(event.data.from)
    : null;
}

function eventToZone(event: CommittedEvent): FabZone | null {
  return "to" in event.data && typeof event.data.to === "string"
    ? toCanonicalZone(event.data.to)
    : null;
}

function toCanonicalZone(zone: string): FabZone | null {
  return normalizeToCatalogZone(zone);
}

function eventRandom(event: CommittedEvent): boolean | null {
  return "random" in event.data && typeof event.data.random === "boolean"
    ? event.data.random
    : null;
}

function matchesTargetPattern(
  state: FabRulesSnapshot,
  event: CommittedEvent,
  pattern: FabEventTargetPattern,
  controllerId: string,
): boolean {
  if (pattern.kind === "any") return true;
  if (!("target" in event.data)) return false;
  const target = event.data.target;
  if (!target || typeof target !== "object") return false;
  if (pattern.kind === "hero") {
    if (!("kind" in target) || target.kind !== "hero") return false;
    const targetPlayerId =
      "playerId" in target && typeof target.playerId === "string" ? target.playerId : null;
    if (
      pattern.player &&
      !matchesRelativePlayer(pattern.player, targetPlayerId, state, controllerId, event)
    )
      return false;
    if (pattern.filter) {
      const hero = heroTargetObject(state, event);
      return (
        hero !== null &&
        matchesFabSnapshotFilter(state, hero, pattern.filter, undefined, controllerId)
      );
    }
    return true;
  }
  return (
    isObjectSnapshot(target) &&
    (!pattern.filter ||
      matchesFabSnapshotFilter(state, target, pattern.filter, undefined, controllerId))
  );
}

function matchesRelativePlayer(
  relative: import("@tcg/flesh-and-blood-types").FabRelativePlayer,
  playerId: string | null,
  state: FabRulesSnapshot,
  controllerId: string,
  event: CommittedEvent,
): boolean {
  if (!playerId) return false;
  switch (relative) {
    case "ability-controller":
      return playerId === controllerId;
    case "opponent":
    case "other-hero":
      return playerId !== controllerId;
    case "turn-player":
      return playerId === state.activePlayerId;
    case "non-turn-player":
      return playerId !== state.activePlayerId;
    case "attacking-hero":
      return playerId === eventAttackingPlayerId(event);
    case "defending-hero":
      return playerId === eventDefendingPlayerId(event);
  }
}

function eventAttackingPlayerId(event: CommittedEvent): string | null {
  return "attackingPlayerId" in event.data && typeof event.data.attackingPlayerId === "string"
    ? event.data.attackingPlayerId
    : null;
}

/**
 * Evaluate a player-level status (e.g. "marked") against the hero target of
 * an event. Currently supports "marked" which is tracked as a boolean on the
 * player state. Other statuses return false until their player-level tracking
 * is wired in.
 */
function matchesHeroTargetStatus(
  state: FabRulesSnapshot,
  event: CommittedEvent,
  status: string,
): boolean {
  const playerId = heroTargetPlayerId(event);
  if (!playerId) return false;

  switch (status) {
    case "marked":
      // CR 9.3.3 clears Marked during the hit itself. Event trigger matching
      // occurs after its reducer commits, so marked-hit triggers must use the
      // immutable pre-hit observation rather than the now-cleared state.
      if (event.name === "hit" && event.data.targetWasMarked !== undefined) {
        return event.data.targetWasMarked;
      }
      return state.players[playerId]?.marked === true;
    default:
      return false;
  }
}

/** Reviled/Revered on defended-attack is the attacking hero, not the attack card. */
function filterIsHeroIdentityOnDefendedAttack(filter: FabCardFilter): boolean {
  const supers = filter.typeBox?.supertypes ?? [];
  if (supers.length === 0) return false;
  return supers.every((token) => token === "Reviled" || token === "Revered");
}

/** True when the filter should be evaluated against the targeted hero. */
function filterAppliesToHeroTarget(filter: FabCardFilter): boolean {
  if (filter.or && filter.or.length > 0) {
    return filter.or.every((child) => filterAppliesToHeroTarget(child));
  }
  if (filter.and && filter.and.length > 0) {
    return filter.and.every((child) => filterAppliesToHeroTarget(child));
  }
  if (filter.hasStatus === "marked") return true;
  if (!filterHasCardIdentity(filter)) return false;
  // "Dawnblade hits a hero" is the hitting weapon's name, not the defending hero.
  if (
    filter.nameContains &&
    !filter.name &&
    !filter.moniker &&
    !filter.typeBox?.types &&
    !filter.typeBox?.subtypes &&
    !filter.typeBox?.supertypes
  ) {
    return false;
  }
  const types = [...(filter.typeBox?.types ?? [])];
  const subtypes = [...(filter.typeBox?.subtypes ?? [])];
  // "a Runeblade attack action hits a hero" describes the hitting card.
  // Hero-identity filters are class/talent/name/marked, not playable types.
  if (
    types.some((type) =>
      ["Action", "Instant", "Attack Reaction", "Defense Reaction", "Equipment", "Weapon"].includes(
        type,
      ),
    ) ||
    subtypes.includes("Attack")
  ) {
    return false;
  }
  return true;
}

function filterHasCardIdentity(filter: FabCardFilter): boolean {
  return Boolean(
    filter.typeBox?.types ||
    filter.typeBox?.subtypes ||
    filter.typeBox?.supertypes ||
    filter.typeBox?.metatypes ||
    filter.name ||
    filter.nameContains ||
    filter.moniker,
  );
}

function heroTargetPlayerId(event: CommittedEvent): string | null {
  if ("defendingPlayerId" in event.data && typeof event.data.defendingPlayerId === "string") {
    return event.data.defendingPlayerId;
  }
  if ("target" in event.data && event.data.target && typeof event.data.target === "object") {
    const target = event.data.target;
    if ("kind" in target && target.kind === "hero" && "playerId" in target) {
      return typeof target.playerId === "string" ? target.playerId : null;
    }
  }
  return null;
}

/**
 * Snapshot of the hero card targeted by an attack/hit/etc. event so
 * identity filters (Guardian, marked-hero, …) can evaluate real types.
 */
function heroTargetObject(
  state: FabRulesSnapshot,
  event: CommittedEvent,
): FabObjectSnapshot | null {
  const playerId = heroTargetPlayerId(event);
  if (!playerId) return null;
  const heroId = state.containers.zonesByPlayerId[playerId]?.heroZone[0];
  if (!heroId) return null;
  return snapshotObject(state, heroId, playerId, "heroZone");
}

function eventDefendingPlayerId(event: CommittedEvent): string | null {
  if ("defendingPlayerId" in event.data && typeof event.data.defendingPlayerId === "string") {
    return event.data.defendingPlayerId;
  }
  // A defend event's actor is the player who declared the defending cards —
  // the defending player by definition.
  if (event.name === "defend") return eventActorId(event);
  return null;
}

export { applyTriggerCollection } from "../kernel/trigger-collection.ts";
