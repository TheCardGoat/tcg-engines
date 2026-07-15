import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { beagleBoysSmalltimeCrooks } from "./132-beagle-boys-small-time-crooks";

const targetCharacter = createMockCharacter({
  id: "beagle-target",
  name: "Target Character",
  strength: 2,
  willpower: 3,
  cost: 2,
});

const opponentCharacter = createMockCharacter({
  id: "beagle-opponent-target",
  name: "Opponent Character",
  strength: 2,
  willpower: 3,
  cost: 2,
});

describe("Beagle Boys - Small-Time Crooks", () => {
  it("HURRY IT UP! - grants Rush and Resist +1 to chosen character of yours when questing", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: beagleBoysSmalltimeCrooks, isDrying: false }, targetCharacter],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().quest(beagleBoysSmalltimeCrooks)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

    const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(beagleBoysSmalltimeCrooks, {
        targets: [targetCharacter],
      }),
    ).toBeSuccessfulCommand();

    // Target should have Rush and Resist +1
    expect(testEngine.hasKeyword(targetCharacter, "Rush")).toBe(true);
    expect(testEngine.getKeywordValue(targetCharacter, "Resist")).toBe(1);
  });

  it("HURRY IT UP! - Rush allows the target to challenge the turn it was played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: beagleBoysSmalltimeCrooks, isDrying: false }],
        hand: [targetCharacter],
        inkwell: targetCharacter.cost,
        deck: 2,
      },
      {
        play: [{ card: opponentCharacter, isDrying: false, exerted: true }],
        deck: 2,
      },
    );

    // Play target character (it's drying)
    expect(testEngine.asPlayerOne().playCard(targetCharacter)).toBeSuccessfulCommand();

    // Quest with beagle boys to grant Rush
    expect(testEngine.asPlayerOne().quest(beagleBoysSmalltimeCrooks)).toBeSuccessfulCommand();

    const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(beagleBoysSmalltimeCrooks, {
        targets: [targetCharacter],
      }),
    ).toBeSuccessfulCommand();

    // Target should now be able to challenge despite being played this turn
    expect(testEngine.hasKeyword(targetCharacter, "Rush")).toBe(true);
    expect(
      testEngine.asPlayerOne().challenge(targetCharacter, opponentCharacter),
    ).toBeSuccessfulCommand();
  });

  it("HURRY IT UP! - Resist +1 reduces damage dealt to the target", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: beagleBoysSmalltimeCrooks, isDrying: false },
          { card: targetCharacter, isDrying: false },
        ],
        deck: 2,
      },
      {
        play: [{ card: opponentCharacter, isDrying: false, exerted: true }],
        deck: 2,
      },
    );

    // Quest with beagle boys to grant Resist +1
    expect(testEngine.asPlayerOne().quest(beagleBoysSmalltimeCrooks)).toBeSuccessfulCommand();

    const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(beagleBoysSmalltimeCrooks, {
        targets: [targetCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getKeywordValue(targetCharacter, "Resist")).toBe(1);

    // Challenge with target - opponent has 2 strength, but Resist reduces by 1
    expect(
      testEngine.asPlayerOne().challenge(targetCharacter, opponentCharacter),
    ).toBeSuccessfulCommand();

    // Target should have taken 2 - 1 = 1 damage
    expect(testEngine.asPlayerOne().getDamage(targetCharacter)).toBe(1);
  });

  it("HURRY IT UP! - effects expire at end of turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: beagleBoysSmalltimeCrooks, isDrying: false }, targetCharacter],
      deck: 5,
    });

    expect(testEngine.asPlayerOne().quest(beagleBoysSmalltimeCrooks)).toBeSuccessfulCommand();

    const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(beagleBoysSmalltimeCrooks, {
        targets: [targetCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.hasKeyword(targetCharacter, "Rush")).toBe(true);
    expect(testEngine.getKeywordValue(targetCharacter, "Resist")).toBe(1);

    // Pass turn to opponent and back
    testEngine.asServer().passTurn();
    testEngine.asServer().passTurn();

    // Effects should be gone
    expect(testEngine.hasKeyword(targetCharacter, "Rush")).toBe(false);
    expect(testEngine.getKeywordValue(targetCharacter, "Resist")).toBe(null);
  });
});
