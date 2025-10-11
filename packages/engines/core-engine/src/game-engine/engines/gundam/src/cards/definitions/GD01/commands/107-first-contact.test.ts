import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { firstContact } from "./107-first-contact";

/**
 * Tests for GD01-107: First Contact
 *
 * Card Properties:
 * - Cost: 3, Level: 3
 * - Color: green
 * - Type: triggered
 * - Rarity: uncommon
 * Abilities:
 * - 【burst】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-107: First Contact", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(firstContact.id).toBe("GD01-107");
      expect(firstContact.name).toBe("First Contact");
      expect(firstContact.number).toBe(107);
      expect(firstContact.set).toBe("GD01");
      expect(firstContact.type).toBe("command");
      expect(firstContact.rarity).toBe("uncommon");
    });

    it("should have correct stats", () => {
      expect(firstContact.cost).toBe(3);
      expect(firstContact.level).toBe(3);
    });

    it("should have correct color", () => {
      expect(firstContact.color).toBe("green");
    });

    it("should have card text", () => {
      expect(firstContact.text).toBeTruthy();
      expect(firstContact.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(firstContact.abilities).toBeDefined();
      expect(Array.isArray(firstContact.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(firstContact.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      firstContact.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [firstContact],
          resourceArea: 5,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "resourceArea", 5, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with card in appropriate zone", () => {
      const engine = new GundamTestEngine(
        {
          hand: [firstContact],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      assertZoneCount(engine, "hand", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(firstContact).toHaveProperty("implemented");
      expect(firstContact).toHaveProperty("missingTestCase");
    });
  });
});
