import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { moanaUndeterredVoyager } from "./116-moana-undeterred-voyager";

describe("Moana - Undeterred Voyager", () => {
  it.skip("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [moanaUndeterredVoyager],
    });

    const cardUnderTest = testEngine.getCardModel(moanaUndeterredVoyager);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
