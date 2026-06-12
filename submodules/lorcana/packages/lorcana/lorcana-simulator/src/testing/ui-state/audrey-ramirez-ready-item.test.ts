import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockItem } from "@tcg/lorcana-engine/testing";
import { audreyRamirezTheEngineer } from "@tcg/lorcana-cards/cards/003";

import { snapshotPendingPrompt } from "./prompt-snapshot.js";

// Audrey Ramirez - The Engineer: SPARE PARTS — "Whenever this character quests,
// ready one of your items."
//
// Regression guard for SLOT_CARD_TYPES.ready being locked to ["character"]:
// items must appear in candidateEntries so the UI renders them as selectable.
// cardCandidateIds is always correct (engine layer); candidateEntries is the
// UI-filtered list the simulator actually renders for the picker.
describe("Audrey Ramirez - The Engineer | SPARE PARTS | UI prompt", () => {
  it("includes an exerted own item in candidateEntries when Audrey quests", () => {
    const ownItem = createMockItem({
      id: "audrey-own-item",
      name: "Own Item",
      cost: 2,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: audreyRamirezTheEngineer, isDrying: false },
          { card: ownItem, exerted: true },
        ],
        lore: 0,
      },
      {},
    );

    expect(testEngine.asPlayerOne().quest(audreyRamirezTheEngineer)).toBeSuccessfulCommand();

    const snapshot = snapshotPendingPrompt(testEngine);

    expect(snapshot).not.toBeNull();
    expect(snapshot?.kind).toBe("target-selection");
    expect(snapshot?.effectType).toBe("ready");

    const itemId = testEngine.findCardInstanceId(ownItem, "play", "p1");

    // Engine candidates: own item in play is a valid ready target.
    expect(snapshot?.cardCandidateIds).toContain(itemId as unknown as string);

    // UI candidates: the item must appear in the rendered picker.
    // Before the fix, SLOT_CARD_TYPES.ready === ["character"] silently emptied
    // candidateEntries for item targets, leaving the player unable to select.
    expect(snapshot?.prompt?.candidateEntries.map((e) => e.cardId)).toContain(
      itemId as unknown as string,
    );
  });
});
