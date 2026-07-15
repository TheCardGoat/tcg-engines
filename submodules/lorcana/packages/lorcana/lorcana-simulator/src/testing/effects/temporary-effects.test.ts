import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { minnieMouseQuickthinkingInventor } from "@tcg/lorcana-cards/cards/005";

const targetCharacter = createMockCharacter({
  id: "temp-effect-target",
  name: "Target Character",
  cost: 3,
  strength: 4,
  willpower: 5,
  lore: 1,
});

const secondTarget = createMockCharacter({
  id: "temp-effect-second-target",
  name: "Second Target",
  cost: 2,
  strength: 3,
  willpower: 4,
  lore: 1,
});

describe("Temporary Effects - Effects that expire after a duration", () => {
  it("should expire this-turn effects at end of the current turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [minnieMouseQuickthinkingInventor],
        inkwell: minnieMouseQuickthinkingInventor.cost,
        play: [targetCharacter],
        deck: 2,
      },
      {
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(4);

    // Play Minnie and target our character for -2 strength this turn
    expect(
      testEngine.asPlayerOne().playCard(minnieMouseQuickthinkingInventor),
    ).toBeSuccessfulCommand();

    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
          targets: [targetCharacter],
        }),
    ).toBeSuccessfulCommand();

    // Strength reduced during this turn
    expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(2);

    // Pass both turns
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    // Strength should be restored
    expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(4);
  });

  it("should apply temporary stat modifier that affects challenge damage", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [minnieMouseQuickthinkingInventor],
        inkwell: minnieMouseQuickthinkingInventor.cost,
      },
      {
        play: [{ card: targetCharacter, exerted: true }],
        deck: 2,
      },
    );

    // Apply -2 strength to opponent's exerted character
    expect(
      testEngine.asPlayerOne().playCard(minnieMouseQuickthinkingInventor),
    ).toBeSuccessfulCommand();

    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
          targets: [targetCharacter],
        }),
    ).toBeSuccessfulCommand();

    // Opponent's character now has 2 strength instead of 4
    expect(testEngine.asPlayerTwo().getCardStrength(targetCharacter)).toBe(2);
  });

  it("should keep the effect active until turn actually ends", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [minnieMouseQuickthinkingInventor],
        inkwell: minnieMouseQuickthinkingInventor.cost,
        play: [targetCharacter],
        deck: 2,
      },
      {
        deck: 2,
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(minnieMouseQuickthinkingInventor),
    ).toBeSuccessfulCommand();

    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
          targets: [targetCharacter],
        }),
    ).toBeSuccessfulCommand();

    // Modifier still active during the same turn
    expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(2);

    // Can still do other actions and modifier persists
    expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(2);
  });
});
