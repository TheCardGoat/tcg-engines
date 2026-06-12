import type { MatchState } from "../types/match-state.ts";
import type { MoveDefinition, MoveInput } from "../types/commands.ts";
import type { Operations } from "../operations/index.ts";
import { allowedGainGigDice, readySpentCards } from "./gain-gig.ts";

export interface KeepHandInput extends MoveInput {
  args: Record<string, never>;
}

/**
 * "I'm done with my mulligan decision, no thanks." Setup-phase counterpart to
 * {@link mulliganMove}: marks the player as having decided without reshuffling
 * their opening hand. When both players have either kept or mulliganed, the
 * engine auto-advances to the start phase.
 */
export const keepHandMove: MoveDefinition<KeepHandInput> = {
  available({ state, playerId }) {
    if (state.G.gamePhase !== "setup") return false;
    const player = state.G.players[playerId as string];
    if (!player) return false;
    return !player.mulliganDone;
  },

  validate({ state, playerId }) {
    if (state.G.gamePhase !== "setup") {
      return { valid: false, error: "Not in setup phase", errorCode: "WRONG_PHASE" };
    }
    const player = state.G.players[playerId as string];
    if (!player) {
      return { valid: false, error: "Player not found", errorCode: "PLAYER_NOT_FOUND" };
    }
    if (player.mulliganDone) {
      return { valid: false, error: "Already decided", errorCode: "ALREADY_DECIDED" };
    }
    return { valid: true };
  },

  execute({ state, playerId, operations }) {
    const player = state.G.players[playerId as string];
    if (!player) return;

    player.mulliganDone = true;

    operations.log.emit({
      type: "keepHand",
      playerId,
      timestamp: Date.now(),
      turnNumber: state.G.turnMetadata.turnNumber,
    });

    advanceIfBothDecided(state, operations);
  },
};

/**
 * If every player has now resolved their mulligan decision (either took the
 * mulligan or kept), close the setup window and begin the first player's
 * turn 1.
 */
export function advanceIfBothDecided(state: MatchState, operations: Operations): void {
  if (state.G.gamePhase !== "setup") return;
  const allDecided = state.ctx.playerIds.every(
    (pid) => state.G.players[pid as string]?.mulliganDone === true,
  );
  if (allDecided) {
    enterStartPhase(state, operations);
  }
}

/**
 * Transition setup → start and begin the first player's start phase.
 *
 * Per the Beta rules, every turn begins with:
 *   1. Ready your spent Units, Legends, and Eddies.
 *   2. Draw a card.
 *   3. Gain a Gig (player choice — see {@link gainGigMove}).
 *
 * Step 1 fires immediately (skipped on turn 1 since the first player begins
 * with two Legends spent as a setup handicap). Step 2 draws immediately.
 * Step 3 sets a `gainGig` pending choice that the active player resolves with
 * the {@link gainGigMove}.
 */
export function enterStartPhase(state: MatchState, operations: Operations): void {
  const firstPlayerId = state.ctx.playerIds.find(
    (pid) => state.G.players[pid as string]?.firstPlayer === true,
  );
  if (!firstPlayerId) {
    operations.game.setPhase("main");
    return;
  }

  operations.game.setPhase("start");

  // Step 1: READY SPENT CARDS (skipped on first player's turn 1).
  const turnNumber = state.G.turnMetadata.turnNumber;
  if (turnNumber !== 1) {
    readySpentCards(state, operations, firstPlayerId);
  }

  // Step 2: DRAW A CARD.
  operations.zone.drawCards(firstPlayerId, 1);
  if (state.G.gameEnded) {
    return;
  }

  // Step 3: GAIN A GIG — open a pending choice for the active player.
  const allowedDieIds = allowedGainGigDice(state, firstPlayerId as string);
  if (allowedDieIds.length > 0) {
    operations.game.setPendingChoice({
      type: "gainGig",
      chooserId: firstPlayerId,
      effectId: "start-phase",
      payload: { allowedDieIds },
    });
    return;
  }

  operations.game.setPhase("main");
}
