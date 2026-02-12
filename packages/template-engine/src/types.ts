import type { CardId, PlayerId } from "@tcg/core";

/**
 * Template Game State
 *
 * This is a minimal working example showing how to structure your game state.
 * Your game state should be a plain TypeScript type with all game data.
 */
export interface TemplateGameState {
  // Player information
  players: {
    id: PlayerId;
    name: string;
    life: number;
  }[];

  // Turn tracking
  currentPlayerIndex: number;
  turnNumber: number;
  phase: "draw" | "main" | "end";

  // Zones - just arrays of card IDs per player
  zones: {
    deck: Record<PlayerId, CardId[]>;
    hand: Record<PlayerId, CardId[]>;
    field: Record<PlayerId, CardId[]>;
    graveyard: Record<PlayerId, CardId[]>;
  };

  // Cards - lookup table of actual card data
  cards: Record<CardId, CardInstance>;
}

/**
 * Card Instance
 *
 * Represents a card in play with runtime state.
 */
export interface CardInstance {
  id: CardId;
  definitionId: string; // References a card definition (like "fireball")
  ownerId: PlayerId;
  tapped: boolean;
  damage: number;
  counters: Record<string, number>;
}

/**
 * Template Game Moves
 *
 * Define the shape of data for each move type.
 * Use Record<string, never> for moves with no parameters.
 */
export interface TemplateGameMoves {
  drawCard: Record<string, never>;
  playCard: { cardId: CardId };
  attack: { attackerId: CardId; targetId: CardId };
  endPhase: Record<string, never>;
}
