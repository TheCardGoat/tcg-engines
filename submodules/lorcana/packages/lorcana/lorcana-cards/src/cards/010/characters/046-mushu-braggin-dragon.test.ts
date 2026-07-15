import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mushuBragginDragon } from "./046-mushu-braggin-dragon";

describe("Mushu - Braggin' Dragon", () => {
  it("can be played, quests for 2 lore, and can be put into the inkwell", () => {
    const playEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [mushuBragginDragon],
        inkwell: mushuBragginDragon.cost,
        deck: 5,
      },
      {
        deck: 5,
      },
    );

    expect(playEngine.asPlayerOne().playCard(mushuBragginDragon)).toBeSuccessfulCommand();
    expect(playEngine.asPlayerOne().getCardZone(mushuBragginDragon)).toBe("play");

    expect(playEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(playEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(playEngine.asPlayerOne().quest(mushuBragginDragon)).toBeSuccessfulCommand();
    expect(playEngine.asPlayerOne().getLore("player_one")).toBe(2);

    const inkEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [mushuBragginDragon],
        deck: 5,
      },
      {
        deck: 5,
      },
    );

    expect(inkEngine.asPlayerOne().ink(mushuBragginDragon)).toBeSuccessfulCommand();
    expect(inkEngine.asPlayerOne().getCardZone(mushuBragginDragon)).toBe("inkwell");
  });
});
