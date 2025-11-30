import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { thePrinceVigilantSuitor } from "./024-the-prince-vigilant-suitor";

describe("The Prince - Vigilant Suitor", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new TestEngine({
      play: [thePrinceVigilantSuitor],
    });
    const cardUnderTest = testEngine.getCardModel(thePrinceVigilantSuitor);
    expect(cardUnderTest.hasBodyguard).toBe(true);
  });
});
