/**
 * Brandless string aliases used across the page-layer contract. Every id is
 * opaque — the page layer never parses them, never decodes meaning out of
 * them, and never compares formats. Each deployable owns its id format.
 */

/**
 * Game slug carried in self-identifying payloads (replay files, server WS
 * messages). NOT a router — the reverse proxy is responsible for sending a
 * request to the right deployable. This field exists so a partner client can
 * fail loudly if it ends up talking to the wrong backend.
 */
export type GameType = "lorcana" | "gundam" | "cyberpunk" | "riftbound";

export type MatchId = string;
export type GameId = string;
export type PlayerId = string;

/** A card instance inside a single game. Distinct from `PublicCardId`. */
export type InstanceId = string;

/** A card *definition* id — set/number/slug, format is per-game. */
export type PublicCardId = string;

/** Move name. The contract treats this as opaque; engines validate legality. */
export type MoveId = string;
