import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { basilHypnotizedMouse } from "./079-basil-hypnotized-mouse";

describe("Basil - Hypnotized Mouse", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [basilHypnotizedMouse],
    });

    const cardUnderTest = testEngine.getCardModel(basilHypnotizedMouse);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
