import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { pongoOlRascal } from "./120-pongo-ol-rascal";

describe("Pongo - Ol’ Rascal", () => {
  it.skip("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [pongoOlRascal],
    });

    const cardUnderTest = testEngine.getCardModel(pongoOlRascal);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
