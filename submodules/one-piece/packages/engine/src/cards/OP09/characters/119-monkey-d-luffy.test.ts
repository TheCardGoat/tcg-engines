import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op09MonkeyDLuffy119 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-119 Monkey.D.Luffy", () => {
  test("may return any positive number of DON!! to draw and attack immediately with Rush", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op09MonkeyDLuffy119],
        deck: [eb01Doma005, eb01Fourtricks025],
        activeDon: op09MonkeyDLuffy119.cost + 3,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const drawnId = engine.findCardInZone("south", "deck", eb01Doma005);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op09MonkeyDLuffy119, "south");
    const luffyId = engine.findCardInZone("south", "character", op09MonkeyDLuffy119);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const payment = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
    expect(payment).toMatchObject({ kind: "payCost", min: 1, max: 12 });
    if (payment?.kind !== "payCost") throw new Error("Expected Luffy's variable DON!! cost.");
    engine.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: payment.candidates.slice(0, 2).map((candidate) => candidate.ref.id) },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 2);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(() => engine.declareAttack(luffyId, engine.leader("north"), "south")).not.toThrow();
  });

  test("may decline without drawing, returning DON!!, or gaining Rush", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op09MonkeyDLuffy119],
        deck: [eb01Doma005, eb01Fourtricks025],
        activeDon: op09MonkeyDLuffy119.cost + 1,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const deckBefore = engine.getView("south").players.south.deckCount;
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;
    engine.playCard(op09MonkeyDLuffy119, "south");
    const luffyId = engine.findCardInZone("south", "character", op09MonkeyDLuffy119);

    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(deckBefore);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore);
    const failure = engine.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId: luffyId,
      targetId: engine.leader("north"),
    });
    expect(failure.reason).toBe("The selected attacker cannot attack.");
  });
});
