import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { lennyToyBinocularsP3Challenge } from "./p3-049-lenny-toy-binoculars-challenge";

const opponentAction = createMockAction({
  id: "lenny-p3-opponent-action",
  name: "Opponent Action",
  cost: 2,
});

const opponentCharacter = createMockCharacter({
  id: "lenny-p3-opponent-char",
  name: "Filler Character",
  cost: 2,
});

describe("Lenny - Toy Binoculars (P3 Challenge)", () => {
  it("TAKE A GOOD LOOK - opponent discards an action card when Lenny is played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [lennyToyBinocularsP3Challenge],
        inkwell: lennyToyBinocularsP3Challenge.cost,
      },
      {
        hand: [opponentAction, opponentCharacter],
        deck: 5,
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(lennyToyBinocularsP3Challenge),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [opponentAction] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(opponentAction)).toBe("discard");
  });
});
