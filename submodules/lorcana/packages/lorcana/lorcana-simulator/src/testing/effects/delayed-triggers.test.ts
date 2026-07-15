import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { bernardBrandnewAgent } from "@tcg/lorcana-cards/cards/003";
import { hansBrazenManipulator } from "@tcg/lorcana-cards/cards/010";

const allyCharacter = createMockCharacter({
  id: "delayed-trigger-ally",
  name: "Ally Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const opponentCharacter = createMockCharacter({
  id: "delayed-trigger-opponent",
  name: "Opponent Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Delayed Triggers - Bernard, Brand-New Agent - At the end of your turn, if this character is exerted, you may ready another chosen character of yours.", () => {
  it("should fire at end of turn when Bernard is exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: bernardBrandnewAgent, isDrying: false },
          { card: allyCharacter, isDrying: false },
        ],
        deck: 2,
      },
      {
        deck: 2,
      },
    );

    // Quest with both to exert them
    expect(testEngine.asPlayerOne().quest(bernardBrandnewAgent)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().quest(allyCharacter)).toBeSuccessfulCommand();

    // Both are exerted
    expect(testEngine.asPlayerOne().isExerted(bernardBrandnewAgent)).toBe(true);
    expect(testEngine.asPlayerOne().isExerted(allyCharacter)).toBe(true);

    // Pass turn - Bernard's end-of-turn trigger should fire
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Should have a bag effect for the optional ready
    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

    // Accept the optional and target the ally
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
          resolveOptional: true,
          targets: [allyCharacter],
        }),
    ).toBeSuccessfulCommand();

    // Ally should now be ready (readied by Bernard's ability)
    expect(testEngine.asPlayerOne().isExerted(allyCharacter)).toBe(false);
  });

  it("should NOT fire at end of turn when Bernard is NOT exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: bernardBrandnewAgent, isDrying: false },
          { card: allyCharacter, isDrying: false, exerted: true },
        ],
        deck: 2,
      },
      {
        deck: 2,
      },
    );

    // Bernard is ready (not exerted), condition should fail
    expect(testEngine.asPlayerOne().isExerted(bernardBrandnewAgent)).toBe(false);

    // Pass turn - Bernard's trigger should NOT fire because he's not exerted
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // No bag effect expected
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("should NOT fire during opponent's turn end", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: bernardBrandnewAgent, exerted: true, isDrying: false },
          { card: allyCharacter, exerted: true, isDrying: false },
        ],
        deck: 2,
      },
      {
        deck: 2,
      },
    );

    // Pass to opponent's turn
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Resolve any bag from P1's end of turn first
    testEngine.asPlayerOne().resolveAllBagEffects({ maxIterations: 10, resolveOptional: false });
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

    // Opponent's turn end should NOT trigger Bernard
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    // No bag from Bernard's trigger during opponent's turn end
    // (Bernard's trigger fires at end of YOUR turn only)
    expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
  });
});

describe("Delayed Triggers - Hans, Brazen Manipulator - At the start of your turn, if an opponent has 2 or more ready characters in play, gain 2 lore.", () => {
  it("should fire at start of turn when opponent has 2+ ready characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [hansBrazenManipulator],
        deck: 2,
      },
      {
        play: [opponentCharacter, allyCharacter],
        deck: 2,
      },
      {
        startingLore: { [PLAYER_ONE]: 0 },
      },
    );

    // Pass to opponent, then pass back to trigger start-of-turn
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    // Resolve any bag effects from the start-of-turn trigger
    const bagEffects = testEngine.asPlayerOne().getBagEffects();
    for (const bagEffect of bagEffects) {
      testEngine.asPlayerOne().resolvePendingByCard(bagEffect.sourceId);
    }

    // Hans's trigger should have fired at start of our turn
    // Opponent had 2 ready characters => gain 2 lore
    expect(testEngine.getLore(PLAYER_ONE)).toBe(2);
  });

  it("should NOT fire when opponent has fewer than 2 ready characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [hansBrazenManipulator],
        deck: 2,
      },
      {
        play: [opponentCharacter],
        deck: 2,
      },
      {
        startingLore: { [PLAYER_ONE]: 0 },
      },
    );

    // Pass to opponent, then pass back
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    // Only 1 opponent character => condition not met => no lore gain
    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
  });
});
