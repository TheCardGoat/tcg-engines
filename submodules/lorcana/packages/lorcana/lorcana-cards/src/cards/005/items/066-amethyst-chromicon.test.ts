import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { amethystChromicon } from "./066-amethyst-chromicon";

const playerOneDraw = createMockCharacter({
  id: "amethyst-chromicon-p1-draw",
  name: "Player One Draw",
  cost: 1,
});

const playerTwoDraw = createMockCharacter({
  id: "amethyst-chromicon-p2-draw",
  name: "Player Two Draw",
  cost: 1,
});

describe("Amethyst Chromicon", () => {
  it("lets each player independently decide whether to draw a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: [playerOneDraw],
        play: [amethystChromicon],
      },
      {
        deck: [playerTwoDraw],
      },
    );

    expect(testEngine.asPlayerOne().activateAbility(amethystChromicon)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);

    expect(
      testEngine.asPlayerOne().resolvePendingEffect(amethystChromicon, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(playerOneDraw)).toBe("hand");
    expect(testEngine.asPlayerTwo().getPendingEffects()).toHaveLength(1);

    expect(
      testEngine.asPlayerTwo().resolvePendingEffect(amethystChromicon, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(playerTwoDraw)).toBe("deck");
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });
});
