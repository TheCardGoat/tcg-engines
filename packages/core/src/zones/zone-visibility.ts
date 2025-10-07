import type { PlayerId } from "../types";
import type { Zone } from "./zone";

/**
 * Filters a zone based on visibility rules and the viewing player
 * @param zone - Zone to filter
 * @param viewerId - ID of the player viewing the zone
 * @returns Filtered zone with appropriate cards visible
 */
export function filterZoneByVisibility(zone: Zone, viewerId: PlayerId): Zone {
  // Public zones: everyone sees everything
  if (zone.config.visibility === "public") {
    return zone;
  }

  // Private zones: owner sees everything, others see nothing
  if (zone.config.visibility === "private") {
    if (zone.config.owner === viewerId) {
      return zone;
    }
    // Non-owner sees config but no cards
    return {
      ...zone,
      cards: [],
    };
  }

  // Secret zones: no one sees card details
  if (zone.config.visibility === "secret") {
    return {
      ...zone,
      cards: [],
    };
  }

  return zone;
}
