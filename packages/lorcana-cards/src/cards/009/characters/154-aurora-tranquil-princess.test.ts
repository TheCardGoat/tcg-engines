import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { auroraTranquilPrincess } from "./154-aurora-tranquil-princess";

describe("Aurora - Tranquil Princess", () => {
  it("should have Ward ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [auroraTranquilPrincess],
    });

    const cardUnderTest = testEngine.getCardModel(auroraTranquilPrincess);
    expect(cardUnderTest.hasWard()).toBe(true);
  });
});
