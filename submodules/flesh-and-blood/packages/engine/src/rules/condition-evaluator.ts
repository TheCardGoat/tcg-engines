import type { FabCondition, FabPlayer, FabZone } from "@tcg/flesh-and-blood-types";
import type { FabZoneKind } from "../state.ts";
import type { CommittedEvent, FabObjectSnapshot } from "./events.ts";
import type { FabResolvedBindings } from "./continuous/ir.ts";
import { buildFabRulesDesiredViewWithLki, findObjectZone } from "./state-rules-view.ts";
import type { FabRulesSnapshot } from "../kernel/transaction-kernel.ts";
import { snapshotObject } from "./snapshots.ts";

export interface FabConditionSource {
  readonly controllerId: string;
  readonly source: FabObjectSnapshot;
  readonly bindings?: FabResolvedBindings;
  /** Flat bindings captured when a delayed clause was armed (chosen-number). */
  readonly triggerBindings?: import("./events.ts").FabEventBindings;
}

/** Canonical condition evaluation is owned exclusively by the staged rules view. */
export function evaluateCanonicalCondition(
  state: FabRulesSnapshot,
  condition: FabCondition,
  source: FabConditionSource,
  event: CommittedEvent | null,
): boolean {
  const eventObjects = Object.values(event?.bindings ?? {}).filter(isObjectSnapshot);
  const primary = eventPrimaryObject(event);
  const chargedCard = declarationChargedCard(state, source.source);
  const lki = [
    source.source,
    ...(chargedCard ? [chargedCard] : []),
    ...(primary ? [primary] : []),
    ...eventObjects,
  ];
  const merged = mergeResolvedBindings(
    mergeResolvedBindings(
      mergeResolvedBindings(source.bindings, resolvedEventBindingsFromFlat(source.triggerBindings)),
      chargedCard
        ? { objects: { chargedCard: [chargedCard.ref] }, numbers: {}, strings: {} }
        : undefined,
    ),
    resolvedEventBindings(event),
  );
  return buildFabRulesDesiredViewWithLki(state, lki).evaluateCondition(condition, {
    controllerId: source.controllerId,
    source: source.source.ref,
    subject: source.source.ref,
    // Printed "if it is Draconic" / "if it has go again" on a source's own
    // trigger names the source unless a more specific `it` was already bound.
    bindings: {
      ...merged,
      objects: {
        ...merged.objects,
        it: merged.objects.it ?? [source.source.ref],
      },
    },
  });
}

function declarationChargedCard(
  state: FabRulesSnapshot,
  source: FabObjectSnapshot,
): FabObjectSnapshot | null {
  const fact = source.declarationFacts?.find((entry) => entry.kind === "charge");
  const ref = fact?.kind === "charge" ? fact.chargedCard : undefined;
  if (!ref) return null;
  const record = state.objects[ref.instanceId];
  const zone = findObjectZone(state, ref.instanceId);
  if (!record || !zone) return null;
  return snapshotObject(state, ref.instanceId, record.ownerId, zone.zone);
}

function mergeResolvedBindings(
  left: FabResolvedBindings | undefined,
  right: FabResolvedBindings | undefined,
): FabResolvedBindings {
  return {
    objects: { ...left?.objects, ...right?.objects },
    numbers: { ...left?.numbers, ...right?.numbers },
    strings: { ...left?.strings, ...right?.strings },
  };
}

function resolvedEventBindings(event: CommittedEvent | null): FabResolvedBindings {
  const resolved = resolvedEventBindingsFromFlat(event?.bindings);
  if (!event) return resolved;
  const damage =
    event.name === "hit"
      ? event.data.damage
      : event.name === "deal-damage" || event.name === "dealt-damage"
        ? event.data.amount
        : null;
  if (typeof damage === "number" && resolved.numbers["trigger-event-damage"] === undefined) {
    return {
      ...resolved,
      numbers: { ...resolved.numbers, "trigger-event-damage": damage },
    };
  }
  return resolved;
}

function resolvedEventBindingsFromFlat(
  eventBindings: import("./events.ts").FabEventBindings | undefined,
): FabResolvedBindings {
  const objects: Record<string, readonly import("./continuous/ir.ts").FabObjectRef[]> = {};
  const numbers: Record<string, number> = {};
  const strings: Record<string, string> = {};
  for (const [key, value] of Object.entries(eventBindings ?? {})) {
    if (isObjectSnapshot(value)) objects[key] = [value.ref];
    else if (isExactAttackBinding(value)) objects[key] = [value.object.ref];
    else if (Array.isArray(value) && value.every(isObjectSnapshot)) {
      objects[key] = value.map((object) => object.ref);
    } else if (typeof value === "number") numbers[key] = value;
    else if (typeof value === "string") strings[key] = value;
  }
  return { objects, numbers, strings };
}

export function playerIdsForCanonicalPlayer(
  state: FabRulesSnapshot,
  controllerId: string,
  player: FabPlayer | undefined,
  bindings: Readonly<Record<string, unknown>> = {},
): readonly string[] {
  if (!player || player === "controller" || player === "self") {
    // for-each "their graveyard" omits player; the bound seat is the zone owner.
    if (!player) {
      const subject = bindings["iteration-subject"];
      if (typeof subject === "string" && state.playerIds.some((playerId) => playerId === subject))
        return [subject];
    }
    return [controllerId];
  }
  if (player === "any" || player === "each") return state.playerIds;
  if (player === "opponent" || player === "another-hero" || player === "each-other-hero") {
    return state.playerIds.filter((playerId) => playerId !== controllerId);
  }
  if (player === "iteration-subject") {
    const subject = bindings["iteration-subject"];
    if (typeof subject === "string" && state.playerIds.some((playerId) => playerId === subject))
      return [subject];
    // Declaration contexts for for-each optionals already rebind controllerId to
    // the iteration subject (handleOptional chooser) — fall back to that seat.
    return [controllerId];
  }
  if (player === "target-controller") {
    const targetController = bindings["target-controller"];
    return typeof targetController === "string" &&
      state.playerIds.some((playerId) => playerId === targetController)
      ? [targetController]
      : [];
  }
  if (player === "highest-life-hero" || player === "lowest-life-hero") {
    const entries = state.playerIds
      .map((playerId) => {
        const life = state.players[playerId]?.life;
        return life === undefined ? null : { playerId, life };
      })
      .filter((entry) => entry !== null);
    if (entries.length === 0) return [];
    const extreme =
      player === "highest-life-hero"
        ? Math.max(...entries.map((e) => e.life))
        : Math.min(...entries.map((e) => e.life));
    const winners = entries.filter((e) => e.life === extreme).map((e) => e.playerId);
    return winners.length === 1 ? winners : [];
  }
  if (player === "attacking-hero") {
    return optionalPlayer(state.combat?.activeLink?.attackingPlayerId);
  }
  if (player === "defending-hero" || player === "attack-target") {
    return optionalPlayer(state.combat?.activeLink?.defendingPlayerId);
  }
  if (player === "winner" || player === "loser") {
    const bound = bindings[player];
    return typeof bound === "string" && state.playerIds.some((playerId) => playerId === bound)
      ? [bound]
      : [];
  }
  return [];
}

export function runtimeZonesForCanonicalZone(zone: FabZone): readonly FabZoneKind[] {
  switch (zone) {
    case "hand":
    case "deck":
    case "graveyard":
    case "banished":
    case "pitch":
    case "arsenal":
    case "stack":
    case "soul":
    case "inventory":
    case "under":
      return [zone];
    case "combat-chain":
      return ["combatChain"];
    // CR arena permanents: allies/auras/items in arena + equipment + weapons.
    // Card text `zones: ["permanent"]` must reach equipped gear (Enigma New Moon
    // flip, crush destroy equipment, continuous grants on equipment, …).
    case "permanent":
      return ["arena", "head", "chest", "arms", "legs", "weapon1", "weapon2"];
    case "hero":
      return ["heroZone"];
    case "weapon":
      return ["weapon1", "weapon2"];
    case "equipment-head":
      return ["head"];
    case "equipment-chest":
      return ["chest"];
    case "equipment-arms":
      return ["arms"];
    case "equipment-legs":
      return ["legs"];
  }
}

function optionalPlayer(playerId: string | undefined): readonly string[] {
  return playerId ? [playerId] : [];
}

function isObjectSnapshot(value: unknown): value is FabObjectSnapshot {
  return typeof value === "object" && value !== null && "ref" in value && "current" in value;
}

function isExactAttackBinding(
  value: unknown,
): value is import("./events.ts").FabExactAttackBinding {
  return (
    typeof value === "object" &&
    value !== null &&
    "kind" in value &&
    value.kind === "exact-attack" &&
    "object" in value
  );
}

function eventPrimaryObject(event: CommittedEvent | null): FabObjectSnapshot | null {
  if (!event) return null;
  if ("object" in event.data && isObjectSnapshot(event.data.object)) return event.data.object;
  if ("attack" in event.data && isObjectSnapshot(event.data.attack)) return event.data.attack;
  return event.affected[0] ?? null;
}
