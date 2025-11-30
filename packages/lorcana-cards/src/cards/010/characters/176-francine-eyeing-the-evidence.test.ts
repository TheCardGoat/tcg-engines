import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { francineEyeingTheEvidence } from "./176-francine-eyeing-the-evidence";

describe("Francine - Eyeing the Evidence", () => {
  it.skip("should have Resist 1 ability", () => {
    const testEngine = new TestEngine({
      play: [francineEyeingTheEvidence],
    });

    const cardUnderTest = testEngine.getCardModel(francineEyeingTheEvidence);
    expect(cardUnderTest.hasResist).toBe(true);
  });
});
