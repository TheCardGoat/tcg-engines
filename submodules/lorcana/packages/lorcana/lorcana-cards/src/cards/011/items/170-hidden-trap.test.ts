import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { pawpsicle } from "../../002/items";
import { hiddenTrap } from "./170-hidden-trap";

const trappedOpponent = createMockCharacter({
  id: "hidden-trap-trapped-opponent",
  name: "Trapped Opponent",
  cost: 2,
  strength: 4,
});

describe("Hidden Trap", () => {
  it("enters play exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [hiddenTrap],
      inkwell: hiddenTrap.cost,
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(hiddenTrap)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(hiddenTrap)).toBe("play");
    expect(testEngine.asPlayerOne().isExerted(hiddenTrap)).toBe(true);
  });

  it("can banish a chosen item", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [hiddenTrap],
        deck: 2,
      },
      {
        play: [pawpsicle],
        deck: 2,
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(hiddenTrap, {
        choiceIndex: 0,
        targets: [pawpsicle],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(hiddenTrap)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(pawpsicle)).toBe("discard");
  });

  it("can give a chosen opposing character -2 strength this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [hiddenTrap],
        deck: 2,
      },
      {
        play: [trappedOpponent],
        deck: 2,
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(hiddenTrap, {
        choiceIndex: 1,
        targets: [trappedOpponent],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardStrength(trappedOpponent)).toBe(2);
  });

  it("the -2 strength effect only lasts until end of turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [hiddenTrap],
        deck: 2,
      },
      {
        play: [trappedOpponent],
        deck: 2,
      },
    );

    const baseStrength = trappedOpponent.strength ?? 0;

    // Activate ability to apply -2 strength
    testEngine.asPlayerOne().activateAbility(hiddenTrap, {
      choiceIndex: 1,
      targets: [trappedOpponent],
    });

    // Verify strength is reduced
    expect(testEngine.asPlayerTwo().getCardStrength(trappedOpponent)).toBe(baseStrength - 2);

    // Pass turn to opponent and back
    testEngine.asPlayerOne().passTurn();
    testEngine.asPlayerTwo().passTurn();

    // Strength should be back to normal
    expect(testEngine.asPlayerTwo().getCardStrength(trappedOpponent)).toBe(baseStrength);
  });
});
