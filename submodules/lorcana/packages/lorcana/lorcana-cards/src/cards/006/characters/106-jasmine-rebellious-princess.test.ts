import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { jasmineRebelliousPrincess } from "./106-jasmine-rebellious-princess";

describe("Jasmine - Rebellious Princess", () => {
  describe("YOU'LL NEVER MISS IT - Whenever this character quests, each opponent loses 1 lore.", () => {
    it("makes each opponent lose 1 lore when Jasmine quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: jasmineRebelliousPrincess, isDrying: false }],
        },
        {
          lore: 5,
        },
      );

      expect(testEngine.asPlayerOne().quest(jasmineRebelliousPrincess)).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_TWO)).toBe(4);
    });

    it("does not reduce opponent lore below 0", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: jasmineRebelliousPrincess, isDrying: false }],
        },
        {
          lore: 0,
        },
      );

      expect(testEngine.asPlayerOne().quest(jasmineRebelliousPrincess)).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_TWO)).toBe(0);
    });

    it("does not affect controller lore when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: jasmineRebelliousPrincess, isDrying: false }],
          lore: 3,
        },
        {
          lore: 5,
        },
      );

      expect(testEngine.asPlayerOne().quest(jasmineRebelliousPrincess)).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_ONE)).toBe(3 + jasmineRebelliousPrincess.lore);
      expect(testEngine.getLore(PLAYER_TWO)).toBe(4);
    });
  });
});
