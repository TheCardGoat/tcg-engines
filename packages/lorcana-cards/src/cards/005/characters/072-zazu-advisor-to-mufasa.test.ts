import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { zazuAdvisorToMufasa } from "./072-zazu-advisor-to-mufasa";

describe("Zazu - Advisor to Mufasa", () => {
  it("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [zazuAdvisorToMufasa],
    });
    const cardUnderTest = testEngine.getCardModel(zazuAdvisorToMufasa);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
