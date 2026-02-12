import type { Draft } from "immer";
import type { GameMoveDefinitions } from "../game-definition/move-definitions";
import type { PlayerId, ZoneId } from "../types/branded";
import type { MoveContext } from "./move-system";

/**
 * Options for configuring standard moves
 */
export interface StandardMoveOptions {
  /** Which standard moves to include */
  include?: StandardMoveName[];
  /** Custom zone names for draw/shuffle operations */
  zones?: {
    deck?: ZoneId;
    hand?: ZoneId;
    discard?: ZoneId;
  };
  /** Custom game-over handling for concede */
  onConcede?: (playerId: PlayerId, context: MoveContext) => void;
}

/**
 * Available standard move names
 */
export type StandardMoveName = "pass" | "concede" | "draw" | "shuffle" | "mulligan";

/**
 * Type definition for standard moves
 */
export interface StandardMoves {
  pass: { playerId: PlayerId };
  concede: { playerId: PlayerId };
  draw: { playerId: PlayerId; count?: number };
  shuffle: { playerId: PlayerId };
  mulligan: { playerId: PlayerId; keepCards?: string[] };
}

/**
 * Create a library of standard TCG moves that games can opt into.
 * Eliminates boilerplate for common operations like pass, concede, draw, shuffle, etc.
 *
 * @example
 * ```typescript
 * const gameDefinition = {
 *   moves: {
 *     ...standardMoves({ include: ["pass", "concede", "draw"] }),
 *     // Custom game-specific moves
 *     playCard: { ... }
 *   }
 * }
 * ```
 *
 * @param options - Configuration for which moves to include and custom settings
 * @returns A GameMoveDefinitions object with the requested standard moves
 */
export function standardMoves<TState>(
  options: StandardMoveOptions = {},
): Partial<GameMoveDefinitions<TState, StandardMoves>> {
  const { include = ["pass", "concede"], zones = {} } = options;
  const moves: Partial<GameMoveDefinitions<TState, StandardMoves>> = {};

  const deckZone = zones.deck ?? ("deck" as ZoneId);
  const handZone = zones.hand ?? ("hand" as ZoneId);
  const discardZone = zones.discard ?? ("discard" as ZoneId);

  // Pass move - do nothing, just advance turn
  if (include.includes("pass")) {
    moves.pass = {
      condition: (_state: TState, _context: MoveContext) => true,
      reducer: (_draft: Draft<TState>, _context: MoveContext) => {
        // No state changes - this is just a signal to advance flow
      },
    };
  }

  // Concede move - player forfeits the game
  if (include.includes("concede")) {
    moves.concede = {
      condition: () => true, // Can always concede
      reducer: (_draft: Draft<TState>, context: MoveContext) => {
        if (options.onConcede) {
          options.onConcede(context.playerId, context);
        } else if (context.endGame) {
          // Determine winner (opponent of conceeding player)
          const winner = (
            context.flow?.currentPlayer !== context.playerId
              ? context.flow?.currentPlayer
              : undefined
          ) as PlayerId | undefined;
          context.endGame({
            metadata: { conceedingPlayer: context.playerId },
            reason: "concede",
            winner,
          });
        }
      },
    };
  }

  // Draw move - draw N cards from deck to hand
  if (include.includes("draw")) {
    moves.draw = {
      condition: (_state: TState, context: MoveContext) => {
        const count = context.params?.count ?? 1;
        const deckCards = context.zones.getCardsInZone(deckZone, context.playerId);
        return deckCards.length >= count;
      },
      reducer: (_draft: Draft<TState>, context: MoveContext) => {
        const count = context.params?.count ?? 1;
        context.zones.drawCards({
          count,
          from: deckZone,
          playerId: context.playerId,
          to: handZone,
        });
      },
    };
  }

  // Shuffle move - shuffle player's deck
  if (include.includes("shuffle")) {
    moves.shuffle = {
      condition: () => true,
      reducer: (_draft: Draft<TState>, context: MoveContext) => {
        context.zones.shuffleZone(deckZone, context.playerId);
      },
    };
  }

  // Mulligan move - return hand to deck, shuffle, and redraw
  if (include.includes("mulligan")) {
    moves.mulligan = {
      condition: (_state: TState, context: MoveContext) => context.flow?.isFirstTurn ?? true,
      reducer: (_draft: Draft<TState>, context: MoveContext) => {
        const keepCards = context.params?.keepCards ?? [];
        const handCards = context.zones.getCardsInZone(handZone, context.playerId);

        // Return non-kept cards to deck
        const cardsToReturn = handCards.filter((cardId: string) => !keepCards.includes(cardId));
        for (const cardId of cardsToReturn) {
          context.zones.moveCard({
            cardId,
            position: "bottom",
            targetZoneId: deckZone,
          });
        }

        // Shuffle deck
        context.zones.shuffleZone(deckZone, context.playerId);

        // Draw the same number of cards we returned
        const drawCount = cardsToReturn.length;
        if (drawCount > 0) {
          context.zones.drawCards({
            count: drawCount,
            from: deckZone,
            playerId: context.playerId,
            to: handZone,
          });
        }
      },
    };
  }

  return moves;
}

/**
 * Helper to create a "discard" standard move
 * This is separate because it requires card selection parameters
 */
export function createDiscardMove<TState>(): GameMoveDefinitions<
  TState,
  { discard: { playerId: PlayerId; cardIds: string[] } }
>["discard"] {
  return {
    condition: (_state: TState, context: MoveContext) => {
      // Must have cards to discard
      const cardIds = context.params?.cardIds ?? [];
      return cardIds.length > 0;
    },
    reducer: (_draft: Draft<TState>, context: MoveContext) => {
      const cardIds = context.params?.cardIds ?? [];
      for (const cardId of cardIds) {
        context.zones.moveCard({
          cardId,
          targetZoneId: "discard" as ZoneId,
        });
      }
    },
  };
}

/**
 * Helper to create an "endTurn" standard move
 * This is separate because it interacts with flow management
 */
export function createEndTurnMove<TState>(): GameMoveDefinitions<
  TState,
  { endTurn: { playerId: PlayerId } }
>["endTurn"] {
  return {
    condition: (_state: TState, context: MoveContext) =>
      context.flow?.currentPlayer === context.playerId,
    reducer: (_draft: Draft<TState>, _context: MoveContext) => {
      // The actual turn transition is handled by FlowManager
      // This move just signals that the player is done
    },
  };
}
