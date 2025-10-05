/**
 * Tests for Security Validation System
 *
 * Tests for SecurityRuleRegistry and automatic security checks
 * that prevent invalid targeting (Ward, protection abilities, etc.)
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
import { TargetResolver } from "../target-resolver";
import type { ValidationResult } from "../types";

// Mock types for testing
type TestCardDefinition = {
  id: string;
  name: string;
  cost: number;
  type: string;
  keywords?: string[];
};

type TestCardInstance = CoreCardInstance<TestCardDefinition>;

describe("Security Validation System", () => {
  let mockStore: CoreCardInstanceStore<TestCardDefinition>;
  let mockCards: TestCardInstance[];
  let resolver: TargetResolver<BaseCoreCardFilter, TestCardInstance>;
  let registry: SecurityRuleRegistry<TestCardInstance>;

  beforeEach(() => {
    mockCards = createMockCards();
    mockStore = createMockStore(mockCards);
    registry = new SecurityRuleRegistry<TestCardInstance>();
    resolver = new TargetResolver({}, mockStore, registry);
  });

  describe("SecurityRuleRegistry", () => {
    it("should start with empty rules", () => {
      const newRegistry = new SecurityRuleRegistry<TestCardInstance>();
      const rules = newRegistry.getAllRules();

      expect(rules).toEqual([]);
    });

    it("should register a security rule", () => {
      const rule: SecurityRule<TestCardInstance> = {
        id: "test-rule",
        name: "Test Rule",
        check: () => ({ valid: true }),
      };

      registry.registerRule(rule);
      const rules = registry.getAllRules();

      expect(rules).toHaveLength(1);
      expect(rules[0].id).toBe("test-rule");
    });

    it("should allow multiple rules to be registered", () => {
      const rule1: SecurityRule<TestCardInstance> = {
        id: "rule-1",
        name: "Rule 1",
        check: () => ({ valid: true }),
      };

      const rule2: SecurityRule<TestCardInstance> = {
        id: "rule-2",
        name: "Rule 2",
        check: () => ({ valid: true }),
      };

      registry.registerRule(rule1);
      registry.registerRule(rule2);

      expect(registry.getAllRules()).toHaveLength(2);
    });

    it("should prevent duplicate rule IDs", () => {
      const rule1: SecurityRule<TestCardInstance> = {
        id: "duplicate",
        name: "First",
        check: () => ({ valid: true }),
      };

      const rule2: SecurityRule<TestCardInstance> = {
        id: "duplicate",
        name: "Second",
        check: () => ({ valid: true }),
      };

      registry.registerRule(rule1);

      expect(() => registry.registerRule(rule2)).toThrow();
    });

    it("should allow unregistering rules", () => {
      const rule: SecurityRule<TestCardInstance> = {
        id: "removable",
        name: "Removable Rule",
        check: () => ({ valid: true }),
      };

      registry.registerRule(rule);
      expect(registry.getAllRules()).toHaveLength(1);

      registry.unregisterRule("removable");
      expect(registry.getAllRules()).toHaveLength(0);
    });
  });

  describe("Ward Protection (Built-in Rule)", () => {
    beforeEach(() => {
      // Register Ward protection for these tests
      registry.registerRule(
        BuiltInSecurityRules.createWardRule<TestCardInstance>(),
      );
    });

    it("should prevent opponent from targeting card with Ward", () => {
      const filter: BaseCoreCardFilter = {
        zone: "play",
        type: "character",
      };

      // Source card owned by player1
      const sourceCard = mockCards.find((c) => c.owner === "player1");

      // Target card with Ward owned by player2
      const wardCard = mockCards.find(
        (c) => c.card.keywords?.includes("ward") && c.owner === "player2",
      );

      const result = resolver.resolveCardTargets(filter, sourceCard);

      // Ward card should NOT be in results (protected from opponent)
      expect(
        result.find((c) => c.instanceId === wardCard?.instanceId),
      ).toBeUndefined();
    });

    it("should allow self-targeting card with Ward", () => {
      const filter: BaseCoreCardFilter = {
        zone: "play",
        owner: "self",
      };

      // Source card owned by player1
      const sourceCard = mockCards.find((c) => c.owner === "player1");

      // Target card with Ward ALSO owned by player1
      const ownWardCard = mockCards.find(
        (c) => c.card.keywords?.includes("ward") && c.owner === "player1",
      );

      const result = resolver.resolveCardTargets(filter, sourceCard);

      // Own Ward card SHOULD be in results (can target own cards)
      expect(
        result.find((c) => c.instanceId === ownWardCard?.instanceId),
      ).toBeDefined();
    });

    it("should not apply Ward to 'all' effects", () => {
      const filter: BaseCoreCardFilter = {
        zone: "play",
        count: "all",
      };

      // Source card owned by player1
      const sourceCard = mockCards.find((c) => c.owner === "player1");

      const result = resolver.resolveCardTargets(filter, sourceCard);

      // Ward cards should be included in "all" effects (Ward only protects from targeting)
      const wardCards = result.filter((c) => c.card.keywords?.includes("ward"));
      expect(wardCards.length).toBeGreaterThan(0);
    });

    it("should not apply Ward protection when no source card", () => {
      const filter: BaseCoreCardFilter = {
        zone: "play",
        type: "character",
      };

      // No source card provided
      const result = resolver.resolveCardTargets(filter);

      // Without source, can't determine opponent, so Ward doesn't apply
      const wardCards = result.filter((c) => c.card.keywords?.includes("ward"));
      expect(wardCards.length).toBeGreaterThan(0);
    });
  });

  describe("Custom Security Rules", () => {
    it("should apply custom security rule", () => {
      // Register a rule that prevents targeting cards with cost > 5
      const expensiveCardRule: SecurityRule<TestCardInstance> = {
        id: "no-expensive-targets",
        name: "Cannot Target Expensive Cards",
        check: (target, _source, _context) => {
          if ((target.card as any).cost > 5) {
            return {
              valid: false,
              reason: "EXPENSIVE_CARD",
              message: "Cannot target cards with cost greater than 5",
            };
          }
          return { valid: true };
        },
      };

      registry.registerRule(expensiveCardRule);

      const filter: BaseCoreCardFilter = {
        zone: "play",
      };

      const sourceCard = mockCards[0];
      const result = resolver.resolveCardTargets(filter, sourceCard);

      // No card with cost > 5 should be in results
      expect(result.every((c) => (c.card as any).cost <= 5)).toBe(true);
    });

    it("should apply multiple custom rules in sequence", () => {
      // Rule 1: No legendaries
      const noLegendariesRule: SecurityRule<TestCardInstance> = {
        id: "no-legendaries",
        name: "Cannot Target Legendaries",
        check: (target) => {
          const characteristics = (target.card as any).characteristics || [];
          if (characteristics.includes("legendary")) {
            return {
              valid: false,
              reason: "LEGENDARY_PROTECTION",
            };
          }
          return { valid: true };
        },
      };

      // Rule 2: No damaged cards
      const noDamagedRule: SecurityRule<TestCardInstance> = {
        id: "no-damaged",
        name: "Cannot Target Damaged Cards",
        check: (target) => {
          if ((target as any).meta?.damaged === true) {
            return {
              valid: false,
              reason: "DAMAGED_PROTECTION",
            };
          }
          return { valid: true };
        },
      };

      registry.registerRule(noLegendariesRule);
      registry.registerRule(noDamagedRule);

      const filter: BaseCoreCardFilter = {
        zone: "play",
      };

      const sourceCard = mockCards[0];
      const result = resolver.resolveCardTargets(filter, sourceCard);

      // No legendaries or damaged cards
      expect(
        result.every((c) => {
          const characteristics = (c.card as any).characteristics || [];
          return !(
            characteristics.includes("legendary") || (c as any).meta?.damaged
          );
        }),
      ).toBe(true);
    });

    it("should provide detailed error information", () => {
      const customRule: SecurityRule<TestCardInstance> = {
        id: "detailed-error",
        name: "Detailed Error Rule",
        check: (target) => {
          return {
            valid: false,
            reason: "CUSTOM_ERROR",
            message: "This target is invalid",
            details: {
              targetId: target.instanceId,
              targetName: (target.card as any).name,
            },
          };
        },
      };

      registry.registerRule(customRule);

      const filter: BaseCoreCardFilter = {
        zone: "play",
      };

      const sourceCard = mockCards[0];
      const result = resolver.resolveCardTargets(filter, sourceCard);

      // All cards should be filtered out by the rule
      expect(result).toHaveLength(0);
    });
  });

  describe("ValidationResult", () => {
    it("should support valid result", () => {
      const result: ValidationResult = {
        valid: true,
      };

      expect(result.valid).toBe(true);
      expect(result.reason).toBeUndefined();
      expect(result.message).toBeUndefined();
    });

    it("should support invalid result with reason", () => {
      const result: ValidationResult = {
        valid: false,
        reason: "WARD_PROTECTION",
      };

      expect(result.valid).toBe(false);
      expect(result.reason).toBe("WARD_PROTECTION");
    });

    it("should support invalid result with message", () => {
      const result: ValidationResult = {
        valid: false,
        reason: "CUSTOM_ERROR",
        message: "Card is protected",
      };

      expect(result.message).toBe("Card is protected");
    });

    it("should support invalid result with details", () => {
      const result: ValidationResult = {
        valid: false,
        reason: "INVALID_TARGET",
        details: {
          cardId: "card-123",
          ownerId: "player-456",
        },
      };

      expect(result.details).toEqual({
        cardId: "card-123",
        ownerId: "player-456",
      });
    });
  });

  describe("Integration with TargetResolver", () => {
    beforeEach(() => {
      // Register Ward protection for integration tests
      registry.registerRule(
        BuiltInSecurityRules.createWardRule<TestCardInstance>(),
      );
    });

    it("should apply security checks before quantity rules", () => {
      // Register rule that blocks specific card
      const blockSpecificCard: SecurityRule<TestCardInstance> = {
        id: "block-specific",
        name: "Block Specific Card",
        check: (target) => {
          if (target.instanceId === "instance-card2") {
            return { valid: false, reason: "BLOCKED" };
          }
          return { valid: true };
        },
      };

      registry.registerRule(blockSpecificCard);

      const filter: BaseCoreCardFilter = {
        zone: "play",
        count: 2,
      };

      const sourceCard = mockCards[0];
      const result = resolver.resolveCardTargets(filter, sourceCard);

      // Should not include the blocked card, even if asking for 2 cards
      expect(
        result.find((c) => c.instanceId === "instance-card2"),
      ).toBeUndefined();
    });

    it("should work with complex filters", () => {
      const filter: BaseCoreCardFilter = {
        zone: "play",
        type: "character",
        cost: { operator: "lte", value: 4 },
        owner: "opponent",
      };

      const sourceCard = mockCards.find((c) => c.owner === "player1");
      const result = resolver.resolveCardTargets(filter, sourceCard);

      // Ward protection should be applied automatically
      // Should only get opponent's characters with cost <= 4 WITHOUT Ward
      expect(
        result.every((c) => {
          return (
            c.card.type === "character" &&
            (c.card as any).cost <= 4 &&
            c.owner !== sourceCard?.owner &&
            !c.card.keywords?.includes("ward")
          );
        }),
      ).toBe(true);
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
      meta: { ready: true },
    }),
    createMockCard({
      id: "card2",
      name: "Protected Mage",
      cost: 4,
      type: "character",
      keywords: ["ward"], // Has Ward - opponent can't target
      owner: "player2",
      zone: "play",
      meta: { ready: true },
    }),
    createMockCard({
      id: "card3",
      name: "Goblin Warrior",
      cost: 2,
      type: "character",
      keywords: [],
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
      owner: "player1",
      zone: "play",
      meta: { ready: true },
    }),
    createMockCard({
      id: "card5",
      name: "Legendary Hero",
      cost: 5,
      type: "character",
      keywords: ["ward"], // Has Ward AND owned by player1
      owner: "player1",
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
