import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { francineEyeingTheEvidence } from "./176-francine-eyeing-the-evidence";

describe("Francine - Eyeing the Evidence", () => {
  it("should have Resist 1 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [francineEyeingTheEvidence],
    });

    const cardUnderTest = testEngine.getCardModel(francineEyeingTheEvidence);
    expect(cardUnderTest.hasResist).toBe(true);
  });
});
