import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { smash } from "../../001/actions/200-smash";
import { hydraDeadlySerpent } from "./108-hydra-deadly-serpent";

const opposingTarget = createMockCharacter({
  id: "hydra-opposing-target",
  name: "Opposing Target",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
});

/** Strength 3 so combat deals 3 to Hydra (W5) — Hydra survives and Watch the Teeth deals 3 more to the attacker. */
const hydraChallenger = createMockCharacter({
  id: "hydra-challenge-attacker",
  name: "Hydra Challenger",
  cost: 3,
  strength: 3,
  willpower: 20,
  lore: 1,
});

describe("Hydra - Deadly Serpent", () => {
  it("deals the same amount of damage to a chosen opposing character when Hydra is dealt damage", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [hydraDeadlySerpent],
      },
      {
        hand: [smash],
        inkwell: smash.cost,
        play: [opposingTarget],
      },
    );

    expect(testEngine.asServer().manualPassTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().playCard(smash, { targets: [hydraDeadlySerpent] }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(hydraDeadlySerpent, {
        targets: [opposingTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCard(hydraDeadlySerpent).damage).toBe(3);
    expect(testEngine.asPlayerTwo().getCard(opposingTarget).damage).toBe(3);
  });

  it("deals Watch the Teeth damage to the attacking character when Hydra is damaged in a challenge", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [hydraChallenger],
        deck: 1,
      },
      {
        play: [{ card: hydraDeadlySerpent, exerted: true }],
        deck: 1,
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(hydraChallenger, hydraDeadlySerpent),
    ).toBeSuccessfulCommand();

    const combatDamageToDefender = 3;
    const combatDamageToAttacker = 6;
    const watchTheTeethDamage = combatDamageToDefender;

    expect(testEngine.asPlayerTwo().getCard(hydraDeadlySerpent).damage).toBe(
      combatDamageToDefender,
    );
    expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerTwo().resolvePendingByCard(hydraDeadlySerpent, {
        targets: [hydraChallenger],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCard(hydraChallenger).damage).toBe(
      combatDamageToAttacker + watchTheTeethDamage,
    );
  });
});
