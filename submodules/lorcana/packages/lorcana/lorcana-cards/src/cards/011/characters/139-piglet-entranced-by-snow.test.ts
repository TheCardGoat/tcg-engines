import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { pigletEntrancedBySnow } from "./139-piglet-entranced-by-snow";

describe("Piglet - Entranced by Snow", () => {
  it("should be a vanilla character with no abilities", () => {
    const testEngine = new LorcanaTestEngine({
      play: [pigletEntrancedBySnow],
    });

    const cardUnderTest = testEngine.getCardModel(pigletEntrancedBySnow);
    expect(cardUnderTest.hasAbility).toBe(false);
  });

  it("should be able to quest for 1 lore", () => {
    const testEngine = new LorcanaTestEngine({
      play: [pigletEntrancedBySnow],
    });

    const cardUnderTest = testEngine.getCardModel(pigletEntrancedBySnow);
    expect(cardUnderTest.lore).toBe(1);
    expect(cardUnderTest.canQuest()).toBe(true);
  });
});
