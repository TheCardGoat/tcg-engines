import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { pongoOlRascal } from "./120-pongo-ol-rascal";

describe("Pongo - Ol’ Rascal", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [pongoOlRascal],
    });

    const cardUnderTest = testEngine.getCardModel(pongoOlRascal);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
