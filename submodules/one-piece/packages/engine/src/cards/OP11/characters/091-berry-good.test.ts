import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op01ArtificialDevilFruitSmile116,
  op01ElephantSMarchoo115,
  op01RoundTable027,
  op01SheepSHorn117,
  op11BerryGood091,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-091 Berry Good", () => {
  test("the opponent chooses and orders exactly three Events from their trash for deck bottom", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op11BerryGood091], activeDon: op11BerryGood091.cost },
      {
        trash: [
          op01ArtificialDevilFruitSmile116,
          op01ElephantSMarchoo115,
          op01SheepSHorn117,
          op01RoundTable027,
          eb01Doma005,
        ],
      },
    );
    const eventIds = [
      engine.findCardInZone("north", "trash", op01ArtificialDevilFruitSmile116),
      engine.findCardInZone("north", "trash", op01ElephantSMarchoo115),
      engine.findCardInZone("north", "trash", op01SheepSHorn117),
    ];
    const unselectedEventId = engine.findCardInZone("north", "trash", op01RoundTable027);
    const excludedId = engine.findCardInZone("north", "trash", eb01Doma005);
    const submittedOrder = [...eventIds].reverse();

    engine.playCard(op11BerryGood091, "south");
    const choice = engine.pendingDecision("effectTargetSelection", "north");
    expect(choice.actorId).toBe("north");
    const target = choice.steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 3, max: 3 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Berry Good's Event choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([
      ...eventIds,
      unselectedEventId,
    ]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: submittedOrder }, "north");

    const order = engine.pendingDecision("effectReturnToDeckOwnerOrder", "north").steps[0];
    expect(order).toMatchObject({ kind: "orderItems", min: 3, max: 3 });
    if (order?.kind !== "orderItems") throw new Error("Expected Berry Good's Event order.");
    expect(order.candidates.map((candidate) => candidate.ref.id)).toEqual(submittedOrder);
    expect(engine.getView("south").prompts).toHaveLength(0);
    engine.resolveDecision(
      "effectReturnToDeckOwnerOrder",
      { selectedIds: submittedOrder },
      "north",
    );

    const view = engine.getView("north");
    expect(view.players.north.trash.map((card) => card.instanceId)).toEqual([
      unselectedEventId,
      excludedId,
    ]);
    expect(view.players.north.deckCount).toBe(13);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().players.north.deck.slice(-3)).toEqual(submittedOrder);
  });
});
