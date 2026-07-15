import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { creeperLoyalLackey } from "./050-creeper-loyal-lackey";

describe("Creeper - Loyal Lackey", () => {
  it("should have the printed vanilla stats and characteristics", () => {
    expect(creeperLoyalLackey.cost).toBe(6);
    expect(creeperLoyalLackey.strength).toBe(5);
    expect(creeperLoyalLackey.willpower).toBe(4);
    expect(creeperLoyalLackey.lore).toBe(4);
    expect(creeperLoyalLackey.inkable).toBe(true);
    expect(creeperLoyalLackey.vanilla).toBe(true);
    expect(creeperLoyalLackey.classifications).toEqual(["Storyborn", "Ally"]);
  });

  it("should be playable as a vanilla character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [creeperLoyalLackey],
      inkwell: creeperLoyalLackey.cost,
    });

    expect(testEngine.asPlayerOne().playCard(creeperLoyalLackey)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(creeperLoyalLackey)).toBe("play");
  });

  it("should be able to quest for lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [creeperLoyalLackey],
      inkwell: creeperLoyalLackey.cost,
      deck: 5,
    });

    expect(testEngine.asPlayerOne().playCard(creeperLoyalLackey)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().quest(creeperLoyalLackey)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(4);
  });

  it("should be able to be used as ink", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [creeperLoyalLackey],
    });

    expect(testEngine.asPlayerOne().getCardZone(creeperLoyalLackey)).toBe("hand");
    expect(creeperLoyalLackey.inkable).toBe(true);

    const initialInkwellSize = testEngine.asPlayerOne().getBoard().players.player_one
      .inkwell.length;

    expect(testEngine.asPlayerOne().ink(creeperLoyalLackey)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(creeperLoyalLackey)).toBe("inkwell");
    expect(testEngine.asPlayerOne().getBoard().players.player_one.inkwell.length).toBe(
      initialInkwellSize + 1,
    );
  });
});
