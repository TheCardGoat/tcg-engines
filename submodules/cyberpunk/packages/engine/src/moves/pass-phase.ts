import type { Effect } from "@tcg/cyberpunk-types";
import type { MoveDefinition, MoveInput } from "../types/commands.ts";
import { executeAbilityEffects } from "../ability-executor.ts";
import { resolveTarget, type ResolutionContext } from "../effects/target-resolver.ts";
import type { CardInstanceId, PlayerId as PlayerIdType } from "../types/branded.ts";
import type { MatchState } from "../types/match-state.ts";
import type { Operations } from "../operations/index.ts";
import { enterStartPhase } from "./keep-hand.ts";
import { allowedGainGigDice, readySpentCards } from "./gain-gig.ts";
import { defOf } from "../state/lookups.ts";

export interface PassPhaseInput extends MoveInput {
  args: Record<string, never>;
}

export const passPhaseMove: MoveDefinition<PassPhaseInput> = {
  available({ state, playerId }) {
    if (state.G.gamePhase === "setup") return false;
    if (state.G.turnMetadata.activePlayerId !== playerId) return false;
    if (state.G.gamePhase === "main" && !state.G.attackState) return true;
    return false;
  },

  validate({ state, playerId }) {
    if (state.G.gamePhase === "end") {
      return { valid: false, error: "Game has ended", errorCode: "GAME_ENDED" };
    }
    if (state.G.gamePhase !== "setup" && state.G.turnMetadata.activePlayerId !== playerId) {
      return { valid: false, error: "Not your turn", errorCode: "NOT_YOUR_TURN" };
    }
    if (state.G.gamePhase === "main" && state.G.attackState) {
      return { valid: false, error: "Attack in progress", errorCode: "ATTACK_IN_PROGRESS" };
    }
    return { valid: true };
  },

  execute({ state, playerId, operations }) {
    if (state.G.gamePhase === "setup") {
      // Legacy fallback: callers that haven't migrated to mulligan/keepHand
      // can still force-start the game with passPhase. Runs the same start
      // phase as the auto-advance path so behavior is consistent.
      enterStartPhase(state, operations);
      operations.log.emit({
        type: "passPhase",
        playerId,
        timestamp: Date.now(),
        turnNumber: state.G.turnMetadata.turnNumber,
        fromPhase: "setup",
        toPhase: state.G.gamePhase,
      });
      return;
    }

    if (state.G.gamePhase === "main") {
      endTurn(state, playerId, operations);
      operations.log.emit({
        type: "passPhase",
        playerId,
        timestamp: Date.now(),
        turnNumber: state.G.turnMetadata.turnNumber,
        fromPhase: "main",
        toPhase: state.G.gamePhase,
      });
    }
  },
};

function endTurn(state: MatchState, playerId: PlayerIdType, operations: Operations) {
  const currentTurn = state.G.turnMetadata.turnNumber;
  operations.event.emit({
    type: "turnEnded",
    playerId,
    turnNumber: currentTurn,
  });

  operations.event.emit({
    type: "actionLog",
    messageKey: "move.turnEnded",
    params: { turnNumber: currentTurn },
    playerId,
  });

  // Process delayed effects from the effectBag before cleanup
  const bagEntries = [...state.G.effectBag];
  for (const entry of bagEntries) {
    if (entry.delayedEffects) {
      const ctx: ResolutionContext = {
        state,
        sourceCardId: entry.sourceCardId as CardInstanceId,
        sourcePlayerId: entry.sourcePlayerId as PlayerIdType,
        abilityIndex: -1,
        contextTargets: {},
        boundTargets: (entry.resolvedBindings ?? {}) as Record<string, string[]>,
      };
      emitDelayedDefeatLog(
        entry.sourceCardId as CardInstanceId,
        entry.delayedEffects,
        ctx,
        operations,
      );
      executeAbilityEffects(entry.delayedEffects, ctx, operations);
    }
    operations.game.removeBagEntry(entry.id);
  }

  operations.game.cleanupTurnEffects();
  operations.game.resetTurnFlags(playerId);

  const opponentId = state.ctx.playerIds.find((id) => id !== playerId)!;
  const noGigTaken = !state.G.turnMetadata.gigTakenThisTurn;

  // Overtime begins after the last player's 7th turn.
  const nextTurnNumber = currentTurn + 1;
  const overtimeThreshold = 7 * state.ctx.playerIds.length + 1;
  const overtimeTriggered = nextTurnNumber >= overtimeThreshold;

  if (overtimeTriggered && !state.G.overtime) {
    state.G.overtime = true;
    state.G.turnMetadata.overtimeActive = true;
  }

  operations.game.setTurnMetadata({
    activePlayerId: opponentId,
    turnNumber: nextTurnNumber,
    previousTurnNoGigTaken: noGigTaken,
    gigTakenThisTurn: false,
    overtimeActive: state.G.overtime,
  });

  operations.game.setPhase("start");

  operations.event.emit({
    type: "turnStarted",
    playerId: opponentId,
    turnNumber: currentTurn + 1,
  });

  operations.game.cleanupEffectsExpiringAtTurnStart(opponentId);

  // The 7+ gig win check fires at the turn-start boundary before ready/draw/gain.
  // During overtime, majority decides the game instead.
  if (maybeEndForTurnStart(state, opponentId, playerId, operations, state.G.overtime)) {
    return;
  }

  // Start phase begins.
  // Step 1: READY SPENT CARDS.
  readySpentCards(state, operations, opponentId);

  // Step 2: DRAW A CARD.
  operations.zone.drawCards(opponentId, 1);
  if (state.G.gameEnded) {
    return;
  }

  // Step 3: GAIN A GIG. If the fixer area has dice, open a pending choice —
  // the win/deck-out checks fire when the active player resolves the choice
  // via the `gainGig` move.
  const allowedDieIds = allowedGainGigDice(state, opponentId as string);
  if (allowedDieIds.length > 0) {
    operations.game.setPendingChoice({
      type: "gainGig",
      chooserId: opponentId,
      effectId: "start-phase",
      payload: { allowedDieIds },
    });
    return;
  }

  // Empty fixer — no gig to take. Deck-out can happen after the draw above.
  const newOpponent = state.G.players[opponentId as string];
  const deckEmpty = (newOpponent?.zones.deck.length ?? 0) === 0;
  if (deckEmpty) {
    operations.game.endGame(playerId, "deck_out_victory");
    return;
  }

  operations.game.setPhase("main");
}

function maybeEndForTurnStart(
  state: MatchState,
  playerId: PlayerIdType,
  previousPlayerId: PlayerIdType,
  operations: Operations,
  overtimeActive: boolean,
): boolean {
  const player = state.G.players[playerId as string];
  if (!player) return false;

  if (overtimeActive) {
    const totalDice = Object.keys(state.G.gigDice).length;
    const majority = Math.floor(totalDice / 2) + 1;

    for (const pid of state.ctx.playerIds) {
      const p = state.G.players[pid as string];
      if (p && p.gigArea.length >= majority) {
        operations.game.endGame(pid, "overtime_majority");
        return true;
      }
    }
  } else {
    if (player.gigArea.length >= 7) {
      operations.game.endGame(playerId, "gig_victory");
      return true;
    }
  }

  if (player.zones.deck.length === 0) {
    operations.game.endGame(previousPlayerId, "deck_out_victory");
    return true;
  }

  return false;
}

function emitDelayedDefeatLog(
  sourceCardId: CardInstanceId,
  effects: Effect[],
  ctx: ResolutionContext,
  operations: Operations,
): void {
  const sourceCard = ctx.state.G.cardIndex[sourceCardId as string];
  const sourceCardName = sourceCard ? defOf(sourceCard).displayName : "A delayed effect";
  const targetIds = effects.flatMap((effect) => {
    if (effect.effect !== "defeat") return [];
    return resolveTarget(effect.target, ctx).filter((id) => ctx.state.G.cardIndex[id]);
  });
  if (targetIds.length === 0) return;

  const targetNames = targetIds
    .map((id) => {
      const card = ctx.state.G.cardIndex[id]!;
      return defOf(card).displayName;
    })
    .join(", ");

  operations.event.emit({
    type: "actionLog",
    messageKey: "trigger.delayedDefeat",
    params: { sourceCardName, targetNames },
    playerId: ctx.sourcePlayerId,
    category: "trigger",
    cardIds: [sourceCardId as string, ...targetIds],
  });
  operations.log.emit({
    type: "action",
    messageKey: "trigger.delayedDefeat",
    params: { sourceCardName, targetNames },
    playerId: ctx.sourcePlayerId,
    turnNumber: ctx.state.G.turnMetadata.turnNumber,
    timestamp: Date.now(),
  });
}
