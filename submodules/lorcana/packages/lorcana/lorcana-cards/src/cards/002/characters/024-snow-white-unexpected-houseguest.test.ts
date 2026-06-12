import { describe, expect, it } from "bun:test";
import { happyGoodnatured } from "./011-happy-good-natured";
import { snowWhiteUnexpectedHouseguest } from "./024-snow-white-unexpected-houseguest";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";

describe("Snow White - Unexpected Houseguest", () => {
  it("reduces the cost of your Seven Dwarfs characters by 1", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [happyGoodnatured],
      inkwell: happyGoodnatured.cost - 1,
      play: [snowWhiteUnexpectedHouseguest],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().playCard(happyGoodnatured)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(happyGoodnatured)).toBe("play");
  });
});
