import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { cleansingRainwater } from "../items";
import { agrabahMarketplace } from "../locations";
import { riseOfTheTitans } from "./198-rise-of-the-titans";

describe("Rise of the Titans", () => {
  it("banishes the chosen item", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [riseOfTheTitans],
      inkwell: riseOfTheTitans.cost,
      play: [cleansingRainwater],
    });

    expect(
      testEngine.asPlayerOne().playCard(riseOfTheTitans, {
        targets: [cleansingRainwater],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(cleansingRainwater)).toBe("discard");
  });

  it("banishes the chosen location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [riseOfTheTitans],
      inkwell: riseOfTheTitans.cost,
      play: [agrabahMarketplace],
    });

    expect(
      testEngine.asPlayerOne().playCard(riseOfTheTitans, {
        targets: [agrabahMarketplace],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(agrabahMarketplace)).toBe("discard");
  });
});
