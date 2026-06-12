import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { ramaVigilantFather } from "@tcg/lorcana-cards/cards/010";

const strongCharacter = createMockCharacter({
  id: "conditional-strong",
  name: "Strong Character",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 1,
});

const weakCharacter = createMockCharacter({
  id: "conditional-weak",
  name: "Weak Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Conditional - Rama, Vigilant Father - PROTECTION OF THE PACK: Whenever you play another character with 5 {S} or more, you may ready this character. If you do, he can't quest for the rest of this turn.", () => {
  it("should trigger when a character with 5+ strength is played and allow optional ready", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [strongCharacter],
      inkwell: strongCharacter.cost,
      play: [{ card: ramaVigilantFather, exerted: true, isDrying: false }],
    });

    // Rama is exerted
    expect(testEngine.asPlayerOne().isExerted(ramaVigilantFather)).toBe(true);

    // Play a 5-strength character
    expect(testEngine.asPlayerOne().playCard(strongCharacter)).toBeSuccessfulCommand();

    // Trigger should fire with optional
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    // Accept: ready Rama
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
          resolveOptional: true,
        }),
    ).toBeSuccessfulCommand();

    // Rama should now be ready
    expect(testEngine.asPlayerOne().isExerted(ramaVigilantFather)).toBe(false);
  });

  it("should apply cant-quest restriction when optional is accepted (if-you-do)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [strongCharacter],
      inkwell: strongCharacter.cost,
      play: [{ card: ramaVigilantFather, exerted: true, isDrying: false }],
      lore: 0,
    });

    expect(testEngine.asPlayerOne().playCard(strongCharacter)).toBeSuccessfulCommand();
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
          resolveOptional: true,
        }),
    ).toBeSuccessfulCommand();

    // Rama is ready but can't quest this turn due to if-you-do restriction
    expect(testEngine.asPlayerOne().isExerted(ramaVigilantFather)).toBe(false);

    const questResult = testEngine.asPlayerOne().quest(ramaVigilantFather);
    expect(questResult.success).toBe(false);
  });

  it("should NOT apply cant-quest restriction when optional is declined", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [strongCharacter],
      inkwell: strongCharacter.cost,
      play: [{ card: ramaVigilantFather, isDrying: false }],
      lore: 0,
    });

    expect(testEngine.asPlayerOne().playCard(strongCharacter)).toBeSuccessfulCommand();

    // Decline the optional ready
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
          resolveOptional: false,
        }),
    ).toBeSuccessfulCommand();

    // Rama should still be able to quest (he was already ready, and didn't accept the ready)
    expect(testEngine.asPlayerOne().quest(ramaVigilantFather)).toBeSuccessfulCommand();
    expect(testEngine.getLore(PLAYER_ONE)).toBe(ramaVigilantFather.lore);
  });

  it("should NOT trigger when a character with less than 5 strength is played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [weakCharacter],
      inkwell: weakCharacter.cost,
      play: [{ card: ramaVigilantFather, exerted: true, isDrying: false }],
    });

    expect(testEngine.asPlayerOne().playCard(weakCharacter)).toBeSuccessfulCommand();

    // No trigger because weak character has only 2 strength (< 5)
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

    // Rama stays exerted
    expect(testEngine.asPlayerOne().isExerted(ramaVigilantFather)).toBe(true);
  });

  it("should NOT trigger when opponent plays a character with 5+ strength", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: ramaVigilantFather, exerted: true, isDrying: false }],
        deck: 2,
      },
      {
        hand: [strongCharacter],
        inkwell: strongCharacter.cost,
        deck: 2,
      },
    );

    // Pass to opponent's turn
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Opponent plays a 5-strength character
    expect(testEngine.asPlayerTwo().playCard(strongCharacter)).toBeSuccessfulCommand();

    // Rama's trigger should NOT fire (controller: "you", excludeSelf)
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
  });
});
