import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockLocation } from "@tcg/lorcana-engine/testing";
import { quickPatch } from "@tcg/lorcana-cards/cards/003";

import { snapshotPendingPrompt } from "./prompt-snapshot.js";

// Quick Patch: "Remove up to 3 damage from chosen location."
//
// Regression guard for SLOT_CARD_TYPES.remove-damage being locked to
// ["character"]: locations must appear in candidateEntries so the UI renders
// them as selectable.  cardCandidateIds is always correct (engine layer);
// candidateEntries is the UI-filtered list the simulator actually renders for
// the picker.
describe("Quick Patch | remove-damage | UI prompt", () => {
  it("includes an opposing location in candidateEntries", () => {
    const damagedLocation = createMockLocation({
      id: "quick-patch-location",
      name: "Damaged Location",
      cost: 3,
      willpower: 5,
      lore: 1,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [quickPatch],
        inkwell: quickPatch.cost,
      },
      {
        play: [damagedLocation],
      },
    );

    expect(testEngine.asPlayerOne().playCard(quickPatch)).toBeSuccessfulCommand();

    const snapshot = snapshotPendingPrompt(testEngine);

    expect(snapshot).not.toBeNull();
    expect(snapshot?.kind).toBe("target-selection");
    expect(snapshot?.effectType).toBe("remove-damage");

    const locationId = testEngine.findCardInstanceId(damagedLocation, "play", "p2");

    // Engine candidates: location in play is a valid remove-damage target.
    expect(snapshot?.cardCandidateIds).toContain(locationId as unknown as string);

    // UI candidates: the location must appear in the rendered picker.
    // Before the fix, SLOT_CARD_TYPES.remove-damage === ["character"] silently
    // emptied candidateEntries for location targets, leaving the player unable
    // to select.
    expect(snapshot?.prompt?.candidateEntries.map((e) => e.cardId)).toContain(
      locationId as unknown as string,
    );
  });
});
