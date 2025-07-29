/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { gatheringKnowledgeAndWisdom } from "~/game-engine/engines/lorcana/src/cards/definitions/005/actions";

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
