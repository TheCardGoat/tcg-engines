import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { plutoSteelChampion } from "@tcg/lorcana-cards/cards/010";

import { snapshotPendingPrompt } from "./prompt-snapshot.js";

// MAKE ROOM: "Whenever you play another Steel character, you may banish chosen
// item."
//
// Player report (2026-04-25): "Is Pluto Steel Champion bugged in 2.0? I was
// trying to use his effect of destroying opponents items, but I was unable to
// make an actual selection to destroy something."
//
// The optional trigger should surface a `target-selection` prompt that lists
// every item in play (any owner) as a candidate, so the controller can click
// the opponent's item to banish it.
describe("Pluto - Steel Champion | MAKE ROOM | UI prompt", () => {
  it("surfaces a target-selection prompt listing the opposing item as a candidate", () => {
    const incomingSteelAlly = createMockCharacter({
      id: "pluto-incoming-steel",
      name: "Incoming Steel",
      cost: 2,
      strength: 2,
      willpower: 2,
      inkType: ["steel"],
    });
    const opposingItem = createMockItem({
      id: "pluto-opposing-item",
      name: "Opposing Item",
      cost: 2,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: plutoSteelChampion, isDrying: false }],
        hand: [incomingSteelAlly],
        inkwell: incomingSteelAlly.cost,
      },
      {
        play: [opposingItem],
      },
    );

    expect(testEngine.asPlayerOne().playCard(incomingSteelAlly)).toBeSuccessfulCommand();

    const itemId = testEngine.findCardInstanceId(opposingItem, "play", "p2");
    const snapshot = snapshotPendingPrompt(testEngine);

    expect(snapshot).not.toBeNull();
    expect(snapshot?.kind).toBe("target-selection");
    expect(snapshot?.effectType).toBe("banish");

    // cardCandidateIds = raw engine candidates; candidateEntries = what the UI
    // actually renders as selectable. The Pluto bug was that candidateEntries was
    // empty (items filtered out by SLOT_CARD_TYPES.banish === "character") even
    // though cardCandidateIds correctly included the item. Both must contain it.
    expect(snapshot?.cardCandidateIds).toContain(itemId as unknown as string);
    expect(snapshot?.prompt?.candidateEntries.map((e) => e.cardId)).toContain(
      itemId as unknown as string,
    );
  });
});
