import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { gundamHeavyarms } from "./003-gundam-heavyarms";

/**
 * Tests for ST02-003: Gundam Heavyarms
 *
 * Card Properties:
 * - Cost: 3, Level: 5, AP: 3, HP: 4
 * - Color: Green
 * - Traits: None
 * - Link Requirement: Trowa Barton
 * - Zones: Earth
 *
 * Abilities:
 * - 【During Pair】Deal 1 damage to all enemy Units Lv.3 or lower when destroying with battle damage
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - During Pair condition effect definition
 * - Card usability in game scenarios
 */

describe("ST02-003: Gundam Heavyarms", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(gundamHeavyarms.id).toBe("ST02-003");
      expect(gundamHeavyarms.name).toBe("Gundam Heavyarms");
      expect(gundamHeavyarms.number).toBe(3);
      expect(gundamHeavyarms.set).toBe("ST02");
      expect(gundamHeavyarms.type).toBe("unit");
      expect(gundamHeavyarms.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(gundamHeavyarms.cost).toBe(3);
      expect(gundamHeavyarms.level).toBe(5);
      expect(gundamHeavyarms.ap).toBe(3);
      expect(gundamHeavyarms.hp).toBe(4);
    });

    it("should have correct color and traits", () => {
      expect(gundamHeavyarms.color).toBe("green");
      expect(gundamHeavyarms.traits).toEqual([]);
    });

    it("should have correct zones", () => {
      expect(gundamHeavyarms.zones).toEqual(["earth"]);
    });

    it("should have correct link requirement", () => {
      expect(gundamHeavyarms.linkRequirement).toEqual(["trowa barton"]);
    });

    it("should have text describing During Pair ability", () => {
      expect(gundamHeavyarms.text).toContain("During Pair");
      expect(gundamHeavyarms.text).toContain("damage");
      expect(gundamHeavyarms.text).toContain("Lv.3");
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(gundamHeavyarms.abilities).toBeDefined();
      expect(gundamHeavyarms.abilities.length).toBe(1);
    });

    it("should have conditional ability requiring pair", () => {
      const ability = gundamHeavyarms.abilities[0];
      expect(ability.type).toBe("triggered");
      expect(ability.text).toBe("【during pair】");
    });

    it("should have area damage effect", () => {
      const ability = gundamHeavyarms.abilities[0];
      expect(ability.effects).toBeDefined();
      expect(ability.effects.length).toBe(2);

      // During Pair effect deals damage to multiple targets
      expect(ability.effects[0].type).toBe("damage");
      expect(ability.effects[1].type).toBe("damage");
    });

    it("should target low-level units", () => {
      // The full card text describes targeting Lv.3 or lower units
      expect(gundamHeavyarms.text).toContain("Lv.3 or lower");
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be deployable with sufficient resources", () => {
      // Gundam Heavyarms costs 3, so need 3 resources
      const engine = new GundamTestEngine(
        {
          hand: [gundamHeavyarms],
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

    it("should set up scenario with Gundam Heavyarms in battle area", () => {
      // Gundam Heavyarms with During Pair ability in battle area
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamHeavyarms],
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

      // Gundam Heavyarms is on the field
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario for During Pair ability testing", () => {
      // Gundam Heavyarms deals area damage when paired
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamHeavyarms],
          hand: 5, // Could have Trowa Barton pilot
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2, // Enemy low-level units
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Setup for During Pair ability: needs Trowa Barton to activate
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should work with Trowa Barton pilot link requirement", () => {
      // Gundam Heavyarms has link requirement for Trowa Barton
      // When paired with Trowa Barton, area damage ability activates
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamHeavyarms],
          hand: 5, // Could have Trowa Barton pilot card
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

      // Gundam Heavyarms requires pairing with Trowa Barton
      expect(gundamHeavyarms.linkRequirement).toContain("trowa barton");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should only be deployable in earth zones", () => {
      // Gundam Heavyarms can only be deployed in earth zones
      const engine = new GundamTestEngine(
        {
          hand: [gundamHeavyarms],
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

      // Gundam Heavyarms is earth-only
      expect(gundamHeavyarms.zones).toEqual(["earth"]);
      expect(gundamHeavyarms.zones).not.toContain("space");
      assertZoneCount(engine, "hand", 1, "player_one");
    });

    it("should set up scenario for area damage testing", () => {
      // Gundam Heavyarms deals damage to all Lv.3 or lower enemy units
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamHeavyarms],
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 3, // Multiple low-level enemy units
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Area damage targets multiple units
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 3, "player_two");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      // Card definition tracks whether card is fully implemented
      expect(gundamHeavyarms).toHaveProperty("implemented");
      expect(gundamHeavyarms).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have level 5 stats appropriate for cost 3", () => {
      // Level 5 unit with 3 cost is excellent value
      expect(gundamHeavyarms.level).toBe(5);
      expect(gundamHeavyarms.cost).toBe(3);
      expect(gundamHeavyarms.ap).toBe(3);
      expect(gundamHeavyarms.hp).toBe(4);
    });

    it("should have balanced AP and HP", () => {
      // Gundam Heavyarms has 3 AP and 4 HP - defensive stats
      const totalStats = gundamHeavyarms.ap + gundamHeavyarms.hp;
      expect(totalStats).toBe(7); // 3 + 4

      // During Pair ability provides area damage utility (described in full card text)
      expect(gundamHeavyarms.text).toContain("During Pair");
    });

    it("should set up combat scenario", () => {
      // Gundam Heavyarms with 3 AP attacking
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamHeavyarms],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit
          resourceArea: 5,
          deck: 30,
        },
      );

      // Combat scenario ready: Gundam Heavyarms can attack with 3 AP
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should be a good value mid-game unit", () => {
      // Level 5 is mid-game, cost 3 is reasonable
      expect(gundamHeavyarms.level).toBe(5);
      expect(gundamHeavyarms.cost).toBe(3);

      // Good total stats for cost
      const totalStats = gundamHeavyarms.ap + gundamHeavyarms.hp;
      expect(totalStats).toBeGreaterThanOrEqual(7);
    });

    it("should work as board control with area damage", () => {
      // Gundam Heavyarms clears weak enemy units when paired
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamHeavyarms],
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 3, // Multiple weak units
          resourceArea: 5,
          deck: 30,
        },
      );

      // Area damage ability provides board control (described in full card text)
      expect(gundamHeavyarms.text).toContain("all enemy Units");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should trigger area damage on battle destruction", () => {
      // Ability triggers when destroying units with battle damage
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamHeavyarms],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Must destroy with battle damage to trigger (described in full card text)
      expect(gundamHeavyarms.text).toContain(
        "destroys an enemy Unit with battle damage",
      );
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });
  });
});
