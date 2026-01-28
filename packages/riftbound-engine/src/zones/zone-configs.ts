/**
 * Riftbound Zone Configurations
 *
 * Defines the zones used in Riftbound.
 */

/**
 * Zone type identifier
 */
export type ZoneType = "hand" | "deck" | "field" | "discard" | "exile";

/**
 * Zone configuration
 */
export interface ZoneConfig {
  readonly type: ZoneType;
  readonly name: string;
  readonly isPublic: boolean;
  readonly isOrdered: boolean;
  readonly maxSize?: number;
}

/**
 * Zone configurations for Riftbound
 */
export const ZONE_CONFIGS: Record<ZoneType, ZoneConfig> = {
  hand: {
    type: "hand",
    name: "Hand",
    isPublic: false,
    isOrdered: true,
    maxSize: undefined, // No limit by default
  },
  deck: {
    type: "deck",
    name: "Deck",
    isPublic: false,
    isOrdered: true,
  },
  field: {
    type: "field",
    name: "Field",
    isPublic: true,
    isOrdered: false,
  },
  discard: {
    type: "discard",
    name: "Discard Pile",
    isPublic: true,
    isOrdered: true,
  },
  exile: {
    type: "exile",
    name: "Exile",
    isPublic: true,
    isOrdered: false,
  },
} as const;

/**
 * Get zone configuration by type
 *
 * @param zoneType - The zone type
 * @returns Zone configuration
 */
export function getZoneConfig(zoneType: ZoneType): ZoneConfig {
  return ZONE_CONFIGS[zoneType];
}

/**
 * Check if a zone is public (visible to all players)
 *
 * @param zoneType - The zone type
 * @returns true if the zone is public
 */
export function isPublicZone(zoneType: ZoneType): boolean {
  return ZONE_CONFIGS[zoneType].isPublic;
}
