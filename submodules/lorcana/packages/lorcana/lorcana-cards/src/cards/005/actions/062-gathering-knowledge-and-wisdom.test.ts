import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { gatheringKnowledgeAndWisdom } from "./062-gathering-knowledge-and-wisdom";

describe("Gathering Knowledge and Wisdom", () => {
  it("Gain 2 lore.", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [gatheringKnowledgeAndWisdom],
      inkwell: gatheringKnowledgeAndWisdom.cost,
    });

    const playResult = testEngine.asPlayerOne().playCard(gatheringKnowledgeAndWisdom);

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toEqual(2);
  });
});
