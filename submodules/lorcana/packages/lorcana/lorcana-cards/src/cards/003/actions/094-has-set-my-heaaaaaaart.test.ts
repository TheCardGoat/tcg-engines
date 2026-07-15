import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { cleansingRainwater } from "../items";
import { hasSetMyHeaaaaaaart } from "./094-has-set-my-heaaaaaaart";

describe("Has Set My Heaaaaaaart . . .", () => {
  it("banishes the chosen item", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [hasSetMyHeaaaaaaart],
      inkwell: hasSetMyHeaaaaaaart.cost,
      play: [cleansingRainwater],
    });

    expect(
      testEngine.asPlayerOne().playCard(hasSetMyHeaaaaaaart, {
        targets: [cleansingRainwater],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(cleansingRainwater)).toBe("discard");
  });
});
