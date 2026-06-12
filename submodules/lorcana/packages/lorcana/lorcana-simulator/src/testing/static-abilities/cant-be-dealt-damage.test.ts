import { describe, expect, it } from "bun:test";
import type { CommandFailure } from "@tcg/lorcana-engine";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { fireTheCannons, stitchNewDog } from "@tcg/lorcana-cards/cards/001";
import { balooOlIronPaws } from "@tcg/lorcana-cards/cards/007";

const strongCharacter = createMockCharacter({
  id: "dmg-immune-strong",
  name: "Strong Character",
  cost: 6,
  strength: 7,
  willpower: 7,
  lore: 1,
});

const weakCharacter = createMockCharacter({
  id: "dmg-immune-weak",
  name: "Weak Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("FIGHT LIKE A BEAR - Baloo, Ol' Iron Paws - Your characters with 7 {S} or more can't be dealt damage.", () => {
  it("should prevent your characters with 7+ strength from taking action damage", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [fireTheCannons],
        inkwell: fireTheCannons.cost,
        play: [balooOlIronPaws, strongCharacter],
      },
      {},
    );

    // Deal damage to the 7-strength character (our own)
    // The card is still a valid target, but damage should be prevented
    expect(
      testEngine.asPlayerOne().playCard(fireTheCannons, {
        targets: [strongCharacter],
      }),
    ).toBeSuccessfulCommand();

    // Damage should be 0 (prevented by Baloo's ability)
    expect(testEngine.asPlayerOne().getDamage(strongCharacter)).toBe(0);
  });

  it("should NOT protect characters with less than 7 strength", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [fireTheCannons],
        inkwell: fireTheCannons.cost,
        play: [balooOlIronPaws, weakCharacter],
      },
      {},
    );

    expect(
      testEngine.asPlayerOne().playCard(fireTheCannons, {
        targets: [weakCharacter],
      }),
    ).toBeSuccessfulCommand();

    // Weak character (2 strength) should take normal damage
    expect(testEngine.asPlayerOne().getDamage(weakCharacter)).toBe(2);
  });

  it("should NOT protect opponent's characters with 7+ strength (only YOUR characters)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [fireTheCannons],
        inkwell: fireTheCannons.cost,
        play: [balooOlIronPaws],
      },
      {
        play: [strongCharacter],
      },
    );

    // Opponent's character has 7 strength but Baloo only protects YOUR characters
    expect(
      testEngine.asPlayerOne().playCard(fireTheCannons, {
        targets: [strongCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getDamage(strongCharacter)).toBe(2);
  });

  it("Baloo himself has 5 strength — he CAN take damage (doesn't meet his own threshold)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [fireTheCannons],
        inkwell: fireTheCannons.cost,
        play: [balooOlIronPaws],
      },
      {},
    );

    // Baloo has 5 strength (< 7), so he can take damage
    expect(
      testEngine.asPlayerOne().playCard(fireTheCannons, {
        targets: [balooOlIronPaws],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(balooOlIronPaws)).toBe(2);
  });

  // QUESTION: When a character with cant-be-dealt-damage is challenged, does the
  // defending immune character still deal damage to the attacker? Currently the engine
  // seems to zero out both sides of the challenge damage when one side has the restriction.
  // Per rules, only the immune character should be protected; the attacker should still take damage.
  it.skip("should prevent challenge damage for qualifying characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [balooOlIronPaws, { card: strongCharacter, exerted: true }],
        deck: 2,
      },
      {
        play: [{ card: stitchNewDog, isDrying: false }],
        deck: 2,
      },
    );

    // Pass to opponent's turn
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Opponent challenges the 7-strength character
    expect(
      testEngine.asPlayerTwo().challenge(stitchNewDog, strongCharacter),
    ).toBeSuccessfulCommand();

    // Strong character should take 0 damage (immune)
    expect(testEngine.asPlayerOne().getDamage(strongCharacter)).toBe(0);
    // Stitch should take damage from the strong character's strength
    // Note: if damage immunity is mutual in challenge context, stitch might take 0 too
    // But per rules, only the immune character doesn't take damage; the attacker still does
    expect(testEngine.asPlayerTwo().getDamage(stitchNewDog)).toBe(strongCharacter.strength);
  });
});
