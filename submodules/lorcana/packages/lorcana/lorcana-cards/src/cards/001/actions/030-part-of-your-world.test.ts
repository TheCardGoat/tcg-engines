import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { moanaOfMotunui } from "../characters/014-moana-of-motunui";
import { partOfYourWorld } from "./030-part-of-your-world";

describe("Part of Your World", () => {
  it("returns a chosen character card from your discard to your hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [partOfYourWorld],
      inkwell: partOfYourWorld.cost,
      discard: [moanaOfMotunui],
    });

    expect(testEngine.asPlayerOne().getCardZone(moanaOfMotunui)).toEqual("discard");

    const playResult = testEngine.asPlayerOne().playCard(partOfYourWorld, {
      targets: [moanaOfMotunui],
    });
    expect(playResult).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(partOfYourWorld)).toEqual("discard");
    expect(testEngine.asPlayerOne().getCardZone(moanaOfMotunui)).toEqual("hand");
    expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
      expect.objectContaining({ hand: 1, discard: 1 }),
    );
  });
});
