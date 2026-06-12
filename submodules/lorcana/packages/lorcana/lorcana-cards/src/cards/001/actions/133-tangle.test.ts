import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { tangle } from "./133-tangle";

describe("Tangle", () => {
  it("makes each opponent lose 1 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [tangle],
        inkwell: tangle.cost,
      },
      {
        deck: 1,
      },
    );

    // Player two sets their own lore (manual moves can be made by the player for themselves)
    testEngine.asServer().manualSetLore(PLAYER_TWO, 5);

    const playResult = testEngine.asPlayerOne().playCard(tangle);

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore(PLAYER_TWO)).toEqual(4);
  });
});
