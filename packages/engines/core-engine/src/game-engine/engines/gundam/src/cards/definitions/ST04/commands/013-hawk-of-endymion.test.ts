import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { hawkOfEndymion } from "./013-hawk-of-endymion";

describe("ST04-013: Hawk of Endymion", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(hawkOfEndymion.id).toBe("ST04-013");
      expect(hawkOfEndymion.name).toBe("Hawk of Endymion");
      expect(hawkOfEndymion.number).toBe(13);
      expect(hawkOfEndymion.set).toBe("ST04");
      expect(hawkOfEndymion.type).toBe("command");
      expect(hawkOfEndymion.rarity).toBe("common");
    });

    it("should have correct cost and level", () => {
      expect(hawkOfEndymion.cost).toBe(1);
      expect(hawkOfEndymion.level).toBe(2);
    });

    it("should have correct color", () => {
      expect(hawkOfEndymion.color).toBe("white");
    });

    it("should have text describing Main/Action ability", () => {
      expect(hawkOfEndymion.text).toContain("Main");
      expect(hawkOfEndymion.text).toContain("Action");
      expect(hawkOfEndymion.text).toContain("Choose");
      expect(hawkOfEndymion.text).toContain("enemy Unit");
      expect(hawkOfEndymion.text).toContain("3 or less HP");
      expect(hawkOfEndymion.text).toContain("hand");
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(hawkOfEndymion.abilities).toBeDefined();
      expect(hawkOfEndymion.abilities.length).toBe(1);
    });

    it("should have triggered Action ability", () => {
      const ability = hawkOfEndymion.abilities[0];
      expect(ability.type).toBe("triggered");
      expect(ability.text).toBe("【action】");
      expect(ability.trigger?.event).toBe("action");
    });
  });

  describe("Command Card in Game Scenarios", () => {
    it("should be playable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [hawkOfEndymion],
          resourceArea: 3,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 3,
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
      expect(hawkOfEndymion).toHaveProperty("implemented");
      expect(hawkOfEndymion).toHaveProperty("missingTestCase");
    });
  });
});
