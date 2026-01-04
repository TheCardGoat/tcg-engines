import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { goofydaredevil } from "./111-goofy-daredevil";

describe("Goofy - Daredevil", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [goofydaredevil],
    });

    const cardUnderTest = testEngine.getCardModel(goofydaredevil);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
