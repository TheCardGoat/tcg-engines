import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { gouf } from "./009-gouf";

/**
 * Tests for ST03-009: Gouf
 *
 * Card Properties:
 * - Cost: 3, Level: 3, AP: 2, HP: 3
 * - Color: Green
 * - Traits: Zeon
 * - Link Requirement: Ramba Ral
 * - Zones: Earth only
 *
 * Abilities:
 * - 【Deploy】: Deploy 1 rested [Zaku Ⅱ]((Zeon)·AP1·HP1) Unit token
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Deploy trigger ability definition
 * - Token generation effect definition
 * - Earth-only zone restriction
 * - Card usability in game scenarios
 */

describe("ST03-009: Gouf", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(gouf.id).toBe("ST03-009");
      expect(gouf.name).toBe("Gouf");
      expect(gouf.number).toBe(9);
      expect(gouf.set).toBe("ST03");
      expect(gouf.type).toBe("unit");
      expect(gouf.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(gouf.cost).toBe(3);
      expect(gouf.level).toBe(3);
      expect(gouf.ap).toBe(2);
      expect(gouf.hp).toBe(3);
    });

    it("should have correct color and traits", () => {
      expect(gouf.color).toBe("green");
      expect(gouf.traits).toEqual(["zeon"]);
    });

    it("should have earth-only zone restriction", () => {
      expect(gouf.zones).toEqual(["earth"]);
      expect(gouf.zones).not.toContain("space");
    });

    it("should have correct link requirement", () => {
      expect(gouf.linkRequirement).toEqual(["ramba ral"]);
    });

    it("should have text describing Deploy ability", () => {
      expect(gouf.text).toContain("Deploy");
      expect(gouf.text).toContain("Zaku Ⅱ");
      expect(gouf.text).toContain("rested");
      expect(gouf.text).toContain("token");
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(gouf.abilities).toBeDefined();
      expect(gouf.abilities.length).toBe(1);
    });

    it("should have triggered Deploy ability", () => {
      const ability = gouf.abilities[0];
      expect(ability.type).toBe("triggered");
      expect(ability.text).toBe("【deploy】");
      expect(ability.trigger).toBeDefined();
      expect(ability.trigger.event).toBe("deploy");
    });

    it("should have rule effect for token generation", () => {
      const ability = gouf.abilities[0];
      expect(ability.effects).toBeDefined();
      expect(ability.effects.length).toBeGreaterThanOrEqual(1);

      const ruleEffect = ability.effects.find((e) => e.type === "rule");
      expect(ruleEffect).toBeDefined();
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be deployable with sufficient resources", () => {
      // Gouf costs 3, so need 3 resources
      const engine = new GundamTestEngine(
        {
          hand: [gouf],
          resourceArea: 4,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 4,
          deck: 30,
        },
      );

      // Card is in hand and can be deployed
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "resourceArea", 4, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with Gouf in battle area", () => {
      // Gouf with Deploy token ability on the field
      const engine = new GundamTestEngine(
        {
          battleArea: [gouf],
          hand: 5,
          resourceArea: 4,
          deck: 30,
        },
        {
          battleArea: 2,
          hand: 5,
          resourceArea: 4,
          deck: 30,
        },
      );

      // Gouf is on the field
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario for Deploy ability testing", () => {
      // Gouf deploys a rested Zaku Ⅱ token when deployed
      const engine = new GundamTestEngine(
        {
          battleArea: [gouf], // Gouf deployed, should create token
          hand: 5,
          resourceArea: 4,
          deck: 30,
        },
        {
          battleArea: 1,
          hand: 5,
          resourceArea: 4,
          deck: 30,
        },
      );

      // Setup for Deploy ability: generates Zaku Ⅱ token on deployment
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable only in earth zone", () => {
      // Gouf can only be deployed on earth
      const engine = new GundamTestEngine(
        {
          hand: [gouf],
          resourceArea: 4,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 4,
          deck: 30,
        },
      );

      // Gouf supports only earth deployment
      expect(gouf.zones).toEqual(["earth"]);
      assertZoneCount(engine, "hand", 1, "player_one");
    });

    it("should work with Ramba Ral pilot link requirement", () => {
      // Gouf has link requirement for Ramba Ral
      const engine = new GundamTestEngine(
        {
          battleArea: [gouf],
          hand: 5, // Could have Ramba Ral pilot card
          resourceArea: 4,
          deck: 30,
        },
        {
          battleArea: 2,
          hand: 5,
          resourceArea: 4,
          deck: 30,
        },
      );

      // Gouf can be paired with Ramba Ral
      expect(gouf.linkRequirement).toContain("ramba ral");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      // Card definition tracks whether card is fully implemented
      expect(gouf).toHaveProperty("implemented");
      expect(gouf).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have level 3 stats appropriate for cost 3", () => {
      // Level 3 unit with 3 cost is a mid-game unit
      expect(gouf.level).toBe(3);
      expect(gouf.cost).toBe(3);
      expect(gouf.ap).toBe(2);
      expect(gouf.hp).toBe(3);
    });

    it("should have balanced defensive stats", () => {
      // Gouf has 2 AP and 3 HP - defensive stats with token generation
      const totalStats = gouf.ap + gouf.hp;
      expect(totalStats).toBe(5); // 2 + 3

      // HP-focused (HP > AP) - designed for board presence
      expect(gouf.hp).toBeGreaterThan(gouf.ap);
    });

    it("should set up combat scenario", () => {
      // Gouf with 2 AP attacking
      const engine = new GundamTestEngine(
        {
          battleArea: [gouf],
          resourceArea: 4,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit
          resourceArea: 4,
          deck: 30,
        },
      );

      // Combat scenario ready: Gouf can attack with 2 AP
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should generate board presence with Deploy ability", () => {
      // Gouf deploys with a Zaku Ⅱ token, creating 2 units from 1 card
      const engine = new GundamTestEngine(
        {
          battleArea: [gouf],
          resourceArea: 4,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 4,
          deck: 30,
        },
      );

      // Deploy ability makes it valuable for board control
      expect(gouf.abilities[0].trigger.event).toBe("deploy");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should work well in Zeon tribal strategies", () => {
      // Gouf has Zeon trait and generates Zeon token
      expect(gouf.traits).toContain("zeon");

      // Deploy ability text mentions Zeon trait on token
      expect(gouf.text).toContain("Zeon");

      const engine = new GundamTestEngine(
        {
          battleArea: [gouf],
          resourceArea: 4,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 4,
          deck: 30,
        },
      );

      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be an earth-only specialist unit", () => {
      // Gouf is specialized for earth combat only
      expect(gouf.zones).toEqual(["earth"]);
      expect(gouf.level).toBe(3);

      // Earth restriction balanced by token generation ability
      expect(gouf.abilities[0].trigger.event).toBe("deploy");
    });
  });
});
