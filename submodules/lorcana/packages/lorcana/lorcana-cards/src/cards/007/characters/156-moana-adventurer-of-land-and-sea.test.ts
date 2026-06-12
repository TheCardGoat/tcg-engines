import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  PLAYER_ONE,
} from "@tcg/lorcana-engine/testing";
import { moanaAdventurerOfLandAndSea } from "./156-moana-adventurer-of-land-and-sea";

describe("Moana - Adventurer of Land and Sea (set 007)", () => {
  it("is a vanilla character with the expected printed metadata", () => {
    const testEngine = new LorcanaTestEngine({
      play: [moanaAdventurerOfLandAndSea],
    });

    expect(moanaAdventurerOfLandAndSea).toMatchObject({
      id: "xp6",
      canonicalId: "ci_ncl",
      reprints: ["set7-156"],
      cardType: "character",
      name: "Moana",
      version: "Adventurer of Land and Sea",
      set: "007",
      cardNumber: 156,
      rarity: "common",
      cost: 3,
      strength: 1,
      willpower: 6,
      lore: 1,
      inkable: true,
      vanilla: true,
      classifications: ["Storyborn", "Hero", "Princess"],
      inkType: ["sapphire"],
    });

    expect(moanaAdventurerOfLandAndSea.missingImplementation).toBeUndefined();
    expect(moanaAdventurerOfLandAndSea.missingTests).toBeUndefined();
    expect(moanaAdventurerOfLandAndSea.abilities ?? []).toHaveLength(0);
    expect(testEngine.getCardModel(moanaAdventurerOfLandAndSea).hasAbility).toBe(false);
  });

  it("can quest for 1 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [moanaAdventurerOfLandAndSea],
      deck: 5,
    });

    const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);
    expect(testEngine.asPlayerOne().quest(moanaAdventurerOfLandAndSea)).toBeSuccessfulCommand();
    const loreAfter = testEngine.asPlayerOne().getLore(PLAYER_ONE);

    expect(loreAfter).toBe(loreBefore + 1);
  });

  it("can be played from hand and used as ink", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [moanaAdventurerOfLandAndSea],
    });

    expect(testEngine.asPlayerOne().ink(moanaAdventurerOfLandAndSea)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCard(moanaAdventurerOfLandAndSea)).toMatchObject({
      zone: "inkwell",
    });
  });
});
