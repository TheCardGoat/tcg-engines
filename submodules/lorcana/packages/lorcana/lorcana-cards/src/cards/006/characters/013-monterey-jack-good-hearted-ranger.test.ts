import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { montereyJackGoodheartedRanger } from "./013-monterey-jack-good-hearted-ranger";

describe("Monterey Jack - Good-Hearted Ranger", () => {
  it("can be played, quests for 2 lore, and can be put into the inkwell", () => {
    const playEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [montereyJackGoodheartedRanger],
        inkwell: montereyJackGoodheartedRanger.cost,
        deck: 5,
      },
      {
        deck: 5,
      },
    );

    expect(
      playEngine.asPlayerOne().playCard(montereyJackGoodheartedRanger),
    ).toBeSuccessfulCommand();
    expect(playEngine.asPlayerOne().getCardZone(montereyJackGoodheartedRanger)).toBe("play");

    expect(playEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(playEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(playEngine.asPlayerOne().quest(montereyJackGoodheartedRanger)).toBeSuccessfulCommand();
    expect(playEngine.asPlayerOne().getLore("player_one")).toBe(2);

    const inkEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [montereyJackGoodheartedRanger],
        deck: 5,
      },
      {
        deck: 5,
      },
    );

    expect(inkEngine.asPlayerOne().ink(montereyJackGoodheartedRanger)).toBeSuccessfulCommand();
    expect(inkEngine.asPlayerOne().getCardZone(montereyJackGoodheartedRanger)).toBe("inkwell");
  });
});
