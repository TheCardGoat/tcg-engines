/**
 * Game State Check (GSC)
 *
 * Implements Lorcana Comprehensive Rules §1.8
 *
 * The game checks for the listed conditions at the end of every step of the
 * Start-of-Turn Phase, after the Challenge Declaration and Challenge Damage
 * steps, after every turn action is completed, after any effect resolves, and
 * when the turn ends (§1.8.1).
 *
 * Conditions (§1.8.1):
 *   1.8.1.1 — If a player has 20 or more lore, that player wins the game.
 *   1.8.1.2 — If a player's turn ends with no cards in their deck, that player
 *              loses the game.
 *   1.8.1.4 — If a character or location has damage equal to or greater than
 *              its effective Willpower {W}, that character or location is
 *              banished.
 *
 * Iteration (§1.8.3):
 *   After a game state check is completed, the game state check immediately
 *   occurs again. If no conditions are met, triggered abilities in the bag are
 *   resolved. GSC then runs once more; only when it finds nothing do abilities
 *   finish and the game continues.
 *
 * Multiple conditions (§1.8.4):
 *   Multiple conditions for a single player resolve simultaneously within one
 *   GSC. Multiple conditions across players resolve in turn order.
 *
 * Triggered abilities (§1.8.2):
 *   Triggered abilities added to the bag during GSC won't resolve until after
 *   all GSC passes complete.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * Call sites
 * ─────────────────────────────────────────────────────────────────────────────
 *   • `runGameStateCheck`       — after damage is applied or aura sources leave
 *                                  play (delegates to sweepLethalDamageInPlay)
 *   • `checkLoreWinCondition`   — called from the flow endIf hook after every
 *                                  move
 *   • `checkDeckEmptyForPlayer` — called at turn end in passTurn
 */

import type { CardInstanceId, PlayerId } from "#core";
import type { LorcanaG } from "../../types";
import { sweepLethalDamageInPlay } from "./lethal-damage-sweep";
import type { PlayCardExecutionContext } from "../resolution/action-effects/types";

/** Minimum context required to run the lethal-damage portion of GSC. */
export type GameStateCheckCtx = Pick<
  PlayCardExecutionContext,
  "G" | "playerId" | "framework" | "cards"
>;

/** Minimum context required to check deck emptiness. */
type DeckCheckCtx = {
  framework: {
    zones: {
      getCards: (args: { zone: string; playerId: PlayerId }) => unknown[];
    };
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// §1.8.1.4 — Lethal-damage banishment
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Run the state-based lethal-damage portion of GSC (§1.8.1.4).
 *
 * Banishes every character/location whose current damage is greater than or
 * equal to its **effective** Willpower (printed + static modifiers). Repeats
 * until the board is stable, then flushes queued triggered events to the bag
 * after each pass so they can be resolved once all conditions clear (§1.8.2).
 *
 * Should be called:
 *   1. After any effect that applies damage to characters or locations.
 *   2. After any effect that removes aura sources from play (which may lower
 *      effective Willpower of cards that already have damage on them).
 *
 * @param options.reasonCardId — The card whose ability caused the board change,
 *   used to attribute the banish to the correct source (§1.8.1.4 attribution).
 */
export function runGameStateCheck(
  ctx: GameStateCheckCtx,
  options: { reasonCardId?: CardInstanceId } = {},
): void {
  sweepLethalDamageInPlay(ctx, options);
}

// ─────────────────────────────────────────────────────────────────────────────
// §1.8.1.1 — Lore win condition
// ─────────────────────────────────────────────────────────────────────────────

/** Default lore required to win (§1.8.1.1). */
export const DEFAULT_LORE_TO_WIN = 20;

/**
 * Check whether any player has reached the lore threshold required to win
 * (§1.8.1.1).
 *
 * The threshold is normally {@link DEFAULT_LORE_TO_WIN} (20) but may be raised
 * per-player by win-condition-modification static abilities (e.g. Donald Duck –
 * Flustered Sorcerer). Modified thresholds are stored in `G.loreToWin`.
 *
 * Returns `{ winner, loreToWin }` for the first player whose lore meets the
 * threshold, or `undefined` if no player has won yet.
 */
export function checkLoreWinCondition(
  G: Pick<LorcanaG, "lore" | "loreToWin">,
): { winner: PlayerId; loreToWin: number } | undefined {
  for (const [playerId, lore] of Object.entries(G.lore)) {
    const loreToWin = G.loreToWin?.[playerId as PlayerId] ?? DEFAULT_LORE_TO_WIN;
    if (lore >= loreToWin) {
      return { winner: playerId as PlayerId, loreToWin };
    }
  }
  return undefined;
}

// ─────────────────────────────────────────────────────────────────────────────
// §1.8.1.2 — Deck-empty loss condition
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check whether a player has no cards remaining in their deck (§1.8.1.2).
 *
 * A player loses the game if their turn ends with no cards in their deck.
 * Called from passTurn before the turn-transition state machine begins.
 */
export function checkDeckEmptyForPlayer(ctx: DeckCheckCtx, playerId: PlayerId): boolean {
  const deckCards = ctx.framework.zones.getCards({ zone: "deck", playerId });
  return deckCards.length === 0;
}
