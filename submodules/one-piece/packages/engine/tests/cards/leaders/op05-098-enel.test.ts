import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01Crocodile067,
  op05Enel098,
  op13WindmillVillage022,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-098 Enel", () => {
  test("rebuilds zero Life once on the opponent's turn, then maps the hand-trash choice", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op01Crocodile067, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
        ],
      },
      {
        leaderCardId: op05Enel098,
        hand: [op13WindmillVillage022, op13WindmillVillage022],
        deck: [eb01Doma005, eb01MountainGod018],
        life: [op13WindmillVillage022],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const rebuiltLifeId = engine.findCardInZone("north", "deck", eb01Doma005);
    const paymentId = engine.findCardInZone("north", "hand", op13WindmillVillage022);

    engine.declareAttack(
      engine.findCardInZone("south", "character", op01Crocodile067),
      engine.leader("north"),
      "south",
    );
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");

    const payment = engine.pendingDecision("effectTrashFromHandSelection", "north").steps[0];
    expect(payment?.kind).toBe("selectEntity");
    if (payment?.kind !== "selectEntity") {
      throw new Error("Expected Enel's controller to choose the mandatory hand trash.");
    }
    expect(payment.candidates.map((candidate) => candidate.ref.id)).toContain(paymentId);
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [paymentId] }, "north");

    expect(engine.findCardInZone("north", "life", eb01Doma005)).toBe(rebuiltLifeId);
    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toContain(
      paymentId,
    );

    engine.declareAttack(
      engine.findCardInZone("south", "character", eb01MountainGod018),
      engine.leader("north"),
      "south",
    );
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(0);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
