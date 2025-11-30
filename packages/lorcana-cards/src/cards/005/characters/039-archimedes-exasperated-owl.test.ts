import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { archimedesExasperatedOwl } from "./039-archimedes-exasperated-owl";

describe("Archimedes - Exasperated Owl", () => {
  it("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [archimedesExasperatedOwl],
    });
    const cardUnderTest = testEngine.getCardModel(archimedesExasperatedOwl);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
