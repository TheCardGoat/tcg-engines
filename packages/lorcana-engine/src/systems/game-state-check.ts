/**
 * Game State Check (Rule 1.9)
 *
 * Game state check happens:
 * - After every action
 * - After every ability resolves
 * - After each bag entry resolves
 *
 * Checks (in order):
 * 1. Win conditions (20+ lore)
 * 2. Loss conditions (deck out, concede)
 * 3. Damage vs willpower (banishment)
 */

import { getWillpower } from "../card-utils";
import { LORE_TO_WIN } from "../flow/turn-types";
import type { LorcanaCardDefinition } from "../types/card-types";
import type { CardId, PlayerId } from "../types/game-state";
import type { CardInstanceState } from "../zones/card-state";
import type {
  BagEntry,
  GameEndReason,
  GameEndState,
  GameStateCheckResult,
  LossCondition,
  RequiredAction,
  WinCondition,
} from "./system-types";

/**
 * Check for win conditions (20+ lore)
 */
export function checkWinConditions(
  players: PlayerId[],
  loreScores: Record<PlayerId, number>,
): WinCondition[] {
  const winners: WinCondition[] = [];

  for (const playerId of players) {
    const lore = loreScores[playerId] ?? 0;
    if (lore >= LORE_TO_WIN) {
      winners.push({
        playerId,
        reason: "lore_victory",
        lore,
      });
    }
  }

  return winners;
}

/**
 * Check for loss conditions
 */
export function checkLossConditions(
  players: PlayerId[],
  deckSizes: Record<PlayerId, number>,
  pendingDraws: Record<PlayerId, number>,
  concededPlayers: PlayerId[],
): LossCondition[] {
  const losers: LossCondition[] = [];

  // Check for deck out (trying to draw from empty deck)
  for (const playerId of players) {
    const deckSize = deckSizes[playerId] ?? 0;
    const pendingDraw = pendingDraws[playerId] ?? 0;

    // Only lose if you need to draw but can't
    if (pendingDraw > 0 && deckSize < pendingDraw) {
      losers.push({
        playerId,
        reason: "deck_out",
      });
    }
  }

  // Check for concedes
  for (const playerId of concededPlayers) {
    if (!losers.some((l) => l.playerId === playerId)) {
      losers.push({
        playerId,
        reason: "concede",
      });
    }
  }

  return losers;
}

/**
 * Check for cards that should be banished (damage >= willpower)
 */
export function getCardsExceedingWillpower(
  cards: Array<{
    cardId: CardId;
    card: LorcanaCardDefinition;
    state: CardInstanceState;
  }>,
): RequiredAction[] {
  const actions: RequiredAction[] = [];

  for (const { cardId, card, state } of cards) {
    const willpower = getWillpower(card);
    if (state.damage >= willpower) {
      actions.push({
        type: "banish",
        cardId,
        reason: "damage_exceeds_willpower",
      });
    }
  }

  return actions;
}

/**
 * Check if a specific card should be banished
 */
export function shouldBanish(
  card: LorcanaCardDefinition,
  state: CardInstanceState,
): boolean {
  const willpower = getWillpower(card);
  return state.damage >= willpower;
}

/**
 * Perform a complete game state check
 */
export function performGameStateCheck(
  players: PlayerId[],
  loreScores: Record<PlayerId, number>,
  deckSizes: Record<PlayerId, number>,
  pendingDraws: Record<PlayerId, number>,
  concededPlayers: PlayerId[],
  cardsInPlay: Array<{
    cardId: CardId;
    card: LorcanaCardDefinition;
    state: CardInstanceState;
  }>,
): GameStateCheckResult {
  // Check win conditions first (Rule 1.9.2)
  const winConditions = checkWinConditions(players, loreScores);

  // Check loss conditions
  const lossConditions = checkLossConditions(
    players,
    deckSizes,
    pendingDraws,
    concededPlayers,
  );

  // Check damage vs willpower (Rule 1.9.3)
  const requiredActions = getCardsExceedingWillpower(cardsInPlay);

  return {
    winConditions,
    lossConditions,
    requiredActions,
    newTriggers: [], // Triggers added during processing
  };
}

/**
 * Determine the game end state from check results
 */
export function determineGameEnd(
  result: GameStateCheckResult,
  players: PlayerId[],
): GameEndState {
  // Win takes priority over loss (Rule 1.9.x)
  if (result.winConditions.length > 0) {
    // If both players reach 20 lore simultaneously, active player wins
    const winner = result.winConditions[0];
    const loser = players.find((p) => p !== winner.playerId);

    return {
      isOver: true,
      winner: winner.playerId,
      loser,
      reason: {
        type: "LORE_VICTORY",
        playerId: winner.playerId,
        lore: winner.lore,
      },
    };
  }

  if (result.lossConditions.length > 0) {
    const loser = result.lossConditions[0];
    const winner = players.find((p) => p !== loser.playerId);

    const reason: GameEndReason =
      loser.reason === "deck_out"
        ? { type: "DECK_OUT", playerId: loser.playerId }
        : { type: "CONCEDE", playerId: loser.playerId };

    return {
      isOver: true,
      winner,
      loser: loser.playerId,
      reason,
    };
  }

  return { isOver: false };
}

/**
 * Check if game needs a state check
 */
export function needsGameStateCheck(
  hasUnresolvedActions: boolean,
  bagHasEntries: boolean,
): boolean {
  // State check happens after every action and ability
  // but only if there's nothing currently resolving
  return !(hasUnresolvedActions || bagHasEntries);
}

/**
 * Get the winner if game is over
 */
export function getWinner(endState: GameEndState): PlayerId | null {
  return endState.winner ?? null;
}

/**
 * Get the loser if game is over
 */
export function getLoser(endState: GameEndState): PlayerId | null {
  return endState.loser ?? null;
}

/**
 * Check if game is over
 */
export function isGameOver(endState: GameEndState): boolean {
  return endState.isOver;
}
