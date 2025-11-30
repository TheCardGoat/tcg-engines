import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { basilPracticedDetective } from "./153-basil-practiced-detective";

describe("Basil - Practiced Detective", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine(
      {},
      {},
      {
        play: [basilPracticedDetective],
      },
    );

    const cardUnderTest = testEngine.getCardModel(basilPracticedDetective);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
