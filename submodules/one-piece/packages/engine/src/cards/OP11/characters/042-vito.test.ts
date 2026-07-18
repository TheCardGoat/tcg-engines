import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op11CaponeGangBege048, op11Gotti050, op11Vito042 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-042 Vito", () => {
  test("trashes a chosen compound Firetank Pirates card and gains Rush for its play turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op11Vito042, op11CaponeGangBege048, op11Gotti050, eb01Doma005],
        activeDon: op11Vito042.cost,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const paidId = engine.findCardInZone("south", "hand", op11CaponeGangBege048);
    const otherLegalId = engine.findCardInZone("south", "hand", op11Gotti050);
    const excludedId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op11Vito042, "south");
    const vitoId = engine.findCardInZone("south", "character", op11Vito042);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    if (cost?.kind !== "payCost") throw new Error("Expected Vito's hand payment.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([paidId, otherLegalId]),
    );
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [paidId] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      paidId,
    );
    engine.declareAttack(vitoId, engine.leader("north"), "south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === vitoId)
        ?.rested,
    ).toBe(true);
  });

  test("declining the hand cost leaves Vito unable to attack on its play turn", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op11Vito042, op11CaponeGangBege048], activeDon: op11Vito042.cost },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(op11Vito042, "south");
    const vitoId = engine.findCardInZone("south", "character", op11Vito042);
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: vitoId,
        targetId: engine.leader("north"),
      }).accepted,
    ).toBe(false);
    expect(engine.getView("south").players.south.trash).toHaveLength(0);
  });
});
