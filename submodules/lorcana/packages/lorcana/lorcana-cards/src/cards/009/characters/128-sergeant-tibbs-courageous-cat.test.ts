import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  PLAYER_ONE,
} from "@tcg/lorcana-engine/testing";
import { sergeantTibbsCourageousCat } from "./128-sergeant-tibbs-courageous-cat";

describe("Sergeant Tibbs - Courageous Cat (set 009)", () => {
  it("is a vanilla character with the expected printed metadata", () => {
    const testEngine = new LorcanaTestEngine({
      play: [sergeantTibbsCourageousCat],
    });

    expect(sergeantTibbsCourageousCat).toMatchObject({
      id: "YfM",
      canonicalId: "ci_VLR",
      reprints: ["set1-124", "set9-128"],
      cardType: "character",
      name: "Sergeant Tibbs",
      version: "Courageous Cat",
      set: "009",
      cardNumber: 128,
      rarity: "common",
      cost: 1,
      strength: 2,
      willpower: 2,
      lore: 1,
      inkable: true,
      vanilla: true,
      classifications: ["Storyborn", "Ally"],
    });

    expect(sergeantTibbsCourageousCat.missingImplementation).toBeUndefined();
    expect(sergeantTibbsCourageousCat.missingTests).toBeUndefined();
    expect(sergeantTibbsCourageousCat.abilities ?? []).toHaveLength(0);
    expect(testEngine.getCardModel(sergeantTibbsCourageousCat).hasAbility).toBe(false);
  });

  it("can quest for 1 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [sergeantTibbsCourageousCat],
      deck: 5,
    });

    const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);
    expect(testEngine.asPlayerOne().quest(sergeantTibbsCourageousCat)).toBeSuccessfulCommand();
    const loreAfter = testEngine.asPlayerOne().getLore(PLAYER_ONE);

    expect(loreAfter).toBe(loreBefore + 1);
  });
});
