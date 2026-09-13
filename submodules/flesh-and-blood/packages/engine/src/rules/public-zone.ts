/**
 * CR 3.0.4a zone visibility classification, promoted to rules scope so proposal
 * code (e.g. search 8.5.19a/b) can reason about whether a card is public to
 * both seated players.
 *
 * Public zones (visible to both players): combat chain, stack, arena, pitch,
 * graveyard, banished, equipment seats, weapon slots, hero zone. Private zones
 * (visible only to their owner): hand, deck, arsenal, inventory. (soul/under
 * are scoped to their owner for referencing.)
 */
import type { FabZone } from "@tcg/flesh-and-blood-types";

export const FAB_PUBLIC_ZONES: readonly FabZone[] = [
  "combat-chain",
  "stack",
  "permanent",
  "pitch",
  "graveyard",
  "banished",
  "equipment-head",
  "equipment-chest",
  "equipment-arms",
  "equipment-legs",
  "weapon",
  "hero",
];

export function isFabZonePublic(zone: FabZone | "arena" | "unknown"): boolean {
  if (zone === "arena") return true;
  if (zone === "unknown") return false;
  return FAB_PUBLIC_ZONES.includes(zone);
}
