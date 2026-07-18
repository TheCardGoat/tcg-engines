import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005 } from "@tcg/op-cards";
import { op12KouzukiOden004 } from "../../../../../cards/src/cards/OP12/characters/004-kouzuki-oden.ts";
import { op12Shanks007 } from "../../../../../cards/src/cards/OP12/characters/007-shanks.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-007 Shanks", () => {
  test("gives Rush to another included Roger Pirates Character for the turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op12Shanks007],
        character: [op12KouzukiOden004, eb01Doma005],
        activeDon: op12Shanks007.cost,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const odenId = engine.findCardInZone("south", "character", op12KouzukiOden004);
    const unrelatedId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.playCard(op12Shanks007, "south");
    const shanksId = engine.findCardInZone("south", "character", op12Shanks007);
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Shanks's Rush target.");
    const candidates = target.candidates.map((candidate) => candidate.ref.id);
    expect(candidates).toContain(odenId);
    expect(candidates).not.toContain(shanksId);
    expect(candidates).not.toContain(unrelatedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [odenId] }, "south");

    engine.declareAttack(odenId, engine.leader("north"), "south");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
