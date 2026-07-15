import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { cheshireCatInexplicable } from "@tcg/lorcana-cards/cards/010";
import {
  mickeyMouseTrueFriend,
  simbaProtectiveCub,
  arielOnHumanLegs,
} from "@tcg/lorcana-cards/cards/001";

import { snapshotPendingPrompt } from "./prompt-snapshot.js";

describe("snapshotPendingPrompt — engine-to-UI integration", () => {
  it("returns null when no selection is pending", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [mickeyMouseTrueFriend] },
      { play: [simbaProtectiveCub] },
    );

    expect(snapshotPendingPrompt(testEngine)).toBeNull();
  });

  it("surfaces the move-damage bag effect as a two-slot prompt with an opponent-only destination", () => {
    // Cheshire Cat - Inexplicable: triggered ability moves up to 2 damage from any
    // character to an *opposing* character. This is the exact shape that caused the
    // Cheshire Cat owner-filter regression (commit a073dbbc3) — asserting on the
    // snapshot here is our fast-feedback replacement for clicking through the UI.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        // Player 1 activates Cheshire Cat's Boost; the put-card-under trigger fires.
        play: [cheshireCatInexplicable, { card: arielOnHumanLegs, damage: 2 }],
        inkwell: 2,
        deck: [mickeyMouseTrueFriend],
      },
      {
        // Opponent has a character that should be the only legal destination.
        play: [mickeyMouseTrueFriend],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(cheshireCatInexplicable),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

    const snapshot = snapshotPendingPrompt(testEngine);

    expect(snapshot).not.toBeNull();
    expect(snapshot?.kind).toBe("target-selection");
    expect(snapshot?.expectedSlottedKind).toBe("move-damage");
    expect(snapshot?.effectType).toBe("move-damage");
    expect(snapshot?.prompt?.slots.map((slot) => slot.label)).toEqual([
      "Move damage from",
      "Move damage to",
    ]);
    expect(snapshot?.prompt?.activeSlotIndex).toBe(0);
    expect(snapshot?.message).toBe("Choose the character to move damage from.");

    // Friendly damaged character AND opponent must both be candidates for slot 0.
    const slot0Candidates = snapshot?.prompt?.candidateEntries.map((entry) => entry.cardId) ?? [];
    const arielId = testEngine.asPlayerOne().getCard(arielOnHumanLegs).id;
    const mickeyId = testEngine.asPlayerOne().getCard(mickeyMouseTrueFriend).id;
    expect(slot0Candidates).toContain(arielId);
    expect(slot0Candidates).toContain(mickeyId);
  });

  it("excludes friendly characters from the destination slot after source is selected (Cheshire Cat regression)", () => {
    // Regression: Cheshire Cat destination slot must filter by owner=opponent.
    // Before commit a073dbbc3, a friendly character remained selectable as the
    // destination. This test simulates the UI state *after* the user picks the
    // source card and asserts the remaining candidate list.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          cheshireCatInexplicable,
          { card: arielOnHumanLegs, damage: 2 }, // friendly, damaged
          simbaProtectiveCub, // friendly, 0 damage
        ],
        inkwell: 2,
        deck: [mickeyMouseTrueFriend],
      },
      {
        play: [mickeyMouseTrueFriend], // opponent — only legal destination
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(cheshireCatInexplicable),
    ).toBeSuccessfulCommand();

    const arielId = testEngine.asPlayerOne().getCard(arielOnHumanLegs).id;
    const simbaId = testEngine.asPlayerOne().getCard(simbaProtectiveCub).id;
    const mickeyId = testEngine.asPlayerOne().getCard(mickeyMouseTrueFriend).id;

    // Simulate the UI state after the user picks Ariel as the source.
    const snapshot = snapshotPendingPrompt(testEngine, { selectedTargets: [arielId] });

    expect(snapshot?.prompt?.activeSlotIndex).toBe(1);
    const destCandidates = snapshot?.prompt?.candidateEntries.map((entry) => entry.cardId) ?? [];
    expect(destCandidates).toContain(mickeyId);
    expect(destCandidates).not.toContain(simbaId);
    expect(destCandidates).not.toContain(arielId);
    expect(snapshot?.message).toBe("Choose the character to move damage to.");
  });
});
