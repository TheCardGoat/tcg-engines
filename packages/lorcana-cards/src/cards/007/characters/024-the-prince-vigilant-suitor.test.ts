import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { thePrinceVigilantSuitor } from "./024-the-prince-vigilant-suitor";

describe("The Prince - Vigilant Suitor", () => {
  it.skip("should have Bodyguard ability", () => {
    const testEngine = new TestEngine({
      play: [thePrinceVigilantSuitor],
    });

    const cardUnderTest = testEngine.getCardModel(thePrinceVigilantSuitor);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});
