import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  PLAYER_ONE,
} from "@tcg/lorcana-engine/testing";
import { nessusRiverGuardian } from "./118-nessus-river-guardian";

describe("Nessus - River Guardian (set 004)", () => {
  it("is a vanilla character with the expected printed metadata", () => {
    const testEngine = new LorcanaTestEngine({
      play: [nessusRiverGuardian],
    });

    expect(nessusRiverGuardian).toMatchObject({
      id: "u1p",
      canonicalId: "ci_u1p",
      reprints: ["set4-118"],
      cardType: "character",
      name: "Nessus",
      version: "River Guardian",
      set: "004",
      cardNumber: 118,
      rarity: "uncommon",
      cost: 6,
      strength: 7,
      willpower: 5,
      lore: 2,
      inkable: true,
      vanilla: true,
      classifications: ["Storyborn", "Villain"],
      inkType: ["ruby"],
    });

    expect(nessusRiverGuardian.missingImplementation).toBeUndefined();
    expect(nessusRiverGuardian.missingTests).toBeUndefined();
    expect(nessusRiverGuardian.abilities ?? []).toHaveLength(0);
    expect(testEngine.getCardModel(nessusRiverGuardian).hasAbility).toBe(false);
  });

  it("can quest for 2 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [nessusRiverGuardian],
      deck: 5,
    });

    const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);
    expect(testEngine.asPlayerOne().quest(nessusRiverGuardian)).toBeSuccessfulCommand();
    const loreAfter = testEngine.asPlayerOne().getLore(PLAYER_ONE);

    expect(loreAfter).toBe(loreBefore + 2);
  });

  it("can be played from hand and used as ink", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [nessusRiverGuardian],
    });

    expect(testEngine.asPlayerOne().ink(nessusRiverGuardian)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCard(nessusRiverGuardian)).toMatchObject({
      zone: "inkwell",
    });
  });
});
