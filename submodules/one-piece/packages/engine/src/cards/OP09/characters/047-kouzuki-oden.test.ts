import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op01Kaido094, op09KouzukiOden047 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-047 Kouzuki Oden", () => {
  test("deals two Life damage with Double Attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op09KouzukiOden047, playedOnTurn: 0 }] },
      { life: 4 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const odenId = engine.findCardInZone("south", "character", op09KouzukiOden047);
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.declareAttack(odenId, engine.leader("north"), "south");

    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 2);
  });

  test("on K.O. draws two cards, then trashes one chosen physical hand card", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op09KouzukiOden047, rested: true }],
        deck: [eb01Doma005, eb01Doma005, eb01Doma005],
      },
      { character: [{ card: op01Kaido094, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const odenId = engine.findCardInZone("south", "character", op09KouzukiOden047);
    const attackerId = engine.findCardInZone("north", "character", op01Kaido094);

    engine.declareAttack(attackerId, odenId, "north");
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected Oden's hand-trash choice.");
    expect(trash.candidates).toHaveLength(2);
    const selectedId = trash.candidates[0]!.ref.id;
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [selectedId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand).toHaveLength(1);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([odenId, selectedId]),
    );
    expect(view.prompts).toHaveLength(0);
  });
});
