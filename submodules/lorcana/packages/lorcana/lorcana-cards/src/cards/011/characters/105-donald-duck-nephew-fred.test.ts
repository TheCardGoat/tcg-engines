import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { donaldDuckNephewFred } from "./105-donald-duck-nephew-fred";

describe("Donald Duck - Nephew Fred", () => {
  it("should be a vanilla character with no abilities", () => {
    const testEngine = new LorcanaTestEngine({
      play: [donaldDuckNephewFred],
    });

    const cardUnderTest = testEngine.getCardModel(donaldDuckNephewFred);
    expect(cardUnderTest.hasAbility).toBe(false);
  });

  it("should be able to quest for 1 lore", () => {
    const testEngine = new LorcanaTestEngine({
      play: [donaldDuckNephewFred],
    });

    const cardUnderTest = testEngine.getCardModel(donaldDuckNephewFred);
    expect(cardUnderTest.lore).toBe(1);
    expect(cardUnderTest.canQuest()).toBe(true);
  });
});
