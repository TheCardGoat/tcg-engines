import type { AnimationAnchorRef, AnimationPlayerRef, AnimationZoneRef } from "@tcg/protocol";

export type FabAnimationValueKind = "life" | "resource" | "chi" | "action" | "amp";

export function fabAnimationPlayerRef(playerId: string): AnimationPlayerRef {
  return { kind: "player", id: playerId };
}

export function fabAnimationValueAnchorRef(
  playerId: string,
  value: FabAnimationValueKind,
): AnimationAnchorRef {
  return { kind: "anchor", id: `fab:${playerId}:${value}` };
}

export function fabAnimationDefenseAnchorRef(playerId: string): AnimationAnchorRef {
  return { kind: "anchor", id: `fab:${playerId}:defense` };
}

export function fabAnimationZoneRef(
  playerId: string,
  zone: string,
  equipmentSlot?: "weapon1" | "weapon2",
): AnimationZoneRef | null {
  const normalized = normalizeFabAnimationZone(zone, equipmentSlot);
  return normalized ? { kind: "zone", id: `${playerId}:${normalized}`, ownerId: playerId } : null;
}

function normalizeFabAnimationZone(
  zone: string,
  equipmentSlot?: "weapon1" | "weapon2",
): string | null {
  switch (zone) {
    case "hand":
    case "deck":
    case "graveyard":
    case "banished":
    case "pitch":
    case "arsenal":
    case "soul":
    case "inventory":
    case "stack":
    case "permanent":
    case "under":
    case "head":
    case "chest":
    case "arms":
    case "legs":
    case "weapon1":
    case "weapon2":
      return zone;
    case "combat-chain":
    case "combatChain":
      return "combat-chain";
    case "hero":
    case "heroZone":
      return "hero";
    case "weapon":
      return equipmentSlot ?? "weapon1";
    case "equipment-head":
      return "head";
    case "equipment-chest":
      return "chest";
    case "equipment-arms":
      return "arms";
    case "equipment-legs":
      return "legs";
    case "arena":
      return "permanent";
    case "unknown":
    case "event-deck":
      return null;
    default:
      return null;
  }
}

export function fabAnimationZoneFace(zone: string): "public" | "hidden" {
  switch (zone) {
    case "hand":
    case "deck":
    case "arsenal":
    case "inventory":
      return "hidden";
    default:
      return "public";
  }
}
