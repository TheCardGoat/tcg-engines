import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import {
  heiheiBoatSnack,
  liloMakingAWish,
  starkeyHooksHenchman,
} from "@tcg/lorcana-cards/cards/001";
import { yzmaAboveItAll } from "@tcg/lorcana-cards/cards/007";

const weakDefender = createMockCharacter({
  id: "random-target-weak-defender",
  name: "Weak Defender",
  cost: 1,
  strength: 1,
  willpower: 1,
});

describe("Targeting: Random Target Selection", () => {
  describe("Yzma - Above It All - BACK TO WORK: random discard after return to hand", () => {
    it("should pick a target from valid candidates (random discard selects from hand)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [yzmaAboveItAll, starkeyHooksHenchman],
          deck: 2,
        },
        {
          play: [{ card: weakDefender, exerted: true }],
          hand: [liloMakingAWish, heiheiBoatSnack],
          deck: 2,
        },
      );

      // Starkey challenges weak defender, banishing it in a challenge
      expect(
        testEngine.asPlayerOne().challenge(starkeyHooksHenchman, weakDefender),
      ).toBeSuccessfulCommand();

      // Yzma's trigger: return banished card to hand, then that player discards at random
      // Weak defender should go back to hand (3 cards in hand), then 1 discarded randomly
      // Final state: 2 cards in hand, 1 in discard
      expect(testEngine.asPlayerTwo().getZonesCardCount().hand).toBe(2);
      expect(testEngine.asPlayerTwo().getZonesCardCount().discard).toBe(1);
    });

    it("should be a no-op for the random discard when opponent has empty hand after return", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [yzmaAboveItAll, starkeyHooksHenchman],
          deck: 2,
        },
        {
          play: [{ card: weakDefender, exerted: true }],
          hand: [], // Empty hand
          deck: 2,
        },
      );

      // Starkey banishes weak defender in challenge
      expect(
        testEngine.asPlayerOne().challenge(starkeyHooksHenchman, weakDefender),
      ).toBeSuccessfulCommand();

      // Weak defender returned to hand, then discard at random from the 1-card hand
      // Should have 0 cards in hand and 1 in discard
      expect(testEngine.asPlayerTwo().getZonesCardCount().hand).toBe(0);
      expect(testEngine.asPlayerTwo().getZonesCardCount().discard).toBe(1);
    });
  });
});
