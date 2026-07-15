import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { mauiSnowSlider } from "./109-maui-snow-slider";

const opponentCharacter = createMockCharacter({
  id: "opponent-char",
  name: "Opponent Character",
  strength: 2,
  willpower: 2,
  cost: 2,
});

describe("Maui - Snow Slider", () => {
  it("should have Rush ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [mauiSnowSlider],
    });

    const cardUnderTest = testEngine.getCardModel(mauiSnowSlider);
    expect(cardUnderTest.hasRush).toBe(true);
  });

  it("should be able to challenge the turn it's played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [mauiSnowSlider],
        inkwell: mauiSnowSlider.cost,
      },
      {
        play: [{ card: opponentCharacter, exerted: true }],
      },
    );

    expect(testEngine.asPlayerOne().playCard(mauiSnowSlider)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().challenge(mauiSnowSlider, opponentCharacter),
    ).toBeSuccessfulCommand();
  });
});
