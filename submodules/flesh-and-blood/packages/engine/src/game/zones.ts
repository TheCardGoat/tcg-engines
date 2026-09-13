import { fabObjectInstanceId, type FabObjectInstanceId, type FabPlayerId } from "./identity.ts";
import { createFabLoopGuard } from "@tcg/flesh-and-blood-types";

/**
 * Ordered physical zones owned by a seated Flesh and Blood player.
 * Equipment zones hold at most one equipped permanent each (CR 3.2-3.5, 3.10-3.12).
 */
export type FabZoneKind =
  | "deck"
  | "hand"
  | "graveyard"
  | "banished"
  | "arsenal"
  | "pitch"
  | "combatChain"
  | "stack"
  | "arena"
  | "head"
  | "chest"
  | "arms"
  | "legs"
  | "weapon1"
  | "weapon2"
  | "heroZone"
  /** CR 8.5.29 / MON: hero's soul - public zone of charged cards. */
  | "soul"
  /** CR 4.1.6 inventory - private sideboard of equipment/tomes. */
  | "inventory"
  /** Cards materially placed under a permanent (Evo transform, Nitro Mechanoid). */
  | "under";

export const FAB_ZONE_KINDS = [
  "deck",
  "hand",
  "graveyard",
  "banished",
  "arsenal",
  "pitch",
  "combatChain",
  "stack",
  "arena",
  "head",
  "chest",
  "arms",
  "legs",
  "weapon1",
  "weapon2",
  "heroZone",
  "soul",
  "inventory",
  "under",
] as const satisfies readonly FabZoneKind[];

/** Serialized container membership; object APIs validate entries against branded records. */
export type FabZones = Record<FabZoneKind, string[]>;

/**
 * Persisted CR zone ownership. `FabZones` remains a runtime-only transition
 * surface while RDM-005 removes its callers; snapshots persist this shape.
 *
 * Arsenal is represented as independently-addressable slots because CR 3.3
 * permits effects to create additional arsenal zones while each holds at most
 * one card. Inventory is deliberately outside `zones`: CR 4.1.6 says it is
 * a pre-game card pool, not a game zone.
 */
export interface FabArsenalZone {
  readonly id: string;
  readonly cardId: string | null;
}

export interface FabPlayerContainers {
  readonly deck: readonly string[];
  readonly hand: readonly string[];
  readonly graveyard: readonly string[];
  readonly banished: readonly string[];
  readonly pitch: readonly string[];
  readonly arsenalZones: readonly [FabArsenalZone, ...FabArsenalZone[]];
  readonly hero: string | null;
  readonly arms: string | null;
  readonly chest: string | null;
  readonly head: string | null;
  readonly legs: string | null;
  readonly weapons: readonly [string | null, string | null];
  readonly inventory: readonly string[];
}

/** Shared CR containers; controller ownership is resolved from object state. */
export interface FabSharedZones {
  readonly combatChain: readonly string[];
  readonly permanent: readonly string[];
  readonly stack: readonly string[];
  /** Transitional ownership needed to materialize the schema-v6 runtime view. */
  readonly controllerIdByObjectId: Readonly<Record<string, string>>;
}

/** Ordered host-to-subcard relation (hero soul and cards under permanents). */
export type FabSubcardsByHostId = Readonly<Record<string, readonly string[]>>;

export interface FabContainerModel {
  readonly players: Readonly<Record<string, FabPlayerContainers>>;
  readonly shared: FabSharedZones;
  readonly subcardsByHostId: FabSubcardsByHostId;
}

/**
 * Authoritative mutable runtime container index. Container membership belongs
 * to the match, not to player entities; snapshots normalize this operational
 * index into {@link FabContainerModel}.
 */
export interface FabRuntimeContainers {
  zonesByPlayerId: Record<string, FabZones>;
  arsenalZonesByPlayerId: Record<string, [FabArsenalZone, ...FabArsenalZone[]]>;
  /** Sole ordered runtime authority for CR 3.0.14 host membership. */
  subcardsByHostId: Record<string, FabObjectInstanceId[]>;
}

export interface FabRuntimeContainerView {
  readonly zonesByPlayerId: Readonly<
    Record<string, Readonly<Record<FabZoneKind, readonly string[]>>>
  >;
  readonly arsenalZonesByPlayerId: Readonly<
    Record<string, readonly [FabArsenalZone, ...FabArsenalZone[]]>
  >;
  readonly subcardsByHostId: FabSubcardsByHostId;
}

/**
 * Normalizes the match-owned operational index into the persisted container model.
 * The conversion is deliberately strict: a physical card cannot be in two
 * containers, and every shared object retains the controller needed to recover
 * its seat-scoped operational projection.
 */
export function createFabContainerModel(runtime: FabRuntimeContainerView): FabContainerModel {
  const modelPlayers: Record<string, FabPlayerContainers> = {};
  const subcardsByHostId: Record<string, readonly string[]> = {};
  const shared = {
    combatChain: [] as string[],
    permanent: [] as string[],
    stack: [] as string[],
    controllerIdByObjectId: {} as Record<string, string>,
  };
  const membership = new Set<string>();
  const claim = (objectId: string, location: string) => {
    if (membership.has(objectId)) {
      throw new Error(`FAB object ${objectId} appears in more than one container (${location}).`);
    }
    membership.add(objectId);
  };

  for (const [playerId, zones] of Object.entries(runtime.zonesByPlayerId)) {
    const priorArsenalZones = runtime.arsenalZonesByPlayerId[playerId];
    if (!priorArsenalZones) {
      throw new Error(`FAB player ${playerId} is missing its runtime arsenal-slot index.`);
    }
    const arsenalZones = reconcileArsenalZones(playerId, priorArsenalZones, zones.arsenal);
    const hero = zones.heroZone[0] ?? null;
    if (zones.heroZone.length > 1) throw new Error(`FAB player ${playerId} has multiple heroes.`);
    for (const [zone, objectIds] of Object.entries(zones)) {
      if (zone === "soul" || zone === "under") continue;
      if (zone === "combatChain" || zone === "arena" || zone === "stack") {
        const destination = zone === "arena" ? "permanent" : zone;
        for (const objectId of objectIds) {
          // A legacy weapon/ally attack is projected in both its source seat
          // and the combat-chain list. The v7 model stores that relationship
          // through the active attack/proxy, leaving the physical source in
          // its one authoritative container.
          if (
            zone === "combatChain" &&
            Object.values(runtime.zonesByPlayerId).some((candidateZones) =>
              Object.entries(candidateZones).some(
                ([candidateZone, candidateIds]) =>
                  candidateZone !== "combatChain" &&
                  candidateZone !== "arena" &&
                  candidateZone !== "stack" &&
                  candidateZone !== "soul" &&
                  candidateZone !== "under" &&
                  candidateIds.includes(objectId),
              ),
            )
          )
            continue;
          claim(objectId, `${playerId}:${zone}`);
          shared[destination].push(objectId);
          shared.controllerIdByObjectId[objectId] = playerId;
        }
        continue;
      }
      for (const objectId of objectIds) claim(objectId, `${playerId}:${zone}`);
    }
    for (const objectId of zones.soul) claim(objectId, `${playerId}:soul`);
    for (const objectId of zones.under) claim(objectId, `${playerId}:under`);
    // Fixture-only states can omit a hero object. Keep their soul relationship
    // recoverable with a seat-scoped host until normal initialization supplies
    // the physical hero identity.
    if (zones.soul.length > 0) subcardsByHostId[hero ?? `soul:${playerId}`] = [...zones.soul];
    modelPlayers[playerId] = {
      deck: [...zones.deck],
      hand: [...zones.hand],
      graveyard: [...zones.graveyard],
      banished: [...zones.banished],
      pitch: [...zones.pitch],
      arsenalZones,
      hero,
      arms: zones.arms[0] ?? null,
      chest: zones.chest[0] ?? null,
      head: zones.head[0] ?? null,
      legs: zones.legs[0] ?? null,
      weapons: [zones.weapon1[0] ?? null, zones.weapon2[0] ?? null],
      inventory: [...zones.inventory],
    };
  }
  for (const [hostId, objectIds] of Object.entries(runtime.subcardsByHostId))
    subcardsByHostId[hostId] = [...objectIds];
  return { players: modelPlayers, shared, subcardsByHostId };
}

/** Hydrates the match-owned operational index from normalized persisted containers. */
export function createFabRuntimeContainers(model: FabContainerModel): FabRuntimeContainers {
  const zonesByPlayerId: Record<string, FabZones> = {};
  const arsenalZonesByPlayerId: Record<string, readonly [FabArsenalZone, ...FabArsenalZone[]]> = {};
  const subcardsByHostId: Record<string, FabObjectInstanceId[]> = {};
  for (const [playerId, containers] of Object.entries(model.players)) {
    const zones = createEmptyFabZones();
    zones.deck = [...containers.deck];
    zones.hand = [...containers.hand];
    zones.graveyard = [...containers.graveyard];
    zones.banished = [...containers.banished];
    zones.pitch = [...containers.pitch];
    zones.arsenal = containers.arsenalZones.flatMap((slot) => (slot.cardId ? [slot.cardId] : []));
    zones.heroZone = containers.hero ? [containers.hero] : [];
    zones.arms = containers.arms ? [containers.arms] : [];
    zones.chest = containers.chest ? [containers.chest] : [];
    zones.head = containers.head ? [containers.head] : [];
    zones.legs = containers.legs ? [containers.legs] : [];
    zones.weapon1 = containers.weapons[0] ? [containers.weapons[0]] : [];
    zones.weapon2 = containers.weapons[1] ? [containers.weapons[1]] : [];
    zones.inventory = [...containers.inventory];
    zones.soul = [
      ...(containers.hero ? (model.subcardsByHostId[containers.hero] ?? []) : []),
      ...(model.subcardsByHostId[`soul:${playerId}`] ?? []),
    ];
    zonesByPlayerId[playerId] = zones;
    arsenalZonesByPlayerId[playerId] = containers.arsenalZones.map((slot) => ({ ...slot })) as [
      FabArsenalZone,
      ...FabArsenalZone[],
    ];
  }
  for (const [zone, objectIds] of [
    ["combatChain", model.shared.combatChain],
    ["arena", model.shared.permanent],
    ["stack", model.shared.stack],
  ] as const) {
    for (const objectId of objectIds) {
      const controllerId = model.shared.controllerIdByObjectId[objectId];
      const zones = controllerId ? zonesByPlayerId[controllerId] : undefined;
      if (!zones)
        throw new Error(`FAB shared container object ${objectId} has no seated controller.`);
      zones[zone].push(objectId);
    }
  }
  for (const [hostId, objectIds] of Object.entries(model.subcardsByHostId)) {
    subcardsByHostId[hostId] = objectIds.map(fabObjectInstanceId);
    const syntheticSoulOwner = hostId.startsWith("soul:") ? hostId.slice("soul:".length) : null;
    if (syntheticSoulOwner && model.players[syntheticSoulOwner]) continue;
    const heroOwner = Object.entries(model.players).find(
      ([, player]) => player.hero === hostId,
    )?.[0];
    if (heroOwner) continue;
    const seatedHostOwner = Object.entries(model.players).find(([, player]) =>
      [
        player.arms,
        player.chest,
        player.head,
        player.legs,
        ...player.weapons,
        ...player.inventory,
      ].includes(hostId),
    )?.[0];
    for (const objectId of objectIds) {
      const controllerId = seatedHostOwner ?? model.shared.controllerIdByObjectId[hostId];
      if (!controllerId && !hostId.startsWith("soul:"))
        throw new Error(`FAB hosted card ${objectId} has no seated top-card controller.`);
    }
  }
  return {
    zonesByPlayerId,
    arsenalZonesByPlayerId: arsenalZonesByPlayerId as Record<
      string,
      [FabArsenalZone, ...FabArsenalZone[]]
    >,
    subcardsByHostId,
  };
}

function reconcileArsenalZones(
  playerId: string,
  priorSlots: readonly [FabArsenalZone, ...FabArsenalZone[]],
  currentCardIds: readonly string[],
): readonly [FabArsenalZone, ...FabArsenalZone[]] {
  const unassigned = new Set(currentCardIds);
  const slots = priorSlots.map((slot) => {
    if (slot.cardId && unassigned.delete(slot.cardId)) return { ...slot };
    return { id: slot.id, cardId: null };
  });
  let nextOrdinal = slots.length;
  for (const cardId of currentCardIds) {
    if (!unassigned.delete(cardId)) continue;
    const emptyIndex = slots.findIndex((slot) => slot.cardId === null);
    if (emptyIndex >= 0) {
      slots[emptyIndex] = { ...slots[emptyIndex]!, cardId };
      continue;
    }
    let id = `arsenal:${playerId}:${nextOrdinal++}`;
    const arsenalIdGuard = createFabLoopGuard({ label: "zones: unique arsenal slot id" });
    while (slots.some((slot) => slot.id === id)) {
      arsenalIdGuard.tick();
      id = `arsenal:${playerId}:${nextOrdinal++}`;
    }
    slots.push({ id, cardId });
  }
  return slots as [FabArsenalZone, ...FabArsenalZone[]];
}

export interface FabZoneRef {
  readonly playerId: FabPlayerId | null;
  readonly zone: FabZoneKind;
}

export function createEmptyFabZones(): FabZones {
  return {
    deck: [],
    hand: [],
    graveyard: [],
    banished: [],
    arsenal: [],
    pitch: [],
    combatChain: [],
    stack: [],
    arena: [],
    head: [],
    chest: [],
    arms: [],
    legs: [],
    weapon1: [],
    weapon2: [],
    heroZone: [],
    soul: [],
    inventory: [],
    under: [],
  };
}
