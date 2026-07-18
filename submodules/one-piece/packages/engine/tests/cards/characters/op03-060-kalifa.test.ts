import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op03Kalifa060 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-060 Kalifa", () => {
  test("may pay DON!! -1 to draw two, then trash one", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op03Kalifa060, playedOnTurn: 0 }],
        hand: [eb01Doma005],
        deck: [eb01Doma005, eb01Doma005, eb01Doma005],
        activeDon: 1,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const kalifaId = engine.findCardInZone("south", "character", op03Kalifa060);
    const handBefore = engine.getView("south").players.south.handCount;
    engine.declareAttack(kalifaId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(trash?.kind).toBe("selectEntity");
    if (trash?.kind !== "selectEntity") throw new Error("Expected Kalifa's hand trash.");
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [trash.candidates[0]!.ref.id] },
      "south",
    );
    expect(engine.getView("south").players.south.handCount).toBe(handBefore + 1);
    expect(engine.getView("south").players.south.trash).toHaveLength(1);
  });

  test("may decline without returning DON!! or changing hand", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op03Kalifa060, playedOnTurn: 0 }], activeDon: 1 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const kalifaId = engine.findCardInZone("south", "character", op03Kalifa060);
    const before = engine.getView("south").players.south;
    engine.declareAttack(kalifaId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: before.activeDon,
      handCount: before.handCount,
    });
  });
});
