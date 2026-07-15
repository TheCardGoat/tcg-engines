import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { gizmoduckSuitedUp } from "./105-gizmoduck-suited-up";

// A simple attacker for testing challenges against Gizmoduck
const attacker = createMockCharacter({
  id: "gizmoduck-test-attacker",
  name: "Test Attacker",
  cost: 3,
  strength: 3,
  willpower: 4,
});

// A ready (not exerted) character to challenge
const readyTarget = createMockCharacter({
  id: "gizmoduck-ready-target",
  name: "Ready Target",
  cost: 2,
  strength: 1,
  willpower: 5,
});

describe("Gizmoduck - Suited Up", () => {
  describe("Resist +1", () => {
    it("has the Resist +1 keyword", () => {
      const testEngine = new LorcanaTestEngine({
        play: [gizmoduckSuitedUp],
      });

      const cardModel = testEngine.getCardModel(gizmoduckSuitedUp);
      expect(cardModel.hasResist).toBe(true);
      expect(cardModel.damageReduction).toBe(1);
    });

    it("reduces damage taken by 1 in a challenge — attacker with strength 3 deals only 2 damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: attacker, isDrying: false }],
          deck: 5,
        },
        {
          play: [{ card: gizmoduckSuitedUp, exerted: true }],
          deck: 5,
        },
      );

      const gizmoduckId = testEngine.findCardInstanceId(gizmoduckSuitedUp, "play", PLAYER_TWO);

      expect(
        testEngine.asPlayerOne().challenge(attacker, gizmoduckSuitedUp),
      ).toBeSuccessfulCommand();

      // Gizmoduck has Resist +1 → attacker strength 3 - 1 Resist = 2 damage
      expect(testEngine.asServer().getCard(gizmoduckId).damage).toBe(2);
    });
  });

  describe("BLATHERING BLATHERSKITE - can challenge ready damaged characters", () => {
    it("can challenge a ready character that has damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: gizmoduckSuitedUp, isDrying: false }],
          deck: 5,
        },
        {
          play: [{ card: readyTarget, isDrying: false, damage: 1 }],
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(gizmoduckSuitedUp, readyTarget),
      ).toBeSuccessfulCommand();
    });

    it("cannot challenge a ready character with no damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: gizmoduckSuitedUp, isDrying: false }],
          deck: 5,
        },
        {
          play: [{ card: readyTarget, isDrying: false }],
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(gizmoduckSuitedUp, readyTarget),
      ).not.toBeSuccessfulCommand();
    });

    it("can still challenge an exerted character normally", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: gizmoduckSuitedUp, isDrying: false }],
          deck: 5,
        },
        {
          play: [{ card: readyTarget, exerted: true, isDrying: false }],
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(gizmoduckSuitedUp, readyTarget),
      ).toBeSuccessfulCommand();
    });
  });
});
