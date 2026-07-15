import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mothersNecklace } from "./065-mothers-necklace";

const necklaceBearer = createMockCharacter({
  id: "mothers-necklace-bearer",
  name: "Necklace Bearer",
  cost: 2,
});

const attacker = createMockCharacter({
  id: "mothers-necklace-attacker",
  name: "Attacker",
  cost: 2,
  strength: 3,
});

const defender = createMockCharacter({
  id: "mothers-necklace-defender",
  name: "Defender",
  cost: 2,
  strength: 2,
  willpower: 5,
});

describe("Mother's Necklace", () => {
  it("gives a chosen character Evasive until the start of your next turn when none of your characters challenged", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 2,
        play: [mothersNecklace, necklaceBearer],
      },
      {
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().hasKeyword(necklaceBearer, "Evasive")).toBe(false);
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(testEngine.asPlayerOne().resolvePendingByCard(mothersNecklace)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [necklaceBearer] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().hasKeyword(necklaceBearer, "Evasive")).toBe(true);

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().hasKeyword(necklaceBearer, "Evasive")).toBe(false);
  });

  it("does NOT grant Evasive when a character challenged this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 2,
        play: [mothersNecklace, attacker, necklaceBearer],
      },
      {
        deck: 2,
        play: [{ card: defender, exerted: true }],
      },
    );

    // Challenge with attacker
    expect(testEngine.asPlayerOne().challenge(attacker, defender)).toBeSuccessfulCommand();

    // Pass turn - trigger fires unconditionally, condition checked at resolution
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // The bag effect is created (trigger fires at end of turn)
    const bagCount = testEngine.asPlayerOne().getBagCount();
    if (bagCount > 0) {
      // Resolve it - the conditional should fail since a challenge was made
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(mothersNecklace),
      ).toBeSuccessfulCommand();
    }

    // Necklace Bearer should NOT have Evasive because condition failed
    expect(testEngine.asPlayerOne().hasKeyword(necklaceBearer, "Evasive")).toBe(false);
  });

  it("Evasive character granted by necklace cannot be challenged by non-Evasive characters", () => {
    const opponentAttacker = createMockCharacter({
      id: "mothers-necklace-opponent-attacker",
      name: "Opponent Attacker",
      cost: 2,
      strength: 3,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 2,
        play: [mothersNecklace, necklaceBearer],
      },
      {
        deck: 2,
        play: [opponentAttacker],
      },
    );

    // Pass turn without challenging - PRECIOUS GIFT triggers
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().resolvePendingByCard(mothersNecklace)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [necklaceBearer] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().hasKeyword(necklaceBearer, "Evasive")).toBe(true);

    // Opponent without Evasive should not be able to challenge the Evasive character
    expect(
      testEngine.asPlayerTwo().challenge(opponentAttacker, necklaceBearer),
    ).not.toBeSuccessfulCommand();
  });
});
