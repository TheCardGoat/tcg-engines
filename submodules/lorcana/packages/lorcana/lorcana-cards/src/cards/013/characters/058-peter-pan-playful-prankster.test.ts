import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { peterPanPlayfulPrankster } from "./058-peter-pan-playful-prankster";

const opposingCharacter = createMockCharacter({
  id: "peter-pan-playful-prankster-opposing-character",
  name: "Opposing Character",
  cost: 2,
});

describe("Peter Pan - Playful Prankster", () => {
  it("stops a chosen opposing character from readying at the start of their next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [peterPanPlayfulPrankster],
        inkwell: peterPanPlayfulPrankster.cost,
      },
      {
        play: [{ card: opposingCharacter, exerted: true }],
      },
    );

    expect(testEngine.asPlayerOne().playCard(peterPanPlayfulPrankster)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(peterPanPlayfulPrankster, {
        targets: [opposingCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().isExerted(opposingCharacter)).toBe(true);
  });
});
