import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { moanaDeterminedExplorer } from "./018-moana-determined-explorer";

describe("Moana - Determined Explorer", () => {
  it("should be a vanilla card with correct stats", () => {
    const testEngine = new LorcanaTestEngine({
      play: [moanaDeterminedExplorer],
    });

    const cardUnderTest = testEngine.getCardModel(moanaDeterminedExplorer);
    expect(cardUnderTest.strength).toBe(3);
    expect(cardUnderTest.willpower).toBe(4);
    expect(cardUnderTest.lore).toBe(2);
    expect(cardUnderTest.cost).toBe(3);
  });

  it("should have no abilities", () => {
    expect(moanaDeterminedExplorer.abilities).toBeUndefined();
  });
});
