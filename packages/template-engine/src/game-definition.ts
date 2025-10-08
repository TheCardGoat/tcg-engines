import type { GameDefinition, GameMoveDefinitions, PlayerId } from "@tcg/core";
import type { TemplateGameMoves, TemplateGameState } from "./types";

/**
 * Move Definitions
 *
 * Define all moves for the game.
 * Each move has an optional condition and a required reducer.
 */
const moves: GameMoveDefinitions<TemplateGameState, TemplateGameMoves> = {
  drawCard: {
    condition: (state) => {
      const player = state.players[state.currentPlayerIndex];
      return player !== undefined && state.phase === "draw";
    },
    reducer: (draft, context) => {
      const playerId = context.playerId;
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

  playCard: {
    condition: (state, context) => {
      if (state.phase !== "main") return false;
      if (!context.data?.cardId) return false;

      const cardId = String(context.data.cardId);
      const hand = state.zones.hand[context.playerId];

      return hand?.some((c) => String(c) === cardId) ?? false;
    },
    reducer: (draft, context) => {
      const playerId = context.playerId;
      const cardId = String(context.data?.cardId);

      // Remove from hand
      const hand = draft.zones.hand[playerId];
      if (hand) {
        const index = hand.findIndex((c) => String(c) === cardId);
        if (index >= 0) {
          const card = hand[index];
          hand.splice(index, 1);
          // Add to field
          const field = draft.zones.field[playerId];
          if (field && card) {
            field.push(card);
          }
        }
      }
    },
  },

  attack: {
    condition: (state, context) => {
      if (state.phase !== "main") return false;

      const attackerId = String(context.data?.attackerId);
      const attacker = Object.values(state.cards).find(
        (c) => String(c.id) === attackerId,
      );

      return attacker !== undefined && !attacker.tapped;
    },
    reducer: (draft, context) => {
      const attackerId = String(context.data?.attackerId);
      const targetId = String(context.data?.targetId);

      // Tap attacker
      const attacker = Object.values(draft.cards).find(
        (c) => String(c.id) === attackerId,
      );
      if (attacker) {
        attacker.tapped = true;
      }

      // Deal damage
      const target = Object.values(draft.cards).find(
        (c) => String(c.id) === targetId,
      );
      if (attacker && target) {
        target.damage += 1;
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
        draft.currentPlayerIndex =
          (draft.currentPlayerIndex + 1) % draft.players.length;
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
};

/**
 * Game Definition
 *
 * The complete game configuration using @tcg/core types.
 * No helper functions - just TypeScript types and plain objects.
 */
export const templateGameDefinition: GameDefinition<
  TemplateGameState,
  TemplateGameMoves
> = {
  name: "Template Card Game",

  setup: (players) => ({
    players: players.map((p) => ({
      id: p.id as PlayerId,
      name: p.name || "Player",
      life: 20,
    })),
    currentPlayerIndex: 0,
    turnNumber: 1,
    phase: "draw",
    zones: {
      deck: Object.fromEntries(players.map((p) => [p.id, []])),
      hand: Object.fromEntries(players.map((p) => [p.id, []])),
      field: Object.fromEntries(players.map((p) => [p.id, []])),
      graveyard: Object.fromEntries(players.map((p) => [p.id, []])),
    },
    cards: {},
  }),

  moves,

  endIf: (state) => {
    const loser = state.players.find((p) => p.life <= 0);
    if (loser) {
      const winner = state.players.find((p) => p.id !== loser.id);
      return winner
        ? { winner: winner.id, reason: "Opponent eliminated" }
        : undefined;
    }
    return undefined;
  },

  playerView: (state, playerId) => ({
    ...state,
    zones: {
      ...state.zones,
      hand: Object.fromEntries(
        Object.entries(state.zones.hand).map(([pid, cards]) => [
          pid,
          pid === playerId ? cards : [], // Hide opponent hands
        ]),
      ),
      deck: Object.fromEntries(
        Object.entries(state.zones.deck).map(([pid, cards]) => [
          pid,
          pid === playerId ? cards : [], // Hide opponent decks
        ]),
      ),
    },
  }),
};
