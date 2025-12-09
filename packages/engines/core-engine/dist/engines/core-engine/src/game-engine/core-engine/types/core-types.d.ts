/**
 * Core type definitions for the TCG engine.
 *
 * This file contains the canonical definitions for all fundamental types
 * used throughout the core engine. All other files should import these
 * types rather than defining their own versions.
 */
/**
 * Unique identifier for a player in the game.
 * Used to distinguish between different players in multiplayer games.
 */
export type PlayerID = string;
/**
 * Unique identifier for a card instance in the game.
 * Each physical card in play has a unique instance ID that persists
 * throughout the game, even when the card moves between zones.
 */
export type InstanceId = string;
/**
 * Public identifier for a card that can be safely shared with clients.
 * This is typically used for card definitions and public game state.
 */
export type PublicId = string;
/**
 * Unique identifier for a zone in the game.
 * Zones are areas where cards can be placed (hand, deck, battlefield, etc.).
 */
export type ZoneId = string;
/**
 * @deprecated Use PlayerID instead
 * Legacy alias for PlayerID to maintain backward compatibility.
 */
export type PlayerId = PlayerID;
/**
 * @deprecated Use InstanceId instead
 * Legacy alias for card instance identifiers to maintain backward compatibility.
 */
export type CardInstanceID = InstanceId;
//# sourceMappingURL=core-types.d.ts.map