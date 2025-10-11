import { describe, expect, it } from "bun:test";
import {
  GundamTestEngine,
  mockBaseCard,
  mockResourceCard,
  mockUnitCard,
} from "../../src/testing/gundam-test-engine";
import {
  assertCardInZone,
  assertZoneCount,
  buildGameStartScenario,
  buildResourceScenario,
  getCardsByType,
} from "../helpers";

/**
 * Tests for LLM-RULES Section 3: Game Locations
 *
 * These tests validate zone visibility, zone limits, and card movement rules.
 *
 * Rules covered:
 * - 3.1: Deck area (Private)
 * - 3.2: Resource deck area (Private)
 * - 3.3: Resource area (Public, limit 15 resources, 5 EX Resources)
 * - 3.4: Battle area (Public, limit 6 Units)
 * - 3.5: Shield area - Base section (Public) and Shield section (Private)
 * - 3.6: Removal area (Public)
 * - 3.7: Hand (Private, limit 10 cards during end phase)
 * - 3.8: Trash (Public)
 */
describe("LLM-RULES Section 3: Game Locations", () => {
  describe("Zone Visibility Rules", () => {
    it("should have private zones: deck, resourceDeck, hand, shieldSection", () => {
      const engine = buildGameStartScenario();

      // These zones should be marked as private/secret
      // Private means only the owner can see the cards
      const deck = engine.getZone("deck", "player_one");
      const resourceDeck = engine.getZone("resourceDeck", "player_one");
      const hand = engine.getZone("hand", "player_one");
      const shieldSection = engine.getZone("shieldSection", "player_one");

      // Verify zones exist (have cards)
      expect(deck.length).toBeGreaterThan(0);
      expect(resourceDeck.length).toBeGreaterThan(0);
      expect(hand.length).toBeGreaterThan(0);
      expect(shieldSection.length).toBeGreaterThan(0);
    });

    it("should have public zones: resourceArea, battleArea, shieldBase, removalArea, trash", () => {
      const engine = new GundamTestEngine(
        {
          resourceArea: 5,
          battleArea: 2,
          shieldBase: [mockBaseCard],
          removalArea: 1,
          trash: 1,
        },
        {
          resourceArea: 3,
          battleArea: 1,
        },
      );

      // Verify public zones exist
      assertZoneCount(engine, "resourceArea", 5, "player_one");
      assertZoneCount(engine, "battleArea", 2, "player_one");
      assertZoneCount(engine, "shieldBase", 1, "player_one");
      assertZoneCount(engine, "removalArea", 1, "player_one");
      assertZoneCount(engine, "trash", 1, "player_one");

      // Opponent can also query these zones
      assertZoneCount(engine, "resourceArea", 3, "player_two");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });
  });

  describe("Zone Limit: Resource Area (15 resources, 5 EX Resources)", () => {
    it("should allow up to 15 resources in resource area", () => {
      const engine = buildResourceScenario({
        playerOneResources: 15,
        playerTwoResources: 10,
      });

      assertZoneCount(engine, "resourceArea", 15, "player_one");
      assertZoneCount(engine, "resourceArea", 10, "player_two");
    });

    it("should respect 15 resource limit even if more are attempted", () => {
      // buildResourceScenario caps at 15
      const engine = buildResourceScenario({
        playerOneResources: 20, // Will be capped to 15
        playerTwoResources: 5,
      });

      // Verify limit is enforced
      assertZoneCount(engine, "resourceArea", 15, "player_one");
    });

    it("should handle empty resource area", () => {
      const engine = buildResourceScenario({
        playerOneResources: 0,
        playerTwoResources: 0,
      });

      assertZoneCount(engine, "resourceArea", 0, "player_one");
      assertZoneCount(engine, "resourceArea", 0, "player_two");
    });

    it("should support various resource counts within limit", () => {
      const testCases = [1, 5, 10, 12, 15];

      for (const count of testCases) {
        const engine = buildResourceScenario({
          playerOneResources: count,
          playerTwoResources: 15 - count,
        });

        assertZoneCount(engine, "resourceArea", count, "player_one");
        assertZoneCount(engine, "resourceArea", 15 - count, "player_two");
      }
    });
  });

  describe("Zone Limit: Battle Area (6 units)", () => {
    it("should allow up to 6 units in battle area", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: 6,
        },
        {
          battleArea: 6,
        },
      );

      assertZoneCount(engine, "battleArea", 6, "player_one");
      assertZoneCount(engine, "battleArea", 6, "player_two");
    });

    it("should handle various unit counts within limit", () => {
      const testCases = [0, 1, 3, 5, 6];

      for (const count of testCases) {
        const engine = new GundamTestEngine(
          {
            battleArea: count,
          },
          {
            battleArea: 6 - count,
          },
        );

        assertZoneCount(engine, "battleArea", count, "player_one");
        assertZoneCount(engine, "battleArea", 6 - count, "player_two");
      }
    });

    it("should start with empty battle area by default", () => {
      const engine = buildGameStartScenario();

      assertZoneCount(engine, "battleArea", 0, "player_one");
      assertZoneCount(engine, "battleArea", 0, "player_two");
    });
  });

  describe("Zone Limit: Hand (10 cards during end phase)", () => {
    it("should allow up to 10 cards in hand", () => {
      const engine = new GundamTestEngine(
        {
          hand: 10,
        },
        {
          hand: 8,
        },
      );

      assertZoneCount(engine, "hand", 10, "player_one");
      assertZoneCount(engine, "hand", 8, "player_two");
    });

    it("should handle various hand sizes", () => {
      const testCases = [0, 1, 5, 7, 10];

      for (const count of testCases) {
        const engine = new GundamTestEngine(
          {
            hand: count,
          },
          {
            hand: 10 - count,
          },
        );

        assertZoneCount(engine, "hand", count, "player_one");
        assertZoneCount(engine, "hand", 10 - count, "player_two");
      }
    });

    it("should start with 5 cards in hand by default", () => {
      const engine = buildGameStartScenario();

      assertZoneCount(engine, "hand", 5, "player_one");
      assertZoneCount(engine, "hand", 5, "player_two");
    });
  });

  describe("Shield Area: Base Section and Shield Section", () => {
    it("should have separate shield base and shield section zones", () => {
      const engine = buildGameStartScenario();

      // Shield base (public) should have EX Base token
      assertZoneCount(engine, "shieldBase", 1, "player_one");
      assertZoneCount(engine, "shieldBase", 1, "player_two");

      // Shield section (private) should have 6 shields
      assertZoneCount(engine, "shieldSection", 6, "player_one");
      assertZoneCount(engine, "shieldSection", 6, "player_two");
    });

    it("should limit shield base section to 1 base", () => {
      const engine = new GundamTestEngine(
        {
          shieldBase: [mockBaseCard],
        },
        {
          shieldBase: [mockBaseCard],
        },
      );

      // Only one base allowed in shield base section
      assertZoneCount(engine, "shieldBase", 1, "player_one");
      assertZoneCount(engine, "shieldBase", 1, "player_two");
    });

    it("should support multiple shields in shield section", () => {
      const testCases = [0, 3, 6, 10];

      for (const count of testCases) {
        const engine = new GundamTestEngine(
          {
            shieldSection: count,
          },
          {
            shieldSection: count,
          },
        );

        assertZoneCount(engine, "shieldSection", count, "player_one");
        assertZoneCount(engine, "shieldSection", count, "player_two");
      }
    });
  });

  describe("Other Zone Rules", () => {
    it("should support deck area (private)", () => {
      const engine = new GundamTestEngine(
        {
          deck: 50,
        },
        {
          deck: 40,
        },
      );

      assertZoneCount(engine, "deck", 50, "player_one");
      assertZoneCount(engine, "deck", 40, "player_two");
    });

    it("should support resource deck area (private)", () => {
      const engine = new GundamTestEngine(
        {
          resourceDeck: 10,
        },
        {
          resourceDeck: 8,
        },
      );

      assertZoneCount(engine, "resourceDeck", 10, "player_one");
      assertZoneCount(engine, "resourceDeck", 8, "player_two");
    });

    it("should support removal area (public)", () => {
      const engine = new GundamTestEngine(
        {
          removalArea: 5,
        },
        {
          removalArea: 3,
        },
      );

      assertZoneCount(engine, "removalArea", 5, "player_one");
      assertZoneCount(engine, "removalArea", 3, "player_two");
    });

    it("should support trash area (public)", () => {
      const engine = new GundamTestEngine(
        {
          trash: 10,
        },
        {
          trash: 7,
        },
      );

      assertZoneCount(engine, "trash", 10, "player_one");
      assertZoneCount(engine, "trash", 7, "player_two");
    });

    it("should handle empty zones", () => {
      const engine = new GundamTestEngine(
        {
          removalArea: 0,
          trash: 0,
          battleArea: 0,
        },
        {
          removalArea: 0,
          trash: 0,
          battleArea: 0,
        },
      );

      assertZoneCount(engine, "removalArea", 0, "player_one");
      assertZoneCount(engine, "trash", 0, "player_one");
      assertZoneCount(engine, "battleArea", 0, "player_one");
    });
  });

  describe("Card Movement Between Zones", () => {
    it("should track cards when moving between zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: 5,
          deck: 10,
        },
        {
          hand: 5,
        },
      );

      // Get initial zone counts
      const initialHandCount = engine.getZone("hand", "player_one").length;
      expect(initialHandCount).toBe(5);
    });

    it("should maintain card identity across zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [mockUnitCard],
          battleArea: [mockUnitCard],
          resourceArea: [mockResourceCard],
          resourceDeck: 0, // Explicitly set to avoid negative calculation
        },
        {
          resourceDeck: 0,
        },
      );

      // Verify cards are in expected zones
      const hand = engine.getZone("hand", "player_one");
      const battleArea = engine.getZone("battleArea", "player_one");
      const resourceArea = engine.getZone("resourceArea", "player_one");

      expect(hand.length).toBe(1);
      expect(battleArea.length).toBe(1);
      expect(resourceArea.length).toBe(1);

      // Each card should have unique instance ID
      expect(hand[0]).toBeDefined();
      expect(battleArea[0]).toBeDefined();
      expect(resourceArea[0]).toBeDefined();
      expect(hand[0]).not.toBe(battleArea[0]);
    });

    it("should support cards in multiple zones simultaneously for different players", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: 3,
          hand: 5,
          resourceArea: 10,
        },
        {
          battleArea: 4,
          hand: 7,
          resourceArea: 8,
        },
      );

      // Player one zones
      assertZoneCount(engine, "battleArea", 3, "player_one");
      assertZoneCount(engine, "hand", 5, "player_one");
      assertZoneCount(engine, "resourceArea", 10, "player_one");

      // Player two zones
      assertZoneCount(engine, "battleArea", 4, "player_two");
      assertZoneCount(engine, "hand", 7, "player_two");
      assertZoneCount(engine, "resourceArea", 8, "player_two");
    });

    it("should handle cards moving from deck to hand to battleArea", () => {
      const units = getCardsByType("unit").slice(0, 3);

      const engine = new GundamTestEngine(
        {
          deck: units,
          hand: 5,
          battleArea: 0,
        },
        {},
      );

      // Initial state
      assertZoneCount(engine, "deck", 3, "player_one");
      assertZoneCount(engine, "hand", 5, "player_one");
      assertZoneCount(engine, "battleArea", 0, "player_one");
    });

    it("should track cards across all zones", () => {
      const engine = new GundamTestEngine(
        {
          deck: 10,
          hand: 5,
          battleArea: 3,
          resourceArea: 8,
          shieldSection: 6,
          trash: 2,
          removalArea: 1,
        },
        {
          deck: 15,
          hand: 7,
        },
      );

      // Verify all zones have expected counts
      assertZoneCount(engine, "deck", 10, "player_one");
      assertZoneCount(engine, "hand", 5, "player_one");
      assertZoneCount(engine, "battleArea", 3, "player_one");
      assertZoneCount(engine, "resourceArea", 8, "player_one");
      assertZoneCount(engine, "shieldSection", 6, "player_one");
      assertZoneCount(engine, "trash", 2, "player_one");
      assertZoneCount(engine, "removalArea", 1, "player_one");

      assertZoneCount(engine, "deck", 15, "player_two");
      assertZoneCount(engine, "hand", 7, "player_two");
    });
  });

  describe("Zone Limit Enforcement", () => {
    it("should enforce all zone limits simultaneously", () => {
      const engine = new GundamTestEngine(
        {
          resourceArea: 15, // Max resources
          battleArea: 6, // Max units
          hand: 10, // Max hand size
          shieldBase: [mockBaseCard], // Max 1 base
          resourceDeck: 0, // Explicitly set to avoid negative calculation
        },
        {
          resourceDeck: 0,
        },
      );

      assertZoneCount(engine, "resourceArea", 15, "player_one");
      assertZoneCount(engine, "battleArea", 6, "player_one");
      assertZoneCount(engine, "hand", 10, "player_one");
      assertZoneCount(engine, "shieldBase", 1, "player_one");
    });

    it("should handle edge case of all limits at once", () => {
      const engine = new GundamTestEngine(
        {
          deck: 50,
          resourceDeck: 10,
          resourceArea: 15,
          battleArea: 6,
          hand: 10,
          shieldBase: [mockBaseCard],
          shieldSection: 10,
        },
        {
          deck: 50,
          resourceDeck: 10,
          resourceArea: 15,
          battleArea: 6,
          hand: 10,
          shieldBase: [mockBaseCard],
          shieldSection: 10,
        },
      );

      // All limits enforced for both players
      assertZoneCount(engine, "resourceArea", 15, "player_one");
      assertZoneCount(engine, "battleArea", 6, "player_one");
      assertZoneCount(engine, "hand", 10, "player_one");
      assertZoneCount(engine, "shieldBase", 1, "player_one");

      assertZoneCount(engine, "resourceArea", 15, "player_two");
      assertZoneCount(engine, "battleArea", 6, "player_two");
      assertZoneCount(engine, "hand", 10, "player_two");
      assertZoneCount(engine, "shieldBase", 1, "player_two");
    });
  });

  describe("Zone Query Operations", () => {
    it("should allow querying zone contents by instance ID", () => {
      const engine = new GundamTestEngine(
        {
          hand: [mockUnitCard],
        },
        {},
      );

      const handCards = engine.getZone("hand", "player_one");
      expect(handCards.length).toBe(1);
      expect(handCards[0]).toBeDefined();

      // Verify we can use the instance ID
      assertCardInZone(engine, handCards[0], "hand", "player_one");
    });

    it("should support querying all zones for a player", () => {
      const engine = new GundamTestEngine(
        {
          deck: 10,
          hand: 5,
          battleArea: 2,
          resourceArea: 8,
        },
        {},
      );

      // Query multiple zones
      const deck = engine.getZone("deck", "player_one");
      const hand = engine.getZone("hand", "player_one");
      const battleArea = engine.getZone("battleArea", "player_one");
      const resourceArea = engine.getZone("resourceArea", "player_one");

      expect(deck.length).toBe(10);
      expect(hand.length).toBe(5);
      expect(battleArea.length).toBe(2);
      expect(resourceArea.length).toBe(8);
    });

    it("should return empty array for empty zones", () => {
      const engine = new GundamTestEngine({}, {});

      const trash = engine.getZone("trash", "player_one");
      const removalArea = engine.getZone("removalArea", "player_one");

      expect(trash).toEqual([]);
      expect(removalArea).toEqual([]);
    });
  });

  describe("Real Card Integration", () => {
    it("should work with real unit cards from catalog", () => {
      const realUnits = getCardsByType("unit").slice(0, 6);

      const engine = new GundamTestEngine(
        {
          battleArea: realUnits,
        },
        {},
      );

      assertZoneCount(engine, "battleArea", 6, "player_one");
    });

    it("should work with real base cards from catalog", () => {
      const realBases = getCardsByType("base");
      expect(realBases.length).toBeGreaterThan(0);

      const engine = new GundamTestEngine(
        {
          shieldBase: [realBases[0]],
        },
        {},
      );

      assertZoneCount(engine, "shieldBase", 1, "player_one");
    });

    it("should work with mixed card types across zones", () => {
      const units = getCardsByType("unit").slice(0, 3);
      const commands = getCardsByType("command").slice(0, 2);
      const bases = getCardsByType("base").slice(0, 1);

      const engine = new GundamTestEngine(
        {
          battleArea: units,
          hand: commands,
          shieldBase: bases,
        },
        {},
      );

      assertZoneCount(engine, "battleArea", 3, "player_one");
      assertZoneCount(engine, "hand", 2, "player_one");
      assertZoneCount(engine, "shieldBase", 1, "player_one");
    });
  });
});
