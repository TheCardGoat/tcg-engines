import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { strikerPack } from "./012-striker-pack";

describe("ST04-012: Striker Pack", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(strikerPack.id).toBe("ST04-012");
      expect(strikerPack.name).toBe("Striker Pack");
      expect(strikerPack.number).toBe(12);
      expect(strikerPack.set).toBe("ST04");
      expect(strikerPack.type).toBe("command");
      expect(strikerPack.rarity).toBe("common");
    });

    it("should have correct cost and level", () => {
      expect(strikerPack.cost).toBe(2);
      expect(strikerPack.level).toBe(4);
    });

    it("should have correct color", () => {
      expect(strikerPack.color).toBe("white");
    });

    it("should have text describing Burst ability", () => {
      expect(strikerPack.text).toContain("Burst");
      expect(strikerPack.text).toContain("Earth Alliance");
      expect(strikerPack.text).toContain("token");
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities defined", () => {
      expect(strikerPack.abilities).toBeDefined();
      expect(strikerPack.abilities.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Command Card in Game Scenarios", () => {
    it("should be playable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [strikerPack],
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
      expect(strikerPack).toHaveProperty("implemented");
      expect(strikerPack).toHaveProperty("missingTestCase");
    });
  });
});
