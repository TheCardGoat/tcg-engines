import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { blackHeronRealBadEgg } from "./182-black-heron-real-bad-egg";

describe("Black Heron - Real Bad Egg", () => {
  it("should have the printed vanilla stats and characteristics", () => {
    expect(blackHeronRealBadEgg.cost).toBe(2);
    expect(blackHeronRealBadEgg.strength).toBe(3);
    expect(blackHeronRealBadEgg.willpower).toBe(3);
    expect(blackHeronRealBadEgg.lore).toBe(1);
    expect(blackHeronRealBadEgg.inkable).toBe(true);
    expect(blackHeronRealBadEgg.vanilla).toBe(true);
    expect(blackHeronRealBadEgg.classifications).toEqual(["Storyborn", "Villain"]);
  });

  it("should be playable as a vanilla character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [blackHeronRealBadEgg],
      inkwell: blackHeronRealBadEgg.cost,
    });

    expect(testEngine.asPlayerOne().playCard(blackHeronRealBadEgg)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(blackHeronRealBadEgg)).toBe("play");
  });

  it("should be able to quest for lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [blackHeronRealBadEgg],
      inkwell: blackHeronRealBadEgg.cost,
      deck: 5,
    });

    expect(testEngine.asPlayerOne().playCard(blackHeronRealBadEgg)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().quest(blackHeronRealBadEgg)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(1);
  });
});
