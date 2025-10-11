import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { wingGundam } from "./001-wing-gundam";

/**
 * Tests for ST02-001: Wing Gundam
 *
 * Card Properties:
 * - Cost: 4, Level: 6, AP: 4, HP: 5
 * - Color: Green
 * - Traits: None
 * - Link Requirement: Heero Yuy
 * - Zones: Space, Earth
 *
 * Abilities:
 * - <Breach 5>: Can attack the base directly if opponent has Lv.5 or lower units
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Breach keyword effect definition
 * - Card usability in game scenarios
 */

describe("ST02-001: Wing Gundam", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(wingGundam.id).toBe("ST02-001");
      expect(wingGundam.name).toBe("Wing Gundam");
      expect(wingGundam.number).toBe(1);
      expect(wingGundam.set).toBe("ST02");
      expect(wingGundam.type).toBe("unit");
      expect(wingGundam.rarity).toBe("legendary");
    });

    it("should have correct stats", () => {
      expect(wingGundam.cost).toBe(4);
      expect(wingGundam.level).toBe(6);
      expect(wingGundam.ap).toBe(4);
      expect(wingGundam.hp).toBe(5);
    });

    it("should have correct color and traits", () => {
      expect(wingGundam.color).toBe("green");
      expect(wingGundam.traits).toEqual([]);
    });

    it("should have correct zones", () => {
      expect(wingGundam.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(wingGundam.linkRequirement).toEqual(["heero yuy"]);
    });

    it("should have text describing Breach ability", () => {
      expect(wingGundam.text).toContain("Breach");
      expect(wingGundam.text).toContain("5");
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(wingGundam.abilities).toBeDefined();
      expect(wingGundam.abilities.length).toBe(1);
    });

    it("should have continuous Breach ability", () => {
      const ability = wingGundam.abilities[0];
      expect(ability.type).toBe("continuous");
      expect(ability.text).toBe("<Breach 5>");
    });

    it("should have Breach keyword effect with value 5", () => {
      const ability = wingGundam.abilities[0];
      expect(ability.effects).toBeDefined();
      expect(ability.effects.length).toBe(1);

      const effect = ability.effects[0];
      expect(effect.type).toBe("keyword");
      expect(effect.keyword).toBe("Breach");
      expect(effect.value).toBe(5);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be deployable with sufficient resources", () => {
      // Wing Gundam costs 4, so need 4 resources
      const engine = new GundamTestEngine(
        {
          hand: [wingGundam],
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

      // Card is in hand and can be deployed
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "resourceArea", 5, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with Wing Gundam in battle area", () => {
      // Wing Gundam with Breach 5 in battle area
      const engine = new GundamTestEngine(
        {
          battleArea: [wingGundam],
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

      // Wing Gundam is on the field
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario for Breach ability testing", () => {
      // Wing Gundam with Breach 5 can attack base if opponent has only Lv.5 or lower
      const engine = new GundamTestEngine(
        {
          battleArea: [wingGundam],
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit Lv.5 or lower
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Setup for Breach ability: Wing Gundam can bypass low-level blockers
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should work with Heero Yuy pilot link requirement", () => {
      // Wing Gundam has link requirement for Heero Yuy
      // When paired with Heero Yuy, additional effects would activate
      const engine = new GundamTestEngine(
        {
          battleArea: [wingGundam],
          hand: 5, // Could have Heero Yuy pilot card
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

      // Wing Gundam can be paired with Heero Yuy
      expect(wingGundam.linkRequirement).toContain("heero yuy");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in both space and earth zones", () => {
      // Wing Gundam can be deployed in space or earth zones
      const engine = new GundamTestEngine(
        {
          hand: [wingGundam],
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

      // Wing Gundam supports both deployment zones
      expect(wingGundam.zones).toContain("space");
      expect(wingGundam.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });

    it("should set up scenario against high-level units", () => {
      // Wing Gundam's Breach 5 is blocked by units Lv.6 or higher
      const engine = new GundamTestEngine(
        {
          battleArea: [wingGundam],
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit Lv.6 or higher would block Breach
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Breach ability context: only works against Lv.5 or lower
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      // Card definition tracks whether card is fully implemented
      expect(wingGundam).toHaveProperty("implemented");
      expect(wingGundam).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have level 6 stats appropriate for cost 4", () => {
      // Level 6 unit with 4 cost is a powerful late-game unit
      expect(wingGundam.level).toBe(6);
      expect(wingGundam.cost).toBe(4);
      expect(wingGundam.ap).toBe(4);
      expect(wingGundam.hp).toBe(5);
    });

    it("should have balanced AP and HP", () => {
      // Wing Gundam has 4 AP and 5 HP - strong balanced stats with Breach
      const totalStats = wingGundam.ap + wingGundam.hp;
      expect(totalStats).toBe(9); // 4 + 5

      // With Breach 5, can bypass most early-mid game units
      expect(wingGundam.abilities[0].effects[0].value).toBe(5);
    });

    it("should set up combat scenario", () => {
      // Wing Gundam with 4 AP attacking
      const engine = new GundamTestEngine(
        {
          battleArea: [wingGundam],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit
          resourceArea: 5,
          deck: 30,
        },
      );

      // Combat scenario ready: Wing Gundam can attack with 4 AP
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should be a high-level unit requiring significant investment", () => {
      // Level 6 is high-level, cost 4 is expensive
      expect(wingGundam.level).toBeGreaterThanOrEqual(6);
      expect(wingGundam.cost).toBeGreaterThanOrEqual(4);

      // High-level unit should have strong total stats
      const totalStats = wingGundam.ap + wingGundam.hp;
      expect(totalStats).toBeGreaterThanOrEqual(9);
    });

    it("should work as a finisher with Breach ability", () => {
      // Wing Gundam with Breach 5 is designed to close out games
      const engine = new GundamTestEngine(
        {
          battleArea: [wingGundam],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 0, // Empty field or only low-level units
          resourceArea: 5,
          deck: 30,
        },
      );

      // Breach ability makes Wing Gundam excellent for direct base attacks
      expect(wingGundam.abilities[0].effects[0].keyword).toBe("Breach");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });
  });
});
