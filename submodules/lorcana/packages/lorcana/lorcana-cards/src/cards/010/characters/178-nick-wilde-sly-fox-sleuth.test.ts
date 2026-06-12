import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { nickWildeSlyFoxSleuth } from "./178-nick-wilde-sly-fox-sleuth";

describe("Nick Wilde - Sly Fox Sleuth", () => {
  it("should have the printed vanilla stats and characteristics", () => {
    expect(nickWildeSlyFoxSleuth.cost).toBe(1);
    expect(nickWildeSlyFoxSleuth.strength).toBe(2);
    expect(nickWildeSlyFoxSleuth.willpower).toBe(2);
    expect(nickWildeSlyFoxSleuth.lore).toBe(1);
    expect(nickWildeSlyFoxSleuth.inkable).toBe(true);
    expect(nickWildeSlyFoxSleuth.vanilla).toBe(true);
    expect(nickWildeSlyFoxSleuth.classifications).toEqual(["Dreamborn", "Ally", "Detective"]);
  });

  it("should be playable as a vanilla character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [nickWildeSlyFoxSleuth],
      inkwell: nickWildeSlyFoxSleuth.cost,
    });

    expect(testEngine.asPlayerOne().playCard(nickWildeSlyFoxSleuth)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(nickWildeSlyFoxSleuth)).toBe("play");
  });

  it("should be able to quest for lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [nickWildeSlyFoxSleuth],
      inkwell: nickWildeSlyFoxSleuth.cost,
      deck: 5,
    });

    expect(testEngine.asPlayerOne().playCard(nickWildeSlyFoxSleuth)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().quest(nickWildeSlyFoxSleuth)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(1);
  });
});
