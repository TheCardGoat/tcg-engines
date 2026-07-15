import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  PLAYER_ONE,
} from "@tcg/lorcana-engine/testing";
import { toulouseArtisticKitten } from "./165-toulouse-artistic-kitten";

describe("Toulouse - Artistic Kitten (set 007)", () => {
  it("is a vanilla character with the expected printed metadata", () => {
    const testEngine = new LorcanaTestEngine({
      play: [toulouseArtisticKitten],
    });

    expect(toulouseArtisticKitten).toMatchObject({
      id: "5do",
      canonicalId: "ci_5do",
      reprints: ["set7-165"],
      cardType: "character",
      name: "Toulouse",
      version: "Artistic Kitten",
      set: "007",
      cardNumber: 165,
      rarity: "common",
      cost: 1,
      strength: 1,
      willpower: 3,
      lore: 1,
      inkable: true,
      vanilla: true,
      classifications: ["Storyborn", "Ally"],
      inkType: ["sapphire"],
    });

    expect(toulouseArtisticKitten.missingImplementation).toBeUndefined();
    expect(toulouseArtisticKitten.missingTests).toBeUndefined();
    expect(toulouseArtisticKitten.abilities ?? []).toHaveLength(0);
    expect(testEngine.getCardModel(toulouseArtisticKitten).hasAbility).toBe(false);
  });

  it("can quest for 1 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [toulouseArtisticKitten],
      deck: 5,
    });

    const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);
    expect(testEngine.asPlayerOne().quest(toulouseArtisticKitten)).toBeSuccessfulCommand();
    const loreAfter = testEngine.asPlayerOne().getLore(PLAYER_ONE);

    expect(loreAfter).toBe(loreBefore + 1);
  });

  it("can be played from hand and used as ink", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [toulouseArtisticKitten],
    });

    expect(testEngine.asPlayerOne().ink(toulouseArtisticKitten)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCard(toulouseArtisticKitten)).toMatchObject({
      zone: "inkwell",
    });
  });
});
