import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  PLAYER_ONE,
} from "@tcg/lorcana-engine/testing";
import { sirKayUnrulyKnight } from "./144-sir-kay-unruly-knight";

describe("Sir Kay - Unruly Knight (set 007)", () => {
  it("is a vanilla character with the expected printed metadata", () => {
    const testEngine = new LorcanaTestEngine({
      play: [sirKayUnrulyKnight],
    });

    expect(sirKayUnrulyKnight).toMatchObject({
      id: "1bB",
      canonicalId: "ci_1bB",
      reprints: ["set7-144"],
      cardType: "character",
      name: "Sir Kay",
      version: "Unruly Knight",
      set: "007",
      cardNumber: 144,
      rarity: "uncommon",
      cost: 2,
      strength: 2,
      willpower: 2,
      lore: 2,
      inkable: true,
      vanilla: true,
      classifications: ["Storyborn", "Knight"],
      inkType: ["ruby"],
    });

    expect(sirKayUnrulyKnight.missingImplementation).toBeUndefined();
    expect(sirKayUnrulyKnight.missingTests).toBeUndefined();
    expect(sirKayUnrulyKnight.abilities ?? []).toHaveLength(0);
    expect(testEngine.getCardModel(sirKayUnrulyKnight).hasAbility).toBe(false);
  });

  it("can quest for 2 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [sirKayUnrulyKnight],
      deck: 5,
    });

    const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);
    expect(testEngine.asPlayerOne().quest(sirKayUnrulyKnight)).toBeSuccessfulCommand();
    const loreAfter = testEngine.asPlayerOne().getLore(PLAYER_ONE);

    expect(loreAfter).toBe(loreBefore + 2);
  });

  it("can be played from hand and used as ink", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [sirKayUnrulyKnight],
    });

    expect(testEngine.asPlayerOne().ink(sirKayUnrulyKnight)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCard(sirKayUnrulyKnight)).toMatchObject({
      zone: "inkwell",
    });
  });
});
