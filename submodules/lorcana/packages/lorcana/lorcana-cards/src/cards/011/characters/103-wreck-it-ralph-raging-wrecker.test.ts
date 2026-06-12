import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { wreckitRalphRagingWrecker } from "./103-wreck-it-ralph-raging-wrecker";

const weakCharacter = createMockCharacter({
  id: "weak-char",
  name: "Weak Character",
  strength: 1,
  willpower: 1,
  cost: 1,
});

const equalCharacter = createMockCharacter({
  id: "equal-char",
  name: "Equal Character",
  strength: 3,
  willpower: 3,
  cost: 3,
});

const strongCharacter = createMockCharacter({
  id: "strong-char",
  name: "Strong Character",
  strength: 5,
  willpower: 5,
  cost: 5,
});

const wardCharacter = createMockCharacter({
  id: "ward-char",
  name: "Ward Character",
  strength: 4,
  willpower: 4,
  cost: 4,
  abilities: [
    {
      type: "keyword",
      keyword: "Ward",
    },
  ],
});

describe("Wreck-it Ralph - Raging Wrecker", () => {
  it("should get +1 strength for each card under him", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [wreckitRalphRagingWrecker],
      deck: 5,
      inkwell: 10,
    });

    const ralph = testEngine.asPlayerOne().getCard(wreckitRalphRagingWrecker);
    expect(ralph.strength).toBe(3);

    // Use Boost ability
    expect(
      testEngine.asPlayerOne().activateAbility(wreckitRalphRagingWrecker, { ability: "Boost" }),
    ).toBeSuccessfulCommand();

    const ralphAfter = testEngine.asPlayerOne().getCard(wreckitRalphRagingWrecker);
    expect(ralphAfter.strength).toBe(4);
  });

  it("should banish characters with strength <= Ralph's strength when banished", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [wreckitRalphRagingWrecker],
      },
      {
        play: [weakCharacter, equalCharacter, strongCharacter],
      },
    );

    // Banish Ralph via lethal damage to trigger banish event
    testEngine.asServer().manualSetDamage(wreckitRalphRagingWrecker, 4);

    // Verify effects
    expect(testEngine.asPlayerTwo().getCardZone(weakCharacter)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(equalCharacter)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(strongCharacter)).toBe("play");
  });

  it("should banish based on boosted strength and bypass Ward", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [wreckitRalphRagingWrecker],
        deck: 5,
        inkwell: 10,
      },
      {
        play: [wardCharacter], // Strength 4
      },
    );

    // Boost twice to get +2 strength (total 5)
    testEngine.asPlayerOne().activateAbility(wreckitRalphRagingWrecker, { ability: "Boost" });
    testEngine.asPlayerOne().passTurn(); // P1 -> P2
    testEngine.asPlayerTwo().passTurn(); // P2 -> P1
    testEngine.asPlayerOne().activateAbility(wreckitRalphRagingWrecker, { ability: "Boost" });

    const ralph = testEngine.asPlayerOne().getCard(wreckitRalphRagingWrecker);
    expect(ralph.strength).toBe(5);

    testEngine.asServer().manualSetDamage(wreckitRalphRagingWrecker, 4);

    // Ward character (4 strength) should be banished because 4 <= 5
    // And "banish all" ignores Ward
    expect(testEngine.asPlayerTwo().getCardZone(wardCharacter)).toBe("discard");
  });

  it("regression: should consider effective strength including Support bonuses when determining which characters to banish", () => {
    // Bug: WHO'S COMIN' WITH ME? was not considering effective strength
    // (including Support bonuses) when determining which characters to banish.
    // If Ralph has boosted strength, the banish threshold should use his effective strength.
    const supportCharacter = createMockCharacter({
      id: "ralph-support-char",
      name: "Support Character",
      cost: 2,
      strength: 2,
      willpower: 2,
      abilities: [
        {
          type: "keyword",
          keyword: "Support",
        },
      ],
    });

    const targetChar = createMockCharacter({
      id: "ralph-target-char",
      name: "Target Character",
      strength: 4,
      willpower: 4,
      cost: 4,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [wreckitRalphRagingWrecker, supportCharacter],
        deck: 5,
        inkwell: 10,
      },
      {
        play: [targetChar], // Strength 4
      },
    );

    // Boost once to get Ralph to 4 strength
    testEngine.asPlayerOne().activateAbility(wreckitRalphRagingWrecker, { ability: "Boost" });

    const ralph = testEngine.asPlayerOne().getCard(wreckitRalphRagingWrecker);
    expect(ralph.strength).toBe(4);

    // Banish Ralph - should banish characters with strength <= 4
    testEngine.asServer().manualSetDamage(wreckitRalphRagingWrecker, 4);

    // Target character (4 strength) should be banished because 4 <= 4
    expect(testEngine.asPlayerTwo().getCardZone(targetChar)).toBe("discard");
  });
});
