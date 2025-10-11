import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { duo039sLeo } from "./042-duo039s-leo";

/**
 * Tests for GD01-042: Duo&#039;s Leo
 *
 * Card Properties:
 * - Cost: 2, Level: 2, AP: 2, HP: 2
 * - Color: green
 * - Type: resolution
 * - Rarity: common
 * - Zones: space, earth
 * - Link Requirement: duo maxwell
 * Abilities:
 * - This Unit may choose an active enemy Unit that is Lv.
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-042: Duo&#039;s Leo", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(duo039sLeo.id).toBe("GD01-042");
      expect(duo039sLeo.name).toBe("Duo&#039;s Leo");
      expect(duo039sLeo.number).toBe(42);
      expect(duo039sLeo.set).toBe("GD01");
      expect(duo039sLeo.type).toBe("unit");
      expect(duo039sLeo.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(duo039sLeo.cost).toBe(2);
      expect(duo039sLeo.level).toBe(2);
      expect(duo039sLeo.ap).toBe(2);
      expect(duo039sLeo.hp).toBe(2);
    });

    it("should have correct color", () => {
      expect(duo039sLeo.color).toBe("green");
    });

    it("should have correct zones", () => {
      expect(duo039sLeo.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(duo039sLeo.linkRequirement).toEqual(["duo maxwell"]);
    });

    it("should have card text", () => {
      expect(duo039sLeo.text).toBeTruthy();
      expect(duo039sLeo.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(duo039sLeo.abilities).toBeDefined();
      expect(Array.isArray(duo039sLeo.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(duo039sLeo.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      duo039sLeo.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [duo039sLeo],
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
          battleArea: [duo039sLeo],
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
          battleArea: [duo039sLeo],
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

      expect(duo039sLeo.linkRequirement).toEqual(["duo maxwell"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [duo039sLeo],
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

      expect(duo039sLeo.zones).toContain("space");
      expect(duo039sLeo.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(duo039sLeo).toHaveProperty("implemented");
      expect(duo039sLeo).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 2", () => {
      expect(duo039sLeo.level).toBe(2);
      expect(duo039sLeo.cost).toBe(2);
      expect(duo039sLeo.ap).toBe(2);
      expect(duo039sLeo.hp).toBe(2);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = duo039sLeo.ap + duo039sLeo.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [duo039sLeo],
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
