import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { balooLaidbackBear } from "./069-baloo-laid-back-bear";

describe("Baloo - Laid-Back Bear", () => {
  it("should be a vanilla character with correct stats", () => {
    expect(balooLaidbackBear).toMatchObject({
      cardType: "character",
      name: "Baloo",
      version: "Laid-Back Bear",
      cost: 2,
      strength: 2,
      willpower: 4,
      lore: 1,
      inkable: true,
      vanilla: true,
      classifications: ["Storyborn", "Ally"],
      inkType: ["emerald"],
    });
  });

  it("should be playable from hand and quest for lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [balooLaidbackBear],
      inkwell: balooLaidbackBear.cost,
    });

    expect(testEngine.asPlayerOne().playCard(balooLaidbackBear)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCard(balooLaidbackBear)).toMatchObject({
      zone: "play",
    });

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().quest(balooLaidbackBear)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(1);
  });

  it("should be usable as ink", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [balooLaidbackBear],
    });

    expect(testEngine.asPlayerOne().ink(balooLaidbackBear)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCard(balooLaidbackBear)).toMatchObject({
      zone: "inkwell",
    });
  });
});
