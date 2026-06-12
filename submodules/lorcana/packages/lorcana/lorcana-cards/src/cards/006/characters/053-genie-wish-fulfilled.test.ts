import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { genieWishFulfilled } from "./053-genie-wish-fulfilled";

const drawStepCard = createMockCharacter({
  id: "genie-draw-step-card",
  name: "Draw Step",
  cost: 1,
});
const playedDrawCard = createMockCharacter({
  id: "genie-play-draw-card",
  name: "Play Draw",
  cost: 1,
});

describe("Genie - Wish Fulfilled", () => {
  it("has Evasive", () => {
    const testEngine = new LorcanaTestEngine({
      play: [genieWishFulfilled],
    });

    expect(testEngine.getCardModel(genieWishFulfilled).hasEvasive).toBe(true);
  });

  it("draws a card when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [genieWishFulfilled],
      inkwell: genieWishFulfilled.cost,
      deck: [playedDrawCard, drawStepCard],
    });

    expect(testEngine.asPlayerOne().playCard(genieWishFulfilled)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: 1,
        deck: 1,
      }),
    );
  });
});
