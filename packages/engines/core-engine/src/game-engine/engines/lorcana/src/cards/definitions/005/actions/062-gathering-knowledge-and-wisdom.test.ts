import { describe, expect, it } from "bun:test";
import { gatheringKnowledgeAndWisdom } from "~/game-engine/engines/lorcana/src/cards/definitions/005/actions";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Gathering Knowledge And Wisdom", () => {
  it("Gain 2 lore.", async () => {
    const testEngine = new TestEngine({
      inkwell: gatheringKnowledgeAndWisdom.cost,
      hand: [gatheringKnowledgeAndWisdom],
    });

    await testEngine.playCard(gatheringKnowledgeAndWisdom);

    expect(testEngine.getPlayerLore()).toBe(2);
  });
});
