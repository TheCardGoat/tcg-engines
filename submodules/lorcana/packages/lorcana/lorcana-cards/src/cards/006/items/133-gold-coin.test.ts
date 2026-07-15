import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { goldCoin } from "./133-gold-coin";

const readyTarget = createMockCharacter({
  id: "gold-coin-ready-target",
  name: "Ready Target",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Gold Coin", () => {
  it("readies the chosen character and stops them from questing for the rest of the turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 2,
        inkwell: 1,
        play: [goldCoin, { card: readyTarget, exerted: true }],
      },
      {
        deck: 2,
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(goldCoin, {
        targets: [readyTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(readyTarget)).toBe(false);
    expect(testEngine.asPlayerOne().quest(readyTarget).success).toBe(false);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().quest(readyTarget).success).toBe(true);
  });
});
