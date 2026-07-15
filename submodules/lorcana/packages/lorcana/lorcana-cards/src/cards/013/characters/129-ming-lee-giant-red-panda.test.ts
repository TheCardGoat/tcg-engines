import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { mingLeeGiantRedPanda } from "./129-ming-lee-giant-red-panda";

const mingBase = createMockCharacter({
  id: "ming-giant-red-panda-shift-base",
  name: "Ming Lee",
  cost: 2,
});

const challengedCharacter = createMockCharacter({
  id: "ming-giant-red-panda-challenged-character",
  name: "Challenged Character",
  cost: 2,
  strength: 1,
  willpower: 10,
});

describe("Ming Lee - Giant Red Panda", () => {
  it("temporarily shifts, then readies after challenging and can't quest that turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [mingLeeGiantRedPanda],
        play: [{ card: mingBase, damage: 2, isDrying: false }],
        inkwell: 7,
      },
      {
        play: [{ card: challengedCharacter, exerted: true }],
        deck: 1,
      },
    );
    const shiftTarget = testEngine.findCardInstanceId(mingBase, "play", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(mingLeeGiantRedPanda, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().challenge(mingLeeGiantRedPanda, challengedCharacter),
    ).toBeSuccessfulCommand();
    if (testEngine.asPlayerOne().getBagCount() > 0) {
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(mingLeeGiantRedPanda),
      ).toBeSuccessfulCommand();
    }

    expect(testEngine.asPlayerOne().isExerted(mingLeeGiantRedPanda)).toBe(false);
    expect(testEngine.asPlayerOne().quest(mingLeeGiantRedPanda)).not.toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(mingLeeGiantRedPanda)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(mingBase)).toBe("play");
    expect(testEngine.asPlayerOne()).toHaveDamage({ card: mingBase, value: 0 });
  });
});
