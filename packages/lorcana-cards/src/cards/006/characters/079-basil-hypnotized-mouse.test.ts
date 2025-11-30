import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { basilHypnotizedMouse } from "./079-basil-hypnotized-mouse";

describe("Basil - Hypnotized Mouse", () => {
  it.skip("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [basilHypnotizedMouse],
    });

    const cardUnderTest = testEngine.getCardModel(basilHypnotizedMouse);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
