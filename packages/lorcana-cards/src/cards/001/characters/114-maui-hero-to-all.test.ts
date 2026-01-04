import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { mauiheroToAll } from "./114-maui-hero-to-all";

describe("Maui - Hero to All", () => {
  it("should have Rush ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [mauiheroToAll],
    });

    const cardUnderTest = testEngine.getCardModel(mauiheroToAll);
    expect(cardUnderTest.hasRush).toBe(true);
  });

  it("should have Reckless ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [mauiheroToAll],
    });

    const cardUnderTest = testEngine.getCardModel(mauiheroToAll);
    expect(cardUnderTest.hasReckless()).toBe(true);
  });
});
