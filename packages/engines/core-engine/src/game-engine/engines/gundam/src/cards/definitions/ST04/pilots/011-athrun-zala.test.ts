import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { athrunZala } from "./011-athrun-zala";

describe("ST04-011: Athrun Zala", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(athrunZala.id).toBe("ST04-011");
      expect(athrunZala.name).toBe("Athrun Zala");
      expect(athrunZala.number).toBe(11);
      expect(athrunZala.set).toBe("ST04");
      expect(athrunZala.type).toBe("pilot");
      expect(athrunZala.rarity).toBe("common");
    });

    it("should have correct cost and level", () => {
      expect(athrunZala.cost).toBe(1);
      expect(athrunZala.level).toBe(4);
    });

    it("should have correct color and traits", () => {
      expect(athrunZala.color).toBe("red");
      expect(athrunZala.traits).toEqual([]);
    });

    it("should have pilot stat modifiers", () => {
      expect(athrunZala.apModifier).toBe(1);
      expect(athrunZala.hpModifier).toBe(2);
    });

    it("should have text describing Burst ability", () => {
      expect(athrunZala.text).toContain("Burst");
      expect(athrunZala.text).toContain("Add this card to your hand");
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(athrunZala.abilities).toBeDefined();
      expect(athrunZala.abilities.length).toBe(1);
    });

    it("should have triggered Burst ability", () => {
      const ability = athrunZala.abilities[0];
      expect(ability.type).toBe("triggered");
      expect(ability.text).toBe("【burst】");
      expect(ability.trigger?.event).toBe("burst");
    });

    it("should have move-to-hand effect", () => {
      const ability = athrunZala.abilities[0];
      expect(ability.effects).toBeDefined();
      expect(ability.effects.length).toBe(1);

      const effect = ability.effects[0];
      expect(effect.type).toBe("move-to-hand");
      expect(effect.target.type).toBe("unit");
      expect(effect.target.value).toBe("self");
      expect(effect.targetText).toBe("this card");
    });
  });

  describe("Pilot Pairing Mechanics", () => {
    it("should be deployable as a pilot", () => {
      const engine = new GundamTestEngine(
        {
          hand: [athrunZala],
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

    it("should set up scenario with Athrun Zala paired with Aegis Gundam", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: 1,
          hand: [athrunZala],
          resourceArea: 3,
          deck: 30,
        },
        {
          battleArea: 2,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      expect(athrunZala.apModifier).toBe(1);
      expect(athrunZala.hpModifier).toBe(2);
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(athrunZala).toHaveProperty("implemented");
      expect(athrunZala).toHaveProperty("missingTestCase");
    });
  });

  describe("Pilot Stats and Strategy", () => {
    it("should have level 4 appropriate for cost 1 pilot", () => {
      expect(athrunZala.level).toBe(4);
      expect(athrunZala.cost).toBe(1);
    });

    it("should provide defensive-focused stat boost", () => {
      expect(athrunZala.apModifier).toBe(1);
      expect(athrunZala.hpModifier).toBe(2);

      const totalBoost = athrunZala.apModifier + athrunZala.hpModifier;
      expect(totalBoost).toBe(3);
    });
  });
});
