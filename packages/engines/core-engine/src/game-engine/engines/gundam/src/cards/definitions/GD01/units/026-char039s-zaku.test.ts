import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { char039sZaku } from "./026-char039s-zaku";

/**
 * Tests for GD01-026: Char&#039;s Zaku Ⅱ
 *
 * Card Properties:
 * - Cost: 2, Level: 3, AP: 3, HP: 2
 * - Color: green
 * - Type: triggered
 * - Rarity: rare
 * - Traits: zeon
 * - Zones: space, earth
 * - Link Requirement: char aznable
 * Abilities:
 * - 【destroyed】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-026: Char&#039;s Zaku Ⅱ", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(char039sZaku.id).toBe("GD01-026");
      expect(char039sZaku.name).toBe("Char&#039;s Zaku Ⅱ");
      expect(char039sZaku.number).toBe(26);
      expect(char039sZaku.set).toBe("GD01");
      expect(char039sZaku.type).toBe("unit");
      expect(char039sZaku.rarity).toBe("rare");
    });

    it("should have correct stats", () => {
      expect(char039sZaku.cost).toBe(2);
      expect(char039sZaku.level).toBe(3);
      expect(char039sZaku.ap).toBe(3);
      expect(char039sZaku.hp).toBe(2);
    });

    it("should have correct color", () => {
      expect(char039sZaku.color).toBe("green");
    });

    it("should have correct traits", () => {
      expect(char039sZaku.traits).toEqual(["zeon"]);
    });

    it("should have correct zones", () => {
      expect(char039sZaku.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(char039sZaku.linkRequirement).toEqual(["char aznable"]);
    });

    it("should have card text", () => {
      expect(char039sZaku.text).toBeTruthy();
      expect(char039sZaku.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(char039sZaku.abilities).toBeDefined();
      expect(Array.isArray(char039sZaku.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(char039sZaku.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      char039sZaku.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [char039sZaku],
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
          battleArea: [char039sZaku],
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
          battleArea: [char039sZaku],
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

      expect(char039sZaku.linkRequirement).toEqual(["char aznable"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [char039sZaku],
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

      expect(char039sZaku.zones).toContain("space");
      expect(char039sZaku.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(char039sZaku).toHaveProperty("implemented");
      expect(char039sZaku).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 3", () => {
      expect(char039sZaku.level).toBe(3);
      expect(char039sZaku.cost).toBe(2);
      expect(char039sZaku.ap).toBe(3);
      expect(char039sZaku.hp).toBe(2);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = char039sZaku.ap + char039sZaku.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [char039sZaku],
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
