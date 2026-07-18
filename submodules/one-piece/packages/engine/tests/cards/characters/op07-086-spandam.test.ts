import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op07Spandam086 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-086 Spandam", () => {
  test("trashes two deck cards and reduces one opposing Character's cost for the turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op07Spandam086],
        deck: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        activeDon: op07Spandam086.cost,
      },
      { character: [eb01MountainGod018, eb01Doma005] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const otherId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op07Spandam086, "south");
    expect(engine.getView("south").players.south.trash).toHaveLength(2);
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Spandam's cost target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([targetId, otherId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    let view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.cost).toBe(
      eb01MountainGod018.cost - 2,
    );
    expect(view.players.north.characters.find((card) => card?.instanceId === otherId)?.cost).toBe(
      eb01Doma005.cost,
    );
    engine.endTurn("south");
    view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.cost).toBe(
      eb01MountainGod018.cost,
    );
  });
});
