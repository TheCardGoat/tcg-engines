import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { arielSingingMermaid } from "./015-ariel-singing-mermaid";

describe("Ariel - Singing Mermaid", () => {
  it("should have Singer 7 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [arielSingingMermaid],
    });

    const cardUnderTest = testEngine.getCardModel(arielSingingMermaid);
    expect(cardUnderTest.hasSinger()).toBe(true);
  });
});
