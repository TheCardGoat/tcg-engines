import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { riddheMarcenas } from "./089-riddhe-marcenas";

/**
 * Tests for GD01-089: Riddhe Marcenas
 *
 * Card Properties:
 * - Cost: 1, Level: 3
 * - Color: blue
 * - Type: triggered
 * - Rarity: common
 * - Traits: earth federation
 * Abilities:
 * - 【burst】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-089: Riddhe Marcenas", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(riddheMarcenas.id).toBe("GD01-089");
      expect(riddheMarcenas.name).toBe("Riddhe Marcenas");
      expect(riddheMarcenas.number).toBe(89);
      expect(riddheMarcenas.set).toBe("GD01");
      expect(riddheMarcenas.type).toBe("pilot");
      expect(riddheMarcenas.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(riddheMarcenas.cost).toBe(1);
      expect(riddheMarcenas.level).toBe(3);
    });

    it("should have correct color", () => {
      expect(riddheMarcenas.color).toBe("blue");
    });

    it("should have correct traits", () => {
      expect(riddheMarcenas.traits).toEqual(["earth federation"]);
    });

    it("should have card text", () => {
      expect(riddheMarcenas.text).toBeTruthy();
      expect(riddheMarcenas.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(riddheMarcenas.abilities).toBeDefined();
      expect(Array.isArray(riddheMarcenas.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(riddheMarcenas.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      riddheMarcenas.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [riddheMarcenas],
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
          hand: [riddheMarcenas],
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
      expect(riddheMarcenas).toHaveProperty("implemented");
      expect(riddheMarcenas).toHaveProperty("missingTestCase");
    });
  });
});
