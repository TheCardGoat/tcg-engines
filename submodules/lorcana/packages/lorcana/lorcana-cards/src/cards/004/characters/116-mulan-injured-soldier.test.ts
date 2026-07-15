import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mulanInjuredSoldier } from "./116-mulan-injured-soldier";

describe("Mulan - Injured Soldier", () => {
  it("BATTLE WOUND - This character enters play with 2 damage", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [mulanInjuredSoldier],
      inkwell: mulanInjuredSoldier.cost,
    });

    expect(testEngine.asPlayerOne().playCard(mulanInjuredSoldier)).toBeSuccessfulCommand();

    const mulan = testEngine.asPlayerOne().getCard(mulanInjuredSoldier);
    expect(mulan.damage).toBe(2);
  });

  it("BATTLE WOUND - Mulan survives because willpower (3) > damage (2)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [mulanInjuredSoldier],
      inkwell: mulanInjuredSoldier.cost,
    });

    expect(testEngine.asPlayerOne().playCard(mulanInjuredSoldier)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(mulanInjuredSoldier)).toBe("play");
  });
});
