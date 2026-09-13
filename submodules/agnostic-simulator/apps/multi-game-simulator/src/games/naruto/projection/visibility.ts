import type { PlayerId } from "@tcg-engines/naruto-engine";

export type NarutoHiddenZone = "chakra" | "hand" | "support";

/**
 * Stable only for one viewer and one projected zone position. The identifier
 * deliberately has no relationship to the engine uid: Naruto engine uids
 * contain the card id and therefore cannot cross a hidden-information
 * boundary, even when the visible fields are otherwise masked.
 */
export function hiddenProjectionId(
  viewer: PlayerId,
  owner: PlayerId,
  zone: NarutoHiddenZone,
  position: number,
): string {
  return `hidden:${viewer}:${owner}:${zone}:${position}`;
}
