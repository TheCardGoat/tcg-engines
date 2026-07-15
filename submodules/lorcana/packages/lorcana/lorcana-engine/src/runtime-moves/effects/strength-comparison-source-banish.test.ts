import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "../../testing";

/**
 * Regression test for: Wreck-It Ralph WHO'S COMIN' WITH ME resolves with zero banishes.
 *
 * When a character with boosted strength (via cards-under-self) is banished and
 * its "when banished SELF" triggered ability resolves a `strength-comparison`
 * filter with `value: "source"`, the filter must use the source card's pre-banish
 * effective strength (e.g. 3 base + 2 from cards-under = 5).
 *
 * If `strengthBeforeBanish` is 0 or undefined, the comparison `≤ 0` filters out
 * every character, producing zero banishes.
 */
describe("strength-comparison value:source on banished source card", () => {
  /**
   * A character with Boost + cards-under-self strength modifier
   * and a "when banished SELF" triggered ability that banishes all
   * characters with strength ≤ the source's pre-banish strength.
   */
  const banishSourceCard = createMockCharacter({
    id: "strength-source-banisher",
    name: "Strength Source Banisher",
    cost: 7,
    strength: 3,
    willpower: 4,
    lore: 1,
    abilities: [
      {
        id: "ssb-1",
        name: "POWERED UP",
        type: "static",
        effect: {
          type: "modify-stat",
          target: "SELF",
          stat: "strength",
          modifier: {
            type: "cards-under-self",
          },
        },
        text: "POWERED UP This character gets +1 {S} for each card under it.",
      },
      {
        id: "ssb-2",
        name: "WHO'S COMIN' WITH ME?",
        type: "triggered",
        trigger: {
          event: "banish",
          on: "SELF",
          timing: "when",
        },
        effect: {
          type: "banish",
          target: {
            selector: "all",
            count: "all",
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
            filter: [
              {
                type: "strength-comparison",
                comparison: "less-or-equal",
                value: "source",
              },
            ],
          },
        },
        text: "WHO'S COMIN' WITH ME? When this character is banished, banish all characters with {S} equal to or less than the {S} he had in play.",
      },
    ],
  });

  it("banishes characters with strength ≤ source's pre-banish strength (base + cards-under)", () => {
    // Two cards under the source → effective strength = 3 + 2 = 5
    const cardUnder1 = createMockCharacter({
      id: "card-under-1",
      name: "Card Under 1",
      cost: 2,
      strength: 1,
      willpower: 1,
    });
    const cardUnder2 = createMockCharacter({
      id: "card-under-2",
      name: "Card Under 2",
      cost: 2,
      strength: 1,
      willpower: 1,
    });

    // Targets in play: one with S=5 (should be banished), one with S=6 (should survive)
    const weakTarget = createMockCharacter({
      id: "weak-target",
      name: "Weak Target",
      cost: 3,
      strength: 5,
      willpower: 10,
    });
    const strongTarget = createMockCharacter({
      id: "strong-target",
      name: "Strong Target",
      cost: 5,
      strength: 6,
      willpower: 10,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: banishSourceCard, cardsUnder: [cardUnder1, cardUnder2] }, weakTarget],
        deck: 1,
      },
      {
        play: [strongTarget],
        deck: 1,
      },
    );

    // Verify initial state
    expect(testEngine.asPlayerOne().getCardZone(banishSourceCard)).toBe("play");
    expect(testEngine.asPlayerOne().getCardZone(weakTarget)).toBe("play");
    expect(testEngine.asPlayerTwo().getCardZone(strongTarget)).toBe("play");

    // Banish the source card via lethal damage
    expect(testEngine.asServer().manualSetDamage(banishSourceCard, 10)).toBeSuccessfulCommand();

    // The source should now be in discard
    expect(testEngine.asPlayerOne().getCardZone(banishSourceCard)).toBe("discard");

    // Resolve all bag effects (the banished trigger fires)
    testEngine.asPlayerOne().resolveAllBagEffects({ maxIterations: 10 });

    // Weak target (S=5 ≤ 5) should be banished
    expect(testEngine.asPlayerOne().getCardZone(weakTarget)).toBe("discard");

    // Strong target (S=6 > 5) should survive
    expect(testEngine.asPlayerTwo().getCardZone(strongTarget)).toBe("play");
  });

  it("uses the effective (modified) strength, not printed base strength", () => {
    // Three cards under → effective strength = 3 + 3 = 6
    const cardUnder = createMockCharacter({
      id: "card-under-b",
      name: "Card Under B",
      cost: 1,
      strength: 1,
      willpower: 1,
    });

    // Target with S=5: should be banished because 5 ≤ 6
    const target = createMockCharacter({
      id: "mid-target",
      name: "Mid Target",
      cost: 4,
      strength: 5,
      willpower: 10,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: banishSourceCard, cardsUnder: [cardUnder, cardUnder, cardUnder] }, target],
        deck: 1,
      },
      { deck: 1 },
    );

    // Banish the source
    expect(testEngine.asServer().manualSetDamage(banishSourceCard, 10)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(banishSourceCard)).toBe("discard");

    // Resolve the triggered banish-all
    testEngine.asPlayerOne().resolveAllBagEffects({ maxIterations: 10 });

    // Target with S=5 should be banished (5 ≤ 6)
    expect(testEngine.asPlayerOne().getCardZone(target)).toBe("discard");
  });

  it("captures strengthBeforeBanish in challenge-banish events (defender path)", () => {
    // Two cards under the source → effective strength = 3 + 2 = 5
    const cardUnder1 = createMockCharacter({
      id: "cu-chal-1",
      name: "Card Under Challenge 1",
      cost: 2,
      strength: 1,
      willpower: 1,
    });
    const cardUnder2 = createMockCharacter({
      id: "cu-chal-2",
      name: "Card Under Challenge 2",
      cost: 2,
      strength: 1,
      willpower: 1,
    });

    // An attacker that can deal enough damage to banish the source (W=4)
    const attacker = createMockCharacter({
      id: "test-challenger",
      name: "Test Challenger",
      cost: 6,
      strength: 6,
      willpower: 6,
      lore: 1,
    });

    // Targets: S=5 should be banished (5 ≤ 5), S=6 should survive (6 > 5)
    const weakTarget = createMockCharacter({
      id: "weak-chal-target",
      name: "Weak Challenge Target",
      cost: 3,
      strength: 5,
      willpower: 10,
    });
    const strongTarget = createMockCharacter({
      id: "strong-chal-target",
      name: "Strong Challenge Target",
      cost: 5,
      strength: 6,
      willpower: 10,
    });

    // Source card is player 2's defender with cards under (exerted for challenge)
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [weakTarget, attacker],
        deck: 1,
      },
      {
        play: [
          { card: banishSourceCard, cardsUnder: [cardUnder1, cardUnder2], exerted: true },
          strongTarget,
        ],
        deck: 1,
      },
    );

    // Player 1 challenges player 2's source card (the defender)
    // The attacker (S=6) deals 6 damage to the defender (W=4) → defender banished
    expect(testEngine.asPlayerOne().challenge(attacker, banishSourceCard)).toBeSuccessfulCommand();

    // Resolve all bag effects (the defender's "when banished" trigger fires)
    testEngine.asPlayerOne().resolveAllBagEffects({ maxIterations: 10 });
    testEngine.asPlayerTwo().resolveAllBagEffects({ maxIterations: 10 });

    // The source (defender) should be in discard
    expect(testEngine.asPlayerTwo().getCardZone(banishSourceCard)).toBe("discard");

    // Weak target (S=5 ≤ 5) should be banished by the triggered ability
    expect(testEngine.asPlayerOne().getCardZone(weakTarget)).toBe("discard");

    // Strong target (S=6 > 5) should survive
    expect(testEngine.asPlayerTwo().getCardZone(strongTarget)).toBe("play");
  });

  it("banishes zero characters when no characters have strength ≤ source's pre-banish strength", () => {
    const cardUnder = createMockCharacter({
      id: "card-under-c",
      name: "Card Under C",
      cost: 1,
      strength: 1,
      willpower: 1,
    });

    // Target with S=10: should survive because 10 > 4
    const toughTarget = createMockCharacter({
      id: "tough-target",
      name: "Tough Target",
      cost: 8,
      strength: 10,
      willpower: 10,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: banishSourceCard, cardsUnder: [cardUnder] }, toughTarget],
        deck: 1,
      },
      { deck: 1 },
    );

    // Banish the source (effective strength = 3 + 1 = 4)
    expect(testEngine.asServer().manualSetDamage(banishSourceCard, 10)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(banishSourceCard)).toBe("discard");

    testEngine.asPlayerOne().resolveAllBagEffects({ maxIterations: 10 });

    // Tough target (S=10 > 4) should survive
    expect(testEngine.asPlayerOne().getCardZone(toughTarget)).toBe("play");
  });
});
