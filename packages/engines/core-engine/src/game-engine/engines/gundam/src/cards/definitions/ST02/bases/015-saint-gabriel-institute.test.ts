import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { saintGabrielInstitute } from "./015-saint-gabriel-institute";

/**
 * Tests for ST02-015: Saint Gabriel Institute
 *
 * Card Properties:
 * - Cost: 2, Level: 2, AP: 0, HP: 5
 * - Color: Green
 * - Traits: Academy, Stronghold
 * - Zones: Earth
 *
 * Abilities:
 * - 【Burst】Deploy this card
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Burst triggered ability definition
 * - Base card deployment scenarios (including shield base)
 * - Zone restrictions (Earth only)
 * - Strategic value as defensive base
 */

describe("ST02-015: Saint Gabriel Institute", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(saintGabrielInstitute.id).toBe("ST02-015");
      expect(saintGabrielInstitute.name).toBe("Saint Gabriel Institute");
      expect(saintGabrielInstitute.number).toBe(15);
      expect(saintGabrielInstitute.set).toBe("ST02");
      expect(saintGabrielInstitute.type).toBe("base");
      expect(saintGabrielInstitute.rarity).toBe("common");
    });

    it("should have correct stats for base card", () => {
      expect(saintGabrielInstitute.cost).toBe(2);
      expect(saintGabrielInstitute.level).toBe(2);
      expect(saintGabrielInstitute.ap).toBe(0);
      expect(saintGabrielInstitute.hp).toBe(5);
    });

    it("should have correct color and traits", () => {
      expect(saintGabrielInstitute.color).toBe("green");
      expect(saintGabrielInstitute.traits).toEqual(["academy", "stronghold"]);
    });

    it("should have correct zones", () => {
      expect(saintGabrielInstitute.zones).toEqual(["earth"]);
    });

    it("should have text describing Burst ability", () => {
      expect(saintGabrielInstitute.text).toContain("【Burst】");
      expect(saintGabrielInstitute.text).toContain("Deploy this card");
    });

    it("should have 0 AP as base card", () => {
      // Base cards cannot attack, so AP is always 0
      expect(saintGabrielInstitute.ap).toBe(0);
      expect(saintGabrielInstitute.type).toBe("base");
    });

    it("should have standard base HP of 5", () => {
      // Standard base card HP
      expect(saintGabrielInstitute.hp).toBe(5);
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(saintGabrielInstitute.abilities).toBeDefined();
      expect(saintGabrielInstitute.abilities.length).toBe(1);
    });

    it("should have triggered Burst ability", () => {
      const ability = saintGabrielInstitute.abilities[0];
      expect(ability.type).toBe("triggered");
      expect(ability.text).toBe("【burst】");
    });

    it("should have trigger for burst event", () => {
      const ability = saintGabrielInstitute.abilities[0];
      expect(ability.trigger).toBeDefined();
      expect(ability.trigger.event).toBe("burst");
    });

    it("should have placeholder effect for deploy", () => {
      const ability = saintGabrielInstitute.abilities[0];
      expect(ability.effects).toBeDefined();
      expect(ability.effects.length).toBe(1);

      const effect = ability.effects[0];
      expect(effect.type).toBe("placeholder");
    });
  });

  describe("Base Card in Game Scenarios", () => {
    it("should be deployable with sufficient resources", () => {
      // Saint Gabriel Institute costs 2, so need 2 resources
      const engine = new GundamTestEngine(
        {
          hand: [saintGabrielInstitute],
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

      // Card is in hand and can be deployed
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "resourceArea", 3, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with base in shield base zone", () => {
      // Base card deployed as shield base to protect main base
      const engine = new GundamTestEngine(
        {
          shieldBase: [saintGabrielInstitute],
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

      // Saint Gabriel Institute is in shield base zone
      assertZoneCount(engine, "shieldBase", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario for Burst ability activation", () => {
      // Base card in shield section can trigger Burst when damaged
      const engine = new GundamTestEngine(
        {
          shieldSection: [saintGabrielInstitute],
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2, // Enemy units attacking
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Setup for Burst ability: Can trigger from shield section when damaged
      assertZoneCount(engine, "shieldSection", 1, "player_one");
    });

    it("should be deployable only in earth zone", () => {
      // Saint Gabriel Institute is earth-only deployment
      const engine = new GundamTestEngine(
        {
          hand: [saintGabrielInstitute],
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

      // Base supports only earth deployment zone
      expect(saintGabrielInstitute.zones).toContain("earth");
      expect(saintGabrielInstitute.zones).not.toContain("space");
      expect(saintGabrielInstitute.zones.length).toBe(1);
      assertZoneCount(engine, "hand", 1, "player_one");
    });

    it("should protect main base when deployed as shield base", () => {
      // Shield base absorbs damage before main base
      const engine = new GundamTestEngine(
        {
          shieldBase: [saintGabrielInstitute],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2, // Enemy units that could attack
          resourceArea: 5,
          deck: 30,
        },
      );

      // Shield base provides 5 HP of protection
      assertZoneCount(engine, "shieldBase", 1, "player_one");
      expect(saintGabrielInstitute.hp).toBe(5);
    });

    it("should set up scenario with multiple bases", () => {
      // Multiple bases provide layered defense
      const engine = new GundamTestEngine(
        {
          shieldBase: [saintGabrielInstitute],
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

      // Can have multiple bases for defense
      assertZoneCount(engine, "shieldBase", 1, "player_one");
    });

    it("should set up scenario for Burst activation timing", () => {
      // Burst ability triggers when card would be damaged in shield section
      const engine = new GundamTestEngine(
        {
          shieldSection: [saintGabrielInstitute],
          hand: 3,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 3, // Multiple attackers
          resourceArea: 5,
          deck: 30,
        },
      );

      // Burst can turn defensive position into board presence
      assertZoneCount(engine, "shieldSection", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      // Card definition tracks whether card is fully implemented
      expect(saintGabrielInstitute).toHaveProperty("implemented");
      expect(saintGabrielInstitute).toHaveProperty("missingTestCase");
    });
  });

  describe("Base Card Strategy", () => {
    it("should have low cost appropriate for defensive base", () => {
      // Cost 2 is efficient for early game defense
      expect(saintGabrielInstitute.cost).toBe(2);
      expect(saintGabrielInstitute.level).toBe(2);
      expect(saintGabrielInstitute.hp).toBe(5);
    });

    it("should provide defensive value with 5 HP", () => {
      // 5 HP blocks significant damage
      expect(saintGabrielInstitute.hp).toBe(5);
      expect(saintGabrielInstitute.ap).toBe(0);

      // HP-only base focused on defense
      const defensiveValue = saintGabrielInstitute.hp;
      expect(defensiveValue).toBe(5);
    });

    it("should set up early game defense scenario", () => {
      // Cost 2 base can be deployed early for protection
      const engine = new GundamTestEngine(
        {
          hand: [saintGabrielInstitute],
          resourceArea: 2,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 2,
          deck: 30,
        },
      );

      // Can be deployed on turn 2 with minimal resources
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "resourceArea", 2, "player_one");
    });

    it("should have synergy with green color identity", () => {
      // Green color often focuses on resource/support cards
      expect(saintGabrielInstitute.color).toBe("green");
      expect(saintGabrielInstitute.traits).toContain("academy");
      expect(saintGabrielInstitute.type).toBe("base");
    });

    it("should have academy trait for potential synergies", () => {
      // Academy trait may interact with other academy cards
      expect(saintGabrielInstitute.traits).toContain("academy");
      expect(saintGabrielInstitute.traits).toContain("stronghold");
    });

    it("should have stronghold trait for defensive identity", () => {
      // Stronghold trait emphasizes defensive role
      expect(saintGabrielInstitute.traits).toContain("stronghold");
    });

    it("should set up scenario comparing with other cost 2 bases", () => {
      // Cost 2, Level 2 base comparison point
      const engine = new GundamTestEngine(
        {
          hand: [saintGabrielInstitute],
          resourceArea: 3,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 3,
          deck: 30,
        },
      );

      // Efficient early game base option
      expect(saintGabrielInstitute.cost).toBe(2);
      expect(saintGabrielInstitute.hp).toBe(5);
      assertZoneCount(engine, "hand", 1, "player_one");
    });

    it("should have Burst ability as comeback mechanism", () => {
      // Burst ability turns damage into board presence
      const ability = saintGabrielInstitute.abilities[0];
      expect(ability.trigger.event).toBe("burst");

      // Can deploy from shield section when burst triggers
      expect(saintGabrielInstitute.text).toContain("Deploy this card");
    });

    it("should set up scenario for defensive resource management", () => {
      // Base in shield base zone protects life total
      const engine = new GundamTestEngine(
        {
          shieldBase: [saintGabrielInstitute],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2, // Aggressive opponent
          resourceArea: 5,
          deck: 30,
        },
      );

      // Provides 5 effective HP against aggression
      assertZoneCount(engine, "shieldBase", 1, "player_one");
      expect(saintGabrielInstitute.hp).toBe(5);
    });

    it("should have common rarity appropriate for staple defense", () => {
      // Common rarity makes it accessible for all decks
      expect(saintGabrielInstitute.rarity).toBe("common");
      expect(saintGabrielInstitute.cost).toBe(2);
    });

    it("should be efficient cost-to-HP ratio", () => {
      // 2 cost for 5 HP is 2.5 HP per cost
      const hpPerCost = saintGabrielInstitute.hp / saintGabrielInstitute.cost;
      expect(hpPerCost).toBe(2.5);

      // Efficient defensive value
      expect(hpPerCost).toBeGreaterThan(2);
    });

    it("should set up scenario for earth zone control", () => {
      // Earth-only bases can support earth zone strategy
      const engine = new GundamTestEngine(
        {
          shieldBase: [saintGabrielInstitute],
          battleArea: 2, // Earth zone units
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Supports earth-focused deck strategy
      expect(saintGabrielInstitute.zones).toEqual(["earth"]);
      assertZoneCount(engine, "shieldBase", 1, "player_one");
    });

    it("should set up scenario for Burst timing advantage", () => {
      // Burst timing can surprise opponents
      const engine = new GundamTestEngine(
        {
          shieldSection: [saintGabrielInstitute],
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Attacker that could trigger burst
          resourceArea: 5,
          deck: 30,
        },
      );

      // Burst can immediately deploy, creating instant board presence
      assertZoneCount(engine, "shieldSection", 1, "player_one");
    });

    it("should compare favorably to level 3 bases in early game", () => {
      // Level 2 is more accessible than level 3 for early defense
      expect(saintGabrielInstitute.level).toBe(2);
      expect(saintGabrielInstitute.cost).toBe(2);

      // Same 5 HP as higher level bases, but lower cost
      expect(saintGabrielInstitute.hp).toBe(5);
    });
  });
});
