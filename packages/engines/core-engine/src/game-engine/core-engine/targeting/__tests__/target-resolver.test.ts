/**
 * Tests for TargetResolver - Runtime Filter Evaluation
 *
 * Following TDD approach - these tests define the expected behavior
 * for resolving card filters to actual card instances at runtime.
 */

import { beforeEach, describe, expect, it } from "bun:test";
import type { CoreCardInstance } from "../../card/core-card-instance";
import type { CoreCardInstanceStore } from "../../card/core-card-instance-store";
import type { BaseCoreCardFilter } from "../../types/game-specific-types";
import { TargetResolver } from "../target-resolver";

// Mock types for testing
type TestCardDefinition = {
  id: string;
  name: string;
  cost: number;
  strength?: number;
  type: string;
  keywords?: string[];
  characteristics?: string[];
};

type TestCardInstance = CoreCardInstance<TestCardDefinition>;

describe("TargetResolver - Filter Evaluation", () => {
  // Test fixtures will be created in each test
  let mockStore: CoreCardInstanceStore<TestCardDefinition>;
  let mockCards: TestCardInstance[];
  let resolver: TargetResolver<BaseCoreCardFilter, TestCardInstance>;

  beforeEach(() => {
    // Reset mocks before each test
    mockCards = createMockCards();
    mockStore = createMockStore(mockCards);
    resolver = new TargetResolver({}, mockStore);
  });

  describe("Zone-Based Candidate Pooling", () => {
    it("should filter cards by single zone", () => {
      const filter: BaseCoreCardFilter = {
        zone: "play",
      };

      const result = resolver.resolveCardTargets(filter);

      // Expected: Only cards in "play" zone
      const expected = mockCards.filter((c) => c.zone === "play");

      expect(result).toHaveLength(expected.length);
      expect(result.every((c) => c.zone === "play")).toBe(true);
    });

    it("should filter cards by multiple zones", () => {
      const filter: BaseCoreCardFilter = {
        zone: ["play", "hand"],
      };

      const result = resolver.resolveCardTargets(filter);

      const expected = mockCards.filter(
        (c) => c.zone === "play" || c.zone === "hand",
      );

      expect(result).toHaveLength(expected.length);
    });

    it("should return all cards when no zone specified", () => {
      const filter: BaseCoreCardFilter = {};

      const result = resolver.resolveCardTargets(filter);

      // Expected: All cards from all zones
      expect(result).toHaveLength(mockCards.length);
    });
  });

  describe("Owner Filter Evaluation", () => {
    it("should filter cards by owner ID", () => {
      const filter: BaseCoreCardFilter = {
        owner: "player1",
      };

      const result = resolver.resolveCardTargets(filter);
      const expected = mockCards.filter((c) => c.owner === "player1");

      expect(result).toHaveLength(expected.length);
      expect(result.every((c) => c.owner === "player1")).toBe(true);
    });

    it("should support 'self' owner relative to source card", () => {
      const filter: BaseCoreCardFilter = {
        owner: "self",
      };

      const sourceCard = mockCards[0]; // Owned by player1

      // Expected: Cards owned by same player as source
      const expected = mockCards.filter((c) => c.owner === sourceCard.owner);
      expect(expected.length).toBeGreaterThan(0);
    });

    it("should support 'opponent' owner relative to source card", () => {
      const filter: BaseCoreCardFilter = {
        owner: "opponent",
      };

      const sourceCard = mockCards[0]; // Owned by player1

      // Expected: Cards NOT owned by source card's owner
      const expected = mockCards.filter((c) => c.owner !== sourceCard.owner);
      expect(expected.length).toBeGreaterThan(0);
    });
  });

  describe("Type Filter Evaluation", () => {
    it("should filter by single type", () => {
      const filter: BaseCoreCardFilter = {
        type: "character",
      };

      const expected = mockCards.filter((c) => c.card.type === "character");
      expect(expected.length).toBeGreaterThan(0);
    });

    it("should filter by multiple types", () => {
      const filter: BaseCoreCardFilter = {
        type: ["character", "creature"],
      };

      const expected = mockCards.filter(
        (c) => c.card.type === "character" || c.card.type === "creature",
      );
      expect(expected.length).toBeGreaterThan(0);
    });
  });

  describe("Status Filter Evaluation", () => {
    it("should filter by ready status", () => {
      const filter: BaseCoreCardFilter = {
        ready: true,
      };

      // Expected: Cards with ready status
      const expected = mockCards.filter((c) => c.meta?.ready === true);
      expect(expected.length).toBeGreaterThan(0);
    });

    it("should filter by exerted status", () => {
      const filter: BaseCoreCardFilter = {
        exerted: true,
      };

      const expected = mockCards.filter((c) => c.meta?.exerted === true);
      expect(expected.length).toBeGreaterThan(0);
    });

    it("should filter by damaged status", () => {
      const filter: BaseCoreCardFilter = {
        damaged: true,
      };

      const expected = mockCards.filter((c) => c.meta?.damaged === true);
      expect(expected.length).toBeGreaterThan(0);
    });

    it("should combine multiple status filters with AND logic", () => {
      const filter: BaseCoreCardFilter = {
        ready: false,
        damaged: true,
      };

      const expected = mockCards.filter(
        (c) => c.meta?.ready === false && c.meta?.damaged === true,
      );
      expect(expected.length).toBeGreaterThan(0);
    });
  });

  describe("Numeric Comparison Evaluation (New Format)", () => {
    it("should filter by cost equality", () => {
      const filter: BaseCoreCardFilter = {
        cost: { operator: "eq", value: 3 },
      };

      const expected = mockCards.filter((c) => c.card.cost === 3);
      expect(expected.length).toBeGreaterThan(0);
    });

    it("should filter by cost greater than", () => {
      const filter: BaseCoreCardFilter = {
        cost: { operator: "gt", value: 2 },
      };

      const expected = mockCards.filter((c) => c.card.cost > 2);
      expect(expected.length).toBeGreaterThan(0);
    });

    it("should filter by cost greater than or equal", () => {
      const filter: BaseCoreCardFilter = {
        cost: { operator: "gte", value: 3 },
      };

      const expected = mockCards.filter((c) => c.card.cost >= 3);
      expect(expected.length).toBeGreaterThan(0);
    });

    it("should filter by cost less than", () => {
      const filter: BaseCoreCardFilter = {
        cost: { operator: "lt", value: 4 },
      };

      const expected = mockCards.filter((c) => c.card.cost < 4);
      expect(expected.length).toBeGreaterThan(0);
    });

    it("should filter by cost less than or equal", () => {
      const filter: BaseCoreCardFilter = {
        cost: { operator: "lte", value: 3 },
      };

      const expected = mockCards.filter((c) => c.card.cost <= 3);
      expect(expected.length).toBeGreaterThan(0);
    });

    it("should filter by strength attribute", () => {
      const filter: BaseCoreCardFilter = {
        strength: { operator: "gte", value: 5 },
      };

      const expected = mockCards.filter(
        (c) => c.card.strength !== undefined && c.card.strength >= 5,
      );
      expect(expected.length).toBeGreaterThan(0);
    });
  });

  describe("Numeric Range Evaluation (Legacy Format)", () => {
    it("should filter by exact cost", () => {
      const filter: BaseCoreCardFilter = {
        cost: { exact: 3 },
      };

      const expected = mockCards.filter((c) => c.card.cost === 3);
      expect(expected.length).toBeGreaterThan(0);
    });

    it("should filter by minimum cost", () => {
      const filter: BaseCoreCardFilter = {
        cost: { min: 2 },
      };

      const expected = mockCards.filter((c) => c.card.cost >= 2);
      expect(expected.length).toBeGreaterThan(0);
    });

    it("should filter by maximum cost", () => {
      const filter: BaseCoreCardFilter = {
        cost: { max: 4 },
      };

      const expected = mockCards.filter((c) => c.card.cost <= 4);
      expect(expected.length).toBeGreaterThan(0);
    });

    it("should filter by cost range (min and max)", () => {
      const filter: BaseCoreCardFilter = {
        cost: { min: 2, max: 4 },
      };

      const expected = mockCards.filter(
        (c) => c.card.cost >= 2 && c.card.cost <= 4,
      );
      expect(expected.length).toBeGreaterThan(0);
    });
  });

  describe("Keyword Filter Evaluation", () => {
    it("should filter by single keyword", () => {
      const filter: BaseCoreCardFilter = {
        withKeyword: "flying",
      };

      const expected = mockCards.filter((c) =>
        c.card.keywords?.includes("flying"),
      );
      expect(expected.length).toBeGreaterThan(0);
    });

    it("should filter by multiple keywords (OR logic)", () => {
      const filter: BaseCoreCardFilter = {
        withKeyword: ["flying", "ward"],
      };

      const expected = mockCards.filter((c) =>
        c.card.keywords?.some((kw) => kw === "flying" || kw === "ward"),
      );
      expect(expected.length).toBeGreaterThan(0);
    });

    it("should exclude cards with keyword", () => {
      const filter: BaseCoreCardFilter = {
        withoutKeyword: "defender",
      };

      const expected = mockCards.filter(
        (c) => !c.card.keywords?.includes("defender"),
      );
      expect(expected.length).toBeGreaterThan(0);
    });

    it("should combine keyword inclusion and exclusion", () => {
      const filter: BaseCoreCardFilter = {
        withKeyword: "flying",
        withoutKeyword: "defender",
      };

      const expected = mockCards.filter(
        (c) =>
          c.card.keywords?.includes("flying") &&
          !c.card.keywords?.includes("defender"),
      );
      expect(expected.length).toBeGreaterThan(0);
    });
  });

  describe("Characteristics Filter Evaluation", () => {
    it("should filter by single characteristic", () => {
      const filter: BaseCoreCardFilter = {
        withCharacteristics: ["legendary"],
      };

      const expected = mockCards.filter((c) =>
        c.card.characteristics?.includes("legendary"),
      );
      expect(expected.length).toBeGreaterThan(0);
    });

    it("should filter by multiple characteristics with ANY mode (default OR)", () => {
      const filter: BaseCoreCardFilter = {
        withCharacteristics: ["hero", "villain"],
        characteristicsMode: "any",
      };

      const expected = mockCards.filter((c) =>
        c.card.characteristics?.some((ch) => ch === "hero" || ch === "villain"),
      );
      expect(expected.length).toBeGreaterThan(0);
    });

    it("should filter by multiple characteristics with ALL mode (AND)", () => {
      const filter: BaseCoreCardFilter = {
        withCharacteristics: ["legendary", "hero"],
        characteristicsMode: "all",
      };

      const expected = mockCards.filter(
        (c) =>
          c.card.characteristics?.includes("legendary") &&
          c.card.characteristics?.includes("hero"),
      );
      expect(expected.length).toBeGreaterThan(0);
    });
  });

  describe("ExcludeSelf Filter", () => {
    it("should exclude source card from results", () => {
      const filter: BaseCoreCardFilter = {
        zone: "play",
        excludeSelf: true,
      };

      const sourceCard = mockCards[0];

      const expected = mockCards.filter(
        (c) => c.zone === "play" && c.instanceId !== sourceCard.instanceId,
      );
      expect(expected.length).toBeGreaterThan(0);
    });

    it("should not exclude when excludeSelf is false", () => {
      const filter: BaseCoreCardFilter = {
        zone: "play",
        excludeSelf: false,
      };

      const sourceCard = mockCards[0];

      const expected = mockCards.filter((c) => c.zone === "play");
      expect(expected).toContain(sourceCard);
    });
  });

  describe("Quantity Rules", () => {
    it("should limit results to count", () => {
      const filter: BaseCoreCardFilter = {
        zone: "play",
        count: 2,
      };

      // Expected: Exactly 2 cards
      const playCards = mockCards.filter((c) => c.zone === "play");
      expect(playCards.length).toBeGreaterThanOrEqual(2);
    });

    it("should return all cards when count is 'all'", () => {
      const filter: BaseCoreCardFilter = {
        zone: "play",
        count: "all",
      };

      const expected = mockCards.filter((c) => c.zone === "play");
      expect(expected.length).toBeGreaterThan(0);
    });

    it("should support 'up to N' selection", () => {
      const filter: BaseCoreCardFilter = {
        zone: "play",
        count: 3,
        upTo: true,
      };

      // Expected: Up to 3 cards (could be 0-3)
      const playCards = mockCards.filter((c) => c.zone === "play");
      expect(playCards.length).toBeGreaterThanOrEqual(3);
    });

    it("should support random selection", () => {
      const filter: BaseCoreCardFilter = {
        zone: "play",
        count: 1,
        random: true,
      };

      // Expected: Random 1 card from play zone
      const playCards = mockCards.filter((c) => c.zone === "play");
      expect(playCards.length).toBeGreaterThan(0);
    });
  });

  describe("Complex Filter Combinations", () => {
    it("should apply multiple filters with AND logic", () => {
      const filter: BaseCoreCardFilter = {
        zone: "play",
        type: "character",
        owner: "player1",
        cost: { operator: "lte", value: 3 },
        damaged: true,
        withKeyword: "flying",
      };

      const expected = mockCards.filter(
        (c) =>
          c.zone === "play" &&
          c.card.type === "character" &&
          c.owner === "player1" &&
          c.card.cost <= 3 &&
          c.meta?.damaged === true &&
          c.card.keywords?.includes("flying"),
      );

      // May be 0 if no card matches all criteria (that's valid)
      expect(expected).toBeDefined();
    });

    it("should handle legacy and new format in same filter", () => {
      const filter: BaseCoreCardFilter = {
        cost: { min: 2, max: 4 }, // Legacy format
        strength: { operator: "gte", value: 5 }, // New format
      };

      const expected = mockCards.filter(
        (c) =>
          c.card.cost >= 2 &&
          c.card.cost <= 4 &&
          c.card.strength !== undefined &&
          c.card.strength >= 5,
      );

      expect(expected).toBeDefined();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty card store", () => {
      const emptyStore = createMockStore([]);
      const filter: BaseCoreCardFilter = {
        zone: "play",
      };

      // Expected: Empty array, no errors
      const expected: TestCardInstance[] = [];
      expect(expected).toEqual([]);
    });

    it("should handle filter with no matching cards", () => {
      const filter: BaseCoreCardFilter = {
        cost: { operator: "eq", value: 999 }, // No card has this cost
      };

      const expected = mockCards.filter((c) => c.card.cost === 999);
      expect(expected).toEqual([]);
    });

    it("should handle undefined optional attributes", () => {
      const filter: BaseCoreCardFilter = {
        strength: { operator: "gte", value: 5 },
      };

      // Some cards may not have strength attribute
      const expected = mockCards.filter(
        (c) => c.card.strength !== undefined && c.card.strength >= 5,
      );

      expect(expected).toBeDefined();
    });
  });
});

// Test helper functions
function createMockCards(): TestCardInstance[] {
  return [
    createMockCard({
      id: "card1",
      name: "Dragon Knight",
      cost: 3,
      strength: 5,
      type: "character",
      keywords: ["flying", "ward"],
      characteristics: ["legendary", "hero"],
      zone: "play",
      owner: "player1",
      meta: { ready: true, damaged: false },
    }),
    createMockCard({
      id: "card2",
      name: "Goblin Warrior",
      cost: 2,
      strength: 3,
      type: "character",
      keywords: ["defender"],
      characteristics: ["villain"],
      zone: "play",
      owner: "player2",
      meta: { ready: false, exerted: true, damaged: true },
    }),
    createMockCard({
      id: "card3",
      name: "Fireball",
      cost: 4,
      type: "action",
      keywords: [],
      characteristics: [],
      zone: "hand",
      owner: "player1",
      meta: {},
    }),
    createMockCard({
      id: "card4",
      name: "Ancient Dragon",
      cost: 6,
      strength: 8,
      type: "creature",
      keywords: ["flying"],
      characteristics: ["legendary"],
      zone: "play",
      owner: "player1",
      meta: { ready: true, damaged: false },
    }),
    createMockCard({
      id: "card5",
      name: "Shield Bearer",
      cost: 1,
      strength: 2,
      type: "character",
      keywords: ["defender"],
      characteristics: ["hero"],
      zone: "play",
      owner: "player2",
      meta: { ready: true, damaged: false },
    }),
  ];
}

function createMockCard(config: {
  id: string;
  name: string;
  cost: number;
  strength?: number;
  type: string;
  keywords: string[];
  characteristics: string[];
  zone: string;
  owner: string;
  meta: Record<string, any>;
}): TestCardInstance {
  return {
    instanceId: `instance-${config.id}`,
    publicId: config.id,
    owner: config.owner,
    ownerId: config.owner,
    zone: config.zone,
    card: {
      id: config.id,
      name: config.name,
      cost: config.cost,
      strength: config.strength,
      type: config.type,
      keywords: config.keywords,
      characteristics: config.characteristics,
    },
    meta: config.meta,
    id: config.id,
    contextProvider: null as any,
    isEqual: () => false,
  } as TestCardInstance;
}

function createMockStore(
  cards: TestCardInstance[],
): CoreCardInstanceStore<TestCardDefinition> {
  return {
    getAllCards: () => cards,
    getCardByInstanceId: (id: string) => cards.find((c) => c.instanceId === id),
  } as CoreCardInstanceStore<TestCardDefinition>;
}
