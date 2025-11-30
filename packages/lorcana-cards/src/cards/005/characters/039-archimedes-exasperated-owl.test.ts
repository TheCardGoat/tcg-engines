import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { archimedesExasperatedOwl } from "./039-archimedes-exasperated-owl";

describe("Archimedes - Exasperated Owl", () => {
  it.skip("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [archimedesExasperatedOwl],
    });

    const cardUnderTest = testEngine.getCardModel(archimedesExasperatedOwl);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
