import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { theNokkWaterSpirit } from "./160-the-nokk-water-spirit";

describe("The Nokk - Water Spirit", () => {
  it("should have Ward ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [theNokkWaterSpirit],
    });

    const cardUnderTest = testEngine.getCardModel(theNokkWaterSpirit);
    expect(cardUnderTest.hasWard()).toBe(true);
  });
});
