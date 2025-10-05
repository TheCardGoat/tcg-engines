/**
 * Integration Tests for Complete Targeting Flow
 *
 * Tests the complete flow from filter → resolution → validation
 * Demonstrates real-world usage scenarios
 */

import { beforeEach, describe, expect, it } from "bun:test";
import type { CoreCardInstance } from "../../card/core-card-instance";
import type { CoreCardInstanceStore } from "../../card/core-card-instance-store";
import type { BaseCoreCardFilter } from "../../types/game-specific-types";
import {
  BuiltInSecurityRules,
  CardFilterBuilder,
  SecurityRuleRegistry,
  TargetResolver,
  TargetValidator,
} from "../index";

// Mock types for testing
type TestCardDefinition = {
  id: string;
  name: string;
  cost: number;
  type: string;
  keywords?: string[];
  strength?: number;
};

type TestCardInstance = CoreCardInstance<TestCardDefinition>;

describe("Integration Tests - Complete Targeting Flow", () => {
  let mockStore: CoreCardInstanceStore<TestCardDefinition>;
  let mockCards: TestCardInstance[];
  let resolver: TargetResolver<BaseCoreCardFilter, TestCardInstance>;
  let validator: TargetValidator<BaseCoreCardFilter, TestCardInstance>;
  let registry: SecurityRuleRegistry<TestCardInstance>;

  beforeEach(() => {
    mockCards = createMockCards();
    mockStore = createMockStore(mockCards);
    registry = new SecurityRuleRegistry<TestCardInstance>();
    registry.registerRule(
      BuiltInSecurityRules.createWardRule<TestCardInstance>(),
    );
    resolver = new TargetResolver({}, mockStore, registry);
    validator = new TargetValidator({}, mockStore, registry);
  });

  describe("Filter → Resolution → Validation Flow", () => {
    it("should complete full targeting flow with builder", () => {
      // 1. Build filter with fluent API
      const filter = new CardFilterBuilder()
        .inZone("play")
        .ofType("character")
        .controlledBy("opponent")
        .withCost("lte", 3)
        .count(2)
        .build();

      // 2. Get valid targets
      const sourceCard = mockCards.find((c) => c.owner === "player1");
      const validTargets = validator.getValidTargets(filter, sourceCard);

      // 3. Validate target count (should have at least 1 card without Ward)
      expect(validTargets.length).toBeGreaterThan(0);

      // 4. Validate selection (select only as many as available)
      const availableCount = Math.min(2, validTargets.length);
      const selectedTargets = validTargets.slice(0, availableCount);
      const validation = validator.validateTargetSelection(
        {
          ...filter,
          count: availableCount, // Adjust count to match available targets
        },
        selectedTargets,
        sourceCard,
      );

      expect(validation.valid).toBe(true);
    });

    it("should handle auto-targeting when only one valid target", () => {
      // Filter that matches only one card
      const filter: BaseCoreCardFilter = {
        zone: "play",
        instanceId: "instance-card1",
        count: 1,
      };

      const sourceCard = mockCards[0];
      const validTargets = validator.getValidTargets(filter, sourceCard);

      expect(validTargets).toHaveLength(1);

      // Auto-target the only valid option
      const validation = validator.validateTargetSelection(
        filter,
        validTargets,
        sourceCard,
      );

      expect(validation.valid).toBe(true);
    });

    it("should handle no valid targets scenario", () => {
      // Filter that matches nothing AND requires targets
      const filter: BaseCoreCardFilter = {
        zone: "play",
        cost: { operator: "eq", value: 999 },
        count: 1, // Explicitly require 1 target
      };

      const sourceCard = mockCards[0];
      const validTargets = validator.getValidTargets(filter, sourceCard);

      expect(validTargets).toHaveLength(0);

      // Trying to select 0 when 1 is required should fail
      const validation = validator.validateTargetSelection(
        filter,
        [],
        sourceCard,
      );

      expect(validation.valid).toBe(false);
      expect(validation.reason).toBe("INCORRECT_TARGET_COUNT");
    });
  });

  describe("Ward Protection Integration", () => {
    it("should automatically block Ward cards from opponent targeting", () => {
      const filter = new CardFilterBuilder()
        .inZone("play")
        .ofType("character")
        .controlledBy("opponent")
        .build();

      const sourceCard = mockCards.find((c) => c.owner === "player1");
      const validTargets = validator.getValidTargets(filter, sourceCard!);

      // Should not include Ward cards
      const wardCards = validTargets.filter((c) =>
        c.card.keywords?.includes("ward"),
      );
      expect(wardCards).toHaveLength(0);
    });

    it("should allow self-targeting Ward cards", () => {
      const filter = new CardFilterBuilder()
        .inZone("play")
        .controlledBy("self")
        .build();

      const sourceCard = mockCards.find((c) => c.owner === "player1");
      const validTargets = validator.getValidTargets(filter, sourceCard!);

      // Should include own Ward cards
      const wardCards = validTargets.filter((c) =>
        c.card.keywords?.includes("ward"),
      );
      expect(wardCards.length).toBeGreaterThan(0);
    });

    it("should not apply Ward to 'all' effects", () => {
      const filter = new CardFilterBuilder().inZone("play").all().build();

      const sourceCard = mockCards.find((c) => c.owner === "player1");
      const validTargets = validator.getValidTargets(filter, sourceCard!);

      // Ward cards should be included for "all" effects
      const wardCards = validTargets.filter((c) =>
        c.card.keywords?.includes("ward"),
      );
      expect(wardCards.length).toBeGreaterThan(0);
    });
  });

  describe("Optional Targeting (Up To N)", () => {
    it("should allow selecting fewer than maximum targets", () => {
      const filter = new CardFilterBuilder().inZone("play").upTo(3).build();

      const sourceCard = mockCards[0];
      const validTargets = validator.getValidTargets(filter, sourceCard);

      // Select only 1 target (less than 3)
      const selectedTargets = validTargets.slice(0, 1);
      const validation = validator.validateTargetSelection(
        filter,
        selectedTargets,
        sourceCard,
      );

      expect(validation.valid).toBe(true);
    });

    it("should allow selecting zero targets with upTo", () => {
      const filter = new CardFilterBuilder().inZone("play").upTo(2).build();

      const sourceCard = mockCards[0];
      const validation = validator.validateTargetSelection(
        filter,
        [],
        sourceCard,
      );

      expect(validation.valid).toBe(true);
    });

    it("should reject exceeding upTo maximum", () => {
      const filter = new CardFilterBuilder().inZone("play").upTo(2).build();

      const sourceCard = mockCards[0];
      const allPlayCards = mockCards.filter((c) => c.zone === "play");

      // We should have enough cards in play
      expect(allPlayCards.length).toBeGreaterThanOrEqual(3);

      // Try to select 3 targets (exceeds upTo: 2)
      const selectedTargets = allPlayCards.slice(0, 3);
      const validation = validator.validateTargetSelection(
        filter,
        selectedTargets,
        sourceCard,
      );

      expect(validation.valid).toBe(false);
      expect(validation.reason).toBe("INCORRECT_TARGET_COUNT");
    });
  });

  describe("Random Target Selection", () => {
    it("should mark filter as random selection", () => {
      const filter = new CardFilterBuilder().inZone("play").random(1).build();

      // Random flag is set on the filter
      expect(filter.random).toBe(true);
      expect(filter.count).toBe(1);

      // Resolver uses this flag to randomly select from valid pool
      // (actual random selection logic tested in resolver tests)
    });

    it("should support random with multiple targets", () => {
      const filter = new CardFilterBuilder().inZone("play").random(2).build();

      expect(filter.random).toBe(true);
      expect(filter.count).toBe(2);
    });
  });

  describe("Complex Filtering Scenarios", () => {
    it("should handle complex multi-criteria targeting", () => {
      // "Target up to 2 damaged opponent characters with cost 3 or less and flying"
      const filter = new CardFilterBuilder()
        .inZone("play")
        .ofType("character")
        .controlledBy("opponent")
        .damaged(true)
        .withCost("lte", 3)
        .withKeyword("flying")
        .upTo(2)
        .build();

      const sourceCard = mockCards.find((c) => c.owner === "player1");
      const validTargets = validator.getValidTargets(filter, sourceCard!);

      // All targets must match ALL criteria
      expect(
        validTargets.every(
          (t) =>
            t.zone === "play" &&
            t.card.type === "character" &&
            t.owner !== sourceCard?.owner &&
            (t.meta as any)?.damaged === true &&
            t.card.cost <= 3 &&
            t.card.keywords?.includes("flying"),
        ),
      ).toBe(true);
    });

    it("should handle characteristics filtering", () => {
      const filter = new CardFilterBuilder()
        .inZone("play")
        .withAllCharacteristics(["legendary", "hero"])
        .build();

      const sourceCard = mockCards[0];
      const validTargets = validator.getValidTargets(filter, sourceCard);

      // All must have BOTH characteristics
      expect(
        validTargets.every((t) => {
          const chars = (t.card as any).characteristics || [];
          return chars.includes("legendary") && chars.includes("hero");
        }),
      ).toBe(true);
    });

    it("should combine excludeSelf with other filters", () => {
      const filter = new CardFilterBuilder()
        .inZone("play")
        .ofType("character")
        .excludeSelf()
        .build();

      const sourceCard = mockCards[0];
      const validTargets = validator.getValidTargets(filter, sourceCard);

      // Should not include source card
      expect(
        validTargets.find((t) => t.instanceId === sourceCard.instanceId),
      ).toBeUndefined();
    });
  });

  describe("Builder + Resolver + Validator Integration", () => {
    it("should work seamlessly across all three components", () => {
      // 1. Build filter
      const filter = new CardFilterBuilder()
        .inZone("play")
        .ofType("character")
        .withStrength("gte", 4)
        .count(1)
        .build();

      // 2. Resolve targets
      const sourceCard = mockCards[0];
      const resolvedTargets = resolver.resolveCardTargets(filter, sourceCard);

      // 3. Validate first target
      if (resolvedTargets.length > 0) {
        const isValid = validator.isValidTarget(
          filter,
          resolvedTargets[0],
          sourceCard,
        );
        expect(isValid).toBe(true);
      }

      // 4. Validate selection
      const validation = validator.validateTargetSelection(
        filter,
        resolvedTargets.slice(0, 1),
        sourceCard,
      );

      expect(validation.valid).toBe(true);
    });
  });

  describe("Error Handling", () => {
    it("should provide clear error for invalid target count", () => {
      const filter = new CardFilterBuilder().inZone("play").count(2).build();

      const sourceCard = mockCards[0];
      const validTargets = validator.getValidTargets(filter, sourceCard);

      // Select wrong number of targets
      const validation = validator.validateTargetSelection(
        filter,
        validTargets.slice(0, 1),
        sourceCard,
      );

      expect(validation.valid).toBe(false);
      expect(validation.reason).toBe("INCORRECT_TARGET_COUNT");
      expect(validation.message).toContain("Expected 2");
    });

    it("should provide clear error for Ward violation", () => {
      const filter: BaseCoreCardFilter = {
        zone: "play",
      };

      const sourceCard = mockCards.find((c) => c.owner === "player1");
      const wardCard = mockCards.find(
        (c) => c.card.keywords?.includes("ward") && c.owner === "player2",
      );

      const validation = validator.validateTargetSelection(
        filter,
        [wardCard!],
        sourceCard,
      );

      expect(validation.valid).toBe(false);
      expect(validation.reason).toBe("WARD_PROTECTION");
      expect(validation.message).toContain("Ward");
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
      type: "character",
      keywords: ["flying"],
      strength: 4,
      owner: "player1",
      zone: "play",
      meta: { ready: true },
    }),
    createMockCard({
      id: "card2",
      name: "Protected Mage",
      cost: 4,
      type: "character",
      keywords: ["ward"],
      strength: 3,
      owner: "player2",
      zone: "play",
      meta: { ready: true },
    }),
    createMockCard({
      id: "card3",
      name: "Goblin Warrior",
      cost: 2,
      type: "character",
      keywords: ["flying"],
      strength: 2,
      owner: "player2",
      zone: "play",
      meta: { damaged: true },
    }),
    createMockCard({
      id: "card4",
      name: "Ancient Dragon",
      cost: 6,
      type: "creature",
      keywords: ["flying"],
      strength: 7,
      owner: "player1",
      zone: "play",
      meta: { ready: true },
    }),
    createMockCard({
      id: "card5",
      name: "Legendary Hero",
      cost: 5,
      type: "character",
      keywords: ["ward"],
      strength: 5,
      owner: "player1",
      zone: "play",
      meta: { ready: true },
    }),
    createMockCard({
      id: "card6",
      name: "Hand Card",
      cost: 3,
      type: "character",
      keywords: [],
      strength: 3,
      owner: "player1",
      zone: "hand",
      meta: {},
    }),
    // Add more cards for testing
    createMockCard({
      id: "card7",
      name: "Scout",
      cost: 1,
      type: "character",
      keywords: [],
      strength: 1,
      owner: "player2",
      zone: "play",
      meta: { ready: true },
    }),
    createMockCard({
      id: "card8",
      name: "Archer",
      cost: 2,
      type: "character",
      keywords: [],
      strength: 2,
      owner: "player2",
      zone: "play",
      meta: { ready: true },
    }),
  ];
}

function createMockCard(config: {
  id: string;
  name: string;
  cost: number;
  type: string;
  keywords: string[];
  strength: number;
  owner: string;
  zone: string;
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
      type: config.type,
      keywords: config.keywords,
      strength: config.strength,
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
