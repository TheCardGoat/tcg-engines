import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { GoofyDaredevil } from "./111-goofy-daredevil";

describe("Goofy - Daredevil", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [GoofyDaredevil],
    });

    const cardUnderTest = testEngine.getCardModel(GoofyDaredevil);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
