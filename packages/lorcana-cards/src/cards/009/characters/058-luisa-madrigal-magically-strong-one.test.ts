import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { luisaMadrigalMagicallyStrongOne } from "./058-luisa-madrigal-magically-strong-one";

describe("Luisa Madrigal - Magically Strong One", () => {
  it("should have Rush ability", () => {
    const testEngine = new LorcanaTestEngine(
      {},
      {},
      {
        play: [luisaMadrigalMagicallyStrongOne],
      },
    );

    const cardUnderTest = testEngine.getCardModel(
      luisaMadrigalMagicallyStrongOne,
    );
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
