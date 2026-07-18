import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01RadicalBeam029,
  op08PhoenixBrand055,
  op12MonkeyDLuffy015,
} from "@tcg/op-cards";
import { op12BoaHancock014 } from "../../../../../cards/src/cards/OP12/characters/014-boa-hancock.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-014 Boa Hancock", () => {
  test("searches for either Monkey.D.Luffy or a red Event and orders the remainder", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op12BoaHancock014],
      deck: [
        op12MonkeyDLuffy015,
        op01RadicalBeam029,
        op08PhoenixBrand055,
        eb01Doma005,
        eb01MountainGod018,
        eb01Doma005,
      ],
      activeDon: op12BoaHancock014.cost,
    });
    const luffyId = engine.findCardInZone("south", "deck", op12MonkeyDLuffy015);
    const redEventId = engine.findCardInZone("south", "deck", op01RadicalBeam029);
    const excludedEventId = engine.findCardInZone("south", "deck", op08PhoenixBrand055);

    engine.playCard(op12BoaHancock014, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected Boa Hancock's search.");
    expect(search.candidates.find((candidate) => candidate.ref.id === luffyId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === redEventId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === excludedEventId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [redEventId] }, "south");
    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected bottom-deck ordering.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: order.candidates.map((candidate) => candidate.ref.id).reverse() },
      "south",
    );

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      redEventId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("trashes itself and gives two rested DON!! to one chosen card", () => {
    const engine = OnePieceTestEngine.create({
      character: [op12BoaHancock014, eb01Doma005],
      restedDon: 2,
    });
    const boaId = engine.findCardInZone("south", "character", op12BoaHancock014);
    const recipientId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.activateEffect(boaId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectGiveDonCount", { optionId: "2" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [recipientId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(boaId);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === recipientId)?.attachedDon,
    ).toBe(2);
    expect(view.prompts).toHaveLength(0);
  });
});
