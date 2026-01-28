/**
 * Test Context Factory
 *
 * Utilities for creating MoveContext objects in tests.
 * Provides mock implementations of engine services for unit testing.
 */

import type { HistoryOperations } from "../history/history-operations";
import type { MoveContext, MoveContextInput } from "../moves/move-system";
import type { CardOperations } from "../operations/card-operations";
import type { CounterOperations } from "../operations/counter-operations";
import type { GameOperations } from "../operations/game-operations";
import type { ZoneOperations } from "../operations/zone-operations";
import { SeededRNG } from "../rng/seeded-rng";
import type { CardId, PlayerId, ZoneId } from "../types";

/**
 * Create a mock MoveContext for testing
 *
 * Builds a full MoveContext with mock implementations of engine services.
 * Useful for unit testing reducers and conditions without a full engine.
 *
 * @param input - Partial context input
 * @param options - Optional mock implementations
 * @returns Full MoveContext with mocks
 *
 * @example
 * ```typescript
 * const context = createMockContext({
 *   playerId: 'p1',
 *   params: { cardId: 'card-123' }
 * });
 *
 * // Use in reducer test
 * const reducer: MoveReducer<GameState> = (draft, ctx) => {
 *   // ctx has full MoveContext type
 * };
 * reducer(draft, context);
 * ```
 */
export function createMockContext<TParams = any>(
  input: MoveContextInput<TParams>,
  options?: {
    rng?: SeededRNG;
    zones?: Partial<ZoneOperations>;
    cards?: Partial<CardOperations<any>>;
    game?: Partial<GameOperations>;
    counters?: Partial<CounterOperations>;
    registry?: any;
    flow?: {
      currentPhase?: string;
      currentSegment?: string;
      turn: number;
      currentPlayer: PlayerId;
      isFirstTurn: boolean;
      endPhase?: () => void;
      endSegment?: () => void;
      endTurn?: () => void;
    };
    endGame?: (result: {
      winner?: PlayerId;
      reason: string;
      metadata?: Record<string, unknown>;
    }) => void;
    trackers?: {
      check(name: string, playerId?: PlayerId): boolean;
      mark(name: string, playerId?: PlayerId): void;
      unmark(name: string, playerId?: PlayerId): void;
    };
    history?: Partial<HistoryOperations>;
  },
): MoveContext<TParams> {
  const mockZones: ZoneOperations = {
    moveCard: () => {},
    getCardsInZone: () => [],
    shuffleZone: () => {},
    getCardZone: () => undefined,
    drawCards: () => [],
    mulligan: () => {},
    bulkMove: () => [],
    createDeck: () => [],
    ...options?.zones,
  };

  const mockCards: CardOperations<any> = {
    getCardMeta: () => ({}),
    updateCardMeta: () => {},
    setCardMeta: () => {},
    getCardOwner: () => undefined as any,
    queryCards: () => [],
    ...options?.cards,
  };

  const mockGame: GameOperations = {
    setOTP: () => {},
    getOTP: () => undefined,
    setChoosingFirstPlayer: () => {},
    getChoosingFirstPlayer: () => undefined,
    setPendingMulligan: () => {},
    getPendingMulligan: () => [],
    addPendingMulligan: () => {},
    removePendingMulligan: () => {},
    ...options?.game,
  };

  const mockCounters: CounterOperations = {
    setFlag: () => {},
    getFlag: () => false,
    addCounter: () => {},
    removeCounter: () => {},
    getCounter: () => 0,
    clearCounter: () => {},
    clearAllCounters: () => {},
    getCardsWithFlag: () => [],
    getCardsWithCounter: () => [],
    ...options?.counters,
  };

  return {
    ...input,
    rng: options?.rng || new SeededRNG("test-seed"),
    zones: mockZones,
    cards: mockCards,
    game: mockGame,
    counters: mockCounters,
    registry: options?.registry,
    flow: options?.flow
      ? {
          ...options.flow,
          endPhase: options.flow.endPhase || (() => {}),
          endSegment: options.flow.endSegment || (() => {}),
          endTurn: options.flow.endTurn || (() => {}),
        }
      : undefined,
    endGame: options?.endGame || (() => {}),
    trackers: options?.trackers || {
      check: () => false,
      mark: () => {},
      unmark: () => {},
    },
    history: {
      log: () => {},
      ...options?.history,
    },
  };
}

/**
 * Create a mock CardOperations for testing
 *
 * @param overrides - Optional method overrides
 * @returns Mock CardOperations
 */
export function createMockCardOperations<TCardMeta = any>(
  overrides?: Partial<CardOperations<TCardMeta>>,
): CardOperations<TCardMeta> {
  return {
    getCardMeta: () => ({}) as TCardMeta,
    updateCardMeta: () => {},
    setCardMeta: () => {},
    getCardOwner: () => undefined as any,
    queryCards: () => [],
    ...overrides,
  };
}

/**
 * Create a mock ZoneOperations for testing
 *
 * @param overrides - Optional method overrides
 * @returns Mock ZoneOperations
 */
export function createMockZoneOperations(
  overrides?: Partial<ZoneOperations>,
): ZoneOperations {
  return {
    moveCard: () => {},
    getCardsInZone: () => [],
    shuffleZone: () => {},
    getCardZone: () => undefined,
    drawCards: () => [],
    mulligan: () => {},
    bulkMove: () => [],
    createDeck: () => [],
    ...overrides,
  };
}
