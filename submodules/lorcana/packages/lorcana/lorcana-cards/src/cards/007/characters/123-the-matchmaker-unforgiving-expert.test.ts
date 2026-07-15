import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { theMatchmakerUnforgivingExpert } from "./123-the-matchmaker-unforgiving-expert";

const defender = createMockCharacter({
  id: "matchmaker-test-defender",
  name: "Defender",
  cost: 2,
  strength: 1,
  willpower: 10,
});

describe("The Matchmaker - Unforgiving Expert", () => {
  describe("YOU ARE A DISGRACE! - Whenever this character challenges another character, each opponent loses 1 lore.", () => {
    it("causes each opponent to lose 1 lore when The Matchmaker challenges", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: theMatchmakerUnforgivingExpert, isDrying: false }],
          deck: 2,
        },
        {
          play: [{ card: defender, exerted: true }],
          lore: 3,
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(theMatchmakerUnforgivingExpert, defender),
      ).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_TWO)).toBe(2);
    });

    it("does not reduce opponent lore below 0", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: theMatchmakerUnforgivingExpert, isDrying: false }],
          deck: 2,
        },
        {
          play: [{ card: defender, exerted: true }],
          lore: 0,
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(theMatchmakerUnforgivingExpert, defender),
      ).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_TWO)).toBe(0);
    });
  });
});
