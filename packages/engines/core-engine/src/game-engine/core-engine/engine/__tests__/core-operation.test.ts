import { beforeEach, describe, expect, it, mock } from "bun:test";
import type { GameSpecificCardMeta } from "../../types/game-specific-types";
import { CoreOperation } from "../core-operation";

// Mock dependencies
const mockState = {
  ctx: {
    cardMetas: {},
    playerOrder: ["player1", "player2"],
    priorityPlayerPos: 0,
    turnPlayerPos: 0,
    gameId: "test-game",
    matchId: "test-match",
    numTurns: 0,
    numMoves: 0,
    numTurnMoves: 0,
    cards: {},
    moveHistory: [],
    players: {},
  },
};

const mockEngine = {
  cardInstanceStore: {
    getCardByInstanceId: mock(() => ({
      instanceId: "card-1",
      card: { id: "card-1" },
    })),
  },
  queryCards: mock(() => []),
  getCardsInZone: mock(() => []),
  getCardOwner: mock(() => "player1"),
  getCardZone: mock(() => "hand"),
};

interface TestCardMeta extends GameSpecificCardMeta {
  damage?: number;
  exerted?: boolean;
  location?: string;
  counters?: Record<string, number>;
}

describe("CoreOperation", () => {
  let coreOps: CoreOperation<any, any, any, any, TestCardMeta>;

  beforeEach(() => {
    // Reset the mocks and state
    mockState.ctx.cardMetas = {};

    // Create a new instance for each test
    coreOps = new CoreOperation({
      state: mockState as any,
      engine: mockEngine as any,
    });
  });

  describe("Card Metadata Operations", () => {
    it("should update card meta with a partial object", () => {
      // Update with a partial object
      coreOps.updateCardMeta("card-1", { damage: 3 });

      // Verify damage was set
      expect(mockState.ctx.cardMetas["card-1"].damage).toBe(3);

      // Update with another partial object that should merge
      coreOps.updateCardMeta("card-1", { exerted: true });

      // Verify both properties exist
      expect(mockState.ctx.cardMetas["card-1"].damage).toBe(3);
      expect(mockState.ctx.cardMetas["card-1"].exerted).toBe(true);
    });

    it("should set card meta to completely replace existing meta", () => {
      // First set some initial meta
      coreOps.updateCardMeta("card-1", { damage: 3, exerted: true });

      // Then completely replace it
      coreOps.setCardMeta("card-1", { location: "play" } as TestCardMeta);

      // Verify old properties are gone and only new ones exist
      expect(mockState.ctx.cardMetas["card-1"].damage).toBeUndefined();
      expect(mockState.ctx.cardMetas["card-1"].exerted).toBeUndefined();
      expect(mockState.ctx.cardMetas["card-1"].location).toBe("play");
    });

    it("should use updateCardMetaField for single field updates", () => {
      // Update a single field
      coreOps.updateCardMetaField("card-1", "damage", 5);

      // Verify it was set
      expect(mockState.ctx.cardMetas["card-1"].damage).toBe(5);

      // Update another field
      coreOps.updateCardMetaField("card-1", "exerted", true);

      // Verify both fields exist
      expect(mockState.ctx.cardMetas["card-1"].damage).toBe(5);
      expect(mockState.ctx.cardMetas["card-1"].exerted).toBe(true);
    });

    it("should handle complex nested objects in metadata", () => {
      // Add counters
      const counters = { energy: 2, shield: 1 };
      coreOps.updateCardMeta("card-1", { counters });

      // Verify counters were set
      expect(mockState.ctx.cardMetas["card-1"].counters).toEqual(counters);

      // Update with additional data
      coreOps.updateCardMeta("card-1", { damage: 2 });

      // Verify both properties exist
      expect(mockState.ctx.cardMetas["card-1"].counters).toEqual(counters);
      expect(mockState.ctx.cardMetas["card-1"].damage).toBe(2);
    });
  });
});
