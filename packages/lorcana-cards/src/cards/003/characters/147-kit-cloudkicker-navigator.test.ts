import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { kitCloudkickerNavigator } from "./147-kit-cloudkicker-navigator";

describe("Kit Cloudkicker - Navigator", () => {
  it("should have Shift ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [kitCloudkickerNavigator],
    });

    const cardUnderTest = testEngine.getCardModel(kitCloudkickerNavigator);
    expect(cardUnderTest.hasShift()).toBe(true);
  });

  it("should have Ward ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [kitCloudkickerNavigator],
    });

    const cardUnderTest = testEngine.getCardModel(kitCloudkickerNavigator);
    expect(cardUnderTest.hasWard()).toBe(true);
  });
});
