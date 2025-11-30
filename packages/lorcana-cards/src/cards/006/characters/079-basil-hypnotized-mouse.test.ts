import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { basilHypnotizedMouse } from "./079-basil-hypnotized-mouse";

describe("Basil - Hypnotized Mouse", () => {
  it("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [basilHypnotizedMouse],
    });
    const cardUnderTest = testEngine.getCardModel(basilHypnotizedMouse);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
