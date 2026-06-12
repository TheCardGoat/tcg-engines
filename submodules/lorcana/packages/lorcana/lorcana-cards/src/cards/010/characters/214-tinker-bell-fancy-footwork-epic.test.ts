import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { tinkerBellFancyFootworkEpic } from "./214-tinker-bell-fancy-footwork-epic";

describe("Tinker Bell - Fancy Footwork (Epic)", () => {
  it("should be a vanilla character with correct stats", () => {
    expect(tinkerBellFancyFootworkEpic).toMatchObject({
      cardType: "character",
      name: "Tinker Bell",
      version: "Fancy Footwork",
      cost: 1,
      strength: 3,
      willpower: 1,
      lore: 1,
      inkable: true,
      vanilla: true,
      specialRarity: "epic",
      classifications: ["Storyborn", "Ally", "Fairy"],
      inkType: ["ruby"],
    });
  });

  it("should be playable from hand and quest for lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [tinkerBellFancyFootworkEpic],
      inkwell: tinkerBellFancyFootworkEpic.cost,
    });

    expect(testEngine.asPlayerOne().playCard(tinkerBellFancyFootworkEpic)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCard(tinkerBellFancyFootworkEpic)).toMatchObject({
      zone: "play",
    });

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().quest(tinkerBellFancyFootworkEpic)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(1);
  });

  it("should be usable as ink", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [tinkerBellFancyFootworkEpic],
    });

    expect(testEngine.asPlayerOne().ink(tinkerBellFancyFootworkEpic)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCard(tinkerBellFancyFootworkEpic)).toMatchObject({
      zone: "inkwell",
    });
  });
});
