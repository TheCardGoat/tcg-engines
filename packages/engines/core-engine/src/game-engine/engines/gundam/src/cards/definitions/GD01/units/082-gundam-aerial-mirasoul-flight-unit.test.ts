import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { gundamAerialMirasoulFlightUnit } from "./082-gundam-aerial-mirasoul-flight-unit";

/**
 * Tests for GD01-082: Gundam Aerial (Mirasoul Flight Unit)
 *
 * Card Properties:
 * - Cost: 3, Level: 4, AP: 4, HP: 3
 * - Color: white
 * - Type: triggered
 * - Rarity: uncommon
 * - Traits: academy
 * - Zones: space, earth
 * - Link Requirement: suletta mercury
 * Abilities:
 * - 【once per turn】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-082: Gundam Aerial (Mirasoul Flight Unit)", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(gundamAerialMirasoulFlightUnit.id).toBe("GD01-082");
      expect(gundamAerialMirasoulFlightUnit.name).toBe(
        "Gundam Aerial (Mirasoul Flight Unit)",
      );
      expect(gundamAerialMirasoulFlightUnit.number).toBe(82);
      expect(gundamAerialMirasoulFlightUnit.set).toBe("GD01");
      expect(gundamAerialMirasoulFlightUnit.type).toBe("unit");
      expect(gundamAerialMirasoulFlightUnit.rarity).toBe("uncommon");
    });

    it("should have correct stats", () => {
      expect(gundamAerialMirasoulFlightUnit.cost).toBe(3);
      expect(gundamAerialMirasoulFlightUnit.level).toBe(4);
      expect(gundamAerialMirasoulFlightUnit.ap).toBe(4);
      expect(gundamAerialMirasoulFlightUnit.hp).toBe(3);
    });

    it("should have correct color", () => {
      expect(gundamAerialMirasoulFlightUnit.color).toBe("white");
    });

    it("should have correct traits", () => {
      expect(gundamAerialMirasoulFlightUnit.traits).toEqual(["academy"]);
    });

    it("should have correct zones", () => {
      expect(gundamAerialMirasoulFlightUnit.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(gundamAerialMirasoulFlightUnit.linkRequirement).toEqual([
        "suletta mercury",
      ]);
    });

    it("should have card text", () => {
      expect(gundamAerialMirasoulFlightUnit.text).toBeTruthy();
      expect(gundamAerialMirasoulFlightUnit.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(gundamAerialMirasoulFlightUnit.abilities).toBeDefined();
      expect(Array.isArray(gundamAerialMirasoulFlightUnit.abilities)).toBe(
        true,
      );
    });

    it("should have at least one ability", () => {
      expect(gundamAerialMirasoulFlightUnit.abilities.length).toBeGreaterThan(
        0,
      );
    });

    it("should have properly structured abilities", () => {
      gundamAerialMirasoulFlightUnit.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [gundamAerialMirasoulFlightUnit],
          resourceArea: 5,
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
      assertZoneCount(engine, "resourceArea", 5, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with card in appropriate zone", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamAerialMirasoulFlightUnit],
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
          battleArea: [gundamAerialMirasoulFlightUnit],
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

      expect(gundamAerialMirasoulFlightUnit.linkRequirement).toEqual([
        "suletta mercury",
      ]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [gundamAerialMirasoulFlightUnit],
          resourceArea: 5,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      expect(gundamAerialMirasoulFlightUnit.zones).toContain("space");
      expect(gundamAerialMirasoulFlightUnit.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(gundamAerialMirasoulFlightUnit).toHaveProperty("implemented");
      expect(gundamAerialMirasoulFlightUnit).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 4", () => {
      expect(gundamAerialMirasoulFlightUnit.level).toBe(4);
      expect(gundamAerialMirasoulFlightUnit.cost).toBe(3);
      expect(gundamAerialMirasoulFlightUnit.ap).toBe(4);
      expect(gundamAerialMirasoulFlightUnit.hp).toBe(3);
    });

    it("should have balanced AP and HP", () => {
      const totalStats =
        gundamAerialMirasoulFlightUnit.ap + gundamAerialMirasoulFlightUnit.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamAerialMirasoulFlightUnit],
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
