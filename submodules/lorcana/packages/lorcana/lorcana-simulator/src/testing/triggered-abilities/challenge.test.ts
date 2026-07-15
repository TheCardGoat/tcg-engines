import { describe, expect, it } from "bun:test";
import type { CommandFailure } from "@tcg/lorcana-engine";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { princePhillipSwordsmanOfTheRealm } from "@tcg/lorcana-cards/cards/005";

const damagedDefender = createMockCharacter({
  id: "challenge-trigger-damaged",
  name: "Damaged Defender",
  cost: 3,
  strength: 2,
  willpower: 6,
  lore: 1,
});

const undamagedDefender = createMockCharacter({
  id: "challenge-trigger-undamaged",
  name: "Undamaged Defender",
  cost: 3,
  strength: 2,
  willpower: 6,
  lore: 1,
});

describe("PRESSING THE ADVANTAGE - Prince Phillip, Swordsman of the Realm - Whenever he challenges a damaged character, ready this character after the challenge.", () => {
  it("should trigger and ready when this character challenges a damaged character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: princePhillipSwordsmanOfTheRealm, isDrying: false }],
      },
      {
        play: [{ card: damagedDefender, exerted: true, damage: 1 }],
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(princePhillipSwordsmanOfTheRealm, damagedDefender),
    ).toBeSuccessfulCommand();

    // Phillip exerts to challenge, but trigger readies him after
    // Check if there's a bag to resolve first
    testEngine.asPlayerOne().resolveAllBagEffects({ maxIterations: 10 });
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

    // Phillip should be readied by the trigger
    expect(testEngine.asPlayerOne().isExerted(princePhillipSwordsmanOfTheRealm)).toBe(false);
  });

  it("should NOT trigger when challenging an undamaged character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: princePhillipSwordsmanOfTheRealm, isDrying: false }],
      },
      {
        play: [{ card: undamagedDefender, exerted: true }],
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(princePhillipSwordsmanOfTheRealm, undamagedDefender),
    ).toBeSuccessfulCommand();

    // No bag from the trigger (defender not damaged)
    // Phillip should stay exerted
    expect(testEngine.asPlayerOne().isExerted(princePhillipSwordsmanOfTheRealm)).toBe(true);
  });

  it("should allow a second challenge in the same turn after being readied", () => {
    const secondDefender = createMockCharacter({
      id: "challenge-trigger-second",
      name: "Second Defender",
      cost: 2,
      strength: 1,
      willpower: 10,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: princePhillipSwordsmanOfTheRealm, isDrying: false }],
      },
      {
        play: [
          { card: damagedDefender, exerted: true, damage: 1 },
          { card: secondDefender, exerted: true, damage: 1 },
        ],
      },
    );

    // First challenge
    expect(
      testEngine.asPlayerOne().challenge(princePhillipSwordsmanOfTheRealm, damagedDefender),
    ).toBeSuccessfulCommand();

    // Resolve trigger to ready Phillip
    testEngine.asPlayerOne().resolveAllBagEffects({ maxIterations: 10 });
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

    // Phillip is ready again; challenge a second time
    expect(
      testEngine.asPlayerOne().challenge(princePhillipSwordsmanOfTheRealm, secondDefender),
    ).toBeSuccessfulCommand();

    // Second challenge also against a damaged character => trigger fires again
    testEngine.asPlayerOne().resolveAllBagEffects({ maxIterations: 10 });
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().isExerted(princePhillipSwordsmanOfTheRealm)).toBe(false);
  });
});
