import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { theNokkWaterSpirit } from "./160-the-nokk-water-spirit";

describe("The Nokk - Water Spirit", () => {
  it.skip("should have Ward ability", () => {
    const testEngine = new TestEngine({
      play: [theNokkWaterSpirit],
    });

    const cardUnderTest = testEngine.getCardModel(theNokkWaterSpirit);
    expect(cardUnderTest.hasWard()).toBe(true);
  });
});
