import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { tongSurvivor } from "./126-tong-survivor";

describe("Tong - Survivor", () => {
  it("should have Reckless ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [tongSurvivor],
    });

    const cardUnderTest = testEngine.getCardModel(tongSurvivor);
    expect(cardUnderTest.hasReckless()).toBe(true);
  });
});
