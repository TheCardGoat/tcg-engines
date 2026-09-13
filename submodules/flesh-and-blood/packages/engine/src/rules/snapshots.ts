import { engineZoneToCatalog, normalizeToCatalogZone } from "./zones.ts";
import type {
  FabBaseObjectProperties,
  FabTriggeredStaticAbility,
  FabZone,
  FleshAndBloodAbility,
} from "@tcg/flesh-and-blood-types";
import type { FabZoneKind } from "../state.ts";
import type { CommittedEvent, FabObjectSnapshot, ProposedEvent } from "./events.ts";
import type { FabTriggeredResolution } from "./layers.ts";
import type { FabTriggerSource } from "./trigger-matcher.ts";
import type { FabRulesSnapshot } from "../kernel/transaction-kernel.ts";
import { buildFabRulesView, findObjectZone } from "./state-rules-view.ts";
import { basePropertiesOf, normalizeBaseObjectProperties } from "../cards.ts";
import type { FabCounterRecord, FabObjectHistory, FabObjectMarker, FabZoneRef } from "../state.ts";
import type { FabObjectRef } from "./continuous/ir.ts";
import type { FabActiveFaceState } from "../game/objects.ts";
import type { FabEvaluatedObjectProperties, FabRulesView } from "./rules-view.ts";
import { profileFabOperation } from "../performance-observer.ts";
import { activeContinuousAtoms } from "./continuous/runtime.ts";
import { delayedTriggerIsActive } from "./delayed-trigger-lifecycle.ts";

type TriggeredAbility = FabTriggeredStaticAbility;

export function syntheticTokenBaseProperties(token: string): FabBaseObjectProperties {
  const tokenName = token.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  const auraTokens = new Set([
    "bloodrot-pox",
    "embodiment-of-earth",
    "embodiment-of-lightning",
    "frailty",
    "inertia",
    "quicken",
    "runechant",
    "seismic-surge",
  ]);
  const resourceTokens = new Set(["copper", "gold", "silver"]);
  return normalizeBaseObjectProperties({
    canonicalId: `token:${token}`,
    name: tokenName,
    types: auraTokens.has(token)
      ? ["Token", "Aura"]
      : resourceTokens.has(token)
        ? ["Token", "Resource"]
        : ["Token"],
  });
}

export function createSyntheticFabObjectSnapshot(input: {
  readonly ref: FabObjectRef;
  readonly canonicalId: string | null;
  readonly objectKind: import("../game/objects.ts").FabObjectRecord["objectKind"];
  readonly baseSource: import("../game/objects.ts").FabObjectRecord["baseSource"];
  readonly ownerId: string;
  readonly controllerId: string | null;
  readonly zone: FabObjectSnapshot["zone"];
  readonly zoneRef: FabZoneRef;
  readonly visibility?: "public" | "private";
  readonly faceDown?: boolean;
  readonly base: FabBaseObjectProperties;
  readonly copyable?: FabBaseObjectProperties;
  readonly current?: FabEvaluatedObjectProperties;
  readonly counters?: Readonly<Record<string, number>>;
  readonly counterRecords?: readonly FabCounterRecord[];
  readonly markers?: readonly FabObjectMarker[];
  readonly history?: FabObjectHistory;
  readonly declarationFacts?: FabObjectSnapshot["declarationFacts"];
  readonly capturedAt?: FabObjectSnapshot["capturedAt"];
  readonly activeFace?: FabActiveFaceState;
}): FabObjectSnapshot {
  const base = input.base;
  const current = input.current ?? base;
  return cloneFrozenLkiValue({
    ref: input.ref,
    instanceId: input.ref.instanceId,
    canonicalId: input.canonicalId,
    objectKind: input.objectKind,
    baseSource: input.baseSource,
    ownerId: input.ownerId,
    controllerId: input.controllerId,
    visibility: input.visibility ?? "public",
    base,
    copyable: input.copyable ?? base,
    baseNumeric: base.numeric,
    current,
    zoneRef: input.zoneRef,
    counterRecords: input.counterRecords ?? [],
    markers: input.markers ?? (input.faceDown === true ? [{ kind: "face-down" as const }] : []),
    history: input.history ?? { moves: [] },
    ...(input.declarationFacts ? { declarationFacts: input.declarationFacts } : {}),
    appliedEffectIds: [],
    capturedAt: input.capturedAt ?? "checkpoint-0",
    zone: input.zone,
    faceDown: input.faceDown ?? false,
    counters: input.counters ?? {},
    ...(input.activeFace ? { activeFace: input.activeFace } : {}),
  });
}

export function snapshotObject(
  state: FabRulesSnapshot,
  instanceId: string,
  _controllerId: string,
  zoneKind: FabZoneKind,
  view: FabRulesView = buildFabRulesView(state),
): FabObjectSnapshot {
  const record = state.objects[instanceId];
  if (!record) throw new Error(`cannot snapshot missing FAB object ${instanceId}`);
  const evaluated = view.object({
    instanceId,
    incarnation: record.incarnation,
  });
  if (!evaluated) throw new Error(`cannot evaluate FAB object ${instanceId}`);
  const canonicalId = record.canonicalId;
  return cloneFrozenLkiValue({
    ref: evaluated.ref,
    instanceId,
    canonicalId,
    objectKind: record.objectKind,
    baseSource: record.baseSource,
    ownerId: record.ownerId,
    controllerId: evaluated.controllerId,
    visibility: evaluated.visibility,
    base: evaluated.base,
    copyable: evaluated.copyable,
    baseNumeric: evaluated.baseNumeric,
    current: evaluated.current,
    zoneRef: evaluated.zone,
    counterRecords: evaluated.counters,
    markers: record.markers,
    history: evaluated.history,
    ...(record.declarationFacts ? { declarationFacts: record.declarationFacts } : {}),
    appliedEffectIds: evaluated.appliedEffectIds,
    capturedAt: `checkpoint-${state.counters.checkpoint}`,
    zone: canonicalZone(zoneKind),
    faceDown: record.markers.some((marker) => marker.kind === "face-down"),
    counters: snapshotCounters(record.counters),
    activeFace: record.activeFace,
  });
}

/** Deterministically reserve a ref for a reset-causing move proposal. */
export function nextFabDestinationRef(
  state: FabRulesSnapshot,
  object: Pick<FabObjectSnapshot, "instanceId">,
  resetOffset = 0,
): FabObjectRef {
  return {
    instanceId: object.instanceId,
    incarnation: state.counters.objectIncarnation + resetOffset + 1,
  };
}

/** CR 3.0.9 destination identity for a zone move, or null when identity persists. */
export function destinationRefForFabMove(
  state: FabRulesSnapshot,
  object: Pick<FabObjectSnapshot, "instanceId">,
  to: FabZone | "arena" | "unknown",
  resetOffset = 0,
): FabObjectRef | null {
  return fabZoneMoveResetsObject(to) ? nextFabDestinationRef(state, object, resetOffset) : null;
}

export function fabZoneMoveResetsObject(to: FabZone | "arena" | "unknown"): boolean {
  return !(
    to === "stack" ||
    to === "combat-chain" ||
    to === "arena" ||
    to === "permanent" ||
    to === "hero" ||
    to === "weapon" ||
    to === "equipment-head" ||
    to === "equipment-chest" ||
    to === "equipment-arms" ||
    to === "equipment-legs"
  );
}

/** Player context for an event involving an uncontrolled-zone snapshot. */
export function snapshotPlayerId(object: FabObjectSnapshot): string {
  return object.controllerId ?? object.zoneRef.playerId ?? object.ownerId;
}

/**
 * Detach selected JSON-shaped LKI, including from a Mutative draft. Preserve
 * sharing within this one snapshot: base/copyable/current frequently contain
 * the same ability trees. Never reuse a copy across event boundaries.
 */
function cloneFrozenLkiValue<T>(value: T, copies = new Map<object, unknown>()): T {
  if (value === null || typeof value !== "object") return value;
  const previous = copies.get(value);
  if (previous !== undefined) return previous as T;
  if (Array.isArray(value)) {
    const copy = value.map((child) => cloneFrozenLkiValue(child, copies));
    copies.set(value, copy);
    return Object.freeze(copy) as T;
  }
  const copy: Record<string, unknown> = {};
  copies.set(value, copy);
  for (const key of Object.keys(value)) {
    const child = cloneFrozenLkiValue((value as Record<string, unknown>)[key], copies);
    // Match Object.fromEntries for own JSON keys, including __proto__.
    if (key === "__proto__") {
      Object.defineProperty(copy, key, {
        value: child,
        enumerable: true,
        writable: true,
        configurable: true,
      });
    } else {
      copy[key] = child;
    }
  }
  return Object.freeze(copy) as T;
}

/** Snapshot all currently functional card-native trigger sources once per boundary. */
export function snapshotFunctionalTriggerSources(state: FabRulesSnapshot): FabTriggerSource[] {
  return profileFabOperation("trigger-source-scan", () =>
    snapshotFunctionalTriggerSourcesUnprofiled(state),
  );
}

function snapshotFunctionalTriggerSourcesUnprofiled(state: FabRulesSnapshot): FabTriggerSource[] {
  const sources: FabTriggerSource[] = [];
  const seen = new Set<string>();
  const view = buildFabRulesView(state);
  for (const playerId of state.playerIds) {
    const player = state.players[playerId];
    if (!player) continue;
    for (const [zoneKey, instanceIds] of Object.entries(
      state.containers.zonesByPlayerId[playerId]!,
    )) {
      const zone = parseZoneKind(zoneKey);
      if (!zone) continue;
      for (const instanceId of instanceIds) {
        const occurrenceKey = `${playerId}:${zone}:${instanceId}`;
        if (seen.has(occurrenceKey)) continue;
        seen.add(occurrenceKey);
        const record = state.objects[instanceId];
        if (!record) continue;
        const ref = { instanceId: record.instanceId, incarnation: record.incarnation };
        const abilities = view.functionalAbilities(ref);
        if (abilities.length === 0) continue;
        // Most functional abilities are not triggers. Only detach and freeze
        // an event-boundary source after an eligible trigger needs it, sharing
        // that snapshot between the object's triggers at this boundary.
        let object: FabObjectSnapshot | undefined;
        for (const ability of abilities) {
          if (!isTriggeredAbility(ability)) {
            continue;
          }
          if (!isFunctionalInZone(ability, canonicalZone(zone))) continue;
          const resolution = triggeredResolution(ability);
          if (!resolution) continue;
          object ??= snapshotObject(state, instanceId, playerId, zone, view);
          const bindings = grantedAbilityBindings(state, view, object.ref, ability.id);
          sources.push({
            abilityId: ability.id,
            controllerId: playerId,
            source: object,
            trigger: ability.trigger,
            abilityCondition: ability.condition,
            resolution,
            layerKeywords: ability.layerKeywords?.map((keyword) => keyword.name) ?? [],
            limit: ability.limit,
            functionalZones: ability.functionalZones ?? defaultFunctionalZones(ability),
            ...(bindings ? { bindings } : {}),
            origin: object.base.abilities.some((baseAbility) => baseAbility.id === ability.id)
              ? "static"
              : "granted",
          });
        }
      }
    }
  }
  for (const delayed of state.delayedTriggers) {
    if (!delayedTriggerIsActive(state, delayed.policy)) continue;
    const functionalZone = functionalZoneForDelayedSource(delayed.source.zone);
    if (!functionalZone) continue;
    sources.push({
      abilityId: delayed.delayedTriggerId,
      controllerId: delayed.controllerId,
      source: delayed.source,
      trigger: delayed.trigger,
      resolution: delayed.resolution,
      layerKeywords: [],
      triggerBindings: delayed.bindings,
      // Delayed clauses persist after the source leaves its generation zone
      // (Stone Rain GY after the arrow resolves).
      functionalZones: [
        functionalZone,
        "graveyard",
        "banished",
        "combat-chain",
        "permanent",
        "stack",
      ],
      origin: "delayed",
    });
  }
  const activeAttackId = state.combat?.activeLink?.activeAttack.sourceObjectId;
  const activeAttackZone = activeAttackId ? findObjectZone(state, activeAttackId) : null;
  const activeAttackRecord = activeAttackId ? state.objects[activeAttackId] : undefined;
  const activeAttack =
    activeAttackRecord && activeAttackZone
      ? snapshotObject(
          state,
          activeAttackId!,
          state.combat!.activeLink!.attackingPlayerId,
          activeAttackZone.zone,
          view,
        )
      : null;
  if (activeAttack?.current.keywords.some((keyword) => keyword.name === "phantasm")) {
    sources.push({
      abilityId: "keyword:phantasm",
      controllerId: state.combat!.activeLink!.attackingPlayerId,
      source: activeAttack,
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: { kind: "any" },
          observes: {
            kind: "event-object",
            selector: "defender",
            relationship: { kind: "any" },
            filter: {
              typeBox: {
                types: ["Action"],
                subtypes: ["Attack"],
                excludeSupertypes: ["Illusionist"],
              },
              numeric: [
                {
                  property: "power",
                  basis: "current",
                  comparison: { op: "gte", value: 6 },
                },
              ],
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        // CR 8.3.13a intervening-if: the triggered-layer re-checks the
        // event-condition at resolution. If the attack is no longer defended by
        // a non-Illusionist attack action card with 6+ current power (e.g. the
        // defending card's power was reduced below 6 before resolution — the CR
        // §5 Blinding Beam example), phantasm fails to resolve and does not
        // destroy. The condition filter mirrors the defend event filter above.
        effect: {
          type: "conditional",
          condition: {
            type: "defended-this-chain-link",
            filter: {
              typeBox: {
                types: ["Action"],
                subtypes: ["Attack"],
                excludeSupertypes: ["Illusionist"],
              },
              numeric: [
                {
                  property: "power",
                  basis: "current",
                  comparison: { op: "gte", value: 6 },
                },
              ],
            },
          },
          then: { type: "destroy", target: { selector: "self" } },
        },
      },
      layerKeywords: [],
      functionalZones: ["combat-chain", "permanent", "weapon"],
      origin: "keyword",
    });
  }
  return sources;
}

/**
 * A property-granted triggered ability resolves as part of the effect that
 * granted it. Preserve that layer's frozen bindings (for example a selected
 * dagger bound as `it`) when the ability is later collected from its target.
 */
function grantedAbilityBindings(
  state: FabRulesSnapshot,
  view: FabRulesView,
  ref: FabObjectRef,
  abilityId: string,
): import("./continuous/ir.ts").FabResolvedBindings | null {
  const contribution = view
    .explain(ref)
    ?.contributions.find(
      (entry) => entry.property === `ability:${abilityId}` || entry.property === "abilities",
    );
  if (!contribution?.atomId) return null;
  return (
    activeContinuousAtoms(state).find((entry) => entry.atom.atomId === contribution.atomId)
      ?.lockedBindings ?? null
  );
}

/** Trigger abilities on the exact changing object retain functionality via LKI. */
export function snapshotEventSubjectTriggerSources(
  state: FabRulesSnapshot,
  events: readonly (ProposedEvent | CommittedEvent)[],
): FabTriggerSource[] {
  const sources: FabTriggerSource[] = [];
  const seen = new Set<string>();
  for (const event of events) {
    for (const object of event.affected) {
      // Face-down / private LKI (arsenal) may hide current.abilities. Printed
      // "from anywhere" triggers still function from the base text box and the
      // registered definition (CR 6.6 hidden triggered abilities).
      const definition = object.canonicalId ? state.cardDefinitions[object.canonicalId] : undefined;
      const printed = definition ? basePropertiesOf(definition).abilities : [];
      const abilities = uniqueTriggeredAbilities(
        object.current.abilities,
        object.base.abilities,
        printed,
      );
      for (const ability of abilities) {
        if (ability.trigger.kind === "state") continue;
        const key = `${object.instanceId}:${ability.id}`;
        if (seen.has(key)) continue;
        const resolution = triggeredResolution(ability);
        if (!resolution) continue;
        seen.add(key);
        sources.push({
          abilityId: ability.id,
          // Personal zones (arsenal/hand) have a null controller. Prefer the
          // zone owner so "an opponent's effect" is the event actor, not the
          // destroyed card's attributed controller.
          controllerId: object.controllerId ?? snapshotPlayerId(object) ?? event.controllerId,
          source: object,
          trigger: ability.trigger,
          abilityCondition: ability.condition,
          resolution,
          layerKeywords: ability.layerKeywords?.map((keyword) => keyword.name) ?? [],
          limit: ability.limit,
          functionalZones: ability.functionalZones ?? [
            object.zone === "arena"
              ? "permanent"
              : object.zone === "unknown"
                ? "hand"
                : object.zone,
            "graveyard",
            "combat-chain",
            "banished",
          ],
          origin: object.base.abilities.some((baseAbility) => baseAbility.id === ability.id)
            ? "static"
            : "granted",
        });
      }
    }
  }
  return sources;
}

function functionalZoneForDelayedSource(zone: FabObjectSnapshot["zone"]): FabZone | null {
  if (zone === "arena") return "permanent";
  if (zone === "unknown") return null;
  return zone;
}

function isTriggeredAbility(ability: FleshAndBloodAbility): ability is TriggeredAbility {
  return ability.kind === "static" && ability.staticKind === "triggered";
}

function uniqueTriggeredAbilities(
  ...lists: readonly (readonly FleshAndBloodAbility[])[]
): TriggeredAbility[] {
  const seen = new Set<string>();
  const result: TriggeredAbility[] = [];
  for (const list of lists) {
    for (const ability of list) {
      if (!isTriggeredAbility(ability) || seen.has(ability.id)) continue;
      seen.add(ability.id);
      result.push(ability);
    }
  }
  return result;
}

function triggeredResolution(ability: TriggeredAbility): FabTriggeredResolution | null {
  if (ability.resolution.kind === "modal") {
    return {
      kind: "modal",
      ability: {
        modal: {
          choose: ability.resolution.choose,
          allowRepeat: ability.resolution.allowRepeat,
          random: ability.resolution.random,
        },
        modes: ability.resolution.modes,
        effect: ability.resolution.effect,
        condition: ability.condition,
      },
    };
  }
  return { kind: "effect", effect: ability.resolution.effect };
}

/** True when a trigger expression includes the complete-contract event. */
function observesCompleteContract(
  expression: import("@tcg/flesh-and-blood-types").FabTriggerEventExpression,
): boolean {
  if ("patterns" in expression) {
    return expression.patterns.some((pattern) => pattern.name === "complete-contract");
  }
  return expression.name === "complete-contract";
}

function defaultFunctionalZones(ability: TriggeredAbility): readonly FabZone[] {
  const permanentZones = [
    "permanent",
    "hero",
    "weapon",
    "equipment-head",
    "equipment-chest",
    "equipment-arms",
    "equipment-legs",
  ] as const satisfies readonly FabZone[];

  // Pure state triggers (e.g. "When this has no steam counters, destroy it")
  // only function while the object is a permanent — not while still on the
  // stack mid-play before enter-arena replacement seeding (Optekal Monocle).
  if (ability.trigger.kind === "state") {
    return permanentZones;
  }

  // CR 8.5.39a: a contract is a continuous effect that starts when generated
  // and ends only when the effect ceases to exist — an attack-action contract
  // is always in the graveyard by the time it completes, so its "whenever you
  // complete this contract" reward must function from there.
  if (ability.trigger.kind === "event" && observesCompleteContract(ability.trigger.event)) {
    return [...permanentZones, "combat-chain", "stack", "graveyard"];
  }

  // Event static triggers also function on combat-chain/stack so attack-action
  // abilities (Virulent Touch "when this chain link resolves") stay live.
  return [...permanentZones, "combat-chain", "stack"];
}

function isFunctionalInZone(ability: TriggeredAbility, zone: FabObjectSnapshot["zone"]): boolean {
  if (zone === "arena" || zone === "unknown") return false;
  const canonicalZone = normalizeToCatalogZone(zone);
  return (
    canonicalZone !== null &&
    (ability.functionalZones ?? defaultFunctionalZones(ability)).includes(canonicalZone)
  );
}

function snapshotCounters(
  records: readonly import("../state.ts").FabCounterRecord[],
): Readonly<Record<string, number>> {
  const counters: Record<string, number> = {};
  for (const record of records) {
    if (record.kind === "damage") continue;
    const key = record.kind === "named" ? record.name : record.property;
    const value = record.kind === "named" ? record.count : record.value * record.count;
    counters[key] = (counters[key] ?? 0) + value;
  }
  return counters;
}

function canonicalZone(zone: FabZoneKind): FabObjectSnapshot["zone"] {
  return engineZoneToCatalog(zone);
}

function parseZoneKind(value: string): FabZoneKind | null {
  switch (value) {
    case "deck":
    case "hand":
    case "graveyard":
    case "banished":
    case "arsenal":
    case "pitch":
    case "combatChain":
    case "stack":
    case "arena":
    case "head":
    case "chest":
    case "arms":
    case "legs":
    case "weapon1":
    case "weapon2":
    case "heroZone":
    case "soul":
    case "inventory":
      return value;
    default:
      return null;
  }
}

/** Resolve the exact attack source even after a token has ceased to exist. */
export function snapshotAttackSource(
  state: FabRulesSnapshot,
  attack: import("../game/combat.ts").FabActiveAttackRef,
  playerId: string,
  zone: FabZoneKind,
): FabObjectSnapshot {
  const proxy = attack.kind === "proxy" ? state.attackProxies[attack.proxyId] : undefined;
  const live = state.objects[attack.sourceObjectId];
  if (live && (!proxy || live.incarnation === proxy.sourceRef.incarnation))
    return snapshotObject(state, attack.sourceObjectId, playerId, zone);
  const lki = proxy
    ? Object.values(state.lkiArena).find(
        (entry) =>
          entry.ref.instanceId === proxy.sourceRef.instanceId &&
          entry.ref.incarnation === proxy.sourceRef.incarnation,
      )
    : undefined;
  if (!lki) throw new Error(`Missing attack source LKI for ${attack.sourceObjectId}`);
  return {
    ...createSyntheticFabObjectSnapshot({
      ref: lki.ref,
      canonicalId: lki.canonicalId,
      objectKind: lki.objectKind,
      baseSource: lki.baseSource,
      ownerId: lki.ownerId,
      controllerId: lki.controllerId,
      zone: engineZoneToCatalog(lki.zone.zone) ?? "unknown",
      zoneRef: lki.zone,
      base: lki.base,
      copyable: lki.copyable,
      current: lki.current,
      counterRecords: lki.counters,
      markers: lki.markers,
    }),
    baseNumeric: lki.baseNumeric,
    appliedEffectIds: lki.appliedEffectIds,
  };
}
