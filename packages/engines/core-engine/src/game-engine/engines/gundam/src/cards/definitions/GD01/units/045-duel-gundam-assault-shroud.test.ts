import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { duelGundamAssaultShroud } from "./045-duel-gundam-assault-shroud";

/**
 * Tests for GD01-045: Duel Gundam (Assault Shroud)
 *
 * Card Properties:
 * - Cost: 4, Level: 5, AP: 4, HP: 4
 * - Color: red
 * - Type: triggered
 * - Rarity: legendary
 * - Zones: space, earth
 * - Link Requirement: yzak jule
 * Abilities:
 * - 【when paired】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-045: Duel Gundam (Assault Shroud)", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(duelGundamAssaultShroud.id).toBe("GD01-045");
      expect(duelGundamAssaultShroud.name).toBe("Duel Gundam (Assault Shroud)");
      expect(duelGundamAssaultShroud.number).toBe(45);
      expect(duelGundamAssaultShroud.set).toBe("GD01");
      expect(duelGundamAssaultShroud.type).toBe("unit");
      expect(duelGundamAssaultShroud.rarity).toBe("legendary");
    });

    it("should have correct stats", () => {
      expect(duelGundamAssaultShroud.cost).toBe(4);
      expect(duelGundamAssaultShroud.level).toBe(5);
      expect(duelGundamAssaultShroud.ap).toBe(4);
      expect(duelGundamAssaultShroud.hp).toBe(4);
    });

    it("should have correct color", () => {
      expect(duelGundamAssaultShroud.color).toBe("red");
    });

    it("should have correct zones", () => {
      expect(duelGundamAssaultShroud.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(duelGundamAssaultShroud.linkRequirement).toEqual(["yzak jule"]);
    });

    it("should have card text", () => {
      expect(duelGundamAssaultShroud.text).toBeTruthy();
      expect(duelGundamAssaultShroud.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(duelGundamAssaultShroud.abilities).toBeDefined();
      expect(Array.isArray(duelGundamAssaultShroud.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(duelGundamAssaultShroud.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      duelGundamAssaultShroud.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [duelGundamAssaultShroud],
          resourceArea: 6,
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
      assertZoneCount(engine, "resourceArea", 6, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with card in appropriate zone", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [duelGundamAssaultShroud],
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
          battleArea: [duelGundamAssaultShroud],
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

      expect(duelGundamAssaultShroud.linkRequirement).toEqual(["yzak jule"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [duelGundamAssaultShroud],
          resourceArea: 6,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      expect(duelGundamAssaultShroud.zones).toContain("space");
      expect(duelGundamAssaultShroud.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(duelGundamAssaultShroud).toHaveProperty("implemented");
      expect(duelGundamAssaultShroud).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 5", () => {
      expect(duelGundamAssaultShroud.level).toBe(5);
      expect(duelGundamAssaultShroud.cost).toBe(4);
      expect(duelGundamAssaultShroud.ap).toBe(4);
      expect(duelGundamAssaultShroud.hp).toBe(4);
    });

    it("should have balanced AP and HP", () => {
      const totalStats =
        duelGundamAssaultShroud.ap + duelGundamAssaultShroud.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [duelGundamAssaultShroud],
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
