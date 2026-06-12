import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  PLAYER_ONE,
} from "@tcg/lorcana-engine/testing";
import type { ZoneId } from "@tcg/lorcana-engine";
import { luisaMadrigalRockOfTheFamily } from "./184-luisa-madrigal-rock-of-the-family";

const anotherCharacter = createMockCharacter({
  id: "luisa-another-char",
  name: "Another Character",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  classifications: ["Storyborn"],
});

describe("Luisa Madrigal - Rock of the Family", () => {
  describe("I'M THE STRONG ONE - While you have another character in play, this character gets +2 {S}.", () => {
    it("has base strength when alone", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [luisaMadrigalRockOfTheFamily],
      });

      expect(testEngine.asPlayerOne().getCardStrength(luisaMadrigalRockOfTheFamily)).toBe(
        luisaMadrigalRockOfTheFamily.strength,
      );
    });

    it("gets +2 strength when another character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [luisaMadrigalRockOfTheFamily, anotherCharacter],
      });

      expect(testEngine.asPlayerOne().getCardStrength(luisaMadrigalRockOfTheFamily)).toBe(
        luisaMadrigalRockOfTheFamily.strength + 2,
      );
    });

    it("loses +2 strength when the other character leaves play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [luisaMadrigalRockOfTheFamily, anotherCharacter],
      });

      expect(testEngine.asPlayerOne().getCardStrength(luisaMadrigalRockOfTheFamily)).toBe(
        luisaMadrigalRockOfTheFamily.strength + 2,
      );

      const anotherCharInstanceId = testEngine.findCardInstanceId(
        anotherCharacter,
        "play",
        PLAYER_ONE,
      );
      testEngine
        .asServer()
        .manualMoveCard(anotherCharInstanceId, `discard:${PLAYER_ONE}` as ZoneId);

      expect(testEngine.asPlayerOne().getCardStrength(luisaMadrigalRockOfTheFamily)).toBe(
        luisaMadrigalRockOfTheFamily.strength,
      );
    });

    it("does not get bonus from opponent's characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [luisaMadrigalRockOfTheFamily] },
        { play: [anotherCharacter] },
      );

      expect(testEngine.asPlayerOne().getCardStrength(luisaMadrigalRockOfTheFamily)).toBe(
        luisaMadrigalRockOfTheFamily.strength,
      );
    });
  });
});
