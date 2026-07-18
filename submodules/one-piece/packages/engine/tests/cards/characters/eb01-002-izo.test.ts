import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Izo002, eb01KouzukiOden001 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-002 Izo", () => {
  test("gives rested DON!! on play, then maps the opponent-attack payment and power target", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: eb01KouzukiOden001,
        hand: [eb01Izo002, eb01Doma005, eb01Doma005],
        activeDon: 5,
      },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(eb01Izo002, "south");
    const izoId = engine.findCardInZone("south", "character", eb01Izo002);

    const donCount = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    expect(donCount?.kind).toBe("chooseOption");
    if (donCount?.kind !== "chooseOption") throw new Error("Expected Izo's DON!! count choice.");
    expect(donCount.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");

    const donRecipient = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(donRecipient?.kind).toBe("selectEntity");
    if (donRecipient?.kind !== "selectEntity") {
      throw new Error("Expected Izo's Leader-or-Character DON!! recipient.");
    }
    expect(donRecipient.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("south"),
      izoId,
    ]);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );

    expect(engine.getView("south").players.south.leader.attachedDon).toBe(1);
    engine.endTurn("south");

    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);
    const paymentIds = engine.getView("south").players.south.hand.map((card) => card.instanceId);
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const payment = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(payment?.kind).toBe("payCost");
    if (payment?.kind !== "payCost") throw new Error("Expected Izo's hand-trash payment.");
    expect(payment.candidates.map((candidate) => candidate.ref.id)).toEqual(paymentIds);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [paymentIds[0]!] }, "south");

    const powerTarget = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(powerTarget?.kind).toBe("selectEntity");
    if (powerTarget?.kind !== "selectEntity") {
      throw new Error("Expected Izo's opposing Leader-or-Character target.");
    }
    expect(powerTarget.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("north"),
      attackerId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [attackerId] }, "south");

    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === attackerId)?.power,
    ).toBe(1000);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      paymentIds[0],
    );
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
