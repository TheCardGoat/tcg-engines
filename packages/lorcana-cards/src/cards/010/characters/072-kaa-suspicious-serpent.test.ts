import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { kaaSuspiciousSerpent } from "./072-kaa-suspicious-serpent";

describe("Kaa - Suspicious Serpent", () => {
  it.skip("should have Ward ability", () => {
    const testEngine = new TestEngine({
      play: [kaaSuspiciousSerpent],
    });

    const cardUnderTest = testEngine.getCardModel(kaaSuspiciousSerpent);
    expect(cardUnderTest.hasWard()).toBe(true);
  });
});
