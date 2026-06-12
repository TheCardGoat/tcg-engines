import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { Abilities } from "@tcg/lorcana-types";
import { chemPurse } from "./119-chem-purse";

const shiftBase = createMockCharacter({
  id: "chem-purse-shift-base",
  name: "Shift Base",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const shifter = createMockCharacter({
  id: "chem-purse-shifter",
  name: "Shift Base",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 2,
  abilities: [Abilities.Shift({ cost: { ink: 3 } })],
});

const ordinaryCharacter = createMockCharacter({
  id: "chem-purse-ordinary",
  name: "Ordinary Character",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Chem Purse", () => {
  it("gives +4 strength to a character played via Shift this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [chemPurse, shiftBase],
      hand: [shifter],
      inkwell: shifter.cost,
      deck: 5,
    });

    const shiftTarget = testEngine.findCardInstanceId(shiftBase, "play", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(shifter, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(shifter)).toBe(shifter.strength + 4);
  });

  it("does not change the strength of a character played normally", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [ordinaryCharacter],
      inkwell: ordinaryCharacter.cost,
      play: [chemPurse],
      deck: 5,
    });

    expect(testEngine.asPlayerOne().playCard(ordinaryCharacter)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCard(ordinaryCharacter)?.strength).toBe(
      ordinaryCharacter.strength,
    );
  });

  it("strength bonus expires at end of turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [chemPurse, shiftBase],
        hand: [shifter],
        inkwell: shifter.cost,
        deck: 5,
      },
      {
        deck: 5,
      },
    );

    const shiftTarget = testEngine.findCardInstanceId(shiftBase, "play", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(shifter, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(shifter)).toBe(shifter.strength + 4);

    testEngine.asPlayerOne().passTurn();
    testEngine.asPlayerTwo().passTurn();

    expect(testEngine.asPlayerOne().getCardStrength(shifter)).toBe(shifter.strength);
  });
});
