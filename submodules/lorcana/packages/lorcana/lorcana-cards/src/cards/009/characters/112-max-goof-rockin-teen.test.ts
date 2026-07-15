import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { maxGoofRockinTeen } from "./112-max-goof-rockin-teen";

describe("Max Goof - Rockin' Teen", () => {
  it("should have Singer 5", () => {
    const testEngine = new LorcanaTestEngine({
      play: [maxGoofRockinTeen],
    });

    const cardUnderTest = testEngine.getCardModel(maxGoofRockinTeen);
    expect(cardUnderTest.hasSinger()).toBe(true);
  });

  it("I JUST WANNA STAY HOME - this character can't move to locations", () => {
    const testEngine = new LorcanaTestEngine({
      play: [maxGoofRockinTeen],
    });

    const cardUnderTest = testEngine.getCardModel(maxGoofRockinTeen);
    expect(cardUnderTest.canMoveToLocation).toBe(false);
  });
});
