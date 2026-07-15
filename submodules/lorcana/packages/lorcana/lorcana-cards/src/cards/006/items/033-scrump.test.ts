import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { scrump } from "./033-scrump";

const stitchedFriend = createMockCharacter({
  id: "scrump-stitched-friend",
  name: "Stitched Friend",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const chosenCharacter = createMockCharacter({
  id: "scrump-chosen-character",
  name: "Chosen Character",
  cost: 3,
  strength: 4,
  willpower: 4,
});

describe("Scrump", () => {
  it("regression: cannot target drying characters for exert cost", () => {
    const dryingCharacter = createMockCharacter({
      id: "scrump-drying-char",
      name: "Drying Character",
      cost: 3,
      strength: 3,
      willpower: 4,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 2,
        play: [scrump, { card: dryingCharacter, isDrying: true }],
      },
      {
        deck: 2,
        play: [chosenCharacter],
      },
    );

    // Drying character should not be a valid exert cost target
    const result = testEngine.asPlayerOne().activateAbility(scrump, {
      costs: {
        exertCharacters: [dryingCharacter],
      },
      targets: [chosenCharacter],
    });

    expect(result.success).toBe(false);
  });

  it("lets you exert one of your characters to give the chosen character -2 strength until your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 2,
        play: [scrump, stitchedFriend],
      },
      {
        deck: 2,
        play: [chosenCharacter],
      },
    );
    const baseStrength = testEngine.asPlayerTwo().getCardStrength(chosenCharacter);

    expect(
      testEngine.asPlayerOne().activateAbility(scrump, {
        costs: {
          exertCharacters: [stitchedFriend],
        },
        targets: [chosenCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(stitchedFriend)).toBe(true);
    expect(testEngine.asPlayerTwo().getCardStrength(chosenCharacter)).toBe(baseStrength - 2);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardStrength(chosenCharacter)).toBe(baseStrength);
  });

  it("regression: cannot activate without exerting a character (exert cost is required)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 2,
        play: [scrump],
        // No characters to exert!
      },
      {
        deck: 2,
        play: [chosenCharacter],
      },
    );

    // Without any characters in play to exert, the ability should not be activatable
    const result = testEngine.asPlayerOne().activateAbility(scrump, {
      targets: [chosenCharacter],
    });
    expect(result.success).toBe(false);
  });

  it("regression: the exerted character must actually be exerted as part of the cost", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 2,
        play: [scrump, stitchedFriend],
      },
      {
        deck: 2,
        play: [chosenCharacter],
      },
    );

    expect(testEngine.asPlayerOne().isExerted(stitchedFriend)).toBe(false);

    expect(
      testEngine.asPlayerOne().activateAbility(scrump, {
        costs: {
          exertCharacters: [stitchedFriend],
        },
        targets: [chosenCharacter],
      }),
    ).toBeSuccessfulCommand();

    // Stitched friend should now be exerted (it was part of the cost)
    expect(testEngine.asPlayerOne().isExerted(stitchedFriend)).toBe(true);
  });
});
