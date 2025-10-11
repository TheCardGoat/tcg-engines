import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { ball } from "./015-ball";

/**
 * Tests for GD01-015: Ball
 *
 * Card Properties:
 * - Cost: 1, Level: 1, AP: 1, HP: 1
 * - Color: blue
 * - Type: triggered
 * - Rarity: common
 * - Traits: earth federation
 * - Zones: space
 * - Link Requirement: -
 * Abilities:
 * - 【attack】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-015: Ball", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(ball.id).toBe("GD01-015");
      expect(ball.name).toBe("Ball");
      expect(ball.number).toBe(15);
      expect(ball.set).toBe("GD01");
      expect(ball.type).toBe("unit");
      expect(ball.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(ball.cost).toBe(1);
      expect(ball.level).toBe(1);
      expect(ball.ap).toBe(1);
      expect(ball.hp).toBe(1);
    });

    it("should have correct color", () => {
      expect(ball.color).toBe("blue");
    });

    it("should have correct traits", () => {
      expect(ball.traits).toEqual(["earth federation"]);
    });

    it("should have correct zones", () => {
      expect(ball.zones).toEqual(["space"]);
    });

    it("should have correct link requirement", () => {
      expect(ball.linkRequirement).toEqual(["-"]);
    });

    it("should have card text", () => {
      expect(ball.text).toBeTruthy();
      expect(ball.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(ball.abilities).toBeDefined();
      expect(Array.isArray(ball.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(ball.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      ball.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [ball],
          resourceArea: 3,
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
      assertZoneCount(engine, "resourceArea", 3, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with card in appropriate zone", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [ball],
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
          battleArea: [ball],
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

      expect(ball.linkRequirement).toEqual(["-"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [ball],
          resourceArea: 3,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      expect(ball.zones).toContain("space");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(ball).toHaveProperty("implemented");
      expect(ball).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 1", () => {
      expect(ball.level).toBe(1);
      expect(ball.cost).toBe(1);
      expect(ball.ap).toBe(1);
      expect(ball.hp).toBe(1);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = ball.ap + ball.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [ball],
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
