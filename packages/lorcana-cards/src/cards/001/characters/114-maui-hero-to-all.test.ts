import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { MauiHeroToAll } from "./114-maui-hero-to-all";

describe("Maui - Hero to All", () => {
  it("should have Rush ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [MauiHeroToAll],
    });

    const cardUnderTest = testEngine.getCardModel(MauiHeroToAll);
    expect(cardUnderTest.hasRush).toBe(true);
  });

  it("should have Reckless ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [MauiHeroToAll],
    });

    const cardUnderTest = testEngine.getCardModel(MauiHeroToAll);
    expect(cardUnderTest.hasReckless()).toBe(true);
  });
});
