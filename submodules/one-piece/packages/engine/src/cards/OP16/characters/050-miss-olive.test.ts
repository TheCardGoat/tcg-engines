import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-050 Miss.Olive", () => {
  test("[On Play] returning a cost-2-or-more Character draws 2 then trashes 1", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP16-004"], hand: ["OP16-050", "OP13-013"], activeDon: 5 },
      {},
    );
    const curielId = engine.findCardInZone("south", "character", "OP16-004");

    engine.playCard("OP16-050");
    engine.acceptLeadingOptional("south");
    engine.resolveDecision("effectCostReturnCharacter", { selectedIds: [curielId] }, "south");
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected the trash choice.");
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [trash.candidates[0]!.ref.id] },
      "south",
    );

    const south = engine.getView("south").players.south;
    // Hand: after playing Olive 1 card, +Curiel = 2, +2 drawn = 4, -1 trashed = 3.
    expect(south.hand).toHaveLength(3);
    expect(south.hand.map((card) => card.cardId)).toContain("OP16-004");
    expect(south.trash.map((card) => card.cardId)).toContain("OP13-013");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declining skips the whole exchange", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP16-004"], hand: ["OP16-050", "OP13-013"], activeDon: 5 },
      {},
    );

    engine.playCard("OP16-050");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const south = engine.getView("south").players.south;
    expect(south.hand).toHaveLength(1);
    expect(south.characters.map((card) => card?.cardId)).toContain("OP16-004");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
