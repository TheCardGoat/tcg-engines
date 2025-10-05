/**
 * Tests for TargetValidator - High-Level Validation API
 *
 * Tests for validating targets before execution, providing clear
 * feedback on why a target selection is invalid.
 */

import { beforeEach, describe, expect, it } from "bun:test";
import type { CoreCardInstance } from "../../card/core-card-instance";
import type { CoreCardInstanceStore } from "../../card/core-card-instance-store";
import type { BaseCoreCardFilter } from "../../types/game-specific-types";
import {
  BuiltInSecurityRules,
  type SecurityRule,
  SecurityRuleRegistry,
} from "../security-rule-registry";
import { TargetValidator } from "../target-validator";
import type { ValidationResult } from "../types";

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

describe("TargetValidator - Validation APIs", () => {
  let mockStore: CoreCardInstanceStore<TestCardDefinition>;
  let mockCards: TestCardInstance[];
  let validator: TargetValidator<BaseCoreCardFilter, TestCardInstance>;
  let registry: SecurityRuleRegistry<TestCardInstance>;

  beforeEach(() => {
    mockCards = createMockCards();
    mockStore = createMockStore(mockCards);
    registry = new SecurityRuleRegistry<TestCardInstance>();
    registry.registerRule(
      BuiltInSecurityRules.createWardRule<TestCardInstance>(),
    );
    validator = new TargetValidator({}, mockStore, registry);
  });

  describe("Validation API", () => {
    it("should validate a valid single target selection", () => {
      const filter: BaseCoreCardFilter = {
        zone: "play",
        type: "character",
        count: 1,
      };

      // Select a valid character in play
      const targetCard = mockCards.find(
        (c) => c.zone === "play" && c.card.type === "character",
      );

      const sourceCard = mockCards[0];
      const result = validator.validateTargetSelection(
        filter,
        [targetCard!],
        sourceCard,
      );

      expect(result.valid).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it("should reject target not matching filter", () => {
      const filter: BaseCoreCardFilter = {
        zone: "play",
        type: "character",
        count: 1,
      };

      // Try to select a card NOT in play
      const targetCard = mockCards.find((c) => c.zone === "hand");

      const sourceCard = mockCards[0];
      const result = validator.validateTargetSelection(
        filter,
        [targetCard!],
        sourceCard,
      );

      expect(result.valid).toBe(false);
      expect(result.reason).toBe("TARGET_NOT_IN_VALID_SET");
    });

    it("should reject target blocked by security rule (Ward)", () => {
      const filter: BaseCoreCardFilter = {
        zone: "play",
        count: 1,
      };

      // Try to target opponent's Ward card
      const sourceCard = mockCards.find((c) => c.owner === "player1");
      const wardCard = mockCards.find(
        (c) => c.card.keywords?.includes("ward") && c.owner === "player2",
      );

      const result = validator.validateTargetSelection(
        filter,
        [wardCard!],
        sourceCard,
      );

      expect(result.valid).toBe(false);
      expect(result.reason).toBe("WARD_PROTECTION");
    });

    it("should reject too many targets", () => {
      const filter: BaseCoreCardFilter = {
        zone: "play",
        count: 1,
      };

      const targets = mockCards.filter((c) => c.zone === "play").slice(0, 2);
      const sourceCard = mockCards[0];

      const result = validator.validateTargetSelection(
        filter,
        targets,
        sourceCard,
      );

      expect(result.valid).toBe(false);
      expect(result.reason).toBe("INCORRECT_TARGET_COUNT");
    });

    it("should reject too few targets", () => {
      const filter: BaseCoreCardFilter = {
        zone: "play",
        count: 2,
      };

      const targets = mockCards.filter((c) => c.zone === "play").slice(0, 1);
      const sourceCard = mockCards[0];

      const result = validator.validateTargetSelection(
        filter,
        targets,
        sourceCard,
      );

      expect(result.valid).toBe(false);
      expect(result.reason).toBe("INCORRECT_TARGET_COUNT");
    });

    it("should accept up to N targets with upTo modifier", () => {
      const filter: BaseCoreCardFilter = {
        zone: "play",
        count: 3,
        upTo: true,
      };

      // Select 2 valid targets (less than 3, but upTo allows it)
      // Avoid Ward cards that would be filtered by security
      const sourceCard = mockCards[0]; // player1
      const targets = mockCards
        .filter((c) => c.zone === "play" && !c.card.keywords?.includes("ward"))
        .slice(0, 2);

      const result = validator.validateTargetSelection(
        filter,
        targets,
        sourceCard,
      );

      expect(result.valid).toBe(true);
    });

    it("should accept 0 targets with upTo modifier", () => {
      const filter: BaseCoreCardFilter = {
        zone: "play",
        count: 3,
        upTo: true,
      };

      const sourceCard = mockCards[0];

      const result = validator.validateTargetSelection(filter, [], sourceCard);

      expect(result.valid).toBe(true);
    });

    it("should reject exceeding upTo limit", () => {
      const filter: BaseCoreCardFilter = {
        zone: "play",
        count: 2,
        upTo: true,
      };

      // Select 3 targets (exceeds upTo: 2)
      const targets = mockCards.filter((c) => c.zone === "play").slice(0, 3);
      const sourceCard = mockCards[0];

      const result = validator.validateTargetSelection(
        filter,
        targets,
        sourceCard,
      );

      expect(result.valid).toBe(false);
      expect(result.reason).toBe("INCORRECT_TARGET_COUNT");
    });

    it("should handle 'all' count as valid for any number", () => {
      const filter: BaseCoreCardFilter = {
        zone: "play",
        count: "all",
      };

      const targets = mockCards.filter((c) => c.zone === "play");
      const sourceCard = mockCards[0];

      const result = validator.validateTargetSelection(
        filter,
        targets,
        sourceCard,
      );

      expect(result.valid).toBe(true);
    });

    it("should validate multiple targets all match filter", () => {
      const filter: BaseCoreCardFilter = {
        zone: "play",
        type: "character",
        count: 2,
      };

      // Select valid characters without Ward
      const sourceCard = mockCards[0]; // player1
      const targets = mockCards
        .filter(
          (c) =>
            c.zone === "play" &&
            c.card.type === "character" &&
            !c.card.keywords?.includes("ward"),
        )
        .slice(0, 2);

      const result = validator.validateTargetSelection(
        filter,
        targets,
        sourceCard,
      );

      expect(result.valid).toBe(true);
    });

    it("should reject if any target doesn't match filter", () => {
      const filter: BaseCoreCardFilter = {
        zone: "play",
        type: "character",
        count: 2,
      };

      // First target is valid, second is not a character
      const validTarget = mockCards.find(
        (c) => c.zone === "play" && c.card.type === "character",
      );
      const invalidTarget = mockCards.find(
        (c) => c.zone === "play" && c.card.type !== "character",
      );

      const sourceCard = mockCards[0];
      const result = validator.validateTargetSelection(
        filter,
        [validTarget!, invalidTarget!],
        sourceCard,
      );

      expect(result.valid).toBe(false);
      expect(result.reason).toBe("TARGET_NOT_IN_VALID_SET");
    });
  });

  describe("Get Valid Targets", () => {
    it("should return all valid targets for a filter", () => {
      const filter: BaseCoreCardFilter = {
        zone: "play",
        type: "character",
      };

      const sourceCard = mockCards[0];
      const validTargets = validator.getValidTargets(filter, sourceCard);

      const expectedCount = mockCards.filter(
        (c) => c.zone === "play" && c.card.type === "character",
      ).length;

      expect(validTargets.length).toBeGreaterThan(0);
      expect(validTargets.every((t) => t.zone === "play")).toBe(true);
      expect(validTargets.every((t) => t.card.type === "character")).toBe(true);
    });

    it("should exclude Ward cards from opponent targeting", () => {
      const filter: BaseCoreCardFilter = {
        zone: "play",
        owner: "opponent",
      };

      const sourceCard = mockCards.find((c) => c.owner === "player1");
      const validTargets = validator.getValidTargets(filter, sourceCard!);

      // Should not include any Ward cards
      expect(
        validTargets.every((t) => !t.card.keywords?.includes("ward")),
      ).toBe(true);
    });

    it("should include Ward cards for self-targeting", () => {
      const filter: BaseCoreCardFilter = {
        zone: "play",
        owner: "self",
      };

      const sourceCard = mockCards.find((c) => c.owner === "player1");
      const validTargets = validator.getValidTargets(filter, sourceCard!);

      // Should include Ward cards owned by player1
      const wardCards = validTargets.filter((t) =>
        t.card.keywords?.includes("ward"),
      );
      expect(wardCards.length).toBeGreaterThan(0);
    });

    it("should apply all filters correctly", () => {
      const filter: BaseCoreCardFilter = {
        zone: "play",
        type: "character",
        cost: { operator: "lte", value: 3 },
      };

      const sourceCard = mockCards[0];
      const validTargets = validator.getValidTargets(filter, sourceCard);

      expect(
        validTargets.every(
          (t) =>
            t.zone === "play" &&
            t.card.type === "character" &&
            t.card.cost <= 3,
        ),
      ).toBe(true);
    });

    it("should return empty array when no valid targets exist", () => {
      const filter: BaseCoreCardFilter = {
        zone: "play",
        cost: { operator: "eq", value: 999 },
      };

      const sourceCard = mockCards[0];
      const validTargets = validator.getValidTargets(filter, sourceCard);

      expect(validTargets).toEqual([]);
    });
  });

  describe("Check Target Validity", () => {
    it("should check if a single target is valid", () => {
      const filter: BaseCoreCardFilter = {
        zone: "play",
        type: "character",
      };

      const targetCard = mockCards.find(
        (c) => c.zone === "play" && c.card.type === "character",
      );
      const sourceCard = mockCards[0];

      const isValid = validator.isValidTarget(filter, targetCard!, sourceCard);

      expect(isValid).toBe(true);
    });

    it("should return false for invalid target", () => {
      const filter: BaseCoreCardFilter = {
        zone: "play",
        type: "character",
      };

      const targetCard = mockCards.find((c) => c.zone === "hand");
      const sourceCard = mockCards[0];

      const isValid = validator.isValidTarget(filter, targetCard!, sourceCard);

      expect(isValid).toBe(false);
    });

    it("should return false for Ward-protected target", () => {
      const filter: BaseCoreCardFilter = {
        zone: "play",
      };

      const sourceCard = mockCards.find((c) => c.owner === "player1");
      const wardCard = mockCards.find(
        (c) => c.card.keywords?.includes("ward") && c.owner === "player2",
      );

      const isValid = validator.isValidTarget(filter, wardCard!, sourceCard!);

      expect(isValid).toBe(false);
    });

    it("should return true for own Ward card", () => {
      const filter: BaseCoreCardFilter = {
        zone: "play",
      };

      const sourceCard = mockCards.find((c) => c.owner === "player1");
      const ownWardCard = mockCards.find(
        (c) => c.card.keywords?.includes("ward") && c.owner === "player1",
      );

      const isValid = validator.isValidTarget(
        filter,
        ownWardCard!,
        sourceCard!,
      );

      expect(isValid).toBe(true);
    });
  });

  describe("Validation with Context", () => {
    it("should pass context to security rules", () => {
      let contextReceived: any = null;

      const contextAwareRule: SecurityRule<TestCardInstance> = {
        id: "context-aware",
        name: "Context Aware Rule",
        check: (_target, _source, context) => {
          contextReceived = context;
          return { valid: true };
        },
      };

      registry.registerRule(contextAwareRule);

      const filter: BaseCoreCardFilter = { zone: "play" };
      const target = mockCards.find((c) => c.zone === "play");
      const sourceCard = mockCards[0];
      const context = { currentPlayer: "player1", turnPhase: "main" };

      validator.isValidTarget(filter, target!, sourceCard, context);

      expect(contextReceived).toEqual(context);
    });
  });

  describe("Error Messages", () => {
    it("should provide descriptive error for invalid count", () => {
      const filter: BaseCoreCardFilter = {
        zone: "play",
        count: 2,
      };

      const targets = mockCards.filter((c) => c.zone === "play").slice(0, 1);
      const sourceCard = mockCards[0];

      const result = validator.validateTargetSelection(
        filter,
        targets,
        sourceCard,
      );

      expect(result.valid).toBe(false);
      expect(result.message).toContain("Expected 2 target");
    });

    it("should provide error details for security violations", () => {
      const filter: BaseCoreCardFilter = {
        zone: "play",
      };

      const sourceCard = mockCards.find((c) => c.owner === "player1");
      const wardCard = mockCards.find(
        (c) => c.card.keywords?.includes("ward") && c.owner === "player2",
      );

      const result = validator.validateTargetSelection(
        filter,
        [wardCard!],
        sourceCard,
      );

      expect(result.valid).toBe(false);
      expect(result.details).toBeDefined();
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
      owner: "player1",
      zone: "play",
    }),
    createMockCard({
      id: "card2",
      name: "Protected Mage",
      cost: 4,
      type: "character",
      keywords: ["ward"],
      owner: "player2",
      zone: "play",
    }),
    createMockCard({
      id: "card3",
      name: "Goblin Warrior",
      cost: 2,
      type: "character",
      keywords: [],
      owner: "player2",
      zone: "play",
    }),
    createMockCard({
      id: "card4",
      name: "Ancient Dragon",
      cost: 6,
      type: "creature",
      keywords: ["flying"],
      owner: "player1",
      zone: "play",
    }),
    createMockCard({
      id: "card5",
      name: "Legendary Hero",
      cost: 5,
      type: "character",
      keywords: ["ward"],
      owner: "player1",
      zone: "play",
    }),
    createMockCard({
      id: "card6",
      name: "Hand Card",
      cost: 3,
      type: "character",
      keywords: [],
      owner: "player1",
      zone: "hand",
    }),
  ];
}

function createMockCard(config: {
  id: string;
  name: string;
  cost: number;
  type: string;
  keywords: string[];
  owner: string;
  zone: string;
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
    },
    meta: {},
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
