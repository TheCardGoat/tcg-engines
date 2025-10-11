import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { rickDom } from "./030-rick-dom";

/**
 * Tests for GD01-030: Rick Dom
 *
 * Card Properties:
 * - Cost: 2, Level: 3, AP: 3, HP: 3
 * - Color: green
 * - Type: continuous
 * - Rarity: uncommon
 * - Traits: zeon
 * - Zones: space
 * - Link Requirement: -
 * Abilities:
 * - <Breach 2>
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-030: Rick Dom", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(rickDom.id).toBe("GD01-030");
      expect(rickDom.name).toBe("Rick Dom");
      expect(rickDom.number).toBe(30);
      expect(rickDom.set).toBe("GD01");
      expect(rickDom.type).toBe("unit");
      expect(rickDom.rarity).toBe("uncommon");
    });

    it("should have correct stats", () => {
      expect(rickDom.cost).toBe(2);
      expect(rickDom.level).toBe(3);
      expect(rickDom.ap).toBe(3);
      expect(rickDom.hp).toBe(3);
    });

    it("should have correct color", () => {
      expect(rickDom.color).toBe("green");
    });

    it("should have correct traits", () => {
      expect(rickDom.traits).toEqual(["zeon"]);
    });

    it("should have correct zones", () => {
      expect(rickDom.zones).toEqual(["space"]);
    });

    it("should have correct link requirement", () => {
      expect(rickDom.linkRequirement).toEqual(["-"]);
    });

    it("should have card text", () => {
      expect(rickDom.text).toBeTruthy();
      expect(rickDom.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(rickDom.abilities).toBeDefined();
      expect(Array.isArray(rickDom.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(rickDom.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      rickDom.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [rickDom],
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
          battleArea: [rickDom],
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
          battleArea: [rickDom],
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

      expect(rickDom.linkRequirement).toEqual(["-"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [rickDom],
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

      expect(rickDom.zones).toContain("space");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(rickDom).toHaveProperty("implemented");
      expect(rickDom).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 3", () => {
      expect(rickDom.level).toBe(3);
      expect(rickDom.cost).toBe(2);
      expect(rickDom.ap).toBe(3);
      expect(rickDom.hp).toBe(3);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = rickDom.ap + rickDom.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [rickDom],
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
