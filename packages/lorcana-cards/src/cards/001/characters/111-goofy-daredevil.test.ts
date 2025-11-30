import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { goofyDaredevil } from "./111-goofy-daredevil";

describe("Goofy - Daredevil", () => {
  it.skip("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [goofyDaredevil],
    });

    const cardUnderTest = testEngine.getCardModel(goofyDaredevil);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
