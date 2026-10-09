import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01CavendishBoxTopper008,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-008 Cavendish (Box Topper)", () => {
  test("is not a Straw Hat Crew card when Nami searches the deck", () => {
    const engine = OnePieceTestEngine.create({
      hand: ["OP01-016"],
      deck: [
        op01CavendishBoxTopper008,
        "ST01-002",
        eb01Doma005,
        eb01Doma005,
        eb01Doma005,
        eb01MountainGod018,
      ],
      activeDon: 1,
    });
    engine.playCard("OP01-016");
    const step = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected Nami search.");
    const eligible = step.candidates.filter((candidate) => candidate.legal);
    expect(eligible.map((candidate) => candidate.publicInfo?.cardId)).toEqual(["ST01-002"]);
    engine.resolveDecision(
      "effectSearchSelection",
      { selectedIds: [eligible[0]!.ref.id] },
      "south",
    );
    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected search remainder.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: order.candidates.map((item) => item.ref.id) },
      "south",
    );
    expect(engine.getView("south").players.south.hand.map((card) => card.cardId)).toEqual([
      "ST01-002",
    ]);
    expect(engine.getView("south").players.south.deckCount).toBe(5);
  });

  test("optionally adds one Life card to hand before gaining Rush for the turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op01CavendishBoxTopper008],
        life: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        activeDon: op01CavendishBoxTopper008.cost,
      },
      { character: [{ card: eb01Doma005, rested: true, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;
    const topLifeId = engine.findCardInZone("south", "life", eb01Doma005);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op01CavendishBoxTopper008, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cavendishId = engine.findCardInZone("south", "character", op01CavendishBoxTopper008);
    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore - 1);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(topLifeId);

    engine.declareAttack(cavendishId, targetId, "south");
    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
  });

  test("may decline the Life cost and does not gain Rush", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op01CavendishBoxTopper008],
        life: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        activeDon: op01CavendishBoxTopper008.cost,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.playCard(op01CavendishBoxTopper008, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const cavendishId = engine.findCardInZone("south", "character", op01CavendishBoxTopper008);

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: cavendishId,
        targetId: engine.leader("north"),
      }).accepted,
    ).toBe(false);
  });
});
