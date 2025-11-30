import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { dukeWeaseltonSmalltimeCrook } from "./146-duke-weaselton-small-time-crook";

describe("Duke Weaselton - Small-Time Crook", () => {
  it("should have Ward ability", () => {
    const testEngine = new LorcanaTestEngine(
      {},
      {},
      {
        play: [dukeWeaseltonSmalltimeCrook],
      },
    );

    const cardUnderTest = testEngine.getCardModel(dukeWeaseltonSmalltimeCrook);
    expect(cardUnderTest.hasWard()).toBe(true);
  });
});
