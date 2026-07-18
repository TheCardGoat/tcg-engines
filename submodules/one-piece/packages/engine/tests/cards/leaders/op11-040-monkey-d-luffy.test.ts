import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op10Urouge101, op11MonkeyDLuffy040, op11RoronoaZoro016 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP11-040 Monkey.D.Luffy", () => {
  test("searches before the turn draw when starting with at least 8 DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op11MonkeyDLuffy040,
        deck: [
          op11RoronoaZoro016,
          op10Urouge101,
          eb01Doma005,
          eb01Doma005,
          eb01Doma005,
          eb01Doma005,
        ],
        activeDon: 8,
      },
      {},
      { firstPlayer: "south", activeSeat: "south" },
    );
    const selectedId = engine.findCardInZone("south", "deck", op11RoronoaZoro016);

    engine.endTurn("south");
    engine.endTurn("north");

    expect(engine.getView("south").players.south.hand).toHaveLength(0);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [selectedId] }, "south");

    const orderStep = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(orderStep?.kind).toBe("orderItems");
    if (orderStep?.kind !== "orderItems") throw new Error("Expected remainder ordering.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: orderStep.candidates.map((candidate) => candidate.ref.id) },
      "south",
    );
    engine.resolveDecision("effectSearchRemainderPosition", { optionId: "bottom" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.some((card) => card.instanceId === selectedId)).toBe(true);
    expect(view.players.south.hand).toHaveLength(2);
    expect(view.phase).toBe("main");
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
