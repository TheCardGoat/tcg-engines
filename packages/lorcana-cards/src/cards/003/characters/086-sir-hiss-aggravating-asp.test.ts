import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { sirHissAggravatingAsp } from "./086-sir-hiss-aggravating-asp";

describe("Sir Hiss - Aggravating Asp", () => {
  it.skip("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [sirHissAggravatingAsp],
    });

    const cardUnderTest = testEngine.getCardModel(sirHissAggravatingAsp);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
