import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { goofyDaredevil } from "./111-goofy-daredevil";

describe("Goofy - Daredevil", () => {
  it("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [goofyDaredevil],
    });
    const cardUnderTest = testEngine.getCardModel(goofyDaredevil);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
