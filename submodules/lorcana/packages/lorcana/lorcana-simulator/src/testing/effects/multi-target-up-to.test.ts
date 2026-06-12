import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { theMobSong } from "@tcg/lorcana-cards/cards/004";

import { snapshotPendingPrompt } from "../ui-state/prompt-snapshot.js";

// The Mob Song: "Deal 3 damage to up to 3 chosen characters and/or locations."
// Defined with `count: { upTo: 3 }` which yields `minSelections = 0, maxSelections = 3`.
//
// BUG-1 (FUTURE): The engine currently resolves the effect with whatever targets are submitted
// in a single `resolveEffect` call — if 1 target is submitted for an upTo:3 effect, it resolves
// with that 1 target without offering a second or third pick.
//
// A future incremental multi-step target selection UX (where the picker stays open after each
// target is added until the player explicitly signals done) would require additional engine
// support. For now, the engine's behavior is: submit N targets → resolve with N targets.
// Submitting all targets in one call (e.g. playCard with { targets: [a, b, c] }) works correctly.

const oppCharA = createMockCharacter({
  id: "mob-song-opp-a",
  name: "Gaston",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 2,
});

const oppCharB = createMockCharacter({
  id: "mob-song-opp-b",
  name: "Villager",
  cost: 2,
  strength: 2,
  willpower: 5,
  lore: 1,
});

const oppCharC = createMockCharacter({
  id: "mob-song-opp-c",
  name: "Mob Member",
  cost: 1,
  strength: 1,
  willpower: 5,
  lore: 1,
});

describe("The Mob Song | count: { upTo: 3 } | multi-target selection", () => {
  it("opens a prompt with maxSelections === 3 after playing the card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [theMobSong],
        inkwell: theMobSong.cost,
      },
      {
        play: [oppCharA, oppCharB, oppCharC],
      },
    );

    expect(testEngine.asPlayerOne().playCard(theMobSong)).toBeSuccessfulCommand();

    const snapshot = snapshotPendingPrompt(testEngine, { playerId: PLAYER_ONE });

    expect(snapshot).not.toBeNull();
    expect(snapshot?.kind).toBe("target-selection");
    expect(snapshot?.maxSelections).toBe(3);
  });

  it("applies damage to all 3 targets when all 3 are submitted together", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [theMobSong],
        inkwell: theMobSong.cost,
      },
      {
        play: [oppCharA, oppCharB, oppCharC],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(theMobSong, {
        targets: [oppCharA, oppCharB, oppCharC],
      }),
    ).toBeSuccessfulCommand();

    // All three have willpower 5, damage 3 < 5 so they stay in play
    expect(testEngine.asPlayerTwo().getDamage(oppCharA)).toBe(3);
    expect(testEngine.asPlayerTwo().getDamage(oppCharB)).toBe(3);
    expect(testEngine.asPlayerTwo().getDamage(oppCharC)).toBe(3);
  });

  it("resolves with fewer targets when player submits less than maxSelections", () => {
    // Current engine behavior: submitting N targets for an upTo:N effect resolves with
    // those N targets immediately. Incremental multi-step selection is not yet supported
    // at the engine level — submit all intended targets in a single call.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [theMobSong],
        inkwell: theMobSong.cost,
      },
      {
        play: [oppCharA, oppCharB, oppCharC],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(theMobSong, {
        targets: [oppCharA],
      }),
    ).toBeSuccessfulCommand();

    // Only oppCharA receives damage; the others are unaffected.
    expect(testEngine.asPlayerTwo().getDamage(oppCharA)).toBe(3);
    expect(testEngine.asPlayerTwo().getDamage(oppCharB)).toBe(0);
    expect(testEngine.asPlayerTwo().getDamage(oppCharC)).toBe(0);
  });
});
