import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { hadesMeticulousPlotter } from "./145-hades-meticulous-plotter";

describe("Hades - Meticulous Plotter", () => {
  it("is a vanilla character with the printed stats and no abilities", () => {
    expect(hadesMeticulousPlotter.vanilla).toBe(true);
    expect(hadesMeticulousPlotter.abilities).toBeUndefined();
    expect(hadesMeticulousPlotter.classifications).toEqual(["Storyborn", "Villain", "Deity"]);
    expect(hadesMeticulousPlotter.cost).toBe(4);
    expect(hadesMeticulousPlotter.strength).toBe(3);
    expect(hadesMeticulousPlotter.willpower).toBe(6);
    expect(hadesMeticulousPlotter.lore).toBe(1);
    expect(hadesMeticulousPlotter.inkable).toBe(true);
  });

  it("can be played and quests for its printed lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [hadesMeticulousPlotter],
      inkwell: hadesMeticulousPlotter.cost,
    });

    expect(testEngine.asPlayerOne().playCard(hadesMeticulousPlotter)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(hadesMeticulousPlotter)).toBe("play");

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().quest(hadesMeticulousPlotter)).toBeSuccessfulCommand();
    expect(testEngine.getLore("player_one")).toBe(hadesMeticulousPlotter.lore);
  });
});
