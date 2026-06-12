import { describe, expect, it } from "bun:test";
import type { CommandFailure } from "@tcg/lorcana-engine";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import {
  fireTheCannons,
  grabYourSword,
  stampede,
  stitchNewDog,
} from "@tcg/lorcana-cards/cards/001";

const toughCharacter = createMockCharacter({
  id: "deal-damage-tough",
  name: "Tough Character",
  cost: 3,
  strength: 2,
  willpower: 5,
});

const fragileCharacter = createMockCharacter({
  id: "deal-damage-fragile",
  name: "Fragile Character",
  cost: 1,
  strength: 1,
  willpower: 2,
});

const anotherFragile = createMockCharacter({
  id: "deal-damage-another-fragile",
  name: "Another Fragile",
  cost: 1,
  strength: 1,
  willpower: 1,
});

describe("Deal Damage - Fire the Cannons! - Deal 2 damage to chosen character.", () => {
  it("should add the specified amount of damage to the chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [fireTheCannons],
        inkwell: fireTheCannons.cost,
      },
      {
        play: [toughCharacter],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(fireTheCannons, {
        targets: [toughCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getDamage(toughCharacter)).toBe(2);
    expect(testEngine.asPlayerTwo().getCardZone(toughCharacter)).toBe("play");
  });

  it("should banish a character when total damage >= willpower", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [fireTheCannons],
        inkwell: fireTheCannons.cost,
      },
      {
        play: [fragileCharacter],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(fireTheCannons, {
        targets: [fragileCharacter],
      }),
    ).toBeSuccessfulCommand();

    // 2 damage >= 2 willpower => banished
    expect(testEngine.asPlayerTwo().getCardZone(fragileCharacter)).toBe("discard");
  });

  it("should banish a character when damage on top of existing damage >= willpower", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [fireTheCannons],
        inkwell: fireTheCannons.cost,
      },
      {
        play: [{ card: toughCharacter, damage: 3 }],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(fireTheCannons, {
        targets: [toughCharacter],
      }),
    ).toBeSuccessfulCommand();

    // 3 existing + 2 new = 5 >= 5 willpower => banished
    expect(testEngine.asPlayerTwo().getCardZone(toughCharacter)).toBe("discard");
  });

  it("can target your own characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [fireTheCannons],
      inkwell: fireTheCannons.cost,
      play: [toughCharacter],
    });

    expect(
      testEngine.asPlayerOne().playCard(fireTheCannons, {
        targets: [toughCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(toughCharacter)).toBe(2);
  });
});

describe("Deal Damage - Stampede - Deal 2 damage to chosen damaged character.", () => {
  it("can only target a character that already has damage", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [stampede],
        inkwell: stampede.cost,
      },
      {
        play: [toughCharacter],
      },
    );

    // Target has no damage, should fail
    const result = testEngine.asPlayerOne().playCard(stampede, {
      targets: [toughCharacter],
    }) as CommandFailure;

    expect(result.success).toBe(false);
  });

  it("can target a character that already has damage", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [stampede],
        inkwell: stampede.cost,
      },
      {
        play: [{ card: toughCharacter, damage: 1 }],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(stampede, {
        targets: [toughCharacter],
      }),
    ).toBeSuccessfulCommand();

    // 1 existing + 2 new = 3
    expect(testEngine.asPlayerTwo().getDamage(toughCharacter)).toBe(3);
  });
});

describe("Deal Damage - Grab Your Sword - Deal 2 damage to each opposing character.", () => {
  it("deals damage to all opposing characters independently", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [grabYourSword],
        inkwell: grabYourSword.cost,
        play: [{ card: stitchNewDog, isDrying: false }],
      },
      {
        play: [toughCharacter, fragileCharacter],
      },
    );

    // Grab Your Sword is a song, sing it with Stitch (cost 2, Singer prerequisite met)
    expect(testEngine.asPlayerOne().playCard(grabYourSword)).toBeSuccessfulCommand();

    // Both opposing characters should take 2 damage
    expect(testEngine.asPlayerTwo().getDamage(toughCharacter)).toBe(2);
    // fragileCharacter has 2 willpower, 2 damage => banished
    expect(testEngine.asPlayerTwo().getCardZone(fragileCharacter)).toBe("discard");
    // toughCharacter survives (5 willpower - 2 damage)
    expect(testEngine.asPlayerTwo().getCardZone(toughCharacter)).toBe("play");
  });

  it("does not damage your own characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [grabYourSword],
        inkwell: grabYourSword.cost,
        play: [{ card: stitchNewDog, isDrying: false }],
      },
      {
        play: [fragileCharacter],
      },
    );

    expect(testEngine.asPlayerOne().playCard(grabYourSword)).toBeSuccessfulCommand();

    // Own character should not be damaged
    expect(testEngine.asPlayerOne().getDamage(stitchNewDog)).toBe(0);
  });
});
