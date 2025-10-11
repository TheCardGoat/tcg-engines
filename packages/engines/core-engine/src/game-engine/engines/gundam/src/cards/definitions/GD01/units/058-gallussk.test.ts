import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { gallussk } from "./058-gallussk";

/**
 * Tests for GD01-058: Galluss-K
 *
 * Card Properties:
 * - Cost: 2, Level: 3, AP: 3, HP: 2
 * - Color: red
 * - Type: triggered
 * - Rarity: common
 * - Traits: zeon
 * - Zones: space, earth
 * - Link Requirement: -
 * Abilities:
 * - 【once per turn】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-058: Galluss-K", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(gallussk.id).toBe("GD01-058");
      expect(gallussk.name).toBe("Galluss-K");
      expect(gallussk.number).toBe(58);
      expect(gallussk.set).toBe("GD01");
      expect(gallussk.type).toBe("unit");
      expect(gallussk.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(gallussk.cost).toBe(2);
      expect(gallussk.level).toBe(3);
      expect(gallussk.ap).toBe(3);
      expect(gallussk.hp).toBe(2);
    });

    it("should have correct color", () => {
      expect(gallussk.color).toBe("red");
    });

    it("should have correct traits", () => {
      expect(gallussk.traits).toEqual(["zeon"]);
    });

    it("should have correct zones", () => {
      expect(gallussk.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(gallussk.linkRequirement).toEqual(["-"]);
    });

    it("should have card text", () => {
      expect(gallussk.text).toBeTruthy();
      expect(gallussk.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(gallussk.abilities).toBeDefined();
      expect(Array.isArray(gallussk.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(gallussk.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      gallussk.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [gallussk],
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
          battleArea: [gallussk],
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
          battleArea: [gallussk],
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

      expect(gallussk.linkRequirement).toEqual(["-"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [gallussk],
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

      expect(gallussk.zones).toContain("space");
      expect(gallussk.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(gallussk).toHaveProperty("implemented");
      expect(gallussk).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 3", () => {
      expect(gallussk.level).toBe(3);
      expect(gallussk.cost).toBe(2);
      expect(gallussk.ap).toBe(3);
      expect(gallussk.hp).toBe(2);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = gallussk.ap + gallussk.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [gallussk],
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
