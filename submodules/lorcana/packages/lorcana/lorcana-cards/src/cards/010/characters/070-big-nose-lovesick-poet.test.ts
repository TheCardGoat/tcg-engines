import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { bigNoseLovesickPoet } from "./070-big-nose-lovesick-poet";

describe("Big Nose - Lovesick Poet", () => {
  it("should be playable as a vanilla character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [bigNoseLovesickPoet],
      inkwell: bigNoseLovesickPoet.cost,
    });

    expect(testEngine.asPlayerOne().playCard(bigNoseLovesickPoet)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(bigNoseLovesickPoet)).toBe("play");
  });

  it("should be able to quest for lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [bigNoseLovesickPoet],
      inkwell: bigNoseLovesickPoet.cost,
      deck: 5,
    });

    expect(testEngine.asPlayerOne().playCard(bigNoseLovesickPoet)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().quest(bigNoseLovesickPoet)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(1);
  });
});
