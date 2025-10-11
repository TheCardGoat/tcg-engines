import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { archangel } from "./015-archangel";

describe("ST04-015: Archangel", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(archangel.id).toBe("ST04-015");
      expect(archangel.name).toBe("Archangel");
      expect(archangel.number).toBe(15);
      expect(archangel.set).toBe("ST04");
      expect(archangel.type).toBe("base");
      expect(archangel.rarity).toBe("common");
    });

    it("should have correct cost and level", () => {
      expect(archangel.cost).toBe(1);
      expect(archangel.level).toBe(3);
    });

    it("should have correct color and traits", () => {
      expect(archangel.color).toBe("white");
      expect(archangel.traits).toEqual(["earth federation", "warship"]);
    });

    it("should have correct zones", () => {
      expect(archangel.zones).toEqual(["space", "earth"]);
    });

    it("should have base card stats", () => {
      expect(archangel.ap).toBe(0);
      expect(archangel.hp).toBe(5);
    });

    it("should have text describing Burst ability", () => {
      expect(archangel.text).toContain("Burst");
      expect(archangel.text).toContain("Deploy this card");
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(archangel.abilities).toBeDefined();
      expect(archangel.abilities.length).toBe(1);
    });

    it("should have triggered Burst ability", () => {
      const ability = archangel.abilities[0];
      expect(ability.type).toBe("triggered");
      expect(ability.text).toBe("【burst】");
      expect(ability.trigger?.event).toBe("burst");
    });
  });

  describe("Base Card in Game Scenarios", () => {
    it("should be playable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [archangel],
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

      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "resourceArea", 3, "player_one");
      assertGamePhase(engine, "mainPhase");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(archangel).toHaveProperty("implemented");
      expect(archangel).toHaveProperty("missingTestCase");
    });
  });

  describe("Base Card Stats and Strategy", () => {
    it("should have level 3 appropriate for cost 1 base", () => {
      expect(archangel.level).toBe(3);
      expect(archangel.cost).toBe(1);
    });

    it("should have 0 AP and 5 HP", () => {
      expect(archangel.ap).toBe(0);
      expect(archangel.hp).toBe(5);
    });

    it("should have Earth Federation and Warship traits", () => {
      expect(archangel.traits).toContain("earth federation");
      expect(archangel.traits).toContain("warship");
    });
  });
});
