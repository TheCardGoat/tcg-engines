import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { bagheeraCautiousExplorer } from "./012-bagheera-cautious-explorer";

describe("Bagheera - Cautious Explorer", () => {
  it("should be a vanilla character with correct stats", () => {
    expect(bagheeraCautiousExplorer).toMatchObject({
      cardType: "character",
      name: "Bagheera",
      version: "Cautious Explorer",
      cost: 3,
      strength: 4,
      willpower: 4,
      lore: 1,
      inkable: true,
      vanilla: true,
      classifications: ["Storyborn", "Ally"],
      inkType: ["amber"],
    });
  });

  it("should be playable from hand and quest for lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [bagheeraCautiousExplorer],
      inkwell: bagheeraCautiousExplorer.cost,
    });

    expect(testEngine.asPlayerOne().playCard(bagheeraCautiousExplorer)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCard(bagheeraCautiousExplorer)).toMatchObject({
      zone: "play",
    });

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().quest(bagheeraCautiousExplorer)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(1);
  });

  it("should be usable as ink", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [bagheeraCautiousExplorer],
    });

    expect(testEngine.asPlayerOne().ink(bagheeraCautiousExplorer)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCard(bagheeraCautiousExplorer)).toMatchObject({
      zone: "inkwell",
    });
  });
});
