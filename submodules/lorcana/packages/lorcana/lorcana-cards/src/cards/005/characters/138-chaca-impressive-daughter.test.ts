import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { chacaImpressiveDaughter } from "./138-chaca-impressive-daughter";

describe("Chaca - Impressive Daughter", () => {
  it("can be played from hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [chacaImpressiveDaughter],
      inkwell: chacaImpressiveDaughter.cost,
    });

    expect(testEngine.asPlayerOne().playCard(chacaImpressiveDaughter)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(chacaImpressiveDaughter)).toBe("play");
  });

  it("quests for 2 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: chacaImpressiveDaughter, isDrying: false }],
    });

    const loreBefore = testEngine.getLore(PLAYER_ONE);
    expect(testEngine.asPlayerOne().quest(chacaImpressiveDaughter)).toBeSuccessfulCommand();
    expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + chacaImpressiveDaughter.lore);
  });
});
