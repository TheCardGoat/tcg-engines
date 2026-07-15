import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { scoutAhead } from "./104-scout-ahead";

describe("Scout Ahead", () => {
  it("gains 2 lore when an opponent has more lore than you", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [scoutAhead],
        inkwell: scoutAhead.cost,
      },
      {
        startingLore: {
          [PLAYER_ONE]: 1,
          [PLAYER_TWO]: 3,
        },
      },
    );

    expect(testEngine.asPlayerOne().playCard(scoutAhead)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(3);
  });
});
