import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { pongoOlRascal } from "./120-pongo-ol-rascal";

describe("Pongo - Ol’ Rascal", () => {
  it("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [pongoOlRascal],
    });
    const cardUnderTest = testEngine.getCardModel(pongoOlRascal);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
