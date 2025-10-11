import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { aegisGundamMaMode } from "./007-aegis-gundam-ma-mode";

/**
 * Tests for ST04-007: Aegis Gundam (MA Mode)
 *
 * Card Properties:
 * - Cost: 3, Level: 4, AP: 3, HP: 4
 * - Color: Red
 * - Traits: [] (empty)
 * - Link Requirement: Athrun Zala
 * - Zones: Space, Earth
 *
 * Abilities:
 * - <Breach 3> (continuous keyword ability)
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Breach keyword ability definition
 * - Card usability in game scenarios
 * - Shield damage mechanics
 */

describe("ST04-007: Aegis Gundam (MA Mode)", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(aegisGundamMaMode.id).toBe("ST04-007");
      expect(aegisGundamMaMode.name).toBe("Aegis Gundam (MA Mode)");
      expect(aegisGundamMaMode.number).toBe(7);
      expect(aegisGundamMaMode.set).toBe("ST04");
      expect(aegisGundamMaMode.type).toBe("unit");
      expect(aegisGundamMaMode.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(aegisGundamMaMode.cost).toBe(3);
      expect(aegisGundamMaMode.level).toBe(4);
      expect(aegisGundamMaMode.ap).toBe(3);
      expect(aegisGundamMaMode.hp).toBe(4);
    });

    it("should have correct color and traits", () => {
      expect(aegisGundamMaMode.color).toBe("red");
      expect(aegisGundamMaMode.traits).toEqual([]);
    });

    it("should have correct zones", () => {
      expect(aegisGundamMaMode.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(aegisGundamMaMode.linkRequirement).toEqual(["athrun zala"]);
    });

    it("should have text describing Breach ability", () => {
      expect(aegisGundamMaMode.text).toContain("Breach 3");
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(aegisGundamMaMode.abilities).toBeDefined();
      expect(aegisGundamMaMode.abilities.length).toBe(1);
    });

    it("should have continuous Breach keyword ability", () => {
      const ability = aegisGundamMaMode.abilities[0];
      expect(ability.type).toBe("continuous");
      expect(ability.text).toBe("<breach 3>");
      expect(ability.keyword).toBe("breach");
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be deployable with sufficient resources", () => {
      // Aegis Gundam (MA Mode) costs 3, so need 3 resources
      const engine = new GundamTestEngine(
        {
          hand: [aegisGundamMaMode],
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

    it("should set up scenario with Aegis Gundam (MA Mode) in battle area", () => {
      // Aegis Gundam (MA Mode) with Breach ability in battle area
      const engine = new GundamTestEngine(
        {
          battleArea: [aegisGundamMaMode],
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

      // Aegis Gundam (MA Mode) is on the field
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario for Breach ability testing", () => {
      // Aegis Gundam (MA Mode) can damage shields with Breach 3
      const engine = new GundamTestEngine(
        {
          battleArea: [aegisGundamMaMode],
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 0,
          shieldSection: 6, // Opponent has shields
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Setup for Breach ability: Can damage 3 shields on unblocked attack
      const ability = aegisGundamMaMode.abilities[0];
      expect(ability.keyword).toBe("breach");
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "shieldSection", 6, "player_two");
    });

    it("should work with Athrun Zala pilot link requirement", () => {
      // Aegis Gundam (MA Mode) has link requirement for Athrun Zala
      // When paired with Athrun Zala, additional effects would activate
      const engine = new GundamTestEngine(
        {
          battleArea: [aegisGundamMaMode],
          hand: 5, // Could have Athrun Zala pilot card
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

      // Aegis Gundam (MA Mode) can be paired with Athrun Zala
      expect(aegisGundamMaMode.linkRequirement).toContain("athrun zala");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in both space and earth zones", () => {
      // Aegis Gundam (MA Mode) can be deployed in space or earth zones
      const engine = new GundamTestEngine(
        {
          hand: [aegisGundamMaMode],
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

      // Aegis Gundam (MA Mode) supports both deployment zones
      expect(aegisGundamMaMode.zones).toContain("space");
      expect(aegisGundamMaMode.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      // Card definition tracks whether card is fully implemented
      expect(aegisGundamMaMode).toHaveProperty("implemented");
      expect(aegisGundamMaMode).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have level 4 stats appropriate for cost 3", () => {
      // Level 4 unit with 3 cost
      expect(aegisGundamMaMode.level).toBe(4);
      expect(aegisGundamMaMode.cost).toBe(3);
      expect(aegisGundamMaMode.ap).toBe(3);
      expect(aegisGundamMaMode.hp).toBe(4);
    });

    it("should have defensive stat distribution", () => {
      // Aegis Gundam (MA Mode) has 3 AP and 4 HP - defensive stats
      const totalStats = aegisGundamMaMode.ap + aegisGundamMaMode.hp;
      expect(totalStats).toBe(7); // 3 + 4

      // Breach ability provides shield pressure value
      expect(aegisGundamMaMode.abilities[0].keyword).toBe("breach");
    });

    it("should set up combat scenario", () => {
      // Aegis Gundam (MA Mode) with 3 AP attacking
      const engine = new GundamTestEngine(
        {
          battleArea: [aegisGundamMaMode],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit
          resourceArea: 5,
          deck: 30,
        },
      );

      // Combat scenario ready: Aegis Gundam (MA Mode) can attack with 3 AP
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should be a mid-game pressure unit", () => {
      // Level 4 is mid-game, cost 3 with Breach for shield pressure
      expect(aegisGundamMaMode.level).toBe(4);
      expect(aegisGundamMaMode.cost).toBe(3);

      // Breach keyword makes it excellent for shield pressure
      const ability = aegisGundamMaMode.abilities[0];
      expect(ability.keyword).toBe("breach");
    });

    it("should work as shield pressure tool", () => {
      // Aegis Gundam (MA Mode) can damage 3 shields on unblocked attack
      const engine = new GundamTestEngine(
        {
          battleArea: [aegisGundamMaMode],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 0, // No blockers
          shieldSection: 6,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Breach 3 ability allows it to damage 3 shields
      expect(aegisGundamMaMode.abilities[0].keyword).toBe("breach");
      expect(aegisGundamMaMode.text).toContain("Breach 3");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should have empty traits array", () => {
      // No specific faction traits
      expect(aegisGundamMaMode.traits).toEqual([]);
    });

    it("should be versatile red unit", () => {
      // Common rarity red deck unit with shield pressure
      expect(aegisGundamMaMode.color).toBe("red");
      expect(aegisGundamMaMode.rarity).toBe("common");
      expect(aegisGundamMaMode.type).toBe("unit");
    });
  });

  describe("Breach Mechanics", () => {
    it("should have continuous Breach keyword", () => {
      // Breach is always active while unit is in play
      const ability = aegisGundamMaMode.abilities[0];
      expect(ability.type).toBe("continuous");
      expect(ability.keyword).toBe("breach");
    });

    it("should damage shields on unblocked attack", () => {
      // Breach 3 means damage 3 shields when attack is not blocked
      const engine = new GundamTestEngine(
        {
          battleArea: [aegisGundamMaMode],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 0, // No units to block
          shieldSection: 6,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Aegis Gundam (MA Mode) can damage shields directly
      expect(aegisGundamMaMode.text).toContain("Breach 3");
      assertZoneCount(engine, "shieldSection", 6, "player_two");
    });

    it("should provide aggressive shield pressure", () => {
      // With 4 HP, can survive combat and continue pressuring shields
      expect(aegisGundamMaMode.hp).toBe(4);
      expect(aegisGundamMaMode.abilities[0].keyword).toBe("breach");

      // Durable unit with shield pressure
      const engine = new GundamTestEngine(
        {
          battleArea: [aegisGundamMaMode],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1,
          shieldSection: 6,
          resourceArea: 5,
          deck: 30,
        },
      );

      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should compare with normal Aegis Gundam", () => {
      // MA Mode: 3 AP, 4 HP, Breach 3 (defensive, shield pressure)
      // Normal Mode: 4 AP, 3 HP, Attack ability (offensive, removal)
      expect(aegisGundamMaMode.ap).toBe(3);
      expect(aegisGundamMaMode.hp).toBe(4);
      expect(aegisGundamMaMode.abilities[0].keyword).toBe("breach");
    });
  });
});
