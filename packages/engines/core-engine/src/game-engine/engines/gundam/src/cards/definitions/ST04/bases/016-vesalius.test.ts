import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { vesalius } from "./016-vesalius";

describe("ST04-016: Vesalius", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(vesalius.id).toBe("ST04-016");
      expect(vesalius.name).toBe("Vesalius");
      expect(vesalius.number).toBe(16);
      expect(vesalius.set).toBe("ST04");
      expect(vesalius.type).toBe("base");
      expect(vesalius.rarity).toBe("common");
    });

    it("should have correct cost and level", () => {
      expect(vesalius.cost).toBe(1);
      expect(vesalius.level).toBe(3);
    });

    it("should have correct color and traits", () => {
      expect(vesalius.color).toBe("red");
      expect(vesalius.traits).toEqual(["warship"]);
    });

    it("should have space-only zone restriction", () => {
      expect(vesalius.zones).toEqual(["space"]);
      expect(vesalius.zones).not.toContain("earth");
    });

    it("should have base card stats", () => {
      expect(vesalius.ap).toBe(0);
      expect(vesalius.hp).toBe(5);
    });

    it("should have text describing Burst ability", () => {
      expect(vesalius.text).toContain("Burst");
      expect(vesalius.text).toContain("Deploy this card");
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(vesalius.abilities).toBeDefined();
      expect(vesalius.abilities.length).toBe(1);
    });

    it("should have triggered Burst ability", () => {
      const ability = vesalius.abilities[0];
      expect(ability.type).toBe("triggered");
      expect(ability.text).toBe("【burst】");
      expect(ability.trigger?.event).toBe("burst");
    });
  });

  describe("Base Card in Game Scenarios", () => {
    it("should be playable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [vesalius],
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

    it("should be deployable only in space", () => {
      const engine = new GundamTestEngine(
        {
          hand: [vesalius],
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

      expect(vesalius.zones).toEqual(["space"]);
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(vesalius).toHaveProperty("implemented");
      expect(vesalius).toHaveProperty("missingTestCase");
    });
  });

  describe("Base Card Stats and Strategy", () => {
    it("should have level 3 appropriate for cost 1 base", () => {
      expect(vesalius.level).toBe(3);
      expect(vesalius.cost).toBe(1);
    });

    it("should have 0 AP and 5 HP", () => {
      expect(vesalius.ap).toBe(0);
      expect(vesalius.hp).toBe(5);
    });

    it("should be space-specialized base", () => {
      expect(vesalius.zones).toEqual(["space"]);
      expect(vesalius.zones.length).toBe(1);
    });

    it("should have Warship trait", () => {
      expect(vesalius.traits).toContain("warship");
    });
  });
});
