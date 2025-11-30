import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { sirHissAggravatingAsp } from "./086-sir-hiss-aggravating-asp";

describe("Sir Hiss - Aggravating Asp", () => {
  it("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [sirHissAggravatingAsp],
    });
    const cardUnderTest = testEngine.getCardModel(sirHissAggravatingAsp);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
