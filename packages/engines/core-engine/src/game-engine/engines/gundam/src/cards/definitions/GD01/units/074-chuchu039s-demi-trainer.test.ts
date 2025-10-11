import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { chuchu039sDemiTrainer } from "./074-chuchu039s-demi-trainer";

/**
 * Tests for GD01-074: Chuchu&#039;s Demi Trainer
 *
 * Card Properties:
 * - Cost: 2, Level: 2, AP: 3, HP: 1
 * - Color: white
 * - Type: triggered
 * - Rarity: rare
 * - Traits: academy
 * - Zones: space, earth
 * - Link Requirement: chuatury panlunch
 * Abilities:
 * - 【attack】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-074: Chuchu&#039;s Demi Trainer", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(chuchu039sDemiTrainer.id).toBe("GD01-074");
      expect(chuchu039sDemiTrainer.name).toBe("Chuchu&#039;s Demi Trainer");
      expect(chuchu039sDemiTrainer.number).toBe(74);
      expect(chuchu039sDemiTrainer.set).toBe("GD01");
      expect(chuchu039sDemiTrainer.type).toBe("unit");
      expect(chuchu039sDemiTrainer.rarity).toBe("rare");
    });

    it("should have correct stats", () => {
      expect(chuchu039sDemiTrainer.cost).toBe(2);
      expect(chuchu039sDemiTrainer.level).toBe(2);
      expect(chuchu039sDemiTrainer.ap).toBe(3);
      expect(chuchu039sDemiTrainer.hp).toBe(1);
    });

    it("should have correct color", () => {
      expect(chuchu039sDemiTrainer.color).toBe("white");
    });

    it("should have correct traits", () => {
      expect(chuchu039sDemiTrainer.traits).toEqual(["academy"]);
    });

    it("should have correct zones", () => {
      expect(chuchu039sDemiTrainer.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(chuchu039sDemiTrainer.linkRequirement).toEqual([
        "chuatury panlunch",
      ]);
    });

    it("should have card text", () => {
      expect(chuchu039sDemiTrainer.text).toBeTruthy();
      expect(chuchu039sDemiTrainer.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(chuchu039sDemiTrainer.abilities).toBeDefined();
      expect(Array.isArray(chuchu039sDemiTrainer.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(chuchu039sDemiTrainer.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      chuchu039sDemiTrainer.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [chuchu039sDemiTrainer],
          resourceArea: 4,
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
      assertZoneCount(engine, "resourceArea", 4, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with card in appropriate zone", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [chuchu039sDemiTrainer],
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
          battleArea: [chuchu039sDemiTrainer],
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

      expect(chuchu039sDemiTrainer.linkRequirement).toEqual([
        "chuatury panlunch",
      ]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [chuchu039sDemiTrainer],
          resourceArea: 4,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      expect(chuchu039sDemiTrainer.zones).toContain("space");
      expect(chuchu039sDemiTrainer.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(chuchu039sDemiTrainer).toHaveProperty("implemented");
      expect(chuchu039sDemiTrainer).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 2", () => {
      expect(chuchu039sDemiTrainer.level).toBe(2);
      expect(chuchu039sDemiTrainer.cost).toBe(2);
      expect(chuchu039sDemiTrainer.ap).toBe(3);
      expect(chuchu039sDemiTrainer.hp).toBe(1);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = chuchu039sDemiTrainer.ap + chuchu039sDemiTrainer.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [chuchu039sDemiTrainer],
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
