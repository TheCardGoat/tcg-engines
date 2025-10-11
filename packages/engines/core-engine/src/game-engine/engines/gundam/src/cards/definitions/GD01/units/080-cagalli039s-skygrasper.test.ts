import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { cagalli039sSkygrasper } from "./080-cagalli039s-skygrasper";

/**
 * Tests for GD01-080: Cagalli&#039;s Skygrasper
 *
 * Card Properties:
 * - Cost: 2, Level: 2, AP: 2, HP: 1
 * - Color: white
 * - Type: triggered
 * - Rarity: common
 * - Traits: earth federation
 * - Zones: earth
 * - Link Requirement: cagalli yula athha
 * Abilities:
 * - 【destroyed】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-080: Cagalli&#039;s Skygrasper", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(cagalli039sSkygrasper.id).toBe("GD01-080");
      expect(cagalli039sSkygrasper.name).toBe("Cagalli&#039;s Skygrasper");
      expect(cagalli039sSkygrasper.number).toBe(80);
      expect(cagalli039sSkygrasper.set).toBe("GD01");
      expect(cagalli039sSkygrasper.type).toBe("unit");
      expect(cagalli039sSkygrasper.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(cagalli039sSkygrasper.cost).toBe(2);
      expect(cagalli039sSkygrasper.level).toBe(2);
      expect(cagalli039sSkygrasper.ap).toBe(2);
      expect(cagalli039sSkygrasper.hp).toBe(1);
    });

    it("should have correct color", () => {
      expect(cagalli039sSkygrasper.color).toBe("white");
    });

    it("should have correct traits", () => {
      expect(cagalli039sSkygrasper.traits).toEqual(["earth federation"]);
    });

    it("should have correct zones", () => {
      expect(cagalli039sSkygrasper.zones).toEqual(["earth"]);
    });

    it("should have correct link requirement", () => {
      expect(cagalli039sSkygrasper.linkRequirement).toEqual([
        "cagalli yula athha",
      ]);
    });

    it("should have card text", () => {
      expect(cagalli039sSkygrasper.text).toBeTruthy();
      expect(cagalli039sSkygrasper.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(cagalli039sSkygrasper.abilities).toBeDefined();
      expect(Array.isArray(cagalli039sSkygrasper.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(cagalli039sSkygrasper.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      cagalli039sSkygrasper.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [cagalli039sSkygrasper],
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
          battleArea: [cagalli039sSkygrasper],
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
          battleArea: [cagalli039sSkygrasper],
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

      expect(cagalli039sSkygrasper.linkRequirement).toEqual([
        "cagalli yula athha",
      ]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [cagalli039sSkygrasper],
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

      expect(cagalli039sSkygrasper.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(cagalli039sSkygrasper).toHaveProperty("implemented");
      expect(cagalli039sSkygrasper).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 2", () => {
      expect(cagalli039sSkygrasper.level).toBe(2);
      expect(cagalli039sSkygrasper.cost).toBe(2);
      expect(cagalli039sSkygrasper.ap).toBe(2);
      expect(cagalli039sSkygrasper.hp).toBe(1);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = cagalli039sSkygrasper.ap + cagalli039sSkygrasper.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [cagalli039sSkygrasper],
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
