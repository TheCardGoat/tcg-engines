import { describe, expect, test } from "vite-plus/test";
import { op02IceAge117 } from "@tcg/op-cards";
import { op15Conis104 } from "../../../../../cards/src/cards/characters/op15-104-conis.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-104 Conis", () => {
  test("[On Play] draws 2 and trashes 2 when Life is below the opponent's", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op15Conis104, op02IceAge117, op02IceAge117],
        activeDon: 2,
        life: 2,
        deck: 5,
      },
      { life: 4 },
    );
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(op15Conis104);
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected the hand trash choice.");
    const ids = trash.candidates.map((candidate) => candidate.ref.id);
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: ids.slice(0, 2) },
      "south",
    );

    const south = engine.getView("south").players.south;
    expect(south.hand).toHaveLength(2);
    expect(south.deckCount).toBe(deckBefore - 2);
  });

  test("does not draw with Life equal to the opponent's", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op15Conis104], activeDon: 2, life: 4, deck: 5 },
      { life: 4 },
    );
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(op15Conis104);

    const south = engine.getView("south").players.south;
    expect(south.deckCount).toBe(deckBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("Life Trigger draws two and trashes only one even without lower Life", () => {
    const engine = OnePieceTestEngine.create(
      { life: [op15Conis104, "OP12-013", "OP12-013"], deck: 5 },
      { life: 1 },
      { firstPlayer: "south", activeSeat: "north" },
    );
    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");
    const choice = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (choice?.kind !== "selectEntity") throw new Error("Expected hand discard");
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [choice.candidates[0]!.ref.id] },
      "south",
    );
    const view = engine.getView("south");
    expect(view.players.south.handCount).toBe(1);
    expect(view.players.south.deckCount).toBe(3);
    expect(view.players.south.trash).toHaveLength(2);
    expect(view.players.south.lifeCount).toBe(2);
  });
});
