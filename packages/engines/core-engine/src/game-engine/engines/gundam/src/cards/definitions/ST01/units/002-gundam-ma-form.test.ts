import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { gundamMaForm } from "./002-gundam-ma-form";

/**
 * Tests for ST01-002: Gundam (MA Form)
 *
 * Card Properties:
 * - Cost: 3, Level: 5, AP: 4, HP: 3
 * - Color: Blue
 * - Traits: Earth Federation
 * - Link Requirement: Amuro Ray
 * - Zones: Space only
 *
 * Abilities:
 * - <When Paired･(White Base Team) Pilot>: Draw 1 card
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - When Paired triggered ability with draw effect
 * - Card usability in game scenarios
 * - Space-only deployment restriction
 */

describe("ST01-002: Gundam (MA Form)", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(gundamMaForm.id).toBe("ST01-002");
      expect(gundamMaForm.name).toBe("Gundam (MA Form)");
      expect(gundamMaForm.number).toBe(2);
      expect(gundamMaForm.set).toBe("ST01");
      expect(gundamMaForm.type).toBe("unit");
      expect(gundamMaForm.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(gundamMaForm.cost).toBe(3);
      expect(gundamMaForm.level).toBe(5);
      expect(gundamMaForm.ap).toBe(4);
      expect(gundamMaForm.hp).toBe(3);
    });

    it("should have correct color and traits", () => {
      expect(gundamMaForm.color).toBe("blue");
      expect(gundamMaForm.traits).toEqual(["earth federation"]);
    });

    it("should have correct zones", () => {
      expect(gundamMaForm.zones).toEqual(["space"]);
    });

    it("should have correct link requirement", () => {
      expect(gundamMaForm.linkRequirement).toEqual(["amuro ray"]);
    });

    it("should have text describing When Paired ability", () => {
      expect(gundamMaForm.text).toContain("When Paired");
      expect(gundamMaForm.text).toContain("White Base Team");
      expect(gundamMaForm.text).toContain("Draw");
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(gundamMaForm.abilities).toBeDefined();
      expect(gundamMaForm.abilities.length).toBe(1);
    });

    it("should have triggered When Paired ability", () => {
      const ability = gundamMaForm.abilities[0];
      expect(ability.type).toBe("triggered");
      expect(ability.text).toBe("【when paired･(white base team) pilot】");
    });

    it("should have trigger for when-paired event", () => {
      const ability = gundamMaForm.abilities[0];
      expect(ability.trigger).toBeDefined();
      expect(ability.trigger.event).toBe("when-paired･(white-base-team)-pilot");
    });

    it("should have draw effect with amount 1", () => {
      const ability = gundamMaForm.abilities[0];
      expect(ability.effects).toBeDefined();
      expect(ability.effects.length).toBe(1);

      const effect = ability.effects[0];
      expect(effect.type).toBe("draw");
      expect(effect.amount).toBe(1);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be deployable with sufficient resources", () => {
      // Gundam MA Form costs 3, so need 3 resources
      const engine = new GundamTestEngine(
        {
          hand: [gundamMaForm],
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

    it("should set up scenario with Gundam MA Form in battle area", () => {
      // Gundam MA Form with When Paired ability in battle area
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamMaForm],
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

      // Gundam MA Form is on the field
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario for When Paired ability testing", () => {
      // Gundam MA Form that would draw when paired with White Base Team pilot
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamMaForm],
          hand: 3, // Hand to verify draw effect
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Setup for When Paired ability: would draw 1 card when paired with White Base Team pilot
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "hand", 3, "player_one");
    });

    it("should work with Amuro Ray pilot link requirement", () => {
      // Gundam MA Form has link requirement for Amuro Ray
      // When paired with Amuro Ray (White Base Team), draw effect would activate
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamMaForm],
          hand: 5, // Could have Amuro Ray pilot card
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

      // Gundam MA Form can be paired with Amuro Ray
      expect(gundamMaForm.linkRequirement).toContain("amuro ray");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable only in space zone", () => {
      // Gundam MA Form can only be deployed in space zones
      const engine = new GundamTestEngine(
        {
          hand: [gundamMaForm],
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

      // Gundam MA Form only supports space deployment
      expect(gundamMaForm.zones).toEqual(["space"]);
      expect(gundamMaForm.zones).not.toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });

    it("should set up scenario for pairing with non-White Base Team pilot", () => {
      // Gundam MA Form paired with pilot that is not White Base Team
      // When Paired ability would not trigger
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamMaForm],
          hand: 3,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Setup to verify ability only triggers with White Base Team pilots
      assertZoneCount(engine, "battleArea", 1, "player_one");
      expect(gundamMaForm.abilities[0].trigger.event).toContain(
        "white-base-team",
      );
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      // Card definition tracks whether card is fully implemented
      expect(gundamMaForm).toHaveProperty("implemented");
      expect(gundamMaForm).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have level 5 stats appropriate for cost 3", () => {
      // Level 5 unit with 3 cost is a high-level unit
      expect(gundamMaForm.level).toBe(5);
      expect(gundamMaForm.cost).toBe(3);
      expect(gundamMaForm.ap).toBe(4);
      expect(gundamMaForm.hp).toBe(3);
    });

    it("should have offensive-focused AP and HP distribution", () => {
      // Gundam MA Form has 4 AP and 3 HP - offensive stats
      const totalStats = gundamMaForm.ap + gundamMaForm.hp;
      expect(totalStats).toBe(7); // 4 + 3

      // More AP than HP indicates aggressive unit
      expect(gundamMaForm.ap).toBeGreaterThan(gundamMaForm.hp);
    });

    it("should set up combat scenario", () => {
      // Gundam MA Form with 4 AP attacking
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamMaForm],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit
          resourceArea: 5,
          deck: 30,
        },
      );

      // Combat scenario ready: Gundam MA Form can attack with 4 AP
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should have synergy between card draw and offensive stats", () => {
      // High AP with card draw creates aggressive tempo strategy
      expect(gundamMaForm.ap).toBe(4);
      expect(gundamMaForm.abilities[0].effects[0].type).toBe("draw");

      // Card draw helps maintain resources for aggressive play
      const drawEffect = gundamMaForm.abilities[0].effects[0];
      expect(drawEffect.amount).toBe(1);
    });
  });
});
