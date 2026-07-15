import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { mauiHeroToAll } from "./114-maui-hero-to-all";

describe("Maui - Hero to All", () => {
  it("should have Rush ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [mauiHeroToAll],
    });

    const cardUnderTest = testEngine.getCardModel(mauiHeroToAll);
    expect(cardUnderTest.hasRush).toBe(true);
  });

  it("should have Reckless ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [mauiHeroToAll],
    });

    const cardUnderTest = testEngine.getCardModel(mauiHeroToAll);
    expect(cardUnderTest.hasReckless()).toBe(true);
  });
});
