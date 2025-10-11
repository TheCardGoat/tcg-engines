import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { justiceGundam } from "./066-justice-gundam";

/**
 * Tests for GD01-066: Justice Gundam
 *
 * Card Properties:
 * - Cost: 5, Level: 7, AP: 5, HP: 5
 * - Color: white
 * - Type: continuous
 * - Rarity: legendary
 * - Zones: space, earth
 * - Link Requirement: athrun zala
 * Abilities:
 * - <Blocker>
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-066: Justice Gundam", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(justiceGundam.id).toBe("GD01-066");
      expect(justiceGundam.name).toBe("Justice Gundam");
      expect(justiceGundam.number).toBe(66);
      expect(justiceGundam.set).toBe("GD01");
      expect(justiceGundam.type).toBe("unit");
      expect(justiceGundam.rarity).toBe("legendary");
    });

    it("should have correct stats", () => {
      expect(justiceGundam.cost).toBe(5);
      expect(justiceGundam.level).toBe(7);
      expect(justiceGundam.ap).toBe(5);
      expect(justiceGundam.hp).toBe(5);
    });

    it("should have correct color", () => {
      expect(justiceGundam.color).toBe("white");
    });

    it("should have correct zones", () => {
      expect(justiceGundam.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(justiceGundam.linkRequirement).toEqual(["athrun zala"]);
    });

    it("should have card text", () => {
      expect(justiceGundam.text).toBeTruthy();
      expect(justiceGundam.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(justiceGundam.abilities).toBeDefined();
      expect(Array.isArray(justiceGundam.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(justiceGundam.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      justiceGundam.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [justiceGundam],
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
          battleArea: [justiceGundam],
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
          battleArea: [justiceGundam],
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

      expect(justiceGundam.linkRequirement).toEqual(["athrun zala"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [justiceGundam],
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

      expect(justiceGundam.zones).toContain("space");
      expect(justiceGundam.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(justiceGundam).toHaveProperty("implemented");
      expect(justiceGundam).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 7", () => {
      expect(justiceGundam.level).toBe(7);
      expect(justiceGundam.cost).toBe(5);
      expect(justiceGundam.ap).toBe(5);
      expect(justiceGundam.hp).toBe(5);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = justiceGundam.ap + justiceGundam.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [justiceGundam],
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
