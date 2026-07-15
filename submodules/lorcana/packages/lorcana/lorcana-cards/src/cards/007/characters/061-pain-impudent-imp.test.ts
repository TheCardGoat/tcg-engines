import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  PLAYER_ONE,
} from "@tcg/lorcana-engine/testing";
import { painImpudentImp } from "./061-pain-impudent-imp";

describe("Pain - Impudent Imp (set 007)", () => {
  it("is a vanilla character with the expected printed metadata", () => {
    const testEngine = new LorcanaTestEngine({
      play: [painImpudentImp],
    });

    expect(painImpudentImp).toMatchObject({
      id: "V8w",
      canonicalId: "ci_V8w",
      reprints: ["set7-061"],
      cardType: "character",
      name: "Pain",
      version: "Impudent Imp",
      set: "007",
      cardNumber: 61,
      rarity: "common",
      cost: 1,
      strength: 1,
      willpower: 3,
      lore: 1,
      inkable: true,
      vanilla: true,
      classifications: ["Storyborn", "Ally"],
      inkType: ["amethyst"],
    });

    expect(painImpudentImp.missingImplementation).toBeUndefined();
    expect(painImpudentImp.missingTests).toBeUndefined();
    expect(painImpudentImp.abilities ?? []).toHaveLength(0);
    expect(testEngine.getCardModel(painImpudentImp).hasAbility).toBe(false);
  });

  it("can quest for 1 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [painImpudentImp],
      deck: 5,
    });

    const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);
    expect(testEngine.asPlayerOne().quest(painImpudentImp)).toBeSuccessfulCommand();
    const loreAfter = testEngine.asPlayerOne().getLore(PLAYER_ONE);

    expect(loreAfter).toBe(loreBefore + 1);
  });

  it("can be played from hand and used as ink", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [painImpudentImp],
    });

    expect(testEngine.asPlayerOne().ink(painImpudentImp)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCard(painImpudentImp)).toMatchObject({
      zone: "inkwell",
    });
  });
});
