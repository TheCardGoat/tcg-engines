import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { eilonwyPrincessOfLlyr } from "./007-eilonwy-princess-of-llyr";

describe("Eilonwy - Princess of Llyr", () => {
  it.skip("should have Support ability", () => {
    const testEngine = new TestEngine({
      play: [eilonwyPrincessOfLlyr],
    });

    const cardUnderTest = testEngine.getCardModel(eilonwyPrincessOfLlyr);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
