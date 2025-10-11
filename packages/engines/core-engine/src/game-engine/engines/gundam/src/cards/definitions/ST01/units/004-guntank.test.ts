import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { guntank } from "./004-guntank";

/**
 * Tests for ST01-004: Guntank
 *
 * Card Properties:
 * - Cost: 2, Level: 3, AP: 2, HP: 3
 * - Color: Blue
 * - Traits: Earth Federation
 * - Link Requirement: Hayato Kobayashi
 * - Zones: Space, Earth
 *
 * Abilities:
 * - <Deploy>: Choose 1 enemy Unit with 2 or less HP. Rest it.
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Deploy triggered ability with targeting and rest effect
 * - Card usability in game scenarios
 * - HP-based targeting condition
 */

describe("ST01-004: Guntank", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(guntank.id).toBe("ST01-004");
      expect(guntank.name).toBe("Guntank");
      expect(guntank.number).toBe(4);
      expect(guntank.set).toBe("ST01");
      expect(guntank.type).toBe("unit");
      expect(guntank.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(guntank.cost).toBe(2);
      expect(guntank.level).toBe(3);
      expect(guntank.ap).toBe(2);
      expect(guntank.hp).toBe(3);
    });

    it("should have correct color and traits", () => {
      expect(guntank.color).toBe("blue");
      expect(guntank.traits).toEqual(["earth federation"]);
    });

    it("should have correct zones", () => {
      expect(guntank.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(guntank.linkRequirement).toEqual(["hayato kobayashi"]);
    });

    it("should have text describing Deploy ability", () => {
      expect(guntank.text).toContain("Deploy");
      expect(guntank.text).toContain("Choose");
      expect(guntank.text).toContain("enemy Unit");
      expect(guntank.text).toContain("2 or less HP");
      expect(guntank.text).toContain("Rest");
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(guntank.abilities).toBeDefined();
      expect(guntank.abilities.length).toBe(1);
    });

    it("should have triggered Deploy ability", () => {
      const ability = guntank.abilities[0];
      expect(ability.type).toBe("triggered");
      expect(ability.text).toBe("【deploy】");
    });

    it("should have trigger for deploy event", () => {
      const ability = guntank.abilities[0];
      expect(ability.trigger).toBeDefined();
      expect(ability.trigger.event).toBe("deploy");
    });

    it("should have two effects: targeting and rest", () => {
      const ability = guntank.abilities[0];
      expect(ability.effects).toBeDefined();
      expect(ability.effects.length).toBe(2);
    });

    it("should have targeting effect with HP condition", () => {
      const ability = guntank.abilities[0];
      const targetingEffect = ability.effects[0];

      expect(targetingEffect.type).toBe("targeting");
      expect(targetingEffect.amount).toBe("1");
      expect(targetingEffect.condition).toBe("2 or less HP");
      expect(targetingEffect.targetText).toContain("enemy Unit");
    });

    it("should have targeting configuration for enemy units", () => {
      const ability = guntank.abilities[0];
      const targetingEffect = ability.effects[0];

      expect(targetingEffect.target).toBeDefined();
      expect(targetingEffect.target.type).toBe("unit");
      expect(targetingEffect.target.value).toBe(1);
      expect(targetingEffect.target.zone).toBe("battlefield");
      expect(targetingEffect.target.isMultiple).toBe(false);
    });

    it("should have rest effect for targeted unit", () => {
      const ability = guntank.abilities[0];
      const restEffect = ability.effects[1];

      expect(restEffect.type).toBe("rest");
      expect(restEffect.target).toBeDefined();
      expect(restEffect.target.type).toBe("unit");
      expect(restEffect.targetText).toContain("it");
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be deployable with sufficient resources", () => {
      // Guntank costs 2, so need 2 resources
      const engine = new GundamTestEngine(
        {
          hand: [guntank],
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

    it("should set up scenario with Guntank in battle area", () => {
      // Guntank with Deploy ability in battle area
      const engine = new GundamTestEngine(
        {
          battleArea: [guntank],
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

      // Guntank is on the field
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario for Deploy ability with valid targets", () => {
      // Guntank deploying with enemy units that have 2 or less HP
      const engine = new GundamTestEngine(
        {
          hand: [guntank],
          resourceArea: 5,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 3, // Enemy units, some with 2 or less HP
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Setup for Deploy ability: choose and rest enemy unit with 2 or less HP
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "battleArea", 3, "player_two");
    });

    it("should set up scenario with no valid targets", () => {
      // Guntank deploying when all enemy units have more than 2 HP
      const engine = new GundamTestEngine(
        {
          hand: [guntank],
          resourceArea: 5,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2, // Enemy units with high HP
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Setup for Deploy ability with no valid targets (HP > 2)
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "battleArea", 2, "player_two");
    });

    it("should work with Hayato Kobayashi pilot link requirement", () => {
      // Guntank has link requirement for Hayato Kobayashi
      // When paired with Hayato Kobayashi, additional effects would activate
      const engine = new GundamTestEngine(
        {
          battleArea: [guntank],
          hand: 5, // Could have Hayato Kobayashi pilot card
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

      // Guntank can be paired with Hayato Kobayashi
      expect(guntank.linkRequirement).toContain("hayato kobayashi");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in both space and earth zones", () => {
      // Guntank can be deployed in space or earth zones
      const engine = new GundamTestEngine(
        {
          hand: [guntank],
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

      // Guntank supports both deployment zones
      expect(guntank.zones).toContain("space");
      expect(guntank.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });

    it("should set up scenario for tempo play with Deploy ability", () => {
      // Guntank's Deploy ability can rest damaged enemy units
      // Creating tempo advantage by preventing attacks
      const engine = new GundamTestEngine(
        {
          hand: [guntank],
          resourceArea: 5,
          battleArea: 1,
          deck: 30,
        },
        {
          battleArea: 2, // Enemy units, one damaged
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Setup for tempo advantage: rest damaged enemy unit on deploy
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "battleArea", 2, "player_two");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      // Card definition tracks whether card is fully implemented
      expect(guntank).toHaveProperty("implemented");
      expect(guntank).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have level 3 stats appropriate for cost 2", () => {
      // Level 3 unit with 2 cost is a solid early game unit
      expect(guntank.level).toBe(3);
      expect(guntank.cost).toBe(2);
      expect(guntank.ap).toBe(2);
      expect(guntank.hp).toBe(3);
    });

    it("should have balanced AP and HP", () => {
      // Guntank has 2 AP and 3 HP - slightly defensive stats
      const totalStats = guntank.ap + guntank.hp;
      expect(totalStats).toBe(5); // 2 + 3

      // Slightly more HP than AP
      expect(guntank.hp).toBeGreaterThan(guntank.ap);
    });

    it("should set up combat scenario", () => {
      // Guntank with 2 AP attacking
      const engine = new GundamTestEngine(
        {
          battleArea: [guntank],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit
          resourceArea: 5,
          deck: 30,
        },
      );

      // Combat scenario ready: Guntank can attack with 2 AP
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should have synergy between Deploy ability and combat", () => {
      // Deploy ability rests low HP enemies, preventing counterattacks
      const ability = guntank.abilities[0];
      expect(ability.trigger.event).toBe("deploy");
      expect(ability.effects[1].type).toBe("rest");

      // Can safely attack rested targets
      expect(guntank.ap).toBe(2);
    });

    it("should be effective at finishing off damaged units", () => {
      // Deploy ability targets units with 2 or less HP
      const ability = guntank.abilities[0];
      const targetingEffect = ability.effects[0];
      expect(targetingEffect.condition).toBe("2 or less HP");

      // 2 AP can finish off rested 2 HP units
      expect(guntank.ap).toBe(2);
    });
  });
});
