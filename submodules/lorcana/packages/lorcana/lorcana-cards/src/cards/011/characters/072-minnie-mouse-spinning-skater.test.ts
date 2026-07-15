import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { minnieMouseSpinningSkater } from "./072-minnie-mouse-spinning-skater";

describe("Minnie Mouse - Spinning Skater", () => {
  it("can be played and quest on a later turn like a vanilla character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [minnieMouseSpinningSkater],
        inkwell: minnieMouseSpinningSkater.cost,
        deck: 5,
      },
      {
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().playCard(minnieMouseSpinningSkater)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(minnieMouseSpinningSkater)).toBe("play");
    expect(testEngine.isExerted(minnieMouseSpinningSkater)).toBe(false);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().quest(minnieMouseSpinningSkater)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(1);
  });
});
