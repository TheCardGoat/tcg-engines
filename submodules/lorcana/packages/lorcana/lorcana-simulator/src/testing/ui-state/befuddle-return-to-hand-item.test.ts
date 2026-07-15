import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockItem } from "@tcg/lorcana-engine/testing";
import { befuddle } from "@tcg/lorcana-cards/cards/001";

import { snapshotPendingPrompt } from "./prompt-snapshot.js";

// Befuddle: "Return a character or item with cost 2 or less to their player's hand."
//
// Regression guard for SLOT_CARD_TYPES.return-to-hand being locked to
// ["character"]: items with cost ≤ 2 must appear in candidateEntries so the UI
// renders them as selectable.  cardCandidateIds alone is insufficient — that list
// comes straight from the engine and was always correct; candidateEntries is the
// UI-filtered list the simulator actually renders.
describe("Befuddle | return-to-hand | UI prompt", () => {
  it("includes an eligible opposing item in candidateEntries, not just cardCandidateIds", () => {
    const eligibleItem = createMockItem({
      id: "befuddle-eligible-item",
      name: "Eligible Item",
      cost: 2,
    });

    const tooExpensiveItem = createMockItem({
      id: "befuddle-expensive-item",
      name: "Too Expensive Item",
      cost: 3,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [befuddle],
        inkwell: befuddle.cost,
      },
      {
        play: [eligibleItem, tooExpensiveItem],
      },
    );

    expect(testEngine.asPlayerOne().playCard(befuddle)).toBeSuccessfulCommand();

    const snapshot = snapshotPendingPrompt(testEngine);

    expect(snapshot).not.toBeNull();
    expect(snapshot?.kind).toBe("target-selection");
    expect(snapshot?.effectType).toBe("return-to-hand");

    const eligibleId = testEngine.findCardInstanceId(eligibleItem, "play", "p2");
    const expensiveId = testEngine.findCardInstanceId(tooExpensiveItem, "play", "p2");

    // Engine candidates: only the cost-≤2 item passes the engine's cost filter.
    expect(snapshot?.cardCandidateIds).toContain(eligibleId as unknown as string);
    expect(snapshot?.cardCandidateIds).not.toContain(expensiveId as unknown as string);

    // UI candidates: the item must appear in the rendered picker, not just the
    // raw engine list.  Before the fix, SLOT_CARD_TYPES.return-to-hand === ["character"]
    // silently emptied candidateEntries for any item target.
    expect(snapshot?.prompt?.candidateEntries.map((e) => e.cardId)).toContain(
      eligibleId as unknown as string,
    );
  });
});
