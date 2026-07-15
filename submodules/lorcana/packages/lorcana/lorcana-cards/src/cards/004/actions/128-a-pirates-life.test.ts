import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { aPiratesLife } from "./128-a-pirates-life";

describe("A Pirate’s Life", () => {
  it("makes each opponent lose 2 lore and you gain 2 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [aPiratesLife],
        inkwell: aPiratesLife.cost,
      },
      {},
    );
    testEngine.asServer().manualSetLore(PLAYER_ONE, 5);
    testEngine.asServer().manualSetLore(PLAYER_TWO, 5);

    expect(testEngine.asPlayerOne().playCard(aPiratesLife)).toBeSuccessfulCommand();
    expect(testEngine.getLore(PLAYER_ONE)).toBe(7);
    expect(testEngine.getLore(PLAYER_TWO)).toBe(3);
  });
});
