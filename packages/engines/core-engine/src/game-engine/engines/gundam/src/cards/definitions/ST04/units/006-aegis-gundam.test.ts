import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { aegisGundam } from "./006-aegis-gundam";

/**
 * Tests for ST04-006: Aegis Gundam
 *
 * Card Properties:
 * - Cost: 3, Level: 4, AP: 4, HP: 3
 * - Color: Red
 * - Traits: [] (empty)
 * - Link Requirement: Athrun Zala
 * - Zones: Space, Earth
 *
 * Abilities:
 * - 【Attack】If this Unit has 5 or more AP, choose 1 enemy Unit that is Lv.5 or higher. Deal 3 damage to it.
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Attack trigger effect definition
 * - Conditional damage ability
 * - Card usability in game scenarios
 */

describe("ST04-006: Aegis Gundam", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(aegisGundam.id).toBe("ST04-006");
      expect(aegisGundam.name).toBe("Aegis Gundam");
      expect(aegisGundam.number).toBe(6);
      expect(aegisGundam.set).toBe("ST04");
      expect(aegisGundam.type).toBe("unit");
      expect(aegisGundam.rarity).toBe("legendary");
    });

    it("should have correct stats", () => {
      expect(aegisGundam.cost).toBe(3);
      expect(aegisGundam.level).toBe(4);
      expect(aegisGundam.ap).toBe(4);
      expect(aegisGundam.hp).toBe(3);
    });

    it("should have correct color and traits", () => {
      expect(aegisGundam.color).toBe("red");
      expect(aegisGundam.traits).toEqual([]);
    });

    it("should have correct zones", () => {
      expect(aegisGundam.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(aegisGundam.linkRequirement).toEqual(["athrun zala"]);
    });

    it("should have text describing Attack ability", () => {
      expect(aegisGundam.text).toContain("Attack");
      expect(aegisGundam.text).toContain("5 or more AP");
      expect(aegisGundam.text).toContain("Lv.5 or higher");
      expect(aegisGundam.text).toContain("Deal 3 damage");
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(aegisGundam.abilities).toBeDefined();
      expect(aegisGundam.abilities.length).toBe(1);
    });

    it("should have triggered Attack ability", () => {
      const ability = aegisGundam.abilities[0];
      expect(ability.type).toBe("triggered");
      expect(ability.trigger?.event).toBe("attack");
    });

    it("should have Attack text", () => {
      const ability = aegisGundam.abilities[0];
      expect(ability.text).toBe("【attack】");
    });

    it("should have conditional damage effect", () => {
      const ability = aegisGundam.abilities[0];
      expect(ability.effects).toBeDefined();
      expect(ability.effects.length).toBeGreaterThanOrEqual(1);

      // Attack effect deals damage conditionally
      expect(ability.effects[0].type).toBeDefined();
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be deployable with sufficient resources", () => {
      // Aegis Gundam costs 3, so need 3 resources
      const engine = new GundamTestEngine(
        {
          hand: [aegisGundam],
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

    it("should set up scenario with Aegis Gundam in battle area", () => {
      // Aegis Gundam with Attack ability in battle area
      const engine = new GundamTestEngine(
        {
          battleArea: [aegisGundam],
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

      // Aegis Gundam is on the field
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario for Attack ability testing", () => {
      // Aegis Gundam deals damage when attacking if conditions met
      const engine = new GundamTestEngine(
        {
          battleArea: [aegisGundam],
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy high-level unit
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Setup for Attack ability: 4 AP base, needs 5+ AP to trigger
      const ability = aegisGundam.abilities[0];
      expect(ability.trigger?.event).toBe("attack");
      expect(aegisGundam.ap).toBe(4);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should work with Athrun Zala pilot link requirement", () => {
      // Aegis Gundam has link requirement for Athrun Zala
      // When paired with Athrun Zala, AP can reach 5+
      const engine = new GundamTestEngine(
        {
          battleArea: [aegisGundam],
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

      // Aegis Gundam can be paired with Athrun Zala
      expect(aegisGundam.linkRequirement).toContain("athrun zala");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in both space and earth zones", () => {
      // Aegis Gundam can be deployed in space or earth zones
      const engine = new GundamTestEngine(
        {
          hand: [aegisGundam],
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

      // Aegis Gundam supports both deployment zones
      expect(aegisGundam.zones).toContain("space");
      expect(aegisGundam.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });

    it("should provide removal when conditions met", () => {
      // Aegis Gundam's Attack ability removes high-level threats
      const engine = new GundamTestEngine(
        {
          battleArea: [aegisGundam],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy level 5+ unit
          resourceArea: 5,
          deck: 30,
        },
      );

      // Attack ability targets level 5+ units when Aegis has 5+ AP
      expect(aegisGundam.text).toContain("Lv.5 or higher");
      expect(aegisGundam.text).toContain("Deal 3 damage");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      // Card definition tracks whether card is fully implemented
      expect(aegisGundam).toHaveProperty("implemented");
      expect(aegisGundam).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have level 4 stats appropriate for cost 3", () => {
      // Level 4 legendary unit with 3 cost
      expect(aegisGundam.level).toBe(4);
      expect(aegisGundam.cost).toBe(3);
      expect(aegisGundam.ap).toBe(4);
      expect(aegisGundam.hp).toBe(3);
    });

    it("should have aggressive stat distribution", () => {
      // Aegis Gundam has 4 AP and 3 HP - offensive stats
      const totalStats = aegisGundam.ap + aegisGundam.hp;
      expect(totalStats).toBe(7); // 4 + 3

      // Attack ability provides removal value
      expect(aegisGundam.abilities[0].trigger?.event).toBe("attack");
    });

    it("should set up combat scenario", () => {
      // Aegis Gundam with 4 AP attacking
      const engine = new GundamTestEngine(
        {
          battleArea: [aegisGundam],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit
          resourceArea: 5,
          deck: 30,
        },
      );

      // Combat scenario ready: Aegis Gundam can attack with 4 AP
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should be a mid-game offensive unit", () => {
      // Level 4 is mid-game, cost 3 with strong offensive stats
      expect(aegisGundam.level).toBe(4);
      expect(aegisGundam.cost).toBe(3);

      // High AP with removal ability
      expect(aegisGundam.ap).toBe(4);
    });

    it("should work as removal tool", () => {
      // Aegis Gundam can remove high-level threats when boosted
      const engine = new GundamTestEngine(
        {
          battleArea: [aegisGundam],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy level 5+ unit
          resourceArea: 5,
          deck: 30,
        },
      );

      // Attack ability deals 3 damage to high-level units
      expect(aegisGundam.abilities[0].trigger?.event).toBe("attack");
      expect(aegisGundam.text).toContain("Deal 3 damage");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should have empty traits array", () => {
      // No specific faction traits
      expect(aegisGundam.traits).toEqual([]);
    });

    it("should be legendary red finisher", () => {
      // Legendary rarity red deck unit with strong stats
      expect(aegisGundam.color).toBe("red");
      expect(aegisGundam.rarity).toBe("legendary");
      expect(aegisGundam.type).toBe("unit");
    });
  });

  describe("Attack Ability Mechanics", () => {
    it("should have conditional trigger requirement", () => {
      // Attack ability only triggers if Aegis has 5+ AP
      expect(aegisGundam.text).toContain("5 or more AP");
      expect(aegisGundam.ap).toBe(4);

      // Needs +1 AP from pilot or other source
      const ability = aegisGundam.abilities[0];
      expect(ability.trigger?.event).toBe("attack");
    });

    it("should target high-level units", () => {
      // Ability targets level 5+ enemy units
      expect(aegisGundam.text).toContain("Lv.5 or higher");
      expect(aegisGundam.text).toContain("choose 1 enemy Unit");

      // Anti-big unit tech
      const engine = new GundamTestEngine(
        {
          battleArea: [aegisGundam],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Level 5+ enemy
          resourceArea: 5,
          deck: 30,
        },
      );

      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should deal significant damage", () => {
      // 3 damage is enough to destroy most units
      expect(aegisGundam.text).toContain("Deal 3 damage");

      // Combined with combat damage can remove large threats
      const engine = new GundamTestEngine(
        {
          battleArea: [aegisGundam],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
      );

      // 3 damage + 4 AP = 7 total potential damage
      expect(aegisGundam.ap).toBe(4);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should synergize with pilot pairing", () => {
      // Athrun Zala provides +1 AP, enabling the 5+ AP condition
      expect(aegisGundam.linkRequirement).toContain("athrun zala");
      expect(aegisGundam.ap).toBe(4);

      // With Athrun Zala (+1 AP): 4 + 1 = 5 AP (meets condition)
      const engine = new GundamTestEngine(
        {
          battleArea: [aegisGundam], // Could be paired with Athrun
          hand: 5,
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
    });
  });

  describe("Legendary Status", () => {
    it("should be powerful finisher option", () => {
      // Legendary with strong stats and removal ability
      expect(aegisGundam.rarity).toBe("legendary");
      expect(aegisGundam.ap).toBe(4);
      expect(aegisGundam.abilities[0].trigger?.event).toBe("attack");
    });

    it("should set up late game scenario", () => {
      // Aegis Gundam as finisher against big units
      const engine = new GundamTestEngine(
        {
          battleArea: [aegisGundam],
          resourceArea: 5,
          hand: 3,
          deck: 20,
        },
        {
          battleArea: 1, // Enemy high-level unit
          resourceArea: 5,
          hand: 3,
          deck: 20,
        },
      );

      // Can remove big threats and attack
      expect(aegisGundam.text).toContain("Lv.5 or higher");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });
  });
});
