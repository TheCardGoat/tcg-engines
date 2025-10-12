import type { PlayerId } from "../types";

/**
 * Game Operations
 *
 * Provides controlled access to game-level internal state:
 * - OTP (On The Play): The player who goes first
 * - Pending Mulligan: Players who need to decide on mulligan
 *
 * These are universal TCG concepts that apply across all card games.
 */
export type GameOperations = {
  /**
   * Set the player who is "on the play" (goes first)
   *
   * This is a universal TCG concept. The player marked as OTP
   * typically goes first and may have different rules apply
   * (e.g., no card draw on first turn in some games).
   *
   * @param playerId - Player to mark as on the play
   *
   * @example
   * ```typescript
   * // In a choose first player move:
   * context.game.setOTP('player-1');
   * ```
   */
  setOTP(playerId: PlayerId): void;

  /**
   * Get the player who is on the play
   *
   * @returns Player ID of OTP, or undefined if not yet set
   *
   * @example
   * ```typescript
   * const firstPlayer = context.game.getOTP();
   * if (firstPlayer === context.playerId) {
   *   // Current player goes first
   * }
   * ```
   */
  getOTP(): PlayerId | undefined;

  /**
   * Set the list of players who need to decide on mulligan
   *
   * Replaces the entire pending mulligan list.
   * Typically called during game setup to initialize the list.
   *
   * @param playerIds - Array of player IDs pending mulligan
   *
   * @example
   * ```typescript
   * // After choosing first player, all players can mulligan:
   * context.game.setPendingMulligan(['player-1', 'player-2']);
   * ```
   */
  setPendingMulligan(playerIds: PlayerId[]): void;

  /**
   * Get the list of players pending mulligan
   *
   * @returns Array of player IDs (copy to prevent mutation)
   *
   * @example
   * ```typescript
   * const pending = context.game.getPendingMulligan();
   * if (pending.includes(context.playerId)) {
   *   // Current player can still mulligan
   * }
   * ```
   */
  getPendingMulligan(): PlayerId[];

  /**
   * Add a player to the pending mulligan list
   *
   * Use this to mark a player as needing to decide on mulligan.
   * Has no effect if player is already in the list.
   *
   * @param playerId - Player to add to mulligan list
   *
   * @example
   * ```typescript
   * // Allow a player to mulligan again (game-specific rule):
   * context.game.addPendingMulligan('player-1');
   * ```
   */
  addPendingMulligan(playerId: PlayerId): void;

  /**
   * Remove a player from the pending mulligan list
   *
   * Use this when a player completes their mulligan decision.
   * Has no effect if player is not in the list.
   *
   * @param playerId - Player to remove from mulligan list
   *
   * @example
   * ```typescript
   * // After player decides to keep or mulligan:
   * context.game.removePendingMulligan(context.playerId);
   * ```
   */
  removePendingMulligan(playerId: PlayerId): void;
};
