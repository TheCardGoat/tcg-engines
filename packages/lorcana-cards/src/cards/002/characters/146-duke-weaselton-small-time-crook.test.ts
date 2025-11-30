import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { dukeWeaseltonSmalltimeCrook } from "./146-duke-weaselton-small-time-crook";

describe("Duke Weaselton - Small-Time Crook", () => {
  it.skip("should have Ward ability", () => {
    const testEngine = new TestEngine({
      play: [dukeWeaseltonSmalltimeCrook],
    });

    const cardUnderTest = testEngine.getCardModel(dukeWeaseltonSmalltimeCrook);
    expect(cardUnderTest.hasWard()).toBe(true);
  });
});
