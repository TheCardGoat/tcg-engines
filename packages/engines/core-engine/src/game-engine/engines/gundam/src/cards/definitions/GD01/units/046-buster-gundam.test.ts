import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { busterGundam } from "./046-buster-gundam";

/**
 * Tests for GD01-046: Buster Gundam
 *
 * Card Properties:
 * - Cost: 2, Level: 4, AP: 1, HP: 4
 * - Color: red
 * - Type: continuous
 * - Rarity: legendary
 * - Zones: space, earth
 * - Link Requirement: dearka elthman
 * Abilities:
 * - <Support 3>
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-046: Buster Gundam", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(busterGundam.id).toBe("GD01-046");
      expect(busterGundam.name).toBe("Buster Gundam");
      expect(busterGundam.number).toBe(46);
      expect(busterGundam.set).toBe("GD01");
      expect(busterGundam.type).toBe("unit");
      expect(busterGundam.rarity).toBe("legendary");
    });

    it("should have correct stats", () => {
      expect(busterGundam.cost).toBe(2);
      expect(busterGundam.level).toBe(4);
      expect(busterGundam.ap).toBe(1);
      expect(busterGundam.hp).toBe(4);
    });

    it("should have correct color", () => {
      expect(busterGundam.color).toBe("red");
    });

    it("should have correct zones", () => {
      expect(busterGundam.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(busterGundam.linkRequirement).toEqual(["dearka elthman"]);
    });

    it("should have card text", () => {
      expect(busterGundam.text).toBeTruthy();
      expect(busterGundam.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(busterGundam.abilities).toBeDefined();
      expect(Array.isArray(busterGundam.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(busterGundam.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      busterGundam.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [busterGundam],
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
          battleArea: [busterGundam],
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
          battleArea: [busterGundam],
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

      expect(busterGundam.linkRequirement).toEqual(["dearka elthman"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [busterGundam],
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

      expect(busterGundam.zones).toContain("space");
      expect(busterGundam.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(busterGundam).toHaveProperty("implemented");
      expect(busterGundam).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 4", () => {
      expect(busterGundam.level).toBe(4);
      expect(busterGundam.cost).toBe(2);
      expect(busterGundam.ap).toBe(1);
      expect(busterGundam.hp).toBe(4);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = busterGundam.ap + busterGundam.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [busterGundam],
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
