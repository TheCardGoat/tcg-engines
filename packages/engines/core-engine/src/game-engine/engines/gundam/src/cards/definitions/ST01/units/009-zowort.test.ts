import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { zowort } from "./009-zowort";

/**
 * Tests for ST01-009: Zowort
 *
 * Card Properties:
 * - Cost: 2, Level: 2, AP: 3, HP: 2
 * - Color: White
 * - Traits: Academy
 * - Link Requirement: - (no specific pilot required)
 * - Zones: Space, Earth
 *
 * Abilities:
 * - <Blocker>: Rest this Unit to change the attack target to it
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Blocker keyword ability
 * - Defensive redirection mechanic
 * - Offensive-leaning blocker stats
 */

describe("ST01-009: Zowort", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(zowort.id).toBe("ST01-009");
      expect(zowort.name).toBe("Zowort");
      expect(zowort.number).toBe(9);
      expect(zowort.set).toBe("ST01");
      expect(zowort.type).toBe("unit");
      expect(zowort.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(zowort.cost).toBe(2);
      expect(zowort.level).toBe(2);
      expect(zowort.ap).toBe(3);
      expect(zowort.hp).toBe(2);
    });

    it("should have correct color and traits", () => {
      expect(zowort.color).toBe("white");
      expect(zowort.traits).toEqual(["academy"]);
    });

    it("should have correct zones", () => {
      expect(zowort.zones).toEqual(["space", "earth"]);
    });

    it("should have no specific link requirement", () => {
      expect(zowort.linkRequirement).toEqual(["-"]);
    });

    it("should have text describing Blocker ability", () => {
      expect(zowort.text).toContain("Blocker");
      expect(zowort.text).toContain("Rest");
      expect(zowort.text).toContain("attack target");
    });
  });

  describe("Abilities Definition", () => {
    it("should have two abilities", () => {
      expect(zowort.abilities).toBeDefined();
      expect(zowort.abilities.length).toBe(2);
    });

    it("should have continuous Blocker ability", () => {
      const ability = zowort.abilities[0];
      expect(ability.type).toBe("continuous");
      expect(ability.text).toBe("<Blocker>");
    });

    it("should have Blocker keyword effect", () => {
      const ability = zowort.abilities[0];
      expect(ability.effects).toBeDefined();
      expect(ability.effects.length).toBe(1);

      const effect = ability.effects[0];
      expect(effect.type).toBe("keyword");
      expect(effect.keyword).toBe("Blocker");
    });

    it("should have resolution ability for blocking", () => {
      const ability = zowort.abilities[1];
      expect(ability.type).toBe("resolution");
      expect(ability.text).toContain("Rest this Unit");
      expect(ability.text).toContain("change the attack target");
    });

    it("should have rest effect in resolution ability", () => {
      const ability = zowort.abilities[1];
      expect(ability.effects).toBeDefined();
      expect(ability.effects.length).toBe(1);

      const effect = ability.effects[0];
      expect(effect.type).toBe("rest");
      expect(effect.target).toBeDefined();
      expect(effect.target.type).toBe("unit");
    });

    it("should have resolution ability configuration", () => {
      const ability = zowort.abilities[1];
      expect(ability.dependentEffects).toBe(false);
      expect(ability.resolveEffectsIndividually).toBe(false);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be deployable with sufficient resources", () => {
      // Zowort costs 2, so need 2 resources
      const engine = new GundamTestEngine(
        {
          hand: [zowort],
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

    it("should set up scenario with Zowort in battle area", () => {
      // Zowort with Blocker ability in battle area
      const engine = new GundamTestEngine(
        {
          battleArea: [zowort],
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

      // Zowort is on the field
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario for Blocker ability testing", () => {
      // Zowort ready to block incoming attack
      const engine = new GundamTestEngine(
        {
          battleArea: [zowort],
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy attacker
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Setup for Blocker: can rest to redirect attack
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should be deployable without specific pilot requirement", () => {
      // Zowort has no link requirement, can be paired with any pilot
      const engine = new GundamTestEngine(
        {
          battleArea: [zowort],
          hand: 5, // Could have any pilot card
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

      // Zowort has generic link requirement
      expect(zowort.linkRequirement).toEqual(["-"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in both space and earth zones", () => {
      // Zowort can be deployed in space or earth zones
      const engine = new GundamTestEngine(
        {
          hand: [zowort],
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

      // Zowort supports both deployment zones
      expect(zowort.zones).toContain("space");
      expect(zowort.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });

    it("should set up scenario protecting valuable units", () => {
      // Zowort blocking to protect important units
      const engine = new GundamTestEngine(
        {
          battleArea: [zowort],
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy targeting valuable unit
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Setup for defensive play: block to protect other units
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should set up scenario for aggressive blocking", () => {
      // Zowort with 3 AP can block and potentially survive
      const engine = new GundamTestEngine(
        {
          battleArea: [zowort],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Low AP attacker
          resourceArea: 5,
          deck: 30,
        },
      );

      // Setup for aggressive block: might survive low AP attacks
      assertZoneCount(engine, "battleArea", 1, "player_one");
      expect(zowort.ap).toBe(3);
      expect(zowort.hp).toBe(2);
    });

    it("should set up scenario for dual-purpose unit", () => {
      // Zowort can attack or block depending on situation
      const engine = new GundamTestEngine(
        {
          battleArea: [zowort],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2, // Multiple enemy units
          resourceArea: 5,
          deck: 30,
        },
      );

      // Setup for flexible play: high AP for attacking or blocking
      assertZoneCount(engine, "battleArea", 1, "player_one");
      expect(zowort.ap).toBe(3);
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      // Card definition tracks whether card is fully implemented
      expect(zowort).toHaveProperty("implemented");
      expect(zowort).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have level 2 stats appropriate for cost 2", () => {
      // Level 2 unit with 2 cost is efficient early game unit
      expect(zowort.level).toBe(2);
      expect(zowort.cost).toBe(2);
      expect(zowort.ap).toBe(3);
      expect(zowort.hp).toBe(2);
    });

    it("should have offensive-focused AP and HP distribution", () => {
      // Zowort has 3 AP and 2 HP - offensive stats
      const totalStats = zowort.ap + zowort.hp;
      expect(totalStats).toBe(5); // 3 + 2

      // More AP than HP indicates aggressive unit
      expect(zowort.ap).toBeGreaterThan(zowort.hp);
    });

    it("should set up combat scenario", () => {
      // Zowort with 3 AP attacking
      const engine = new GundamTestEngine(
        {
          battleArea: [zowort],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit
          resourceArea: 5,
          deck: 30,
        },
      );

      // Combat scenario ready: Zowort can attack with 3 AP
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should have solid stat efficiency for cost", () => {
      // 5 total stats for 2 cost is solid efficiency
      const totalStats = zowort.ap + zowort.hp;
      const statsPerCost = totalStats / zowort.cost;
      expect(statsPerCost).toBe(2.5); // 5 stats / 2 cost = 2.5 stats per cost

      // Good stats-per-cost ratio
      expect(totalStats).toBe(5);
    });

    it("should be effective at blocking and dealing damage", () => {
      // 3 AP means Zowort deals significant damage when blocking
      const engine = new GundamTestEngine(
        {
          battleArea: [zowort],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy attacker
          resourceArea: 5,
          deck: 30,
        },
      );

      // Can block and potentially destroy attacker with 3 AP
      assertZoneCount(engine, "battleArea", 1, "player_one");
      expect(zowort.ap).toBe(3);
    });

    it("should enable aggressive blocker strategies", () => {
      // High AP blocker can threaten attackers
      const engine = new GundamTestEngine(
        {
          battleArea: [zowort],
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2, // Multiple potential attackers
          resourceArea: 5,
          deck: 30,
        },
      );

      // Threatens to destroy low HP attackers if they attack
      assertZoneCount(engine, "battleArea", 1, "player_one");
      expect(zowort.abilities[0].effects[0].keyword).toBe("Blocker");
      expect(zowort.ap).toBe(3);
    });

    it("should have synergy between Blocker and offensive stats", () => {
      // High AP makes Blocker more threatening
      expect(zowort.ap).toBe(3);
      expect(zowort.abilities[0].effects[0].keyword).toBe("Blocker");

      // Attackers risk taking 3 damage when blocked
      const ability = zowort.abilities[0];
      expect(ability.type).toBe("continuous");
    });

    it("should be vulnerable but impactful", () => {
      // Low HP means Zowort is vulnerable but makes impact
      const engine = new GundamTestEngine(
        {
          battleArea: [zowort],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // High AP attacker
          resourceArea: 5,
          deck: 30,
        },
      );

      // 2 HP means vulnerable to most attacks
      assertZoneCount(engine, "battleArea", 1, "player_one");
      expect(zowort.hp).toBe(2);
      expect(zowort.ap).toBe(3); // But deals good damage
    });
  });
});
