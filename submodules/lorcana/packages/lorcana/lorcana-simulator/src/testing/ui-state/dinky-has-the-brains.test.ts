import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { dinkyHasTheBrains } from "@tcg/lorcana-cards/cards/011";

import { snapshotPendingPrompt } from "./prompt-snapshot.js";

// GET HIM!: "When you play this character, each opponent chooses one of their
// characters and deals 1 damage to them." Defined at
// lorcana-cards/src/cards/011/characters/078-dinky-has-the-brains.ts with
// `chosenBy: "opponent"`, `target.owner: "opponent"`, `cardTypes: ["character"]`,
// `zones: ["play"]`.
//
// UI-level behaviour under test:
//  - Target-selection prompt is assigned to the *opponent* of Dinky's controller.
//  - `chooserId` is the opponent (player_two when player_one plays Dinky).
//  - Candidate list contains only opponent-owned characters in play, filtered by
//    owner — the controller's own characters must not appear.
//  - `sourceCardId` is Dinky herself.

const opponentCharA = createMockCharacter({
  id: "dinky-opp-a",
  name: "Fox Kit",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const opponentCharB = createMockCharacter({
  id: "dinky-opp-b",
  name: "Hound Pup",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const controllerAlly = createMockCharacter({
  id: "dinky-own-ally",
  name: "Controller Ally",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Dinky - Has the Brains | GET HIM! | UI prompt", () => {
  it("opens a target-selection prompt scoped to the opponent after Dinky is played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [dinkyHasTheBrains],
        inkwell: dinkyHasTheBrains.cost,
        play: [{ card: controllerAlly, isDrying: false }],
        deck: 5,
      },
      {
        play: [opponentCharA, opponentCharB],
      },
    );

    expect(testEngine.asPlayerOne().playCard(dinkyHasTheBrains)).toBeSuccessfulCommand();

    const snapshot = snapshotPendingPrompt(testEngine, { playerId: PLAYER_TWO });

    expect(snapshot).not.toBeNull();
    expect(snapshot?.kind).toBe("target-selection");
    expect(snapshot?.effectType).toBe("deal-damage");
    // The opponent is the chooser — any other value means the UI prompts the
    // wrong player, which is the exact symptom bug-02 describes.
    expect(snapshot?.chooserId).toBe(PLAYER_TWO);
    expect(snapshot?.minSelections).toBe(1);
    expect(snapshot?.maxSelections).toBe(1);

    const dinkyId = testEngine.asPlayerOne().getCard(dinkyHasTheBrains).id;
    expect(snapshot?.sourceCardId).toBe(dinkyId);
  });

  it("restricts candidates to the opponent's own characters (owner: opponent filter)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [dinkyHasTheBrains],
        inkwell: dinkyHasTheBrains.cost,
        play: [{ card: controllerAlly, isDrying: false }],
        deck: 5,
      },
      {
        play: [opponentCharA, opponentCharB],
      },
    );

    expect(testEngine.asPlayerOne().playCard(dinkyHasTheBrains)).toBeSuccessfulCommand();

    const snapshot = snapshotPendingPrompt(testEngine, { playerId: PLAYER_TWO });

    const oppAId = testEngine.asPlayerTwo().getCard(opponentCharA).id;
    const oppBId = testEngine.asPlayerTwo().getCard(opponentCharB).id;
    const allyId = testEngine.asPlayerOne().getCard(controllerAlly).id;

    expect(snapshot?.cardCandidateIds).toContain(oppAId);
    expect(snapshot?.cardCandidateIds).toContain(oppBId);
    // Regression guard: Dinky's controller's ally must not leak into the
    // opponent's candidate list.
    expect(snapshot?.cardCandidateIds).not.toContain(allyId);

    // Per SLOT_CARD_TYPES the deal-damage prompt renders a single slot.
    expect(snapshot?.prompt?.slots.map((slot) => slot.label)).toEqual(["Deal damage to"]);
    expect(snapshot?.prompt?.candidateEntries.map((entry) => entry.cardId).sort()).toEqual(
      [oppAId, oppBId].sort(),
    );
  });

  it("does not open any prompt when the opponent has no characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [dinkyHasTheBrains],
        inkwell: dinkyHasTheBrains.cost,
        deck: 5,
      },
      { deck: 5 },
    );

    expect(testEngine.asPlayerOne().playCard(dinkyHasTheBrains)).toBeSuccessfulCommand();

    // No valid target → no prompt on either player's view.
    expect(snapshotPendingPrompt(testEngine, { playerId: PLAYER_ONE })).toBeNull();
    expect(snapshotPendingPrompt(testEngine, { playerId: PLAYER_TWO })).toBeNull();
  });
});
