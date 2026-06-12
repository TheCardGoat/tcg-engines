import type { MatchState } from "../types/match-state.ts";
import type { GigDieId } from "../types/branded.ts";
import type { MoveDefinition, MoveInput } from "../types/commands.ts";
import type { Operations } from "../operations/index.ts";
import { SeededRNG } from "../state/rng.ts";

export interface GainGigInput extends MoveInput {
  args: {
    dieId: string;
  };
}

/**
 * Resolves the `gainGig` pending choice — step 3 of the ready phase: "Take a
 * die from your fixer area, roll to set its value, then place it in your Gig
 * area. You can choose any die except the d20, which must always be taken
 * last." (cyberpunktcg.com/gameplay-guide)
 */
export const gainGigMove: MoveDefinition<GainGigInput> = {
  handlesPendingChoice: true,

  available({ state, playerId }) {
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "gainGig") return false;
    return choice.chooserId === playerId;
  },

  validate({ state, playerId, input }) {
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "gainGig") {
      return {
        valid: false,
        error: "No gain-gig choice is pending",
        errorCode: "NO_PENDING_CHOICE",
      };
    }
    if (choice.chooserId !== playerId) {
      return { valid: false, error: "Not your gain-gig choice", errorCode: "WRONG_CHOOSER" };
    }
    const dieId = input.args.dieId as GigDieId;
    if (!choice.payload.allowedDieIds.includes(dieId)) {
      return { valid: false, error: "Die not allowed", errorCode: "DIE_NOT_ALLOWED" };
    }
    const die = state.G.gigDice[dieId as string];
    if (!die) {
      return { valid: false, error: "Die not found", errorCode: "DIE_NOT_FOUND" };
    }
    return { valid: true };
  },

  execute({ state, playerId, input, operations }) {
    const dieId = input.args.dieId as GigDieId;

    const rng = new SeededRNG(state.ctx.seed);
    if (state.ctx.rngState) rng.setState(state.ctx.rngState);
    operations.gig.takeFromFixer(playerId, dieId, (dieType) => rng.rollDie(dieType));
    state.ctx.rngState = rng.getState();
    state.G.turnMetadata.gigTakenThisTurn = true;

    const die = state.G.gigDice[dieId as string];
    operations.game.setPendingChoice(undefined);

    operations.log.emit({
      type: "gainGig",
      playerId,
      timestamp: Date.now(),
      turnNumber: state.G.turnMetadata.turnNumber,
      dieId,
      dieType: die?.dieType ?? "unknown",
      faceValue: die?.faceValue ?? 0,
    });

    // Lose check: deck reached 0 cards. Gig victory is checked at the
    // turn-start boundary before this start-phase gain resolves.
    const player = state.G.players[playerId as string];
    const deckEmpty = (player?.zones.deck.length ?? 0) === 0;
    if (deckEmpty) {
      const opponentId = state.ctx.playerIds.find((id) => id !== playerId);
      if (opponentId) {
        operations.game.endGame(opponentId, "deck_out_victory");
      }
      return;
    }

    operations.game.setPhase("main");
  },
};

export function readySpentCards(
  state: MatchState,
  operations: Operations,
  playerId: import("../types/branded.ts").PlayerId,
): number {
  const player = state.G.players[playerId as string];
  if (!player) return 0;
  let readiedCount = 0;
  const ids = [...player.zones.field, ...player.zones.legendArea, ...player.zones.eddieArea];
  for (const cardId of ids) {
    const card = state.G.cardIndex[cardId as string];
    if (card?.meta.spent) {
      operations.card.ready(cardId);
      readiedCount++;
    }
  }
  if ((player.spentEddies ?? 0) > 0) {
    player.eddies += player.spentEddies;
    player.spentEddies = 0;
  }
  return readiedCount;
}

/**
 * Build the allowed-die-ids list per the d20-last rule: every non-d20 die in
 * the fixer area, or the d20 if it's the only die left.
 */
export function allowedGainGigDice(state: MatchState, playerId: string): GigDieId[] {
  const player = state.G.players[playerId];
  if (!player) return [];
  const fixer = player.fixerArea;
  if (fixer.length === 0) return [];
  const nonD20s = fixer.filter((id) => state.G.gigDice[id as string]?.dieType !== "d20");
  if (nonD20s.length > 0) return nonD20s;
  return fixer.filter((id) => state.G.gigDice[id as string]?.dieType === "d20");
}
