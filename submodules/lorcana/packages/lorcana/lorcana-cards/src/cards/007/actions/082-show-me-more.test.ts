import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { showMeMore } from "./082-show-me-more";

describe("Show Me More!", () => {
  it("makes each player draw 3 cards", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [showMeMore],
        inkwell: showMeMore.cost,
        deck: 3,
      },
      {
        deck: 3,
      },
    );

    expect(testEngine.asPlayerOne().playCard(showMeMore)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(3);
    expect(testEngine.asPlayerTwo().getZonesCardCount().hand).toBe(3);
  });
});
