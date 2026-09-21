import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-093 Bartholomew Kuma", () => {
  test("[On Play] draws 2, trashes 2, then gives a rested DON!! to the Leader or a Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP16-093", "EB01-005", "OP16-004", "OP13-013", "OP13-013"],
        character: [{ cardId: "EB01-005" }],
        restedDon: 2,
        activeDon: 3,
      },
      {},
    );
    const domaId = engine.findCardInZone("south", "character", "EB01-005");

    engine.playCard("OP16-093");
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected the trash choice.");
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: trash.candidates.slice(0, 2).map((candidate) => candidate.ref.id) },
      "south",
    );
    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    if (count?.kind !== "chooseOption") throw new Error("Expected the DON!! count.");
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    const recipient = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (recipient?.kind !== "selectEntity") throw new Error("Expected the recipient.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [domaId] }, "south");

    const south = engine.getView("south").players.south;
    expect(south.hand).toHaveLength(4);
    // Play cost rested 3 of the 2 resting DON!! plus 1 given away.
    expect(south.restedDon).toBe(4);
    expect(south.characters.find((card) => card?.instanceId === domaId)?.attachedDon).toBe(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
