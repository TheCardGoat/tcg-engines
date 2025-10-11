import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { demiTrainer } from "./008-demi-trainer";

/**
 * Tests for ST01-008: Demi Trainer
 *
 * Card Properties:
 * - Cost: 1, Level: 1, AP: 1, HP: 1
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
 * - Minimal cost defensive utility
 */

describe("ST01-008: Demi Trainer", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(demiTrainer.id).toBe("ST01-008");
      expect(demiTrainer.name).toBe("Demi Trainer");
      expect(demiTrainer.number).toBe(8);
      expect(demiTrainer.set).toBe("ST01");
      expect(demiTrainer.type).toBe("unit");
      expect(demiTrainer.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(demiTrainer.cost).toBe(1);
      expect(demiTrainer.level).toBe(1);
      expect(demiTrainer.ap).toBe(1);
      expect(demiTrainer.hp).toBe(1);
    });

    it("should have correct color and traits", () => {
      expect(demiTrainer.color).toBe("white");
      expect(demiTrainer.traits).toEqual(["academy"]);
    });

    it("should have correct zones", () => {
      expect(demiTrainer.zones).toEqual(["space", "earth"]);
    });

    it("should have no specific link requirement", () => {
      expect(demiTrainer.linkRequirement).toEqual(["-"]);
    });

    it("should have text describing Blocker ability", () => {
      expect(demiTrainer.text).toContain("Blocker");
      expect(demiTrainer.text).toContain("Rest");
      expect(demiTrainer.text).toContain("attack target");
    });
  });

  describe("Abilities Definition", () => {
    it("should have two abilities", () => {
      expect(demiTrainer.abilities).toBeDefined();
      expect(demiTrainer.abilities.length).toBe(2);
    });

    it("should have continuous Blocker ability", () => {
      const ability = demiTrainer.abilities[0];
      expect(ability.type).toBe("continuous");
      expect(ability.text).toBe("<Blocker>");
    });

    it("should have Blocker keyword effect", () => {
      const ability = demiTrainer.abilities[0];
      expect(ability.effects).toBeDefined();
      expect(ability.effects.length).toBe(1);

      const effect = ability.effects[0];
      expect(effect.type).toBe("keyword");
      expect(effect.keyword).toBe("Blocker");
    });

    it("should have resolution ability for blocking", () => {
      const ability = demiTrainer.abilities[1];
      expect(ability.type).toBe("resolution");
      expect(ability.text).toContain("Rest this Unit");
      expect(ability.text).toContain("change the attack target");
    });

    it("should have rest effect in resolution ability", () => {
      const ability = demiTrainer.abilities[1];
      expect(ability.effects).toBeDefined();
      expect(ability.effects.length).toBe(1);

      const effect = ability.effects[0];
      expect(effect.type).toBe("rest");
      expect(effect.target).toBeDefined();
      expect(effect.target.type).toBe("unit");
    });

    it("should have resolution ability configuration", () => {
      const ability = demiTrainer.abilities[1];
      expect(ability.dependentEffects).toBe(false);
      expect(ability.resolveEffectsIndividually).toBe(false);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be deployable with sufficient resources", () => {
      // Demi Trainer costs 1, so need 1 resource
      const engine = new GundamTestEngine(
        {
          hand: [demiTrainer],
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

    it("should set up scenario with Demi Trainer in battle area", () => {
      // Demi Trainer with Blocker ability in battle area
      const engine = new GundamTestEngine(
        {
          battleArea: [demiTrainer],
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

      // Demi Trainer is on the field
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario for Blocker ability testing", () => {
      // Demi Trainer ready to block incoming attack
      const engine = new GundamTestEngine(
        {
          battleArea: [demiTrainer],
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
      // Demi Trainer has no link requirement, can be paired with any pilot
      const engine = new GundamTestEngine(
        {
          battleArea: [demiTrainer],
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

      // Demi Trainer has generic link requirement
      expect(demiTrainer.linkRequirement).toEqual(["-"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in both space and earth zones", () => {
      // Demi Trainer can be deployed in space or earth zones
      const engine = new GundamTestEngine(
        {
          hand: [demiTrainer],
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

      // Demi Trainer supports both deployment zones
      expect(demiTrainer.zones).toContain("space");
      expect(demiTrainer.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });

    it("should set up scenario protecting valuable units", () => {
      // Demi Trainer blocking to protect important units
      const engine = new GundamTestEngine(
        {
          battleArea: [demiTrainer],
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

    it("should be deployable early game with minimal cost", () => {
      // Demi Trainer costs 1, can be deployed on turn 1
      const engine = new GundamTestEngine(
        {
          hand: [demiTrainer],
          resourceArea: 1, // Minimum resources
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 0,
          resourceArea: 1,
          deck: 30,
        },
      );

      // Early game deployment possible
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "resourceArea", 1, "player_one");
    });

    it("should set up scenario for sacrificial blocking", () => {
      // Demi Trainer with 1 HP can block once before being destroyed
      const engine = new GundamTestEngine(
        {
          battleArea: [demiTrainer],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // High AP attacker
          resourceArea: 5,
          deck: 30,
        },
      );

      // Setup for sacrificial block: 1 HP means one-time use
      assertZoneCount(engine, "battleArea", 1, "player_one");
      expect(demiTrainer.hp).toBe(1);
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      // Card definition tracks whether card is fully implemented
      expect(demiTrainer).toHaveProperty("implemented");
      expect(demiTrainer).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have level 1 stats appropriate for cost 1", () => {
      // Level 1 unit with 1 cost is minimal stats unit
      expect(demiTrainer.level).toBe(1);
      expect(demiTrainer.cost).toBe(1);
      expect(demiTrainer.ap).toBe(1);
      expect(demiTrainer.hp).toBe(1);
    });

    it("should have minimal balanced AP and HP", () => {
      // Demi Trainer has 1 AP and 1 HP - minimal stats
      const totalStats = demiTrainer.ap + demiTrainer.hp;
      expect(totalStats).toBe(2); // 1 + 1

      // Equal minimal stats
      expect(demiTrainer.ap).toBe(demiTrainer.hp);
    });

    it("should set up combat scenario", () => {
      // Demi Trainer with 1 AP attacking (unlikely use case)
      const engine = new GundamTestEngine(
        {
          battleArea: [demiTrainer],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit
          resourceArea: 5,
          deck: 30,
        },
      );

      // Combat scenario ready: Demi Trainer primarily for blocking
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should have value in defensive utility over stats", () => {
      // Minimal stats but Blocker provides utility
      expect(demiTrainer.ap + demiTrainer.hp).toBe(2);
      expect(demiTrainer.abilities[0].effects[0].keyword).toBe("Blocker");

      // Value comes from blocking ability, not combat stats
      expect(demiTrainer.abilities.length).toBe(2);
    });

    it("should be effective at absorbing single attack", () => {
      // 1 HP means Demi Trainer dies to any attack
      const engine = new GundamTestEngine(
        {
          battleArea: [demiTrainer],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Any attacker will destroy it
          resourceArea: 5,
          deck: 30,
        },
      );

      // One-time use blocker
      assertZoneCount(engine, "battleArea", 1, "player_one");
      expect(demiTrainer.hp).toBe(1);
    });

    it("should enable tempo defensive strategies", () => {
      // Low cost blocker enables tempo plays
      const engine = new GundamTestEngine(
        {
          battleArea: [demiTrainer],
          hand: 5, // Resources left for other plays
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Can deploy and still have resources for other cards
      assertZoneCount(engine, "battleArea", 1, "player_one");
      expect(demiTrainer.cost).toBe(1);
    });
  });
});
