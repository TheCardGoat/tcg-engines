import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { headlessManhorseManny } from "./004-headless-manhorse-manny";

describe("Headless Manhorse - Manny", () => {
  it("can be played, quests for 1 lore, and can be put into the inkwell", () => {
    const playEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [headlessManhorseManny],
        inkwell: headlessManhorseManny.cost,
        deck: 5,
      },
      {
        deck: 5,
      },
    );

    expect(playEngine.asPlayerOne().playCard(headlessManhorseManny)).toBeSuccessfulCommand();
    expect(playEngine.asPlayerOne().getCardZone(headlessManhorseManny)).toBe("play");

    expect(playEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(playEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(playEngine.asPlayerOne().quest(headlessManhorseManny)).toBeSuccessfulCommand();
    expect(playEngine.asPlayerOne().getLore("player_one")).toBe(1);

    const inkEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [headlessManhorseManny],
        deck: 5,
      },
      {
        deck: 5,
      },
    );

    expect(inkEngine.asPlayerOne().ink(headlessManhorseManny)).toBeSuccessfulCommand();
    expect(inkEngine.asPlayerOne().getCardZone(headlessManhorseManny)).toBe("inkwell");
  });
});
