import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { zazuAdvisorToMufasa } from "./072-zazu-advisor-to-mufasa";

describe("Zazu - Advisor to Mufasa", () => {
  it.skip("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [zazuAdvisorToMufasa],
    });

    const cardUnderTest = testEngine.getCardModel(zazuAdvisorToMufasa);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
