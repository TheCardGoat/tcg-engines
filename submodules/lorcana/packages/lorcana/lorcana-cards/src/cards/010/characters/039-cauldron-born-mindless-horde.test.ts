import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { cauldronBornMindlessHorde } from "./039-cauldron-born-mindless-horde";

describe("Cauldron Born - Mindless Horde", () => {
  it("should be playable as a vanilla character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cauldronBornMindlessHorde],
      inkwell: cauldronBornMindlessHorde.cost,
    });

    expect(testEngine.asPlayerOne().playCard(cauldronBornMindlessHorde)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(cauldronBornMindlessHorde)).toBe("play");
  });

  it("should be able to quest for lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [cauldronBornMindlessHorde],
        inkwell: cauldronBornMindlessHorde.cost,
        deck: 5,
      },
      {
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().playCard(cauldronBornMindlessHorde)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().quest(cauldronBornMindlessHorde)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(1);
  });
});
