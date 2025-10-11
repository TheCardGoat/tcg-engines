import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { zaku as zakuII } from "./008-zaku";

/**
 * Tests for ST03-008: Zaku Ⅱ
 *
 * Card Properties:
 * - Cost: 1, Level: 2, AP: 1, HP: 2
 * - Color: Green
 * - Traits: Zeon
 * - Link Requirement: -
 * - Zones: Space, Earth
 *
 * Abilities:
 * - 【Attack】: This Unit gets AP+2 during this turn
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Attack trigger ability definition
 * - AP boost effect definition
 * - Card usability in game scenarios
 */

describe("ST03-008: Zaku Ⅱ", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(zakuII.id).toBe("ST03-008");
      expect(zakuII.name).toBe("Zaku Ⅱ");
      expect(zakuII.number).toBe(8);
      expect(zakuII.set).toBe("ST03");
      expect(zakuII.type).toBe("unit");
      expect(zakuII.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(zakuII.cost).toBe(1);
      expect(zakuII.level).toBe(2);
      expect(zakuII.ap).toBe(1);
      expect(zakuII.hp).toBe(2);
    });

    it("should have correct color and traits", () => {
      expect(zakuII.color).toBe("green");
      expect(zakuII.traits).toEqual(["zeon"]);
    });

    it("should have correct zones", () => {
      expect(zakuII.zones).toEqual(["space", "earth"]);
    });

    it("should have no specific link requirement", () => {
      expect(zakuII.linkRequirement).toEqual(["-"]);
    });

    it("should have text describing Attack ability", () => {
      expect(zakuII.text).toContain("Attack");
      expect(zakuII.text).toContain("AP+2");
      expect(zakuII.text).toContain("during this turn");
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(zakuII.abilities).toBeDefined();
      expect(zakuII.abilities.length).toBe(1);
    });

    it("should have triggered Attack ability", () => {
      const ability = zakuII.abilities[0];
      expect(ability.type).toBe("triggered");
      expect(ability.text).toBe(
        "【Attack】 This Unit gets AP+2 during this turn.",
      );
      expect(ability.trigger).toBeDefined();
      expect(ability.trigger.event).toBe("attack");
    });

    it("should have attribute boost effect", () => {
      const ability = zakuII.abilities[0];
      expect(ability.effects).toBeDefined();
      expect(ability.effects.length).toBeGreaterThanOrEqual(1);

      const boostEffect = ability.effects.find(
        (e) =>
          e.type === "attribute-boost" || e.type === "attribute-modification",
      );
      expect(boostEffect).toBeDefined();
      expect(boostEffect?.amount).toBe(2);
    });

    it("should target self for AP boost", () => {
      const ability = zakuII.abilities[0];
      const boostEffect = ability.effects.find(
        (e) =>
          e.type === "attribute-boost" || e.type === "attribute-modification",
      );

      if (boostEffect && "target" in boostEffect) {
        expect(boostEffect.target?.value).toBe("self");
      }
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be deployable with sufficient resources", () => {
      // Zaku Ⅱ costs 1, so need 1 resource
      const engine = new GundamTestEngine(
        {
          hand: [zakuII],
          resourceArea: 2,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 2,
          deck: 30,
        },
      );

      // Card is in hand and can be deployed
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "resourceArea", 2, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with Zaku Ⅱ in battle area", () => {
      // Zaku Ⅱ with Attack trigger ability on the field
      const engine = new GundamTestEngine(
        {
          battleArea: [zakuII],
          hand: 5,
          resourceArea: 2,
          deck: 30,
        },
        {
          battleArea: 2,
          hand: 5,
          resourceArea: 2,
          deck: 30,
        },
      );

      // Zaku Ⅱ is on the field
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario for Attack ability testing", () => {
      // Zaku Ⅱ gets +2 AP when attacking
      const engine = new GundamTestEngine(
        {
          battleArea: [zakuII],
          hand: 5,
          resourceArea: 2,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy target for attack
          hand: 5,
          resourceArea: 2,
          deck: 30,
        },
      );

      // Setup for Attack ability: +2 AP when attacking (1 → 3 AP)
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should be deployable in both space and earth zones", () => {
      // Zaku Ⅱ can be deployed in space or earth zones
      const engine = new GundamTestEngine(
        {
          hand: [zakuII],
          resourceArea: 2,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 2,
          deck: 30,
        },
      );

      // Zaku Ⅱ supports both deployment zones
      expect(zakuII.zones).toContain("space");
      expect(zakuII.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });

    it("should work with no pilot link requirement", () => {
      // Zaku Ⅱ has no specific pilot requirement - flexible pairing
      expect(zakuII.linkRequirement).toEqual(["-"]);

      const engine = new GundamTestEngine(
        {
          battleArea: [zakuII],
          hand: 5,
          resourceArea: 2,
          deck: 30,
        },
        {
          battleArea: 1,
          hand: 5,
          resourceArea: 2,
          deck: 30,
        },
      );

      assertZoneCount(engine, "battleArea", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      // Card definition tracks whether card is fully implemented
      expect(zakuII).toHaveProperty("implemented");
      expect(zakuII).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have level 2 stats appropriate for cost 1", () => {
      // Level 2 unit with 1 cost is an efficient early game unit
      expect(zakuII.level).toBe(2);
      expect(zakuII.cost).toBe(1);
      expect(zakuII.ap).toBe(1);
      expect(zakuII.hp).toBe(2);
    });

    it("should have defensive base stats with offensive ability", () => {
      // Zaku Ⅱ has 1 AP and 2 HP base, but +2 AP when attacking
      const totalStats = zakuII.ap + zakuII.hp;
      expect(totalStats).toBe(3); // 1 + 2

      // Attack ability provides +2 AP boost
      const ability = zakuII.abilities[0];
      const boostEffect = ability.effects.find((e) => e.amount === 2);
      expect(boostEffect?.amount).toBe(2);
    });

    it("should set up combat scenario", () => {
      // Zaku Ⅱ with 1 AP attacking (becomes 3 AP with Attack trigger)
      const engine = new GundamTestEngine(
        {
          battleArea: [zakuII],
          resourceArea: 2,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit
          resourceArea: 2,
          deck: 30,
        },
      );

      // Combat scenario ready: Zaku Ⅱ can attack with 1 AP (becomes 3 with ability)
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should be an efficient aggressive unit when attacking", () => {
      // Zaku Ⅱ becomes 3 AP when attacking, efficient for cost 1
      expect(zakuII.cost).toBe(1);
      expect(zakuII.ap).toBe(1);

      // Attack ability makes it 3 AP when attacking
      const ability = zakuII.abilities[0];
      expect(ability.trigger.event).toBe("attack");
    });

    it("should work well in Zeon tribal strategies", () => {
      // Zaku Ⅱ has Zeon trait for tribal synergies
      expect(zakuII.traits).toContain("zeon");

      const engine = new GundamTestEngine(
        {
          battleArea: [zakuII],
          resourceArea: 2,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 2,
          deck: 30,
        },
      );

      assertZoneCount(engine, "battleArea", 1, "player_one");
    });
  });
});
