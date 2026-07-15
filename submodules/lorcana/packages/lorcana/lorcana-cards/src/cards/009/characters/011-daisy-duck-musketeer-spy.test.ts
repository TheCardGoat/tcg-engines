import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { daisyDuckMusketeerSpy } from "./011-daisy-duck-musketeer-spy";

const opponentAction = createMockAction({
  id: "daisy-duck-musketeer-spy-opponent-action",
  name: "Opponent Action",
  cost: 1,
  text: "A test action.",
});

const opponentCharacter = createMockCharacter({
  id: "daisy-duck-musketeer-spy-opponent-character",
  name: "Opponent Character",
  cost: 1,
});

describe("Daisy Duck - Musketeer Spy", () => {
  it("makes the opponent choose and discard a card when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [daisyDuckMusketeerSpy],
        inkwell: daisyDuckMusketeerSpy.cost,
      },
      {
        hand: [opponentAction, opponentCharacter],
      },
    );

    expect(testEngine.asPlayerOne().playCard(daisyDuckMusketeerSpy)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getPendingEffects()).toHaveLength(1);
    expect(
      testEngine.asPlayerTwo().resolvePendingEffect(daisyDuckMusketeerSpy, {
        targets: [opponentAction],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(opponentAction)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(opponentCharacter)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(daisyDuckMusketeerSpy)).toBe("play");
  });
});
