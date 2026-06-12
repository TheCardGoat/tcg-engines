/**
 * Games that have protocol-level gateway support.
 *
 * This package owns the slug contract because the gateway and wire protocol
 * need it without depending on server-side game adapter registration.
 */

/** Default nanoid length used for single-use WebSocket tickets. */
export const WS_TICKET_NANOID_LENGTH = 21;

export type PlayableGameSlug =
  | "lorcana"
  | "gundam"
  | "cyberpunk"
  | "riftbound"
  | "one-piece"
  | "platform";

export const PLAYABLE_GAME_SLUGS = [
  "lorcana",
  "gundam",
  "cyberpunk",
  "riftbound",
  "one-piece",
  "platform",
] as const satisfies readonly PlayableGameSlug[];

export function isPlayableGameSlug(value: unknown): value is PlayableGameSlug {
  return typeof value === "string" && (PLAYABLE_GAME_SLUGS as readonly string[]).includes(value);
}
