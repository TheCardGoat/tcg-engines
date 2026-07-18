import { describe, expect, test } from "vite-plus/test";
import { op02Hydra090, op12Sanji041 } from "@tcg/op-cards";
import { op12Zeff072 } from "../../../../../cards/src/cards/OP12/characters/072-zeff.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-072 Zeff", () => {
  test("with a Sanji Leader gains Rush when a field DON!! returns to the DON!! deck", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op12Sanji041,
        character: [op12Zeff072],
        hand: [op02Hydra090],
        activeDon: 2,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const zeffId = engine.findCardInZone("south", "character", op12Zeff072);

    engine.playCard(op02Hydra090, "south");
    const payment = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
    if (payment?.kind !== "payCost") throw new Error("Expected Hydra's DON!! return cost.");
    engine.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: [payment.candidates[0]!.ref.id] },
      "south",
    );

    engine.declareAttack(zeffId, engine.leader("north"), "south");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
