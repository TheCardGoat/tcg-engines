import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { deweyShowyNephew } from "./139-dewey-showy-nephew";

describe("Dewey - Showy Nephew", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine(
      {},
      {},
      {
        play: [deweyShowyNephew],
      },
    );

    const cardUnderTest = testEngine.getCardModel(deweyShowyNephew);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
