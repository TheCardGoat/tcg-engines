import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { tinkerBellFastFlier } from "./043-tinker-bell-fast-flier";

describe("Tinker Bell - Fast Flier", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [tinkerBellFastFlier],
    });

    const cardUnderTest = testEngine.getCardModel(tinkerBellFastFlier);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
