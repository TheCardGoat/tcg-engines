import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01KouzukiHiyori013,
  eb01MountainGod018,
  eb01Sanji014,
  op07Hattori088,
  op07MonkeyDLuffy091,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-091 Monkey.D.Luffy", () => {
  test("after its removal choice, offers eligible trash Characters for the variable deck return", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op07MonkeyDLuffy091, playedOnTurn: 0 }],
        trash: [eb01MountainGod018, eb01Sanji014, eb01KouzukiHiyori013, eb01Doma005],
      },
      { character: [op07Hattori088] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const luffyId = engine.findCardInZone("south", "character", op07MonkeyDLuffy091);
    const removalId = engine.findCardInZone("north", "character", op07Hattori088);
    const expensiveIds = [
      engine.findCardInZone("south", "trash", eb01MountainGod018),
      engine.findCardInZone("south", "trash", eb01Sanji014),
      engine.findCardInZone("south", "trash", eb01KouzukiHiyori013),
    ];
    const cheapId = engine.findCardInZone("south", "trash", eb01Doma005);
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.declareAttack(luffyId, engine.leader("north"), "south");
    const removal = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(removal).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (removal?.kind !== "selectEntity") throw new Error("Expected Luffy's removal choice.");
    expect(removal.candidates.map((candidate) => candidate.ref.id)).toContain(removalId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [removalId] }, "south");

    const returned = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(returned?.kind).toBe("selectEntity");
    if (returned?.kind !== "selectEntity") throw new Error("Expected Luffy's trash return choice.");
    expect(returned.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining(expensiveIds),
    );
    expect(returned.candidates.map((candidate) => candidate.ref.id)).not.toContain(cheapId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: expensiveIds }, "south");

    const order = engine.pendingDecision("effectReturnToDeckOwnerOrder", "south").steps[0];
    expect(order).toMatchObject({ kind: "orderItems", min: 3, max: 3 });
    engine.resolveDecision("effectReturnToDeckOwnerOrder", { selectedIds: expensiveIds }, "south");

    let view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(removalId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual([cheapId]);
    expect(view.players.south.deckCount).toBe(deckBefore + 3);
    expect(view.players.south.characters.find((card) => card?.instanceId === luffyId)?.power).toBe(
      (op07MonkeyDLuffy091.power ?? 0) + 1000,
    );

    engine.endTurn("south");
    view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === luffyId)?.power).toBe(
      op07MonkeyDLuffy091.power,
    );
  });
});
