import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { fireTheCannons, stitchNewDog } from "@tcg/lorcana-cards/cards/001";

const resistCharacter = createMockCharacter({
  id: "replacement-resist-char",
  name: "Resist Character",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
  abilities: [
    {
      id: "replacement-resist",
      type: "keyword",
      keyword: "Resist",
      value: 1,
      text: "Resist +1",
    },
  ],
});

const highResistCharacter = createMockCharacter({
  id: "replacement-high-resist-char",
  name: "High Resist Character",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 1,
  abilities: [
    {
      id: "replacement-high-resist",
      type: "keyword",
      keyword: "Resist",
      value: 3,
      text: "Resist +3",
    },
  ],
});

describe("Replacement Effects - Resist reduces damage dealt", () => {
  it("should reduce damage dealt by Resist value (action damage)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [fireTheCannons],
        inkwell: fireTheCannons.cost,
      },
      {
        play: [resistCharacter],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(fireTheCannons, {
        targets: [resistCharacter],
      }),
    ).toBeSuccessfulCommand();

    // Fire the Cannons deals 2, Resist +1 reduces to 1
    expect(testEngine.asPlayerTwo().getDamage(resistCharacter)).toBe(1);
  });

  it("should reduce challenge damage by Resist value", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: stitchNewDog, isDrying: false }],
      },
      {
        play: [{ card: resistCharacter, exerted: true }],
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(stitchNewDog, resistCharacter),
    ).toBeSuccessfulCommand();

    // Stitch has 2 strength, Resist +1 reduces to 1 damage
    expect(testEngine.asPlayerTwo().getDamage(resistCharacter)).toBe(stitchNewDog.strength - 1);
  });

  it("should not reduce damage below 0 (high Resist vs low damage)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [fireTheCannons],
        inkwell: fireTheCannons.cost,
      },
      {
        play: [highResistCharacter],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(fireTheCannons, {
        targets: [highResistCharacter],
      }),
    ).toBeSuccessfulCommand();

    // Fire the Cannons deals 2, Resist +3 would reduce to -1, but minimum is 0
    expect(testEngine.asPlayerTwo().getDamage(highResistCharacter)).toBe(0);
  });

  it("should apply Resist to each damage instance independently", () => {
    // When two separate damage sources hit the same character,
    // Resist applies to each one separately
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [fireTheCannons],
        inkwell: fireTheCannons.cost,
        play: [{ card: stitchNewDog, isDrying: false }],
      },
      {
        play: [{ card: resistCharacter, exerted: true }],
      },
    );

    // First: challenge (Stitch 2 str - 1 Resist = 1 damage)
    expect(
      testEngine.asPlayerOne().challenge(stitchNewDog, resistCharacter),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getDamage(resistCharacter)).toBe(1);

    // Second: Fire the Cannons (2 - 1 Resist = 1 more damage)
    expect(
      testEngine.asPlayerOne().playCard(fireTheCannons, {
        targets: [resistCharacter],
      }),
    ).toBeSuccessfulCommand();

    // Total should be 2 (1 from challenge + 1 from action)
    expect(testEngine.asPlayerTwo().getDamage(resistCharacter)).toBe(2);
  });
});
