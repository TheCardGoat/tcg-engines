import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { moanaUndeterredVoyager } from "./117-moana-undeterred-voyager";

describe("Moana - Undeterred Voyager", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [moanaUndeterredVoyager],
    });

    const cardUnderTest = testEngine.getCardModel(moanaUndeterredVoyager);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
