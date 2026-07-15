import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrumpeter } from "@tcg/lorcana-cards/cards/003";

import { snapshotPendingPrompt } from "./prompt-snapshot.js";

/**
 * BUG-6: Mickey Mouse Trumpeter SOUND THE CALL auto-plays wrong character.
 *
 * SOUND THE CALL: "{E}, 2 {I} — Play a character for free."
 * When activated with 2+ characters in hand, the engine should show a target-selection
 * prompt so the player can choose which character to play.
 *
 * Bug: buildPlayCardSelectionContext bails out for origin="pending-effect" (not "bag"),
 * so no selection context is built and the last character in hand gets auto-played.
 *
 * Fix: build the hand-picker selection context when eligibleCards.length > 0,
 * regardless of origin.
 */

const charA = createMockCharacter({
  id: "trumpeter-bug6-char-a",
  name: "Character Alpha",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const charB = createMockCharacter({
  id: "trumpeter-bug6-char-b",
  name: "Character Beta",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
});

describe("Mickey Mouse - Trumpeter | SOUND THE CALL | UI prompt", () => {
  it("opens a target-selection prompt when 2 characters are in hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        // Mickey must be dry (not drying) to activate
        play: [{ card: mickeyMouseTrumpeter, isDrying: false }],
        hand: [charA, charB],
        inkwell: mickeyMouseTrumpeter.cost + 2,
        deck: 2,
      },
      { deck: 2 },
    );

    // Activate SOUND THE CALL without specifying which card to play
    expect(testEngine.asPlayerOne().activateAbility(mickeyMouseTrumpeter)).toBeSuccessfulCommand();

    // The engine should now be waiting for the player to choose which character to play
    const snapshot = snapshotPendingPrompt(testEngine, { playerId: PLAYER_ONE });

    expect(snapshot).not.toBeNull();
    expect(snapshot?.kind).toBe("target-selection");
    expect(snapshot?.chooserId).toBe(PLAYER_ONE);

    // Both characters in hand should be candidates
    const charAId = testEngine.asPlayerOne().getCard(charA).id;
    const charBId = testEngine.asPlayerOne().getCard(charB).id;
    expect(snapshot?.cardCandidateIds).toContain(charAId);
    expect(snapshot?.cardCandidateIds).toContain(charBId);
  });

  it("does NOT auto-play a character when multiple characters are in hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: mickeyMouseTrumpeter, isDrying: false }],
        hand: [charA, charB],
        inkwell: mickeyMouseTrumpeter.cost + 2,
        deck: 2,
      },
      { deck: 2 },
    );

    expect(testEngine.asPlayerOne().activateAbility(mickeyMouseTrumpeter)).toBeSuccessfulCommand();

    // Neither character should have been auto-played to the play zone
    expect(testEngine.asPlayerOne().getCardZone(charA)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(charB)).toBe("hand");
  });

  it("still works when only 1 character in hand (no picker needed, auto-selects)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: mickeyMouseTrumpeter, isDrying: false }],
        hand: [charA],
        inkwell: mickeyMouseTrumpeter.cost + 2,
        deck: 2,
      },
      { deck: 2 },
    );

    // With only one eligible card, passing it directly should work
    expect(
      testEngine.asPlayerOne().activateAbility(mickeyMouseTrumpeter, {
        targets: [charA],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(charA)).toBe("play");
    expect(testEngine.asPlayerOne().isExerted(mickeyMouseTrumpeter)).toBe(true);
  });
});
