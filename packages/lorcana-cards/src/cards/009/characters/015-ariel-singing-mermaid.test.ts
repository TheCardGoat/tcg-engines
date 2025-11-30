import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { arielSingingMermaid } from "./015-ariel-singing-mermaid";

describe("Ariel - Singing Mermaid", () => {
  it("should have Singer 7 ability", () => {
    const testEngine = new TestEngine({
      play: [arielSingingMermaid],
    });
    const cardUnderTest = testEngine.getCardModel(arielSingingMermaid);
    expect(cardUnderTest.hasSinger).toBe(true);
  });
});
