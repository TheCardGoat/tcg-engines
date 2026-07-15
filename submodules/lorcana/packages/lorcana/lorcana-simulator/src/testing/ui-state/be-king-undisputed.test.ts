import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { beKingUndisputed } from "@tcg/lorcana-cards/cards/004";

import { snapshotPendingPrompt } from "./prompt-snapshot.js";

// Be King Undisputed: "Each opponent chooses and banishes one of their characters."
// Defined at lorcana-cards/src/cards/004/actions/129-be-king-undisputed.ts with
// `chosenBy: "opponent"`, `target.owner: "opponent"`, `zones: ["play"]`,
// `cardTypes: ["character"]`.
//
// UI-level behaviour under test (parallel to Dinky - Has the Brains):
//  - When player_one plays the action, a target-selection prompt opens on
//    player_two's view.
//  - `chooserId` is player_two.
//  - `cardCandidateIds` enumerates ONLY player_two's characters in play.
//  - The controller's (player_one's) own characters must not appear.
//  - `effectType` is `"banish"` so `ResolutionTargetOverlay` renders (the overlay
//    requires a wired `SupportedResolutionTargetEffectType`; previously `banish`
//    was missing and the prompt fell through with `effectType: null`, leaving the
//    chooser unable to pick a target).

const opponentCharA = createMockCharacter({
  id: "bku-opp-a",
  name: "Rival Cub",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const opponentCharB = createMockCharacter({
  id: "bku-opp-b",
  name: "Rival Lion",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 2,
});

const controllerAlly = createMockCharacter({
  id: "bku-own-ally",
  name: "Controller Ally",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Be King Undisputed | UI prompt", () => {
  it("opens a target-selection prompt on the opponent's view after the action resolves", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [beKingUndisputed],
        inkwell: beKingUndisputed.cost,
        play: [{ card: controllerAlly, isDrying: false }],
      },
      {
        play: [opponentCharA, opponentCharB],
      },
    );

    expect(testEngine.asPlayerOne().playCard(beKingUndisputed)).toBeSuccessfulCommand();

    const snapshot = snapshotPendingPrompt(testEngine, { playerId: PLAYER_TWO });

    expect(snapshot).not.toBeNull();
    expect(snapshot?.kind).toBe("target-selection");
    expect(snapshot?.effectType).toBe("banish");
    // The opponent is the chooser; otherwise the UI renders on the wrong side
    // (bug-04 symptom).
    expect(snapshot?.chooserId).toBe(PLAYER_TWO);
    expect(snapshot?.minSelections).toBe(1);
    expect(snapshot?.maxSelections).toBe(1);

    const beKingId = testEngine.asPlayerOne().getCard(beKingUndisputed).id;
    expect(snapshot?.sourceCardId).toBe(beKingId);

    // The overlay is gated on `effectType && slots.length > 0` (see
    // resolution-target-overlay.ts:shouldUseResolutionTargetOverlay). Wiring
    // `banish` into the supported set unblocks Be King; assert the prompt
    // builds slots so the overlay actually renders.
    expect(snapshot?.prompt?.slots.map((slot) => slot.label)).toEqual(["Choose card to banish"]);
  });

  it("restricts candidate ids to the opponent's own characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [beKingUndisputed],
        inkwell: beKingUndisputed.cost,
        play: [{ card: controllerAlly, isDrying: false }],
      },
      {
        play: [opponentCharA, opponentCharB],
      },
    );

    expect(testEngine.asPlayerOne().playCard(beKingUndisputed)).toBeSuccessfulCommand();

    const snapshot = snapshotPendingPrompt(testEngine, { playerId: PLAYER_TWO });

    const oppAId = testEngine.asPlayerTwo().getCard(opponentCharA).id;
    const oppBId = testEngine.asPlayerTwo().getCard(opponentCharB).id;
    const allyId = testEngine.asPlayerOne().getCard(controllerAlly).id;

    expect(snapshot?.cardCandidateIds).toContain(oppAId);
    expect(snapshot?.cardCandidateIds).toContain(oppBId);
    // Regression guard: the controller's ally must not leak into the chooser's
    // candidate list.
    expect(snapshot?.cardCandidateIds).not.toContain(allyId);
    expect(snapshot?.cardCandidateIds).toHaveLength(2);

    // The slot's candidate entries must mirror the engine candidates so the
    // overlay renders the picker.
    expect(snapshot?.prompt?.candidateEntries.map((entry) => entry.cardId).sort()).toEqual(
      [oppAId, oppBId].sort(),
    );
  });

  it("does not open a prompt when the opponent has no characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [beKingUndisputed],
        inkwell: beKingUndisputed.cost,
      },
      {},
    );

    expect(testEngine.asPlayerOne().playCard(beKingUndisputed)).toBeSuccessfulCommand();
    expect(snapshotPendingPrompt(testEngine, { playerId: PLAYER_ONE })).toBeNull();
    expect(snapshotPendingPrompt(testEngine, { playerId: PLAYER_TWO })).toBeNull();
  });
});
