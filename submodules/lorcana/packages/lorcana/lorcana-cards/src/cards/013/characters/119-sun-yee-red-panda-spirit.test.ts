import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { fireTheCannons } from "../../001/actions/197-fire-the-cannons";
import { sunYeeRedPandaSpirit } from "./119-sun-yee-red-panda-spirit";

const redPandaBase = createMockCharacter({
  id: "sun-yee-red-panda-shift-base",
  name: "Red Panda Base",
  cost: 2,
  classifications: ["Storyborn", "Red Panda"],
});

describe("Sun Yee - Red Panda Spirit", () => {
  it("temporarily shifts onto a Red Panda character, then returns only Sun Yee to hand and clears damage", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [sunYeeRedPandaSpirit, fireTheCannons],
        play: [{ card: redPandaBase, isDrying: false }],
        inkwell: 3,
      },
      {
        deck: 1,
      },
    );
    const shiftTarget = testEngine.findCardInstanceId(redPandaBase, "play", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(sunYeeRedPandaSpirit, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.getCardsUnder(sunYeeRedPandaSpirit)).toHaveLength(1);

    expect(
      testEngine.asPlayerOne().playCard(fireTheCannons, {
        targets: [sunYeeRedPandaSpirit],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne()).toHaveDamage({
      card: sunYeeRedPandaSpirit,
      value: 2,
    });

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(sunYeeRedPandaSpirit)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(redPandaBase)).toBe("play");
    expect(testEngine.asPlayerOne()).toHaveDamage({ card: redPandaBase, value: 0 });
  });

  it("cannot temporarily shift onto a non-Red-Panda character", () => {
    const nonRedPandaBase = createMockCharacter({
      id: "sun-yee-non-red-panda-shift-base",
      name: "Generic Base",
      cost: 2,
      classifications: ["Storyborn", "Hero"],
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [sunYeeRedPandaSpirit],
      play: [{ card: nonRedPandaBase, isDrying: false }],
      inkwell: 2,
    });
    const shiftTarget = testEngine.findCardInstanceId(nonRedPandaBase, "play", PLAYER_ONE);

    const result = testEngine.asPlayerOne().playCard(sunYeeRedPandaSpirit, {
      cost: { cost: "shift", shiftTarget },
    });

    expect(result.success).toBe(false);
    expect(testEngine.asPlayerOne().getCardZone(sunYeeRedPandaSpirit)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(nonRedPandaBase)).toBe("play");
  });
});
