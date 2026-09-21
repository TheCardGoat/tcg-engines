import { describe, expect, test } from "vite-plus/test";
import { op02IceAge117 } from "@tcg/op-cards";
import { op15NicoRobin087 } from "../../../../../cards/src/cards/characters/op15-087-nico-robin.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-087 Nico Robin", () => {
  test("[On Play] draws 2 and trashes 2 from hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op15NicoRobin087, op02IceAge117, op02IceAge117],
        activeDon: 5,
        deck: 6,
      },
      {},
    );
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(op15NicoRobin087);
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
    expect(south.trash).toHaveLength(2);
  });

  test("gains Blocker with 10 or more trash cards", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op15NicoRobin087],
        trash: 10,
        activeDon: 2,
      },
      { activeDon: 2 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const robinId = engine.findCardInZone("south", "character", op15NicoRobin087);

    engine.endTurn("south");
    engine.attachDon(engine.leader("north"), 2, "north");
    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");

    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected a Blocker decision.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(robinId);
    engine.resolveDecision("battleBlocker", { selectedIds: [robinId] }, "south");
  });
});
