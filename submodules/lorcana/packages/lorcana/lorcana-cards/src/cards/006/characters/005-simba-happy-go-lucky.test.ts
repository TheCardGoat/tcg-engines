import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaHappygolucky } from "./005-simba-happy-go-lucky";

describe("Simba - Happy-Go-Lucky", () => {
  it("can be played, quests for 1 lore, and can be put into the inkwell", () => {
    const playEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [simbaHappygolucky],
        inkwell: simbaHappygolucky.cost,
        deck: 5,
      },
      {
        deck: 5,
      },
    );

    expect(playEngine.asPlayerOne().playCard(simbaHappygolucky)).toBeSuccessfulCommand();
    expect(playEngine.asPlayerOne().getCardZone(simbaHappygolucky)).toBe("play");

    expect(playEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(playEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(playEngine.asPlayerOne().quest(simbaHappygolucky)).toBeSuccessfulCommand();
    expect(playEngine.asPlayerOne().getLore("player_one")).toBe(1);

    const inkEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [simbaHappygolucky],
        deck: 5,
      },
      {
        deck: 5,
      },
    );

    expect(inkEngine.asPlayerOne().ink(simbaHappygolucky)).toBeSuccessfulCommand();
    expect(inkEngine.asPlayerOne().getCardZone(simbaHappygolucky)).toBe("inkwell");
  });
});
