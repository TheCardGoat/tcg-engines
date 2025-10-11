import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { stealthStratagem } from "./116-stealth-stratagem";

/**
 * Tests for GD01-116: Stealth Stratagem
 *
 * Card Properties:
 * - Cost: 1, Level: 2
 * - Color: red
 * - Type: triggered
 * - Rarity: common
 * Abilities:
 * - 【action】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-116: Stealth Stratagem", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(stealthStratagem.id).toBe("GD01-116");
      expect(stealthStratagem.name).toBe("Stealth Stratagem");
      expect(stealthStratagem.number).toBe(116);
      expect(stealthStratagem.set).toBe("GD01");
      expect(stealthStratagem.type).toBe("command");
      expect(stealthStratagem.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(stealthStratagem.cost).toBe(1);
      expect(stealthStratagem.level).toBe(2);
    });

    it("should have correct color", () => {
      expect(stealthStratagem.color).toBe("red");
    });

    it("should have card text", () => {
      expect(stealthStratagem.text).toBeTruthy();
      expect(stealthStratagem.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(stealthStratagem.abilities).toBeDefined();
      expect(Array.isArray(stealthStratagem.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(stealthStratagem.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      stealthStratagem.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [stealthStratagem],
          resourceArea: 3,
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
      assertZoneCount(engine, "resourceArea", 3, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with card in appropriate zone", () => {
      const engine = new GundamTestEngine(
        {
          hand: [stealthStratagem],
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
      expect(stealthStratagem).toHaveProperty("implemented");
      expect(stealthStratagem).toHaveProperty("missingTestCase");
    });
  });
});
