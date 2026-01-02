import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { goofyDaredevil } from "./111-goofy-daredevil";

describe("Goofy - Daredevil", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [goofyDaredevil],
    });

    const cardUnderTest = testEngine.getCardModel(goofyDaredevil);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
