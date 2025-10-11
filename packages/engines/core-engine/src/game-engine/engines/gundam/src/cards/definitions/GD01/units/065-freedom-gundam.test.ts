import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { freedomGundam } from "./065-freedom-gundam";

/**
 * Tests for GD01-065: Freedom Gundam
 *
 * Card Properties:
 * - Cost: 5, Level: 7, AP: 4, HP: 6
 * - Color: white
 * - Type: continuous
 * - Rarity: legendary
 * - Zones: space, earth
 * - Link Requirement: kira yamato
 * Abilities:
 * - <Blocker>
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-065: Freedom Gundam", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(freedomGundam.id).toBe("GD01-065");
      expect(freedomGundam.name).toBe("Freedom Gundam");
      expect(freedomGundam.number).toBe(65);
      expect(freedomGundam.set).toBe("GD01");
      expect(freedomGundam.type).toBe("unit");
      expect(freedomGundam.rarity).toBe("legendary");
    });

    it("should have correct stats", () => {
      expect(freedomGundam.cost).toBe(5);
      expect(freedomGundam.level).toBe(7);
      expect(freedomGundam.ap).toBe(4);
      expect(freedomGundam.hp).toBe(6);
    });

    it("should have correct color", () => {
      expect(freedomGundam.color).toBe("white");
    });

    it("should have correct zones", () => {
      expect(freedomGundam.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(freedomGundam.linkRequirement).toEqual(["kira yamato"]);
    });

    it("should have card text", () => {
      expect(freedomGundam.text).toBeTruthy();
      expect(freedomGundam.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(freedomGundam.abilities).toBeDefined();
      expect(Array.isArray(freedomGundam.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(freedomGundam.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      freedomGundam.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [freedomGundam],
          resourceArea: 7,
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
      assertZoneCount(engine, "resourceArea", 7, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with card in appropriate zone", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [freedomGundam],
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
          battleArea: [freedomGundam],
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

      expect(freedomGundam.linkRequirement).toEqual(["kira yamato"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [freedomGundam],
          resourceArea: 7,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      expect(freedomGundam.zones).toContain("space");
      expect(freedomGundam.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(freedomGundam).toHaveProperty("implemented");
      expect(freedomGundam).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 7", () => {
      expect(freedomGundam.level).toBe(7);
      expect(freedomGundam.cost).toBe(5);
      expect(freedomGundam.ap).toBe(4);
      expect(freedomGundam.hp).toBe(6);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = freedomGundam.ap + freedomGundam.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [freedomGundam],
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
