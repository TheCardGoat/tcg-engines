import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { theNokkWaterSpirit } from "./160-the-nokk-water-spirit";

describe("The Nokk - Water Spirit", () => {
  it("should have Ward ability", () => {
    const testEngine = new TestEngine({
      play: [theNokkWaterSpirit],
    });
    const cardUnderTest = testEngine.getCardModel(theNokkWaterSpirit);
    expect(cardUnderTest.hasWard).toBe(true);
  });
});
