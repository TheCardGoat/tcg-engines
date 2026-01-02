import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { zazuAdvisorToMufasa } from "./072-zazu-advisor-to-mufasa";

describe("Zazu - Advisor to Mufasa", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [zazuAdvisorToMufasa],
    });

    const cardUnderTest = testEngine.getCardModel(zazuAdvisorToMufasa);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
