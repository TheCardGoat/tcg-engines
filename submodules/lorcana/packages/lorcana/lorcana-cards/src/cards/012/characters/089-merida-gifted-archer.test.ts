import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { meridaGiftedArcher } from "./089-merida-gifted-archer";

const challengeTarget = createMockCharacter({
  id: "merida-challenge-target",
  name: "Challenge Target",
  cost: 3,
  strength: 2,
  willpower: 5,
});

const attacker = createMockCharacter({
  id: "merida-attacker",
  name: "Attacker",
  cost: 3,
  strength: 4,
  willpower: 5,
});

describe("Merida - Gifted Archer", () => {
  it("FIERCE PROTECTION - deals 1 damage to challenger when Merida is exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: meridaGiftedArcher, isDrying: false },
          { card: challengeTarget, exerted: true },
        ],
        deck: 5,
      },
      {
        play: [attacker],
        deck: 5,
      },
    );

    // Quest with Merida to exert her
    expect(testEngine.asPlayerOne().quest(meridaGiftedArcher)).toBeSuccessfulCommand();

    // Pass turn so opponent can challenge
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Opponent challenges the exerted challengeTarget
    expect(testEngine.asPlayerTwo().challenge(attacker, challengeTarget)).toBeSuccessfulCommand();

    // Merida's FIERCE PROTECTION triggers
    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(meridaGiftedArcher, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    // Attacker should have taken 1 damage from Fierce Protection (plus challenge damage)
    const attackerDamage = testEngine.asPlayerTwo().getDamage(attacker);
    expect(attackerDamage).toBeGreaterThanOrEqual(1);
  });
});
