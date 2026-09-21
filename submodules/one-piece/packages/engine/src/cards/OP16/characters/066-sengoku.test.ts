import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-066 Sengoku", () => {
  test("[On Play] for a Navy Leader adds 2 rested DON!!, draws 2, trashes 2", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP16-060",
        hand: ["OP16-066", "EB01-005", "OP16-004", "OP13-013"],
        activeDon: 5,
        donDeckCount: 4,
      },
      {},
    );

    engine.playCard("OP16-066");
    const add = engine.pendingDecision("effectAddDon", "south").steps[0];
    if (add?.kind !== "chooseOption") throw new Error("Expected the DON!! add.");
    engine.resolveDecision("effectAddDon", { optionId: "2" }, "south");

    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected the trash choice.");
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: trash.candidates.slice(0, 2).map((candidate) => candidate.ref.id) },
      "south",
    );

    const south = engine.getView("south").players.south;
    // Play cost rested 5, plus the 2 added rested DON!!.
    expect(south.restedDon).toBe(7);
    expect(south.donDeckCount).toBe(2);
    expect(south.hand).toHaveLength(3);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("without a Navy Leader the On Play does not trigger", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-066", "EB01-005"], activeDon: 5, donDeckCount: 4 },
      {},
    );

    engine.playCard("OP16-066");

    const south = engine.getView("south").players.south;
    expect(south.donDeckCount).toBe(4);
    expect(south.hand).toHaveLength(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
