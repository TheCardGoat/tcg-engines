import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { luisaMadrigalMagicallyStrongOne } from "./058-luisa-madrigal-magically-strong-one";

describe("Luisa Madrigal - Magically Strong One", () => {
  it("should have Rush ability", () => {
    const testEngine = new TestEngine({
      play: [luisaMadrigalMagicallyStrongOne],
    });
    const cardUnderTest = testEngine.getCardModel(
      luisaMadrigalMagicallyStrongOne,
    );
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
