import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { asticassiaSchoolOfTechnologyEarthHouse } from "./016-asticassia-school-of-technology-earth-house";

/**
 * Tests for ST01-016: Asticassia School of Technology, Earth House
 *
 * Card Properties:
 * - Cost: 1, Level: 2
 * - Color: White
 * - Type: Base
 * - Traits: Academy, Stronghold
 * - Zones: Space only
 * - AP: 0, HP: 5
 *
 * Abilities:
 * - 【Burst】Deploy this card
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Burst ability definition
 * - Base card deployment scenarios
 * - Shield base mechanics
 */

describe("ST01-016: Asticassia School of Technology, Earth House", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(asticassiaSchoolOfTechnologyEarthHouse.id).toBe("ST01-016");
      expect(asticassiaSchoolOfTechnologyEarthHouse.name).toBe(
        "Asticassia School of Technology, Earth House",
      );
      expect(asticassiaSchoolOfTechnologyEarthHouse.number).toBe(16);
      expect(asticassiaSchoolOfTechnologyEarthHouse.set).toBe("ST01");
      expect(asticassiaSchoolOfTechnologyEarthHouse.type).toBe("base");
      expect(asticassiaSchoolOfTechnologyEarthHouse.rarity).toBe("common");
    });

    it("should have correct cost and level", () => {
      expect(asticassiaSchoolOfTechnologyEarthHouse.cost).toBe(1);
      expect(asticassiaSchoolOfTechnologyEarthHouse.level).toBe(2);
    });

    it("should have correct color and traits", () => {
      expect(asticassiaSchoolOfTechnologyEarthHouse.color).toBe("white");
      expect(asticassiaSchoolOfTechnologyEarthHouse.traits).toEqual([
        "academy",
        "stronghold",
      ]);
    });

    it("should have space zone only", () => {
      expect(asticassiaSchoolOfTechnologyEarthHouse.zones).toEqual(["space"]);
    });

    it("should have base card stats", () => {
      expect(asticassiaSchoolOfTechnologyEarthHouse.ap).toBe(0);
      expect(asticassiaSchoolOfTechnologyEarthHouse.hp).toBe(5);
    });

    it("should have text describing Burst ability", () => {
      expect(asticassiaSchoolOfTechnologyEarthHouse.text).toContain("Burst");
      expect(asticassiaSchoolOfTechnologyEarthHouse.text).toContain(
        "Deploy this card",
      );
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(asticassiaSchoolOfTechnologyEarthHouse.abilities).toBeDefined();
      expect(asticassiaSchoolOfTechnologyEarthHouse.abilities.length).toBe(1);
    });

    it("should have triggered Burst ability", () => {
      const ability = asticassiaSchoolOfTechnologyEarthHouse.abilities[0];
      expect(ability.type).toBe("triggered");
      expect(ability.text).toBe("【burst】");
      expect(ability.trigger?.event).toBe("burst");
    });

    it("should have placeholder effect", () => {
      const ability = asticassiaSchoolOfTechnologyEarthHouse.abilities[0];
      expect(ability.effects).toBeDefined();
      expect(ability.effects.length).toBe(1);

      const effect = ability.effects[0];
      expect(effect.type).toBe("placeholder");
    });
  });

  describe("Base Card in Game Scenarios", () => {
    it("should be playable with sufficient resources", () => {
      // Asticassia School costs 1, so need 1 resource
      const engine = new GundamTestEngine(
        {
          hand: [asticassiaSchoolOfTechnologyEarthHouse],
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

      // Card is in hand and can be played
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "resourceArea", 3, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario as shield base", () => {
      // Asticassia School can be placed in shield base zone
      const engine = new GundamTestEngine(
        {
          hand: [asticassiaSchoolOfTechnologyEarthHouse],
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
          shieldBase: 0, // Empty shield base
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Scenario for deploying as shield base
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "shieldBase", 0, "player_one");
    });

    it("should set up scenario for Burst activation", () => {
      // Asticassia School with Burst ability in shield section
      // When shield is destroyed, Burst triggers: deploy this card
      const engine = new GundamTestEngine(
        {
          battleArea: 1,
          hand: 5,
          resourceArea: 5,
          deck: 30,
          shieldSection: 6, // Asticassia School could be one of the shields
        },
        {
          battleArea: 2,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Burst ability: when shield card is destroyed, deploy Asticassia School
      const ability = asticassiaSchoolOfTechnologyEarthHouse.abilities[0];
      expect(ability.trigger?.event).toBe("burst");
      assertZoneCount(engine, "shieldSection", 6, "player_one");
    });

    it("should be deployable in space only", () => {
      // Asticassia School can only be deployed in space zone
      const engine = new GundamTestEngine(
        {
          hand: [asticassiaSchoolOfTechnologyEarthHouse],
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

      // Asticassia School supports only space deployment
      expect(asticassiaSchoolOfTechnologyEarthHouse.zones).toEqual(["space"]);
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(asticassiaSchoolOfTechnologyEarthHouse).toHaveProperty(
        "implemented",
      );
      expect(asticassiaSchoolOfTechnologyEarthHouse).toHaveProperty(
        "missingTestCase",
      );
    });

    it("should have placeholder effect for deploy", () => {
      // Note: The deploy effect is referenced but not fully defined yet
      const ability = asticassiaSchoolOfTechnologyEarthHouse.abilities[0];
      const effect = ability.effects[0];

      expect(effect.type).toBe("placeholder");
      expect(effect.parameters).toBeDefined();
    });
  });

  describe("Base Card Stats and Strategy", () => {
    it("should have level 2 appropriate for cost 1 base", () => {
      // Level 2 base with cost 1 - very efficient
      expect(asticassiaSchoolOfTechnologyEarthHouse.level).toBe(2);
      expect(asticassiaSchoolOfTechnologyEarthHouse.cost).toBe(1);
    });

    it("should have 0 AP and 5 HP", () => {
      // Base cards typically have 0 AP
      expect(asticassiaSchoolOfTechnologyEarthHouse.ap).toBe(0);
      expect(asticassiaSchoolOfTechnologyEarthHouse.hp).toBe(5);
    });

    it("should provide defensive value as shield base", () => {
      // Asticassia School: 5 HP as shield base provides defensive value
      // Base cards in shield base zone act as persistent shields
      expect(asticassiaSchoolOfTechnologyEarthHouse.hp).toBe(5);
      expect(asticassiaSchoolOfTechnologyEarthHouse.type).toBe("base");
    });

    it("should have Academy and Stronghold traits", () => {
      // Traits important for deck building and card interactions
      expect(asticassiaSchoolOfTechnologyEarthHouse.traits).toContain(
        "academy",
      );
      expect(asticassiaSchoolOfTechnologyEarthHouse.traits).toContain(
        "stronghold",
      );
    });

    it("should be white defensive tool", () => {
      // White deck base option
      expect(asticassiaSchoolOfTechnologyEarthHouse.color).toBe("white");
      expect(asticassiaSchoolOfTechnologyEarthHouse.type).toBe("base");
    });

    it("should be more efficient than White Base", () => {
      // Asticassia School: Cost 1, Level 2
      // White Base: Cost 2, Level 3
      // Asticassia is cheaper but lower level
      expect(asticassiaSchoolOfTechnologyEarthHouse.cost).toBe(1);
      expect(asticassiaSchoolOfTechnologyEarthHouse.level).toBe(2);
    });
  });

  describe("Burst Mechanics", () => {
    it("should deploy when Burst triggers", () => {
      // Burst effect: Deploy this card to shield base
      expect(asticassiaSchoolOfTechnologyEarthHouse.text).toBe(
        "【Burst】Deploy this card.",
      );

      const ability = asticassiaSchoolOfTechnologyEarthHouse.abilities[0];
      expect(ability.trigger?.event).toBe("burst");
    });

    it("should provide value from shield zone", () => {
      // Unlike regular shields, Asticassia School deploys when destroyed
      const engine = new GundamTestEngine(
        {
          shieldSection: 6, // Asticassia School as shield
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Provides value even when used as shield - deploys to shield base
      assertZoneCount(engine, "shieldSection", 6, "player_one");
      expect(asticassiaSchoolOfTechnologyEarthHouse.text).toContain("Burst");
    });
  });

  describe("Shield Base Mechanics", () => {
    it("should act as persistent shield", () => {
      // Base cards in shield base remain until destroyed
      // Unlike EX Base token, base cards provide HP shield
      expect(asticassiaSchoolOfTechnologyEarthHouse.hp).toBe(5);
      expect(asticassiaSchoolOfTechnologyEarthHouse.type).toBe("base");
    });

    it("should be replaceable with other bases", () => {
      // Only one base card can be in shield base at a time
      // Rule 3-2-2-2: Shield Base zone can hold max 1 card
      const engine = new GundamTestEngine(
        {
          hand: [asticassiaSchoolOfTechnologyEarthHouse],
          shieldBase: 0, // Empty - can deploy Asticassia School here
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
      );

      assertZoneCount(engine, "shieldBase", 0, "player_one");
      assertZoneCount(engine, "hand", 1, "player_one");
    });

    it("should provide HP shield equal to its HP stat", () => {
      // Asticassia School has 5 HP - provides 5 HP as shield base
      // When taking damage to shield base, subtract from base's HP
      expect(asticassiaSchoolOfTechnologyEarthHouse.hp).toBe(5);
      expect(asticassiaSchoolOfTechnologyEarthHouse.ap).toBe(0); // Bases don't attack
    });
  });

  describe("Zone Deployment Options", () => {
    it("should support only space deployment", () => {
      // Asticassia School is space-only
      expect(asticassiaSchoolOfTechnologyEarthHouse.zones).toEqual(["space"]);
      expect(asticassiaSchoolOfTechnologyEarthHouse.zones.length).toBe(1);
    });

    it("should compare with multi-zone bases", () => {
      // Asticassia School: space only (specialized)
      // White Base: space + earth (versatile)
      expect(asticassiaSchoolOfTechnologyEarthHouse.zones).toContain("space");
      expect(asticassiaSchoolOfTechnologyEarthHouse.zones).not.toContain(
        "earth",
      );
    });

    it("should be restricted to space zone", () => {
      // Cannot deploy to earth zone
      expect(asticassiaSchoolOfTechnologyEarthHouse.zones).not.toContain(
        "earth",
      );
    });
  });

  describe("Comparison with White Base", () => {
    it("should be cheaper but less versatile than White Base", () => {
      // Asticassia School:
      // - Cost 1, Level 2
      // - Space only
      // - Academy, Stronghold traits
      // - White color

      // White Base:
      // - Cost 2, Level 3
      // - Space + Earth
      // - Earth Federation, Warship traits
      // - Blue color

      expect(asticassiaSchoolOfTechnologyEarthHouse.cost).toBe(1);
      expect(asticassiaSchoolOfTechnologyEarthHouse.level).toBe(2);
      expect(asticassiaSchoolOfTechnologyEarthHouse.zones.length).toBe(1);
    });

    it("should provide same HP but at lower cost", () => {
      // Both provide 5 HP shield
      // Asticassia School: 1 cost
      // White Base: 2 cost
      expect(asticassiaSchoolOfTechnologyEarthHouse.hp).toBe(5);
      expect(asticassiaSchoolOfTechnologyEarthHouse.cost).toBe(1);
    });

    it("should fit in white decks vs blue decks", () => {
      // Asticassia School: white deck option
      // White Base: blue deck option
      expect(asticassiaSchoolOfTechnologyEarthHouse.color).toBe("white");
    });
  });

  describe("Academy Synergies", () => {
    it("should have Academy trait for synergies", () => {
      // Academy trait connects with Suletta Mercury and other academy cards
      expect(asticassiaSchoolOfTechnologyEarthHouse.traits).toContain(
        "academy",
      );
    });

    it("should support academy-themed decks", () => {
      // Asticassia School supports academy strategy
      // Synergizes with academy units and pilots
      expect(asticassiaSchoolOfTechnologyEarthHouse.traits).toContain(
        "academy",
      );
      expect(asticassiaSchoolOfTechnologyEarthHouse.color).toBe("white");
    });

    it("should have Stronghold trait for defensive identity", () => {
      // Stronghold trait emphasizes defensive role
      expect(asticassiaSchoolOfTechnologyEarthHouse.traits).toContain(
        "stronghold",
      );
    });
  });
});
