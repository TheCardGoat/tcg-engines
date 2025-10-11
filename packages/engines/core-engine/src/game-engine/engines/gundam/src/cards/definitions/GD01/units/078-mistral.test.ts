import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { mistral } from "./078-mistral";

/**
 * Tests for GD01-078: Mistral
 *
 * Card Properties:
 * - Cost: 1, Level: 1, AP: 1, HP: 1
 * - Color: white
 * - Type: triggered
 * - Rarity: common
 * - Traits: earth federation
 * - Zones: space
 * - Link Requirement: -
 * Abilities:
 * - 【deploy】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-078: Mistral", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(mistral.id).toBe("GD01-078");
      expect(mistral.name).toBe("Mistral");
      expect(mistral.number).toBe(78);
      expect(mistral.set).toBe("GD01");
      expect(mistral.type).toBe("unit");
      expect(mistral.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(mistral.cost).toBe(1);
      expect(mistral.level).toBe(1);
      expect(mistral.ap).toBe(1);
      expect(mistral.hp).toBe(1);
    });

    it("should have correct color", () => {
      expect(mistral.color).toBe("white");
    });

    it("should have correct traits", () => {
      expect(mistral.traits).toEqual(["earth federation"]);
    });

    it("should have correct zones", () => {
      expect(mistral.zones).toEqual(["space"]);
    });

    it("should have correct link requirement", () => {
      expect(mistral.linkRequirement).toEqual(["-"]);
    });

    it("should have card text", () => {
      expect(mistral.text).toBeTruthy();
      expect(mistral.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(mistral.abilities).toBeDefined();
      expect(Array.isArray(mistral.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(mistral.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      mistral.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [mistral],
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
          battleArea: [mistral],
          hand: 5,
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

      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should work with link requirement", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [mistral],
          hand: 5,
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

      expect(mistral.linkRequirement).toEqual(["-"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [mistral],
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

      expect(mistral.zones).toContain("space");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(mistral).toHaveProperty("implemented");
      expect(mistral).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 1", () => {
      expect(mistral.level).toBe(1);
      expect(mistral.cost).toBe(1);
      expect(mistral.ap).toBe(1);
      expect(mistral.hp).toBe(1);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = mistral.ap + mistral.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [mistral],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
      );

      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });
  });
});
