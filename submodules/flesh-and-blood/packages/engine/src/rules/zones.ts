/**
 * Canonical engine ↔ catalog zone vocabulary.
 * All rules modules must map zones through this module so new zones fail tsc.
 */
import type { FabZone } from "@tcg/flesh-and-blood-types";
import { FAB_ZONE_KINDS, type FabMatchState, type FabZoneKind } from "../state.ts";
import type { FabRulesSnapshot } from "../kernel/transaction-kernel.ts";
import { assertNever } from "./evaluation/assert-never.ts";

export type EngineZoneKind = FabZoneKind;
export type CatalogZone = FabZone;

export function engineZoneToCatalog(zone: FabZoneKind): CatalogZone {
  switch (zone) {
    case "combatChain":
      return "combat-chain";
    case "arena":
      return "permanent";
    case "heroZone":
      return "hero";
    case "head":
      return "equipment-head";
    case "chest":
      return "equipment-chest";
    case "arms":
      return "equipment-arms";
    case "legs":
      return "equipment-legs";
    case "weapon1":
    case "weapon2":
      return "weapon";
    case "deck":
    case "hand":
    case "graveyard":
    case "banished":
    case "arsenal":
    case "pitch":
    case "stack":
    case "soul":
    case "inventory":
    case "under":
      return zone;
    default:
      return assertNever(zone, "FabZoneKind");
  }
}

export function catalogZoneToEngine(zone: string): FabZoneKind | null {
  switch (zone) {
    case "deck":
    case "hand":
    case "graveyard":
    case "banished":
    case "arsenal":
    case "pitch":
    case "stack":
    case "soul":
    case "inventory":
    case "under":
      return zone;
    case "combat-chain":
      return "combatChain";
    case "permanent":
    case "arena":
      return "arena";
    case "hero":
      return "heroZone";
    case "equipment-head":
      return "head";
    case "equipment-chest":
      return "chest";
    case "equipment-arms":
      return "arms";
    case "equipment-legs":
      return "legs";
    case "weapon":
    case "unknown":
      return null;
    default:
      return null;
  }
}

/**
 * Catalog zones that sit in the FAB arena as permanents (CR 3 / 8.1).
 * Engine seats them in arena, equipment, or weapon zones; card text often
 * says "permanent" / "equipment you control" with `zones: ["permanent"]`.
 */
export const ARENA_PERMANENT_CATALOG_ZONES = [
  "permanent",
  "equipment-head",
  "equipment-chest",
  "equipment-arms",
  "equipment-legs",
  "weapon",
] as const satisfies readonly CatalogZone[];

/** Complete CR arena vocabulary in both authored/catalog and engine-seat form.
 * Keep this ownership here so reducers and evaluators cannot silently drift. */
export const ARENA_CATALOG_ZONES = [
  "permanent",
  "hero",
  "combat-chain",
  "equipment-head",
  "equipment-chest",
  "equipment-arms",
  "equipment-legs",
  "weapon",
] as const satisfies readonly CatalogZone[];

export const ARENA_ENGINE_ZONES = [
  "arena",
  "heroZone",
  "combatChain",
  "head",
  "chest",
  "arms",
  "legs",
  "weapon1",
  "weapon2",
] as const satisfies readonly EngineZoneKind[];

export function isArenaZone(zone: string): boolean {
  return (
    (ARENA_CATALOG_ZONES as readonly string[]).includes(zone) ||
    (ARENA_ENGINE_ZONES as readonly string[]).includes(zone) ||
    zone === "arena"
  );
}

export function isArenaPermanentCatalogZone(zone: string): boolean {
  return (ARENA_PERMANENT_CATALOG_ZONES as readonly string[]).includes(zone);
}

/**
 * Whether an object's catalog zone is legal for a target's `zones` list.
 * `permanent` matches any arena permanent seat (arena + equipment + weapons).
 * `weapon` matches either weapon seat (catalog collapses weapon1/2 → weapon).
 */
export function catalogZoneMatchesTargetZones(
  objectCatalogZone: string,
  targetZones: readonly string[],
): boolean {
  if (targetZones.includes(objectCatalogZone)) return true;
  if (targetZones.includes("permanent") && isArenaPermanentCatalogZone(objectCatalogZone)) {
    return true;
  }
  return false;
}

/**
 * Expand target zone tokens for scanning player zone lists.
 * `permanent` → arena + equipment seats + weapon seats; `weapon` → both
 * weapon seats (handled by callers that map catalog→engine).
 */
export function expandCatalogZonesForScan(zones: readonly string[]): readonly CatalogZone[] {
  const expanded: CatalogZone[] = [];
  const seen = new Set<string>();
  for (const zone of zones) {
    const batch: readonly CatalogZone[] =
      zone === "permanent" ? ARENA_PERMANENT_CATALOG_ZONES : ([zone] as readonly CatalogZone[]);
    for (const entry of batch) {
      if (seen.has(entry)) continue;
      seen.add(entry);
      expanded.push(entry);
    }
  }
  return expanded;
}

/**
 * CR combat-chain membership for continuous/object filters: the physical
 * combatChain zone **or** the active attack (weapons/allies often remain in
 * their permanent/weapon seat while attacking — Dromai "while attacking").
 */
export function isOnCombatChain(
  state: Pick<FabMatchState, "combat" | "containers" | "playerIds"> | FabRulesSnapshot,
  instanceId: string,
): boolean {
  if (state.combat?.activeLink?.activeAttack.sourceObjectId === instanceId) return true;
  for (const playerId of state.playerIds) {
    if (state.containers.zonesByPlayerId[playerId]?.combatChain.includes(instanceId)) return true;
  }
  return false;
}

export function engineZoneOrSelf(zone: FabZoneKind | FabZone): FabZoneKind | null {
  return FAB_ZONE_KINDS.includes(zone as FabZoneKind)
    ? (zone as FabZoneKind)
    : catalogZoneToEngine(zone);
}

export const toCatalogZone = engineZoneToCatalog;
export const engineZone = catalogZoneToEngine;

export function canonicalEngineZone(zone: FabZone): FabZoneKind | null {
  return catalogZoneToEngine(zone);
}

/**
 * Normalize an engine zone kind or catalog zone token to a catalog FabZone.
 * Used by event/trigger matching where zone fields may be either form.
 */
export function normalizeToCatalogZone(zone: string): FabZone | null {
  // Engine match-state zone kinds
  if (
    zone === "deck" ||
    zone === "hand" ||
    zone === "graveyard" ||
    zone === "banished" ||
    zone === "arsenal" ||
    zone === "pitch" ||
    zone === "stack" ||
    zone === "combatChain" ||
    zone === "arena" ||
    zone === "head" ||
    zone === "chest" ||
    zone === "arms" ||
    zone === "legs" ||
    zone === "weapon1" ||
    zone === "weapon2" ||
    zone === "heroZone" ||
    zone === "soul" ||
    zone === "inventory"
  ) {
    return engineZoneToCatalog(zone);
  }
  // Already-catalog tokens (identity)
  switch (zone) {
    case "combat-chain":
    case "permanent":
    case "hero":
    case "weapon":
    case "equipment-head":
    case "equipment-chest":
    case "equipment-arms":
    case "equipment-legs":
    case "soul":
    case "inventory":
    case "under":
      return zone;
    case "unknown":
    default:
      return null;
  }
}
