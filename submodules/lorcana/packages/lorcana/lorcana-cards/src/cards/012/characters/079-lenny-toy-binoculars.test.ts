import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { lennyToyBinoculars } from "./079-lenny-toy-binoculars";

const opponentAction = createMockAction({
  id: "lenny-opponent-action",
  name: "Opponent Action",
  cost: 2,
});

const opponentCharacter = createMockCharacter({
  id: "lenny-opponent-char",
  name: "Filler Character",
  cost: 2,
});

describe("Lenny - Toy Binoculars", () => {
  it("TAKE A GOOD LOOK - opponent discards an action card when Lenny is played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [lennyToyBinoculars],
        inkwell: lennyToyBinoculars.cost,
      },
      {
        hand: [opponentAction, opponentCharacter],
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().playCard(lennyToyBinoculars)).toBeSuccessfulCommand();

    // The ability auto-resolves from the bag into a pending discard-choice for P1
    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [opponentAction] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(opponentAction)).toBe("discard");
  });
});
