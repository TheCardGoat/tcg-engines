import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  PLAYER_ONE,
} from "@tcg/lorcana-engine/testing";
import { viranaFangChief } from "./082-virana-fang-chief";

describe("Virana - Fang Chief (set 009)", () => {
  it("is a vanilla character with the expected printed metadata", () => {
    const testEngine = new LorcanaTestEngine({
      play: [viranaFangChief],
    });

    expect(viranaFangChief).toMatchObject({
      id: "T9y",
      canonicalId: "ci_N3z",
      reprints: ["set2-095", "set9-082"],
      cardType: "character",
      name: "Virana",
      version: "Fang Chief",
      set: "009",
      cardNumber: 82,
      rarity: "common",
      cost: 5,
      strength: 5,
      willpower: 5,
      lore: 2,
      inkable: true,
      vanilla: true,
      classifications: ["Storyborn", "Villain", "Queen"],
    });

    expect(viranaFangChief.missingImplementation).toBeUndefined();
    expect(viranaFangChief.missingTests).toBeUndefined();
    expect(viranaFangChief.abilities ?? []).toHaveLength(0);
    expect(testEngine.getCardModel(viranaFangChief).hasAbility).toBe(false);
  });

  it("can quest for 2 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [viranaFangChief],
      deck: 5,
    });

    const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);
    expect(testEngine.asPlayerOne().quest(viranaFangChief)).toBeSuccessfulCommand();
    const loreAfter = testEngine.asPlayerOne().getLore(PLAYER_ONE);

    expect(loreAfter).toBe(loreBefore + 2);
  });
});
