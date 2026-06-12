import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { someoneWillLoseHisHead } from "./162-someone-will-lose-his-head";

const opposingA = createMockCharacter({
  id: "someone-will-lose-his-head-opposing-a",
  name: "Opposing A",
  cost: 3,
  strength: 4,
  willpower: 5,
});

const opposingB = createMockCharacter({
  id: "someone-will-lose-his-head-opposing-b",
  name: "Opposing B",
  cost: 2,
  strength: 3,
  willpower: 4,
});

const friendly = createMockCharacter({
  id: "someone-will-lose-his-head-friendly",
  name: "Friendly",
  cost: 2,
  strength: 3,
  willpower: 4,
});

describe("Someone Will Lose His Head", () => {
  it("gives each opposing character -2 {S} this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [someoneWillLoseHisHead],
        inkwell: someoneWillLoseHisHead.cost,
        play: [friendly],
      },
      {
        play: [opposingA, opposingB],
      },
    );

    const initialA = testEngine.getCard(opposingA).strength!;
    const initialB = testEngine.getCard(opposingB).strength!;
    const initialFriendly = testEngine.getCard(friendly).strength!;

    expect(testEngine.asPlayerOne().playCard(someoneWillLoseHisHead)).toBeSuccessfulCommand();

    // Each opposing character gets -2 strength
    expect(testEngine.getCard(opposingA).strength).toBe(initialA - 2);
    expect(testEngine.getCard(opposingB).strength).toBe(initialB - 2);

    // Friendly character unaffected
    expect(testEngine.getCard(friendly).strength).toBe(initialFriendly);
  });

  it("expires at end of current turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [someoneWillLoseHisHead],
        inkwell: someoneWillLoseHisHead.cost,
      },
      {
        play: [opposingA],
      },
    );

    const initialA = testEngine.getCard(opposingA).strength!;

    expect(testEngine.asPlayerOne().playCard(someoneWillLoseHisHead)).toBeSuccessfulCommand();

    expect(testEngine.getCard(opposingA).strength).toBe(initialA - 2);

    // After the active player's turn ends, the "this turn" modifier ends.
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.getCard(opposingA).strength).toBe(initialA);
  });
});
