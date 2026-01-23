import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { heathcliffStoicButler } from "./078-heathcliff-stoic-butler";

describe("Heathcliff - Stoic Butler", () => {
  it("should have Ward ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [heathcliffStoicButler],
    });

    const cardUnderTest = testEngine.getCardModel(heathcliffStoicButler);
    expect(cardUnderTest.hasWard()).toBe(true);
  });
});
