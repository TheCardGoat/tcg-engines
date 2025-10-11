import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { theMagicBulletOfDusk } from "./014-the-magic-bullet-of-dusk";

describe("ST04-014: The Magic Bullet of Dusk", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(theMagicBulletOfDusk.id).toBe("ST04-014");
      expect(theMagicBulletOfDusk.name).toBe("The Magic Bullet of Dusk");
      expect(theMagicBulletOfDusk.number).toBe(14);
      expect(theMagicBulletOfDusk.set).toBe("ST04");
      expect(theMagicBulletOfDusk.type).toBe("command");
      expect(theMagicBulletOfDusk.rarity).toBe("common");
    });

    it("should have correct cost and level", () => {
      expect(theMagicBulletOfDusk.cost).toBe(1);
      expect(theMagicBulletOfDusk.level).toBe(3);
    });

    it("should have correct color", () => {
      expect(theMagicBulletOfDusk.color).toBe("red");
    });

    it("should have empty abilities and text", () => {
      expect(theMagicBulletOfDusk.abilities).toEqual([]);
      expect(theMagicBulletOfDusk.text).toBe("");
    });
  });

  describe("Command Card in Game Scenarios", () => {
    it("should be playable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [theMagicBulletOfDusk],
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
      expect(theMagicBulletOfDusk).toHaveProperty("implemented");
      expect(theMagicBulletOfDusk).toHaveProperty("missingTestCase");
    });
  });
});
