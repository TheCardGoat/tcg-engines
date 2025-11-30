import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { kaaSuspiciousSerpent } from "./072-kaa-suspicious-serpent";

describe("Kaa - Suspicious Serpent", () => {
  it("should have Ward ability", () => {
    const testEngine = new LorcanaTestEngine(
      {},
      {},
      {
        play: [kaaSuspiciousSerpent],
      },
    );

    const cardUnderTest = testEngine.getCardModel(kaaSuspiciousSerpent);
    expect(cardUnderTest.hasWard()).toBe(true);
  });
});
