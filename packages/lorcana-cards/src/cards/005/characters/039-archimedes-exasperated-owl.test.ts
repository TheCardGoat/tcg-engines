import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { archimedesExasperatedOwl } from "./039-archimedes-exasperated-owl";

describe("Archimedes - Exasperated Owl", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [archimedesExasperatedOwl],
    });

    const cardUnderTest = testEngine.getCardModel(archimedesExasperatedOwl);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
