import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { penumbraMoonAlien } from "./084-penumbra-moon-alien";

describe("Penumbra - Moon Alien", () => {
  it("should have the printed vanilla stats and characteristics", () => {
    expect(penumbraMoonAlien.cost).toBe(5);
    expect(penumbraMoonAlien.strength).toBe(7);
    expect(penumbraMoonAlien.willpower).toBe(6);
    expect(penumbraMoonAlien.lore).toBe(2);
    expect(penumbraMoonAlien.inkable).toBe(false);
    expect(penumbraMoonAlien.vanilla).toBe(true);
    expect(penumbraMoonAlien.classifications).toEqual(["Storyborn", "Alien"]);
  });

  it("should be playable as a vanilla character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [penumbraMoonAlien],
      inkwell: penumbraMoonAlien.cost,
    });

    expect(testEngine.asPlayerOne().playCard(penumbraMoonAlien)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(penumbraMoonAlien)).toBe("play");
  });

  it("should be able to quest for lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [penumbraMoonAlien],
      inkwell: penumbraMoonAlien.cost,
      deck: 5,
    });

    expect(testEngine.asPlayerOne().playCard(penumbraMoonAlien)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().quest(penumbraMoonAlien)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(2);
  });
});
