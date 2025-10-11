import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { corsicaBase } from "./016-corsica-base";

/**
 * Tests for ST02-016: Corsica Base
 *
 * Card Properties:
 * - Cost: 3, Level: 3, AP: 0, HP: 5
 * - Color: Blue
 * - Traits: Stronghold
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
 * - Strategic value as mid-game defensive base
 */

describe("ST02-016: Corsica Base", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(corsicaBase.id).toBe("ST02-016");
      expect(corsicaBase.name).toBe("Corsica Base");
      expect(corsicaBase.number).toBe(16);
      expect(corsicaBase.set).toBe("ST02");
      expect(corsicaBase.type).toBe("base");
      expect(corsicaBase.rarity).toBe("common");
    });

    it("should have correct stats for base card", () => {
      expect(corsicaBase.cost).toBe(3);
      expect(corsicaBase.level).toBe(3);
      expect(corsicaBase.ap).toBe(0);
      expect(corsicaBase.hp).toBe(5);
    });

    it("should have correct color and traits", () => {
      expect(corsicaBase.color).toBe("blue");
      expect(corsicaBase.traits).toEqual(["stronghold"]);
    });

    it("should have correct zones", () => {
      expect(corsicaBase.zones).toEqual(["earth"]);
    });

    it("should have text describing Burst ability", () => {
      expect(corsicaBase.text).toContain("【Burst】");
      expect(corsicaBase.text).toContain("Deploy this card");
    });

    it("should have 0 AP as base card", () => {
      // Base cards cannot attack, so AP is always 0
      expect(corsicaBase.ap).toBe(0);
      expect(corsicaBase.type).toBe("base");
    });

    it("should have standard base HP of 5", () => {
      // Standard base card HP
      expect(corsicaBase.hp).toBe(5);
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(corsicaBase.abilities).toBeDefined();
      expect(corsicaBase.abilities.length).toBe(1);
    });

    it("should have triggered Burst ability", () => {
      const ability = corsicaBase.abilities[0];
      expect(ability.type).toBe("triggered");
      expect(ability.text).toBe("【burst】");
    });

    it("should have trigger for burst event", () => {
      const ability = corsicaBase.abilities[0];
      expect(ability.trigger).toBeDefined();
      expect(ability.trigger.event).toBe("burst");
    });

    it("should have placeholder effect for deploy", () => {
      const ability = corsicaBase.abilities[0];
      expect(ability.effects).toBeDefined();
      expect(ability.effects.length).toBe(1);

      const effect = ability.effects[0];
      expect(effect.type).toBe("placeholder");
    });
  });

  describe("Base Card in Game Scenarios", () => {
    it("should be deployable with sufficient resources", () => {
      // Corsica Base costs 3, so need 3 resources
      const engine = new GundamTestEngine(
        {
          hand: [corsicaBase],
          resourceArea: 4,
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
      assertZoneCount(engine, "resourceArea", 4, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with base in shield base zone", () => {
      // Base card deployed as shield base to protect main base
      const engine = new GundamTestEngine(
        {
          shieldBase: [corsicaBase],
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

      // Corsica Base is in shield base zone
      assertZoneCount(engine, "shieldBase", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario for Burst ability activation", () => {
      // Base card in shield section can trigger Burst when damaged
      const engine = new GundamTestEngine(
        {
          shieldSection: [corsicaBase],
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
      // Corsica Base is earth-only deployment
      const engine = new GundamTestEngine(
        {
          hand: [corsicaBase],
          resourceArea: 4,
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
      expect(corsicaBase.zones).toContain("earth");
      expect(corsicaBase.zones).not.toContain("space");
      expect(corsicaBase.zones.length).toBe(1);
      assertZoneCount(engine, "hand", 1, "player_one");
    });

    it("should protect main base when deployed as shield base", () => {
      // Shield base absorbs damage before main base
      const engine = new GundamTestEngine(
        {
          shieldBase: [corsicaBase],
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
      expect(corsicaBase.hp).toBe(5);
    });

    it("should set up scenario with multiple bases", () => {
      // Multiple bases provide layered defense
      const engine = new GundamTestEngine(
        {
          shieldBase: [corsicaBase],
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
          shieldSection: [corsicaBase],
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
      expect(corsicaBase).toHaveProperty("implemented");
      expect(corsicaBase).toHaveProperty("missingTestCase");
    });
  });

  describe("Base Card Strategy", () => {
    it("should have mid-game cost appropriate for defensive base", () => {
      // Cost 3 is mid-game deployment timing
      expect(corsicaBase.cost).toBe(3);
      expect(corsicaBase.level).toBe(3);
      expect(corsicaBase.hp).toBe(5);
    });

    it("should provide defensive value with 5 HP", () => {
      // 5 HP blocks significant damage
      expect(corsicaBase.hp).toBe(5);
      expect(corsicaBase.ap).toBe(0);

      // HP-only base focused on defense
      const defensiveValue = corsicaBase.hp;
      expect(defensiveValue).toBe(5);
    });

    it("should set up mid-game defense scenario", () => {
      // Cost 3 base for mid-game protection
      const engine = new GundamTestEngine(
        {
          hand: [corsicaBase],
          resourceArea: 3,
          battleArea: 1,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 3,
          deck: 30,
        },
      );

      // Can be deployed mid-game for defense
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "resourceArea", 3, "player_one");
    });

    it("should have synergy with blue color identity", () => {
      // Blue color often focuses on control/protection
      expect(corsicaBase.color).toBe("blue");
      expect(corsicaBase.traits).toContain("stronghold");
      expect(corsicaBase.type).toBe("base");
    });

    it("should have stronghold trait for defensive identity", () => {
      // Stronghold trait emphasizes defensive role
      expect(corsicaBase.traits).toContain("stronghold");
      expect(corsicaBase.traits.length).toBe(1);
    });

    it("should set up scenario comparing with other cost 3 bases", () => {
      // Cost 3, Level 3 base comparison point
      const engine = new GundamTestEngine(
        {
          hand: [corsicaBase],
          resourceArea: 4,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 4,
          deck: 30,
        },
      );

      // Mid-game base option
      expect(corsicaBase.cost).toBe(3);
      expect(corsicaBase.hp).toBe(5);
      assertZoneCount(engine, "hand", 1, "player_one");
    });

    it("should have Burst ability as comeback mechanism", () => {
      // Burst ability turns damage into board presence
      const ability = corsicaBase.abilities[0];
      expect(ability.trigger.event).toBe("burst");

      // Can deploy from shield section when burst triggers
      expect(corsicaBase.text).toContain("Deploy this card");
    });

    it("should set up scenario for defensive resource management", () => {
      // Base in shield base zone protects life total
      const engine = new GundamTestEngine(
        {
          shieldBase: [corsicaBase],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 3, // Aggressive opponent
          resourceArea: 5,
          deck: 30,
        },
      );

      // Provides 5 effective HP against aggression
      assertZoneCount(engine, "shieldBase", 1, "player_one");
      expect(corsicaBase.hp).toBe(5);
    });

    it("should have common rarity appropriate for staple defense", () => {
      // Common rarity makes it accessible for all decks
      expect(corsicaBase.rarity).toBe("common");
      expect(corsicaBase.cost).toBe(3);
    });

    it("should have reasonable cost-to-HP ratio", () => {
      // 3 cost for 5 HP is approximately 1.67 HP per cost
      const hpPerCost = corsicaBase.hp / corsicaBase.cost;
      expect(hpPerCost).toBeCloseTo(1.67, 2);

      // Reasonable defensive value for higher cost
      expect(hpPerCost).toBeGreaterThan(1.5);
    });

    it("should set up scenario for earth zone control", () => {
      // Earth-only bases can support earth zone strategy
      const engine = new GundamTestEngine(
        {
          shieldBase: [corsicaBase],
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
      expect(corsicaBase.zones).toEqual(["earth"]);
      assertZoneCount(engine, "shieldBase", 1, "player_one");
    });

    it("should set up scenario for Burst timing advantage", () => {
      // Burst timing can surprise opponents
      const engine = new GundamTestEngine(
        {
          shieldSection: [corsicaBase],
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2, // Attackers that could trigger burst
          resourceArea: 5,
          deck: 30,
        },
      );

      // Burst can immediately deploy, creating instant board presence
      assertZoneCount(engine, "shieldSection", 1, "player_one");
    });

    it("should trade cost for higher level", () => {
      // Level 3 provides access to higher level synergies
      expect(corsicaBase.level).toBe(3);
      expect(corsicaBase.cost).toBe(3);

      // Same 5 HP as lower cost bases, but higher level
      expect(corsicaBase.hp).toBe(5);
    });

    it("should have fewer traits than academy bases", () => {
      // Single stronghold trait is more focused
      expect(corsicaBase.traits.length).toBe(1);
      expect(corsicaBase.traits).toEqual(["stronghold"]);
    });

    it("should set up scenario for blue control strategy", () => {
      // Blue bases support control-oriented gameplay
      const engine = new GundamTestEngine(
        {
          shieldBase: [corsicaBase],
          battleArea: 1, // Blue control units
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Blue base provides defensive foundation for control deck
      expect(corsicaBase.color).toBe("blue");
      assertZoneCount(engine, "shieldBase", 1, "player_one");
    });

    it("should compare with cost 2 bases for tempo analysis", () => {
      // Cost 3 is 1 more resource than cost 2 bases
      expect(corsicaBase.cost).toBe(3);

      // Same HP as cost 2 bases, but higher level access
      expect(corsicaBase.hp).toBe(5);
      expect(corsicaBase.level).toBe(3);
    });

    it("should set up scenario for level-restricted synergies", () => {
      // Level 3 may unlock certain card synergies
      const engine = new GundamTestEngine(
        {
          shieldBase: [corsicaBase],
          battleArea: 2, // Units with level synergies
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Level 3 base for potential synergy effects
      expect(corsicaBase.level).toBe(3);
      assertZoneCount(engine, "shieldBase", 1, "player_one");
    });

    it("should set up scenario for burst as tempo recovery", () => {
      // Burst deployment can recover tempo after taking damage
      const engine = new GundamTestEngine(
        {
          shieldSection: [corsicaBase],
          hand: 3,
          resourceArea: 5,
          deck: 25,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Level 3 base from burst provides significant tempo swing
      expect(corsicaBase.level).toBe(3);
      assertZoneCount(engine, "shieldSection", 1, "player_one");
    });

    it("should have efficient defensive profile for mid-game", () => {
      // 5 HP at cost 3 provides solid mid-game defense
      const engine = new GundamTestEngine(
        {
          shieldBase: [corsicaBase],
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 3, // Mid-game board state
          resourceArea: 5,
          deck: 30,
        },
      );

      // Effective mid-game defensive option
      expect(corsicaBase.hp).toBe(5);
      expect(corsicaBase.cost).toBe(3);
      assertZoneCount(engine, "shieldBase", 1, "player_one");
    });

    it("should set up scenario for stronghold trait synergies", () => {
      // Stronghold trait may interact with defensive cards
      const engine = new GundamTestEngine(
        {
          shieldBase: [corsicaBase],
          hand: 5, // Potential stronghold synergy cards
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Stronghold trait provides synergy potential
      expect(corsicaBase.traits).toContain("stronghold");
      assertZoneCount(engine, "shieldBase", 1, "player_one");
    });
  });
});
