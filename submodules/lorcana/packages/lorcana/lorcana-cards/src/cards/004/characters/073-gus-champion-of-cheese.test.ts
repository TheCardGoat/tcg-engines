import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { gusChampionOfCheese } from "./073-gus-champion-of-cheese";

describe("Gus - Champion of Cheese", () => {
  it("should be a vanilla character with correct stats", () => {
    expect(gusChampionOfCheese).toMatchObject({
      cardType: "character",
      name: "Gus",
      version: "Champion of Cheese",
      cost: 2,
      strength: 2,
      willpower: 3,
      lore: 1,
      inkable: true,
      vanilla: true,
      classifications: ["Storyborn", "Ally"],
      inkType: ["emerald"],
    });
  });

  it("should be playable from hand and quest for lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [gusChampionOfCheese],
      inkwell: gusChampionOfCheese.cost,
    });

    expect(testEngine.asPlayerOne().playCard(gusChampionOfCheese)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCard(gusChampionOfCheese)).toMatchObject({
      zone: "play",
    });

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().quest(gusChampionOfCheese)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(1);
  });

  it("should be usable as ink", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [gusChampionOfCheese],
    });

    expect(testEngine.asPlayerOne().ink(gusChampionOfCheese)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCard(gusChampionOfCheese)).toMatchObject({
      zone: "inkwell",
    });
  });
});
