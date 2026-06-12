import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { theNephewsPiggyBank } from "./044-the-nephews-piggy-bank";

const donaldDuckAlly = createMockCharacter({
  id: "piggy-bank-donald",
  name: "Donald Duck",
  cost: 3,
});

const strengthTarget = createMockCharacter({
  id: "piggy-bank-target",
  name: "Strength Target",
  cost: 2,
  strength: 4,
});

describe("The Nephews' Piggy Bank", () => {
  it("costs 1 less to play while you have a character named Donald Duck in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [theNephewsPiggyBank],
      inkwell: theNephewsPiggyBank.cost - 1,
      play: [donaldDuckAlly],
    });

    expect(testEngine.asPlayerOne().canPlayCard(theNephewsPiggyBank)).toBe(true);
    expect(testEngine.asPlayerOne().playCard(theNephewsPiggyBank)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(theNephewsPiggyBank)).toBe("play");
  });

  it("gives the chosen character -1 strength until the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [theNephewsPiggyBank],
      },
      {
        play: [strengthTarget],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(theNephewsPiggyBank, {
        ability: "PAYOFF",
        targets: [strengthTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCard(strengthTarget)?.strength).toBe(3);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCard(strengthTarget)?.strength).toBe(3);

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCard(strengthTarget)?.strength).toBe(4);
  });
});
