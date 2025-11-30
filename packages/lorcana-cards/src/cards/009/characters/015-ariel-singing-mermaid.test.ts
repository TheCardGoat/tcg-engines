import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { arielSingingMermaid } from "./015-ariel-singing-mermaid";

describe("Ariel - Singing Mermaid", () => {
  it.skip("should have Singer 7 ability", () => {
    const testEngine = new TestEngine({
      play: [arielSingingMermaid],
    });

    const cardUnderTest = testEngine.getCardModel(arielSingingMermaid);
    expect(cardUnderTest.hasSinger()).toBe(true);
  });
});
