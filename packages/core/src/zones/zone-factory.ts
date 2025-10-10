import type { CardId } from "../types";
import type { CardZoneConfig, Zone, ZoneVisibility } from "./zone";

const VALID_VISIBILITIES: ZoneVisibility[] = ["public", "private", "secret"];

/**
 * Creates a new zone with the given configuration
 * @param config - Zone configuration
 * @param initialCards - Optional initial cards for the zone
 * @returns A new Zone instance
 * @throws Error if configuration is invalid or initial cards exceed maxSize
 */
export function createZone(
  config: CardZoneConfig,
  initialCards: CardId[] = [],
): Zone {
  // Validate required fields
  if (!config.id) {
    throw new Error("Zone configuration must include an id");
  }

  if (!config.name) {
    throw new Error("Zone configuration must include a name");
  }

  // Validate visibility
  if (!VALID_VISIBILITIES.includes(config.visibility)) {
    throw new Error(
      'Invalid visibility: must be "public", "private", or "secret"',
    );
  }

  // Validate maxSize constraint
  if (config.maxSize !== undefined && initialCards.length > config.maxSize) {
    throw new Error(
      `Cannot create zone: initial cards (${initialCards.length}) exceed maxSize (${config.maxSize})`,
    );
  }

  return {
    config,
    cards: [...initialCards],
  };
}
