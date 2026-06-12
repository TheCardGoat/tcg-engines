import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { donaldDuckDaisysDate } from "./122-donald-duck-daisys-date";

const defender = createMockCharacter({
  id: "daisys-date-defender",
  name: "Defender",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
});

describe("Donald Duck - Daisy's Date", () => {
  describe("PLUCKY PLAY - Whenever this character challenges another character, each opponent loses 1 lore.", () => {
    it("makes each opponent lose 1 lore when Donald Duck challenges another character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: donaldDuckDaisysDate, isDrying: false }],
          deck: 1,
        },
        {
          play: [{ card: defender, exerted: true }],
          deck: 1,
        },
        {
          startingLore: {
            player_one: 0,
            player_two: 3,
          },
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(donaldDuckDaisysDate, defender),
      ).toBeSuccessfulCommand();

      if (testEngine.asPlayerOne().getBagCount() > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(donaldDuckDaisysDate),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
      expect(testEngine.getLore(PLAYER_TWO)).toBe(2);
    });

    it("triggers each time Donald Duck challenges, reducing opponent lore by 1 per challenge", () => {
      const secondDefender = createMockCharacter({
        id: "daisys-date-second-defender",
        name: "Second Defender",
        cost: 2,
        strength: 1,
        willpower: 10,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: donaldDuckDaisysDate, isDrying: false }],
          deck: 1,
        },
        {
          play: [
            { card: defender, exerted: true },
            { card: secondDefender, exerted: true },
          ],
          deck: 1,
        },
        {
          startingLore: {
            player_one: 0,
            player_two: 5,
          },
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(donaldDuckDaisysDate, defender),
      ).toBeSuccessfulCommand();

      if (testEngine.asPlayerOne().getBagCount() > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(donaldDuckDaisysDate),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.getLore(PLAYER_TWO)).toBe(4);
    });
  });
});
