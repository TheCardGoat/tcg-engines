import { describe, expect, it } from "bun:test";
import type { CommandFailure } from "@tcg/lorcana-engine";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { threeArrows } from "@tcg/lorcana-cards/cards/012";

// Three Arrows (set 012 #197):
// "Deal 2 damage to chosen character. Then, you may deal 1 damage to
//  another chosen character."
//
// Effect structure:
//   sequence {
//     step 1: deal-damage(2) to chosen character          ← mandatory
//     step 2: optional { deal-damage(1) to another chosen character }
//   }
//
// requireDifferentTargets: true on step 2 means the player CANNOT select
// the same character that was targeted in step 1.

const targetCharacterA = createMockCharacter({
  id: "three-arrows-target-a",
  name: "Target Character A",
  cost: 3,
  strength: 2,
  willpower: 10,
  lore: 1,
});

const targetCharacterB = createMockCharacter({
  id: "three-arrows-target-b",
  name: "Target Character B",
  cost: 3,
  strength: 2,
  willpower: 10,
  lore: 1,
});

describe("THREE ARROWS - Deal 2 damage to chosen character. Then, you may deal 1 damage to another chosen character.", () => {
  it("deals 2 damage to the chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [threeArrows],
        inkwell: threeArrows.cost,
      },
      {
        play: [targetCharacterA],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(threeArrows, {
        targets: [targetCharacterA],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getDamage(targetCharacterA)).toBe(2);
  });

  it("with 2+ characters in play, can target different characters for each shot", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [threeArrows],
        inkwell: threeArrows.cost,
      },
      {
        play: [targetCharacterA, targetCharacterB],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(threeArrows, {
        targets: [targetCharacterA],
      }),
    ).toBeSuccessfulCommand();

    // Step 1 should have dealt 2 damage to character A
    expect(testEngine.asPlayerTwo().getDamage(targetCharacterA)).toBe(2);

    // Optional second shot pending: accept and target character B
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(threeArrows, {
        resolveOptional: true,
        targets: [targetCharacterB],
      }),
    ).toBeSuccessfulCommand();

    // Step 2 should have dealt 1 damage to character B
    expect(testEngine.asPlayerTwo().getDamage(targetCharacterB)).toBe(1);
    // Character A should only have the 2 damage from step 1
    expect(testEngine.asPlayerTwo().getDamage(targetCharacterA)).toBe(2);
  });

  it("with only 1 character in play, the optional second shot auto-declines (no valid 'another' target)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [threeArrows],
        inkwell: threeArrows.cost,
      },
      {
        play: [targetCharacterA],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(threeArrows, {
        targets: [targetCharacterA],
      }),
    ).toBeSuccessfulCommand();

    // No pending effect should remain: the optional auto-declined because
    // the only character is the one already targeted in step 1.
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

    // Character A only took 2 damage (from step 1), not an additional 1
    expect(testEngine.asPlayerTwo().getDamage(targetCharacterA)).toBe(2);
  });

  it("submitting the SAME character for both shots is rejected", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [threeArrows],
        inkwell: threeArrows.cost,
      },
      {
        play: [targetCharacterA, targetCharacterB],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(threeArrows, {
        targets: [targetCharacterA],
      }),
    ).toBeSuccessfulCommand();

    // Step 1 dealt 2 damage to A
    expect(testEngine.asPlayerTwo().getDamage(targetCharacterA)).toBe(2);

    // Attempting to target character A again (already targeted in step 1) should fail
    const result = testEngine.asPlayerOne().resolvePendingByCard(threeArrows, {
      resolveOptional: true,
      targets: [targetCharacterA],
    }) as CommandFailure;

    expect(result.success).toBe(false);

    // Character A should still have exactly 2 damage (no additional shot applied)
    expect(testEngine.asPlayerTwo().getDamage(targetCharacterA)).toBe(2);
  });

  it("allows declining the optional second shot", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [threeArrows],
        inkwell: threeArrows.cost,
      },
      {
        play: [targetCharacterA, targetCharacterB],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(threeArrows, {
        targets: [targetCharacterA],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);

    // Decline the optional
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(threeArrows, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    // No additional damage dealt — character B is untouched
    expect(testEngine.asPlayerTwo().getDamage(targetCharacterB)).toBe(0);
    expect(testEngine.asPlayerTwo().getDamage(targetCharacterA)).toBe(2);
  });
});
