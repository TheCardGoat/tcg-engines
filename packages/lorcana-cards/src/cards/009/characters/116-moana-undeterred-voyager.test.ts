import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { moanaUndeterredVoyager } from "./116-moana-undeterred-voyager";

describe("Moana - Undeterred Voyager", () => {
  it("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [moanaUndeterredVoyager],
    });
    const cardUnderTest = testEngine.getCardModel(moanaUndeterredVoyager);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
