import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { pongoolRascal } from "./120-pongo-ol-rascal";

describe("Pongo - Ol’ Rascal", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [pongoolRascal],
    });

    const cardUnderTest = testEngine.getCardModel(pongoolRascal);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
