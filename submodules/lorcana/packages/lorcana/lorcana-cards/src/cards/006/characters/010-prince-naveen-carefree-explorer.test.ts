import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { princeNaveenCarefreeExplorer } from "./010-prince-naveen-carefree-explorer";

describe("Prince Naveen - Carefree Explorer", () => {
  it("can be played, quests for 1 lore, and can be put into the inkwell", () => {
    const playEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [princeNaveenCarefreeExplorer],
        inkwell: princeNaveenCarefreeExplorer.cost,
        deck: 5,
      },
      {
        deck: 5,
      },
    );

    expect(playEngine.asPlayerOne().playCard(princeNaveenCarefreeExplorer)).toBeSuccessfulCommand();
    expect(playEngine.asPlayerOne().getCardZone(princeNaveenCarefreeExplorer)).toBe("play");

    expect(playEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(playEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(playEngine.asPlayerOne().quest(princeNaveenCarefreeExplorer)).toBeSuccessfulCommand();
    expect(playEngine.asPlayerOne().getLore("player_one")).toBe(1);

    const inkEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [princeNaveenCarefreeExplorer],
        deck: 5,
      },
      {
        deck: 5,
      },
    );

    expect(inkEngine.asPlayerOne().ink(princeNaveenCarefreeExplorer)).toBeSuccessfulCommand();
    expect(inkEngine.asPlayerOne().getCardZone(princeNaveenCarefreeExplorer)).toBe("inkwell");
  });
});
