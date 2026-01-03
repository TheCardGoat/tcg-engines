import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { PongoOlRascal } from "./120-pongo-ol-rascal";

describe("Pongo - Ol’ Rascal", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [PongoOlRascal],
    });

    const cardUnderTest = testEngine.getCardModel(PongoOlRascal);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
