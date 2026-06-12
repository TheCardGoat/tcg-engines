import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { heroWork } from "./132-hero-work";

const heroAttacker = createMockCharacter({
  id: "hero-work-hero-attacker",
  name: "Hero Attacker",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
  classifications: ["Storyborn", "Hero"],
});

const nonHeroAttacker = createMockCharacter({
  id: "hero-work-non-hero-attacker",
  name: "Non-Hero Ally",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
  classifications: ["Storyborn", "Villain"],
});

const defender = createMockCharacter({
  id: "hero-work-defender",
  name: "Defender",
  cost: 2,
  strength: 2,
  willpower: 5,
  lore: 1,
});

describe("Hero Work", () => {
  it("gives your characters +1 strength this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [heroWork],
        inkwell: heroWork.cost,
        play: [heroAttacker, nonHeroAttacker],
      },
      {},
    );

    const heroBase = testEngine.asPlayerOne().getCardStrength(heroAttacker);
    const nonHeroBase = testEngine.asPlayerOne().getCardStrength(nonHeroAttacker);

    expect(testEngine.asPlayerOne().playCard(heroWork)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(heroAttacker)).toBe(heroBase + 1);
    expect(testEngine.asPlayerOne().getCardStrength(nonHeroAttacker)).toBe(nonHeroBase + 1);
  });

  it("grants your Hero characters a whenever-challenge lore-swing this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [heroWork],
        inkwell: heroWork.cost,
        play: [{ card: heroAttacker, isDrying: false }],
      },
      {
        play: [{ card: defender, exerted: true }],
      },
      {
        startingLore: {
          player_one: 0,
          player_two: 3,
        },
      },
    );

    expect(testEngine.asPlayerOne().playCard(heroWork)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().hasTemporaryAbility(heroAttacker, "hero-work-challenge-lore-swing"),
    ).toBe(true);

    expect(testEngine.asPlayerOne().challenge(heroAttacker, defender)).toBeSuccessfulCommand();

    // The lore-swing trigger is deterministic and is auto-resolved by the
    // engine's bag drain, so by the time challenge returns, lore has already
    // been updated.
    expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
    expect(testEngine.getLore(PLAYER_TWO)).toBe(2);
  });

  it("does NOT grant the triggered ability to your non-Hero characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [heroWork],
        inkwell: heroWork.cost,
        play: [{ card: nonHeroAttacker, isDrying: false }],
      },
      {
        play: [{ card: defender, exerted: true }],
      },
      {
        startingLore: {
          player_one: 0,
          player_two: 3,
        },
      },
    );

    expect(testEngine.asPlayerOne().playCard(heroWork)).toBeSuccessfulCommand();

    expect(
      testEngine
        .asPlayerOne()
        .hasTemporaryAbility(nonHeroAttacker, "hero-work-challenge-lore-swing"),
    ).toBe(false);

    expect(testEngine.asPlayerOne().challenge(nonHeroAttacker, defender)).toBeSuccessfulCommand();

    // No lore-swing should fire for the non-Hero attacker.
    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
    expect(testEngine.getLore(PLAYER_TWO)).toBe(3);
  });
});
