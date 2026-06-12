import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { gopherShipsCarpenter } from "./004-gopher-ships-carpenter";

describe("Gopher - Ship's Carpenter", () => {
  it("can be played, quests for 2 lore, and can be put into the inkwell", () => {
    const playEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [gopherShipsCarpenter],
        inkwell: gopherShipsCarpenter.cost,
        deck: 5,
      },
      {
        deck: 5,
      },
    );

    expect(playEngine.asPlayerOne().playCard(gopherShipsCarpenter)).toBeSuccessfulCommand();
    expect(playEngine.asPlayerOne().getCardZone(gopherShipsCarpenter)).toBe("play");

    expect(playEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(playEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(playEngine.asPlayerOne().quest(gopherShipsCarpenter)).toBeSuccessfulCommand();
    expect(playEngine.asPlayerOne().getLore("player_one")).toBe(2);

    const inkEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [gopherShipsCarpenter],
        deck: 5,
      },
      {
        deck: 5,
      },
    );

    expect(inkEngine.asPlayerOne().ink(gopherShipsCarpenter)).toBeSuccessfulCommand();
    expect(inkEngine.asPlayerOne().getCardZone(gopherShipsCarpenter)).toBe("inkwell");
  });
});
