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
        activeDon: 1,
        restedDon: 7,
      },
      {},
      { firstPlayer: "south", activeSeat: "south" },
    );
    engine.asSouth().attachDon(engine.leader("south"), 1);
    const selectedId = engine.findCardInZone("south", "deck", op11RoronoaZoro016);

    engine.endTurn("south");
    engine.endTurn("north");

    expect(engine.getView("south").players.south.leader.attachedDon).toBe(1);
    expect(engine.getView("south").players.south.restedDon).toBe(7);
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

  test("may decline optional so paid effect does not apply", () => {
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
    engine.endTurn("south");
    engine.endTurn("north");

    const deckBefore = engine.getView("south").players.south.deckCount;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    // Declined start-of-turn search: only the normal turn draw (hand=1), no search pick.
    expect(after.hand).toHaveLength(1);
    expect(after.deckCount).toBe(deckBefore - 1);
    expect(engine.getView("south").phase).toBe("main");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("FAQ: seven DON still permits activation but only the normal turn draw occurs", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP11-040", restedDon: 7, deck: ["OP11-016", "EB01-005", "EB01-005"] },
      { leaderCardId: "ST01-001" },
    );
    e.asSouth().endTurn();
    e.asNorth().endTurn();
    expect(e.getView("south").players.south.hand).toHaveLength(0);
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["OP11-016"]);
    expect(e.getView("south").players.south.deckCount).toBe(2);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
