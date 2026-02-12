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
    bulkMove: () => [],
    createDeck: () => [],
    drawCards: () => [],
    getCardZone: () => undefined,
    getCardsInZone: () => [],
    moveCard: () => {},
    mulligan: () => {},
    shuffleZone: () => {},
    ...options?.zones,
  };

  const mockCards: CardOperations<any> = {
    getCardMeta: () => ({}),
    getCardOwner: () => undefined as any,
    queryCards: () => [],
    setCardMeta: () => {},
    updateCardMeta: () => {},
    ...options?.cards,
  };

  const mockGame: GameOperations = {
    addPendingMulligan: () => {},
    getChoosingFirstPlayer: () => undefined,
    getOTP: () => undefined,
    getPendingMulligan: () => [],
    removePendingMulligan: () => {},
    setChoosingFirstPlayer: () => {},
    setOTP: () => {},
    setPendingMulligan: () => {},
    ...options?.game,
  };

  const mockCounters: CounterOperations = {
    addCounter: () => {},
    clearAllCounters: () => {},
    clearCounter: () => {},
    getCardsWithCounter: () => [],
    getCardsWithFlag: () => [],
    getCounter: () => 0,
    getFlag: () => false,
    removeCounter: () => {},
    setFlag: () => {},
    ...options?.counters,
  };

  return {
    ...input,
    cards: mockCards,
    counters: mockCounters,
    endGame: options?.endGame || (() => {}),
    flow: options?.flow
      ? {
          ...options.flow,
          endPhase: options.flow.endPhase || (() => {}),
          endSegment: options.flow.endSegment || (() => {}),
          endTurn: options.flow.endTurn || (() => {}),
        }
      : undefined,
    game: mockGame,
    history: {
      log: () => {},
      ...options?.history,
    },
    registry: options?.registry,
    rng: options?.rng || new SeededRNG("test-seed"),
    trackers: options?.trackers || {
      check: () => false,
      mark: () => {},
      unmark: () => {},
    },
    zones: mockZones,
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
    getCardOwner: () => undefined as any,
    queryCards: () => [],
    setCardMeta: () => {},
    updateCardMeta: () => {},
    ...overrides,
  };
}

/**
 * Create a mock ZoneOperations for testing
 *
 * @param overrides - Optional method overrides
 * @returns Mock ZoneOperations
 */
export function createMockZoneOperations(overrides?: Partial<ZoneOperations>): ZoneOperations {
  return {
    bulkMove: () => [],
    createDeck: () => [],
    drawCards: () => [],
    getCardZone: () => undefined,
    getCardsInZone: () => [],
    moveCard: () => {},
    mulligan: () => {},
    shuffleZone: () => {},
    ...overrides,
  };
}
