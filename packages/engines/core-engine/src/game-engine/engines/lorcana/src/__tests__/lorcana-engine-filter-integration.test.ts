/**
 * Integration tests for LorcanaEngine filtering system with LorcanaCardFilterBuilder
 * These tests define the expected behavior using TDD approach
 */

import { beforeEach, describe, expect, it } from "bun:test";
import type {
  LorcanitoActionCard,
  LorcanitoCharacterCard,
  LorcanitoLocationCard,
} from "@lorcanito/lorcana-engine";
import { AbilityBuilder } from "~/game-engine/engines/lorcana/src/abilities/factory/ability-builder";
import {
  mockActionCard,
  mockCharacterCard,
  mockLocationCard,
} from "~/game-engine/engines/lorcana/src/testing/mockCards";
import type { LorcanaCardInstance } from "../cards/lorcana-card-instance";
import { LorcanaCardFilterBuilder } from "../lorcana-card-filter-builder";
import { LorcanaTestEngine } from "../testing/lorcana-test-engine";

const value = 5;

describe("LorcanaEngine Filter Integration", () => {
  let testEngine: LorcanaTestEngine;

  // Mock card definitions for testing
  const mockLowCostCharacter: LorcanitoCharacterCard = {
    ...mockCharacterCard,
    id: "low-cost-char",
    name: "Mickey Mouse",
    title: "Brave Little Tailor",
    cost: 2,
    strength: 3,
    willpower: 2,
    lore: 1,
    type: "character",
    inkwell: true,
    abilities: AbilityBuilder.fromText(
      "**Rush** _This character can quest the turn they're played._",
    ),
  };

  const mockHighCostCharacter: LorcanitoCharacterCard = {
    ...mockCharacterCard,
    id: "high-cost-char",
    name: "Beast",
    title: "Tragic Hero",
    cost: 6,
    strength: 5,
    willpower: 6,
    lore: 2,
    type: "character",
    inkwell: false,
    abilities: AbilityBuilder.fromText(
      `**Singer** ${value} _(This character counts as cost ${value} to sing songs.)_ **Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_`,
    ),
  };

  const mockAction: LorcanitoActionCard = {
    ...mockActionCard,
    id: "test-action",
    name: "Be Prepared",
    cost: 3,
    type: "action",
    inkwell: true,
    abilities: [],
  };

  const mockLocation: LorcanitoLocationCard = {
    ...mockLocationCard,
    id: "test-location",
    name: "Beast's Castle",
    title: "",
    cost: 4,
    willpower: 8,
    moveCost: 2,
    type: "location",
    inkwell: false,
    abilities: [],
  };

  beforeEach(() => {
    testEngine = new LorcanaTestEngine(
      {
        play: [mockLowCostCharacter, mockHighCostCharacter, mockLocation],
        hand: [mockAction],
        inkwell: [mockLowCostCharacter], // Same card can be in inkwell
        deck: 0, // No deck cards for cleaner testing
      },
      {
        deck: 0, // No opponent deck cards either
      },
    );
  });

  // =============================================================================
  // BASIC FILTERING TESTS
  // =============================================================================

  describe("Basic Attribute Filtering", () => {
    it("should filter by exact cost", () => {
      const filter = new LorcanaCardFilterBuilder().cost(2).build();

      const result = testEngine.queryCardsByFilter(filter);

      expect(result).toHaveLength(2); // Both Mickey cards (play + inkwell)
      expect(result.every((card) => card.card.cost === 2)).toBe(true);
    });

    it("should filter by cost range", () => {
      const filter = new LorcanaCardFilterBuilder()
        .cost({ min: 3, max: 5 })
        .build();

      const result = testEngine.queryCardsByFilter(filter);

      expect(result).toHaveLength(2); // Action (3) + Location (4)
      expect(
        result.every((card) => card.card.cost >= 3 && card.card.cost <= 5),
      ).toBe(true);
    });

    it("should filter by strength", () => {
      const filter = new LorcanaCardFilterBuilder()
        .strength({ min: 4 })
        .build();

      const result = testEngine.queryCardsByFilter(filter);

      expect(result).toHaveLength(1); // Only Beast
      expect(result[0].card.name).toBe("Beast");
    });

    it("should filter by card type", () => {
      const filter = new LorcanaCardFilterBuilder().type("character").build();

      const result = testEngine.queryCardsByFilter(filter);

      expect(result).toHaveLength(3); // Both characters + inkwell Mickey
      expect(result.every((card) => card.card.type === "character")).toBe(true);
    });

    it("should filter by inkable status", () => {
      const filter = new LorcanaCardFilterBuilder().inkable(true).build();

      const result = testEngine.queryCardsByFilter(filter);

      expect(result).toHaveLength(3); // Mickey (play + inkwell) + Action
      expect(result.every((card) => card.card.inkwell === true)).toBe(true);
    });
  });

  // =============================================================================
  // ZONE FILTERING TESTS
  // =============================================================================

  describe("Zone Filtering", () => {
    it("should filter by single zone", () => {
      const filter = new LorcanaCardFilterBuilder().inZone("play").build();

      const result = testEngine.queryCardsByFilter(filter);

      expect(result).toHaveLength(3); // Mickey, Beast, Location
      result.forEach((card) => {
        expect(testEngine.getCardZone(card.instanceId)).toBe("play");
      });
    });

    it("should filter by multiple zones", () => {
      const filter = new LorcanaCardFilterBuilder()
        .inZone("play", "hand")
        .build();

      const result = testEngine.queryCardsByFilter(filter);

      expect(result).toHaveLength(4); // 3 in play + 1 in hand
      result.forEach((card) => {
        const zone = testEngine.getCardZone(card.instanceId);
        expect(["play", "hand"]).toContain(zone);
      });
    });

    it("should filter by owner", () => {
      const filter = new LorcanaCardFilterBuilder()
        .ownedBy("player_one")
        .build();

      const result = testEngine.queryCardsByFilter(filter);

      expect(result.length).toBeGreaterThan(0);
      // All cards should belong to player_one in test setup
    });
  });

  // =============================================================================
  // CARD STATE FILTERING TESTS
  // =============================================================================

  describe("Card State Filtering", () => {
    it("should filter by exerted status", () => {
      // First exert a card
      const mickeyInPlay = testEngine.queryCardsByFilter(
        new LorcanaCardFilterBuilder()
          .name("Mickey Mouse")
          .inZone("play")
          .build(),
      )[0];

      testEngine.exertCard({ card: mickeyInPlay.instanceId, exerted: true });

      // Now filter for exerted cards
      const filter = new LorcanaCardFilterBuilder().exerted(true).build();

      const result = testEngine.queryCardsByFilter(filter);

      expect(result).toHaveLength(1);
      expect(result[0].instanceId).toBe(mickeyInPlay.instanceId);
    });

    it("should filter by ready (non-exerted) status", () => {
      // Exert one card
      const mickeyInPlay = testEngine.queryCardsByFilter(
        new LorcanaCardFilterBuilder()
          .name("Mickey Mouse")
          .inZone("play")
          .build(),
      )[0];

      testEngine.exertCard({ card: mickeyInPlay.instanceId, exerted: true });

      // Filter for ready cards
      const filter = new LorcanaCardFilterBuilder()
        .ready(true) // This should be equivalent to exerted(false)
        .inZone("play")
        .build();

      const result = testEngine.queryCardsByFilter(filter);

      expect(result).toHaveLength(2); // Beast + Location (not exerted)
      expect(
        result.every((card) => card.instanceId !== mickeyInPlay.instanceId),
      ).toBe(true);
    });

    it("should filter by damaged status", () => {
      // TODO: Add damage to a character first
      // This test will need damage mechanics implemented
      const filter = new LorcanaCardFilterBuilder().damaged(true).build();

      const result = testEngine.queryCardsByFilter(filter);

      // For now, expect no damaged cards in initial setup
      expect(result).toHaveLength(0);
    });
  });

  // =============================================================================
  // STRING ATTRIBUTE FILTERING TESTS
  // =============================================================================

  describe("String Attribute Filtering", () => {
    it("should filter by exact name", () => {
      const filter = new LorcanaCardFilterBuilder()
        .name("Mickey Mouse")
        .build();

      const result = testEngine.queryCardsByFilter(filter);

      expect(result).toHaveLength(2); // Play + Inkwell
      expect(result.every((card) => card.card.name === "Mickey Mouse")).toBe(
        true,
      );
    });

    it("should filter by name contains", () => {
      const filter = new LorcanaCardFilterBuilder()
        .nameContains("Beast")
        .build();

      const result = testEngine.queryCardsByFilter(filter);

      expect(result).toHaveLength(2); // Beast character + Beast's Castle
      expect(result.every((card) => card.card.name.includes("Beast"))).toBe(
        true,
      );
    });

    it("should filter by title", () => {
      const filter = new LorcanaCardFilterBuilder()
        .title("Brave Little Tailor")
        .build();

      const result = testEngine.queryCardsByFilter(filter);

      expect(result).toHaveLength(2); // Both Mickey cards
      expect(
        result.every((card) => card.card.title === "Brave Little Tailor"),
      ).toBe(true);
    });
  });

  // =============================================================================
  // KEYWORD AND ABILITY FILTERING TESTS
  // =============================================================================

  describe("Keyword and Ability Filtering", () => {
    it("should filter by keyword", () => {
      const filter = new LorcanaCardFilterBuilder().hasKeyword("rush").build();

      const result = testEngine.queryCardsByFilter(filter);

      expect(result).toHaveLength(2); // Both Mickey cards
      expect(
        result.every((card) => {
          return card.card.abilities.some(
            (ability: any) =>
              (ability.text && ability.text.toLowerCase().includes("rush")) ||
              (ability.keyword &&
                ability.keyword.toLowerCase().includes("rush")),
          );
        }),
      ).toBe(true);
    });

    it("should filter by ability", () => {
      const filter = new LorcanaCardFilterBuilder()
        .hasAbility("Singer 5")
        .build();

      const result = testEngine.queryCardsByFilter(filter);

      expect(result).toHaveLength(1); // Only Beast
      expect(result[0].card.name).toBe("Beast");
    });

    it("should filter by multiple keywords", () => {
      const filter = new LorcanaCardFilterBuilder()
        .hasKeyword("rush", "bodyguard")
        .build();

      const result = testEngine.queryCardsByFilter(filter);

      // Should find cards that have ANY of the specified keywords
      expect(result).toHaveLength(3); // Mickey (rush) + Beast (bodyguard)
      expect(
        result.some((card) => {
          return card.card.abilities.some(
            (ability: any) =>
              (ability.text && ability.text.toLowerCase().includes("rush")) ||
              (ability.keyword &&
                ability.keyword.toLowerCase().includes("rush")),
          );
        }),
      ).toBe(true);
      expect(
        result.some((card) => {
          return card.card.abilities.some(
            (ability: any) =>
              (ability.text &&
                ability.text.toLowerCase().includes("bodyguard")) ||
              (ability.keyword &&
                ability.keyword.toLowerCase().includes("bodyguard")),
          );
        }),
      ).toBe(true);
    });
  });

  // =============================================================================
  // LOGICAL OPERATOR TESTS
  // =============================================================================

  describe("Logical Operators", () => {
    it("should handle AND operations", () => {
      const filter = new LorcanaCardFilterBuilder()
        .type("character")
        .and(
          new LorcanaCardFilterBuilder().cost({ min: 5 }),
          new LorcanaCardFilterBuilder().hasKeyword("bodyguard"),
        )
        .build();

      const result = testEngine.queryCardsByFilter(filter);

      expect(result).toHaveLength(1); // Only Beast meets all criteria
      expect(result[0].card.name).toBe("Beast");
    });

    it("should handle OR operations", () => {
      const filter = new LorcanaCardFilterBuilder()
        .or(
          new LorcanaCardFilterBuilder().cost(2),
          new LorcanaCardFilterBuilder().type("action"),
        )
        .build();

      const result = testEngine.queryCardsByFilter(filter);

      // Should find Mickey (cost 2) + Action card
      expect(result).toHaveLength(3); // 2 Mickey + 1 Action
    });

    it("should handle NOT operations", () => {
      const filter = new LorcanaCardFilterBuilder()
        .type("character")
        .not(new LorcanaCardFilterBuilder().hasKeyword("rush"))
        .build();

      const result = testEngine.queryCardsByFilter(filter);

      expect(result).toHaveLength(1); // Only Beast (doesn't have rush)
      expect(result[0].card.name).toBe("Beast");
    });
  });

  // =============================================================================
  // COMPLEX FILTERING SCENARIOS
  // =============================================================================

  describe("Complex Filtering Scenarios", () => {
    it("should handle complex multi-criteria filters", () => {
      const filter = new LorcanaCardFilterBuilder()
        .inZone("play")
        .type("character")
        .cost({ min: 2, max: 6 })
        .exerted(false)
        .or(
          new LorcanaCardFilterBuilder().hasKeyword("rush"),
          new LorcanaCardFilterBuilder().strength({ min: 5 }),
        )
        .build();

      const result = testEngine.queryCardsByFilter(filter);

      // Should find characters in play, cost 2-6, not exerted, with rush OR high strength
      expect(result).toHaveLength(2); // Mickey (rush) + Beast (high strength)
    });

    it("should handle ink-specific filtering", () => {
      const filter = new LorcanaCardFilterBuilder()
        .inZone("inkwell")
        .exerted(false) // Ready ink
        .build();

      const result = testEngine.queryCardsByFilter(filter);

      expect(result).toHaveLength(1); // Mickey in inkwell, not exerted
      expect(testEngine.getCardZone(result[0].instanceId)).toBe("inkwell");
    });

    it("should handle location-specific filtering", () => {
      const filter = new LorcanaCardFilterBuilder()
        .type("location")
        .moveCost({ max: 3 })
        .build();

      const result = testEngine.queryCardsByFilter(filter);

      expect(result).toHaveLength(1); // Beast's Castle
      expect(result[0].card.name).toBe("Beast's Castle");
    });
  });

  // =============================================================================
  // GAME STATE INTEGRATION TESTS
  // =============================================================================

  describe("Game State Integration", () => {
    it("should reflect real-time game state changes", () => {
      // Get initial ready ink count
      const initialFilter = new LorcanaCardFilterBuilder()
        .inZone("inkwell")
        .exerted(false)
        .build();

      const initialResult = testEngine.queryCardsByFilter(initialFilter);
      expect(initialResult).toHaveLength(1);

      // Exert the ink card
      testEngine.exertCard({
        card: initialResult[0].instanceId,
        exerted: true,
      });

      // Query again - should now find no ready ink
      const afterExertResult = testEngine.queryCardsByFilter(initialFilter);
      expect(afterExertResult).toHaveLength(0);

      // Query for exerted ink should now find one
      const exertedFilter = new LorcanaCardFilterBuilder()
        .inZone("inkwell")
        .exerted(true)
        .build();

      const exertedResult = testEngine.queryCardsByFilter(exertedFilter);
      expect(exertedResult).toHaveLength(1);
    });

    it("should work with available ink calculation", () => {
      const availableInk = testEngine.getAvailableInk("player_one");
      expect(availableInk).toBe(1); // One ready ink card

      // Exert the ink
      const inkCard = testEngine.queryCardsByFilter(
        new LorcanaCardFilterBuilder().inZone("inkwell").exerted(false).build(),
      )[0];

      testEngine.exertCard({ card: inkCard.instanceId, exerted: true });

      // Available ink should now be 0
      const newAvailableInk = testEngine.getAvailableInk("player_one");
      expect(newAvailableInk).toBe(0);
    });
  });

  // =============================================================================
  // BUILDER INTEGRATION TESTS
  // =============================================================================

  describe("Builder Integration", () => {
    it("should work with static factory methods", () => {
      const filter = LorcanaCardFilterBuilder.create()
        .type("character")
        .cost(2)
        .build();

      const result = testEngine.queryCardsByFilter(filter);
      expect(result).toHaveLength(2); // Both Mickey cards
    });

    it("should work with static AND factory", () => {
      const filter = LorcanaCardFilterBuilder.and(
        new LorcanaCardFilterBuilder().type("character"),
        new LorcanaCardFilterBuilder().cost({ min: 5 }),
      ).build();

      const result = testEngine.queryCardsByFilter(filter);
      expect(result).toHaveLength(1); // Only Beast
    });

    it("should work with static OR factory", () => {
      const filter = LorcanaCardFilterBuilder.or(
        new LorcanaCardFilterBuilder().type("action"),
        new LorcanaCardFilterBuilder().type("location"),
      ).build();

      const result = testEngine.queryCardsByFilter(filter);
      expect(result).toHaveLength(2); // Action + Location
    });
  });

  // =============================================================================
  // PERFORMANCE AND EDGE CASE TESTS
  // =============================================================================

  describe("Edge Cases and Performance", () => {
    it("should handle empty filters", () => {
      const filter = new LorcanaCardFilterBuilder().build();
      const result = testEngine.queryCardsByFilter(filter);

      // Should return all cards
      expect(result).toHaveLength(5); // All cards in test setup
    });

    it("should handle filters with no matches", () => {
      const filter = new LorcanaCardFilterBuilder()
        .cost(99) // No card has cost 99
        .build();

      const result = testEngine.queryCardsByFilter(filter);
      expect(result).toHaveLength(0);
    });

    it("should handle multiple overlapping filters", () => {
      const filter = new LorcanaCardFilterBuilder()
        .type("character")
        .type("character") // Duplicate - should still work
        .build();

      const result = testEngine.queryCardsByFilter(filter);
      expect(result).toHaveLength(3); // All characters
    });

    it("should maintain filter immutability", () => {
      const builder = new LorcanaCardFilterBuilder().cost(2);
      const filter1 = builder.build();

      builder.strength(3); // Modify builder
      const filter2 = builder.build();

      // Original filter should be unchanged
      expect(filter1).toEqual({ cost: { exact: 2 } });
      expect(filter2).toEqual({
        cost: { exact: 2 },
        strength: { exact: 3 },
      });
    });
  });
});
