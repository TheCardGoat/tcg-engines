import type { CardZone } from "@tcg/cyberpunk-types";
import type { ZoneConfig as UnifiedZoneConfig, ZoneVisibility } from "@tcg/engine-core";

export type { ZoneVisibility };

/**
 * Cyberpunk-specific zone configuration.
 * Extends the engine-core base so cross-engine tooling can reason about
 * zones generically, while keeping the `id` narrowed to Cyberpunk's `CardZone`.
 */
export interface ZoneConfig extends UnifiedZoneConfig<CardZone> {}

export const ZONE_CONFIGS: Record<CardZone, ZoneConfig> = {
  field: {
    id: "field",
    name: "Field",
    visibility: "public",
    ordered: false,
    ownerScoped: true,
  },
  hand: {
    id: "hand",
    name: "Hand",
    visibility: "private",
    ordered: false,
    ownerScoped: true,
  },
  deck: {
    id: "deck",
    name: "Deck",
    visibility: "secret",
    ordered: true,
    ownerScoped: true,
  },
  trash: {
    id: "trash",
    name: "Trash",
    visibility: "public",
    ordered: false,
    ownerScoped: true,
  },
  legendArea: {
    id: "legendArea",
    name: "Legend Area",
    visibility: "public",
    ordered: false,
    ownerScoped: true,
  },
  gigArea: {
    id: "gigArea",
    name: "Gig Area",
    visibility: "public",
    ordered: false,
    ownerScoped: true,
  },
  eddieArea: {
    id: "eddieArea",
    name: "Eddie Area",
    visibility: "public",
    ordered: false,
    ownerScoped: true,
  },
};

export const PLAYER_ZONES: CardZone[] = [
  "field",
  "hand",
  "deck",
  "trash",
  "legendArea",
  "eddieArea",
];

export function isCardZone(zone: string): zone is CardZone {
  return zone in ZONE_CONFIGS;
}
