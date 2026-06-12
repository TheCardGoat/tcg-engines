import { describe, expect, it } from "bun:test";
import type { CardInstanceId } from "@tcg/lorcana-engine";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { magicBroomBucketBrigade, moanaOfMotunui, teKTheBurningOne } from "../characters";
import { dinglehopper } from "../items";
import { aWholeNewWorld } from "./195-a-whole-new-world";

describe("A Whole New World", () => {
  it("makes each player discard their hand and draw 7 cards", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [dinglehopper, aWholeNewWorld],
        inkwell: aWholeNewWorld.cost,
        deck: 7,
      },
      {
        hand: [magicBroomBucketBrigade, teKTheBurningOne, moanaOfMotunui],
        deck: 7,
      },
    );

    const playResult = testEngine.asPlayerOne().playCard(aWholeNewWorld);

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
      expect.objectContaining({ hand: 7, discard: 2, deck: 0 }),
    );
    expect(testEngine.asPlayerTwo().getZonesCardCount()).toEqual(
      expect.objectContaining({ hand: 7, discard: 3, deck: 0 }),
    );
  });

  it("still draws 7 for players with empty hands", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [aWholeNewWorld],
        inkwell: aWholeNewWorld.cost,
        deck: 7,
      },
      {
        hand: [],
        deck: 7,
      },
    );

    const playResult = testEngine.asPlayerOne().playCard(aWholeNewWorld);

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
      expect.objectContaining({ hand: 7, discard: 1, deck: 0 }),
    );
    expect(testEngine.asPlayerTwo().getZonesCardCount()).toEqual(
      expect.objectContaining({ hand: 7, discard: 0, deck: 0 }),
    );
  });
});
