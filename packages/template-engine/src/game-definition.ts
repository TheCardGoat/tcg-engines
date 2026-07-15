import type { GameDefinition, GameMoveDefinitions, PlayerId } from "@tcg/core";
import type { TemplateGameMoves, TemplateGameState } from "./types";

/**
 * Move Definitions
 *
 * Define all moves for the game.
 * Each move has an optional condition and a required reducer.
 */
const moves: GameMoveDefinitions<TemplateGameState, TemplateGameMoves> = {
  attack: {
    condition: (state, context) => {
      if (state.phase !== "main") {return false;}

      const {attackerId} = context.params;
      const attacker = state.cards[attackerId];

      return attacker !== undefined && !attacker.tapped;
    },
    reducer: (draft, context) => {
      const {attackerId} = context.params;
      const {targetId} = context.params;

      // Tap attacker
      const attacker = draft.cards[attackerId];
      if (attacker) {
        attacker.tapped = true;
      }

      // Deal damage
      const target = draft.cards[targetId];
      if (attacker && target) {
        target.damage += 1;
      }
    },
  },

  drawCard: {
    condition: (state) => {
      const player = state.players[state.currentPlayerIndex];
      return player !== undefined && state.phase === "draw";
    },
    reducer: (draft, context) => {
      const {playerId} = context;
      const deck = draft.zones.deck[playerId];

      if (deck && deck.length > 0) {
        const card = deck.pop();
        if (card) {
          const hand = draft.zones.hand[playerId];
          if (hand) {
            hand.push(card);
          }
        }
      }
    },
  },

  endPhase: {
    reducer: (draft) => {
      // Progress phase
      const phaseOrder = ["draw", "main", "end"] as const;
      const currentIndex = phaseOrder.indexOf(draft.phase);

      if (currentIndex === phaseOrder.length - 1) {
        // Next player's turn
        draft.currentPlayerIndex = (draft.currentPlayerIndex + 1) % draft.players.length;
        draft.turnNumber += 1;
        draft.phase = "draw";

        // Untap all cards for current player
        const currentPlayerId = draft.players[draft.currentPlayerIndex]?.id;
        if (currentPlayerId) {
          for (const card of Object.values(draft.cards)) {
            if (card && card.ownerId === currentPlayerId) {
              card.tapped = false;
            }
          }
        }
      } else {
        draft.phase = phaseOrder[currentIndex + 1];
      }
    },
  },

  playCard: {
    condition: (state, context) => {
      if (state.phase !== "main") {return false;}
      const {cardId} = context.params;
      if (!cardId) {return false;}

      const hand = state.zones.hand[context.playerId];

      return hand?.some((c) => c === cardId) ?? false;
    },
    reducer: (draft, context) => {
      const {playerId} = context;
      const {cardId} = context.params;

      // Remove from hand
      const hand = draft.zones.hand[playerId];
      if (hand) {
        const index = hand.findIndex((c) => c === cardId);
        if (index !== -1) {
          const cardIdInHand = hand[index];
          hand.splice(index, 1);
          // Add to field
          const field = draft.zones.field[playerId];
          if (field && cardIdInHand) {
            field.push(cardIdInHand);
          }
        }
      }
    },
  },
};

/**
 * Game Definition
 *
 * The complete game configuration using @tcg/core types.
 * No helper functions - just TypeScript types and plain objects.
 */
export const templateGameDefinition: GameDefinition<TemplateGameState, TemplateGameMoves> = {
  endIf: (state) => {
    const loser = state.players.find((p) => p.life <= 0);
    if (loser) {
      const winner = state.players.find((p) => p.id !== loser.id);
      return winner ? { reason: "Opponent eliminated", winner: winner.id } : undefined;
    }
    return undefined;
  },

  moves,

  name: "Template Card Game",

  playerView: (state, playerId) => ({
    ...state,
    zones: {
      ...state.zones,
      deck: Object.fromEntries(
        Object.entries(state.zones.deck).map(([pid, cards]) => [
          pid,
          pid === playerId ? cards : [], // Hide opponent decks
        ]),
      ),
      hand: Object.fromEntries(
        Object.entries(state.zones.hand).map(([pid, cards]) => [
          pid,
          pid === playerId ? cards : [], // Hide opponent hands
        ]),
      ),
    },
  }),

  setup: (players) => ({
    cards: {},
    currentPlayerIndex: 0,
    phase: "draw",
    players: players.map((p) => ({
      id: p.id as PlayerId,
      name: p.name || "Player",
      life: 20,
    })),
    turnNumber: 1,
    zones: {
      deck: Object.fromEntries(players.map((p) => [p.id, []])),
      hand: Object.fromEntries(players.map((p) => [p.id, []])),
      field: Object.fromEntries(players.map((p) => [p.id, []])),
      graveyard: Object.fromEntries(players.map((p) => [p.id, []])),
    },
  }),
};
