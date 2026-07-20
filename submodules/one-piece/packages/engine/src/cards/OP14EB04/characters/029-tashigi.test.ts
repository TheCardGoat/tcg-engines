import { eb01Doma005, op14eb04Shiryu048 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Tashigi029 } from "../../../../../cards/src/cards/OP14EB04/characters/029-tashigi.ts";

import { OnePieceTestEngine } from "../../../index.ts";

function targetTashigiWithShiryu(engine: OnePieceTestEngine) {
  const tashigiId = engine.findCardInZone("south", "character", op14eb04Tashigi029);
  engine.playCard(op14eb04Shiryu048, "north");
  engine.resolveDecision("effectTargetSelection", { selectedIds: [tashigiId] }, "north");
  return tashigiId;
}

describe("OP14-029 Tashigi", () => {
  test("during the opponent's turn may rest one own card instead of effect removal of itself", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op14eb04Tashigi029, eb01Doma005] },
      { hand: [op14eb04Shiryu048], activeDon: op14eb04Shiryu048.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const allyId = engine.findCardInZone("south", "character", eb01Doma005);
    const tashigiId = targetTashigiWithShiryu(engine);

    expect(engine.pendingDecision("effectRemovalReplacement", "south").actorId).toBe("south");
    engine.resolveDecision("effectRemovalReplacement", { optionId: "yes" }, "south");
    const payment = engine.pendingDecision("effectMixedRestSelection", "south").steps[0];
    if (payment?.kind !== "payCost") throw new Error("Expected Tashigi's replacement rest.");
    expect(payment).toMatchObject({ min: 1, max: 1 });
    expect(payment.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("south"), tashigiId, allyId]),
    );
    engine.resolveDecision("effectMixedRestSelection", { selectedIds: [allyId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(tashigiId);
    expect(view.players.south.characters.find((card) => card?.instanceId === allyId)?.rested).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline the replacement and be returned to hand", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op14eb04Tashigi029] },
      { hand: [op14eb04Shiryu048], activeDon: op14eb04Shiryu048.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const tashigiId = targetTashigiWithShiryu(engine);

    engine.resolveDecision("effectRemovalReplacement", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).not.toContain(tashigiId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(tashigiId);
    expect(view.prompts).toHaveLength(0);
  });

  test("rests two selected own cards for power through the opponent's next End Phase once per turn", () => {
    const engine = OnePieceTestEngine.create({
      character: [op14eb04Tashigi029, eb01Doma005],
    });
    const tashigiId = engine.findCardInZone("south", "character", op14eb04Tashigi029);
    const allyId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.activateEffect(tashigiId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostRestCards", "south").steps[0];
    if (cost?.kind !== "payCost") throw new Error("Expected Tashigi's two-card rest cost.");
    expect(cost).toMatchObject({ min: 2, max: 2 });
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("south"), tashigiId, allyId]),
    );
    engine.resolveDecision(
      "effectCostRestCards",
      { selectedIds: [engine.leader("south"), allyId] },
      "south",
    );

    let view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === tashigiId)?.power,
    ).toBe(8000);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: tashigiId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);

    engine.endTurn("south");
    expect(
      engine
        .getView("north")
        .players.south.characters.find((card) => card?.instanceId === tashigiId)?.power,
    ).toBe(8000);
    engine.endTurn("north");
    view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === tashigiId)?.power,
    ).toBe(6000);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline the Activate: Main rest cost without changing power or card states", () => {
    const engine = OnePieceTestEngine.create({
      character: [op14eb04Tashigi029, eb01Doma005],
    });
    const tashigiId = engine.findCardInZone("south", "character", op14eb04Tashigi029);
    const allyId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.activateEffect(tashigiId, "activateMain", "south");
    expect(engine.pendingDecision("effectOptional", "south").actorId).toBe("south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.leader.rested).toBe(false);
    expect(view.players.south.characters.find((card) => card?.instanceId === allyId)?.rested).toBe(
      false,
    );
    expect(
      view.players.south.characters.find((card) => card?.instanceId === tashigiId)?.power,
    ).toBe(6000);
    expect(view.prompts).toHaveLength(0);
  });
});
