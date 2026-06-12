import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  PLAYER_ONE,
} from "@tcg/lorcana-engine/testing";
import { painImmortalSidekick } from "./081-pain-immortal-sidekick";

describe("Pain - Immortal Sidekick (set 004)", () => {
  it("is a vanilla character with the expected printed metadata", () => {
    const testEngine = new LorcanaTestEngine({
      play: [painImmortalSidekick],
    });

    expect(painImmortalSidekick).toMatchObject({
      id: "eqA",
      canonicalId: "ci_eqA",
      reprints: ["set4-081"],
      cardType: "character",
      name: "Pain",
      version: "Immortal Sidekick",
      set: "004",
      cardNumber: 81,
      rarity: "uncommon",
      cost: 3,
      strength: 2,
      willpower: 4,
      lore: 2,
      inkable: true,
      vanilla: true,
      classifications: ["Storyborn", "Ally"],
      inkType: ["emerald"],
    });

    expect(painImmortalSidekick.missingImplementation).toBeUndefined();
    expect(painImmortalSidekick.missingTests).toBeUndefined();
    expect(painImmortalSidekick.abilities ?? []).toHaveLength(0);
    expect(testEngine.getCardModel(painImmortalSidekick).hasAbility).toBe(false);
  });

  it("can quest for 2 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [painImmortalSidekick],
      deck: 5,
    });

    const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);
    expect(testEngine.asPlayerOne().quest(painImmortalSidekick)).toBeSuccessfulCommand();
    const loreAfter = testEngine.asPlayerOne().getLore(PLAYER_ONE);

    expect(loreAfter).toBe(loreBefore + 2);
  });

  it("can be played from hand and used as ink", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [painImmortalSidekick],
    });

    expect(testEngine.asPlayerOne().ink(painImmortalSidekick)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCard(painImmortalSidekick)).toMatchObject({
      zone: "inkwell",
    });
  });
});
