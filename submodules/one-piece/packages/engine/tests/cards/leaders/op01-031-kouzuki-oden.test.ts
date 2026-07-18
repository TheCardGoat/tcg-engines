import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Izo002, eb01Yamato007, op01KouzukiOden031 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-031 Kouzuki Oden", () => {
  test("trashes a chosen included Land of Wano card before reactivating up to two DON", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op01KouzukiOden031,
      hand: [eb01Izo002, eb01Yamato007, eb01Doma005],
      restedDon: 3,
    });
    const compoundWanoId = engine.findCardInZone("south", "hand", eb01Izo002);
    const exactWanoId = engine.findCardInZone("south", "hand", eb01Yamato007);
    const excludedId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") {
      throw new Error("Expected a filtered Land of Wano hand-trash payment.");
    }
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual([
      compoundWanoId,
      exactWanoId,
    ]);
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [compoundWanoId] }, "south");
    engine.resolveDecision("effectSetActiveDon", { optionId: "2" }, "south");

    const view = engine.getView("south").players.south;
    expect(view.trash.map((card) => card.instanceId)).toContain(compoundWanoId);
    expect(view.hand.map((card) => card.instanceId)).toContain(exactWanoId);
    expect(view).toMatchObject({ activeDon: 2, restedDon: 1 });
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
