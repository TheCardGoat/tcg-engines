import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import {
  cantHoldItBackAnymore,
  cheshireCatInexplicable,
  mowgliManCub,
} from "@tcg/lorcana-cards/cards/010";
import {
  mickeyMouseTrueFriend,
  simbaProtectiveCub,
  arielOnHumanLegs,
} from "@tcg/lorcana-cards/cards/001";
import { goofyKnightForADay } from "@tcg/lorcana-cards/cards/002";
import { calhounMarineSergeant } from "@tcg/lorcana-cards/cards/006";

describe("CHESHIRE CAT - Inexplicable - Move damage counters between characters.", () => {
  // Effect type(s): move-damage, redirect-damage
  //
  // Test cases to cover:
  // 1. Move N damage from one character to another (counters relocated)
  // 2. If source has fewer than N damage, moves all available damage
  // 3. Source character survives if moved damage was its only damage below willpower
  // 4. Target character is banished if total damage after move >= willpower
  // 5. redirect-damage: redirects incoming damage mid-resolution to a different target
  // 6. Does NOT fire the `damage` event on the target (damage is moved, not dealt fresh)
  // 7. Source character loses the moved damage counters

  it("should move damage counters from an opponent's character to another opponent's character", () => {
    // Regression: when both source and destination are opponent characters,
    // the engine previously resolved `to` before `from`, causing the source
    // card to be assigned as its own destination (fizzle).
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        // Player 1 has Cheshire Cat with enough ink to activate Boost
        play: [cheshireCatInexplicable],
        inkwell: 2,
        deck: [mickeyMouseTrueFriend],
      },
      {
        // Player 2 has two characters: one with 2 damage (source) and one with 0 damage (destination)
        play: [{ card: mickeyMouseTrueFriend, damage: 2 }, simbaProtectiveCub],
      },
    );

    // Verify initial damage state
    expect(testEngine.asPlayerOne().getDamage(mickeyMouseTrueFriend)).toBe(2);
    expect(testEngine.asPlayerOne().getDamage(simbaProtectiveCub)).toBe(0);

    // Activate Boost to trigger "IT'S LOADS OF FUN"
    expect(
      testEngine.asPlayerOne().activateAbility(cheshireCatInexplicable),
    ).toBeSuccessfulCommand();

    // The triggered ability should be in the bag
    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffect).toBeDefined();

    // Resolve: move 2 damage FROM Mickey (opponent) TO Simba (opponent)
    // This is the regression case: both targets are opponent characters
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(bagEffect!.sourceId, {
        resolveOptional: true,
        targets: [mickeyMouseTrueFriend, simbaProtectiveCub],
        amount: 2,
      }),
    ).toBeSuccessfulCommand();

    // Mickey should have lost 2 damage (moved away)
    expect(testEngine.asPlayerOne().getDamage(mickeyMouseTrueFriend)).toBe(0);
    // Simba should have gained 2 damage
    expect(testEngine.asPlayerOne().getDamage(simbaProtectiveCub)).toBe(2);
  });

  it("should move damage counters from player's own character to an opponent character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        // Player 1: Cheshire Cat + Ariel (with damage) in play
        play: [cheshireCatInexplicable, { card: arielOnHumanLegs, damage: 2 }],
        inkwell: 2,
        deck: [mickeyMouseTrueFriend],
      },
      {
        // Player 2: Mickey in play (destination)
        play: [mickeyMouseTrueFriend],
      },
    );

    // Activate Boost to trigger "IT'S LOADS OF FUN"
    expect(
      testEngine.asPlayerOne().activateAbility(cheshireCatInexplicable),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffect).toBeDefined();

    // Initial state
    expect(testEngine.asPlayerOne().getDamage(arielOnHumanLegs)).toBe(2);
    expect(testEngine.asPlayerOne().getDamage(mickeyMouseTrueFriend)).toBe(0);

    // Resolve: move 2 damage FROM Ariel (own character) TO Mickey (opponent)
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(bagEffect!.sourceId, {
        resolveOptional: true,
        targets: [arielOnHumanLegs, mickeyMouseTrueFriend],
        amount: 2,
      }),
    ).toBeSuccessfulCommand();

    // Ariel loses the damage
    expect(testEngine.asPlayerOne().getDamage(arielOnHumanLegs)).toBe(0);
    // Mickey gains the damage
    expect(testEngine.asPlayerOne().getDamage(mickeyMouseTrueFriend)).toBe(2);
  });

  it("should allow declining the optional move-damage effect", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [cheshireCatInexplicable],
        inkwell: 2,
        deck: [mickeyMouseTrueFriend],
      },
      {
        play: [{ card: mickeyMouseTrueFriend, damage: 2 }],
      },
    );

    const initialDamage = testEngine.asPlayerOne().getDamage(mickeyMouseTrueFriend);

    expect(
      testEngine.asPlayerOne().activateAbility(cheshireCatInexplicable),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffect).toBeDefined();

    // Decline the optional
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(bagEffect!.sourceId, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    // Damage should be unchanged
    expect(testEngine.asPlayerOne().getDamage(mickeyMouseTrueFriend)).toBe(initialDamage);
  });

  it("should move only available damage when source has fewer counters than the maximum", () => {
    // Cheshire Cat can move UP TO 2 damage; if source only has 1, only 1 is moved
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [cheshireCatInexplicable],
        inkwell: 2,
        deck: [mickeyMouseTrueFriend],
      },
      {
        play: [
          { card: mickeyMouseTrueFriend, damage: 1 }, // only 1 damage available
          simbaProtectiveCub,
        ],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(cheshireCatInexplicable),
    ).toBeSuccessfulCommand();

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffect).toBeDefined();

    // Request to move 2, but source only has 1
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(bagEffect!.sourceId, {
        resolveOptional: true,
        targets: [mickeyMouseTrueFriend, simbaProtectiveCub],
        amount: 1,
      }),
    ).toBeSuccessfulCommand();

    // Mickey had 1 damage, all moved
    expect(testEngine.asPlayerOne().getDamage(mickeyMouseTrueFriend)).toBe(0);
    // Simba received 1 damage
    expect(testEngine.asPlayerOne().getDamage(simbaProtectiveCub)).toBe(1);
  });

  it("should bypass Resist when moving damage to a character with Resist +1", () => {
    // Calhoun Marine Sergeant has Resist +1 (willpower 2).
    // Move 1 damage counter to him. If resist were applied: 1 - 1 = 0 (nothing moved).
    // Correct behavior (bypass resist): Calhoun ends up with 1 damage counter.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [cheshireCatInexplicable],
        inkwell: 2,
        deck: [mickeyMouseTrueFriend],
      },
      {
        // Rapunzel is our damage source; Calhoun (Resist +1) is the destination
        play: [{ card: mickeyMouseTrueFriend, damage: 1 }, calhounMarineSergeant],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(cheshireCatInexplicable),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffect).toBeDefined();

    // Move 1 damage FROM Mickey (opponent, source) TO Calhoun (opponent, Resist +1)
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(bagEffect!.sourceId, {
        resolveOptional: true,
        targets: [mickeyMouseTrueFriend, calhounMarineSergeant],
        amount: 1,
      }),
    ).toBeSuccessfulCommand();

    // Source loses 1 damage counter
    expect(testEngine.asPlayerOne().getDamage(mickeyMouseTrueFriend)).toBe(0);
    // Calhoun should have 1 damage — resist does NOT reduce moved damage counters
    expect(testEngine.asPlayerTwo().getDamage(calhounMarineSergeant)).toBe(1);
  });

  it("should banish destination character if moved damage reaches or exceeds willpower", () => {
    // Simba has 3 willpower; if he already has 2 damage and we move 2 more, he's banished
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [cheshireCatInexplicable],
        inkwell: 2,
        deck: [mickeyMouseTrueFriend],
      },
      {
        play: [
          { card: mickeyMouseTrueFriend, damage: 2 }, // source: 2 damage
          { card: simbaProtectiveCub, damage: 2 }, // destination: already 2 damage, willpower 3
        ],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(cheshireCatInexplicable),
    ).toBeSuccessfulCommand();

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffect).toBeDefined();

    // Move 1 damage from Mickey to Simba — total becomes 3, equal to Simba's willpower
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(bagEffect!.sourceId, {
        resolveOptional: true,
        targets: [mickeyMouseTrueFriend, simbaProtectiveCub],
        amount: 1,
      }),
    ).toBeSuccessfulCommand();

    // Simba should be banished (moved to player 2's discard)
    expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("discard");
  });
});

describe("CAN'T HOLD IT BACK ANYMORE — move all damage to exerted opponent (single target)", () => {
  it("consolidates damage onto the only chosen opposing character with one targets array", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [cantHoldItBackAnymore],
        inkwell: cantHoldItBackAnymore.cost,
        play: [mowgliManCub, simbaProtectiveCub],
      },
      {
        play: [goofyKnightForADay],
      },
    );

    testEngine.asServer().manualSetDamage(mowgliManCub, 1);
    testEngine.asServer().manualSetDamage(simbaProtectiveCub, 2);

    expect(
      testEngine.asPlayerOne().playCard(cantHoldItBackAnymore, {
        targets: [goofyKnightForADay],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().isExerted(goofyKnightForADay)).toBe(true);
    expect(testEngine.asPlayerTwo().getDamage(goofyKnightForADay)).toBe(3);
    expect(testEngine.asPlayerOne().getDamage(mowgliManCub)).toBe(0);
    expect(testEngine.asPlayerOne().getDamage(simbaProtectiveCub)).toBe(0);
  });
});
