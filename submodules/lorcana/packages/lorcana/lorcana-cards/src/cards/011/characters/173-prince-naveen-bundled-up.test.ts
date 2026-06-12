import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { princeNaveenBundledUp } from "./173-prince-naveen-bundled-up";

describe("Prince Naveen - Bundled Up", () => {
  it("defines an empty ability list for a vanilla character", () => {
    expect(princeNaveenBundledUp.abilities).toEqual([]);
  });

  it("can be played with enough ink", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [princeNaveenBundledUp],
      inkwell: princeNaveenBundledUp.cost,
      deck: 5,
    });

    expect(testEngine.asPlayerOne().playCard(princeNaveenBundledUp)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(princeNaveenBundledUp)).toBe("play");
  });
});
