import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-050 Miss.Olive", () => {
  test("may return itself and still draw two then trash one", () => {
    const engine = OnePieceTestEngine.create({
      hand: ["OP16-050"],
      activeDon: 5,
      deck: ["EB01-005", "OP16-004", "OP16-016"],
    });
    const sourceId = engine.findCardInZone("south", "hand", "OP16-050");
    const discardId = engine.findCardInZone("south", "deck", "EB01-005");
    const retainedId = engine.findCardInZone("south", "deck", "OP16-004");
    engine.playCard("OP16-050", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discardId] }, "south");
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([sourceId, retainedId]),
    );
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      discardId,
    );
    expect(engine.getView("south").players.south.deckCount).toBe(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("Blocker redirects a Leader attack and protects Life", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP16-050"], hand: [], life: 3 },
      {},
      { firstPlayer: "south", activeSeat: "north" },
    );
    const blockerId = engine.findCardInZone("south", "character", "OP16-050");
    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [blockerId] }, "south");
    expect(engine.getView("south").players.south.lifeCount).toBe(3);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

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
