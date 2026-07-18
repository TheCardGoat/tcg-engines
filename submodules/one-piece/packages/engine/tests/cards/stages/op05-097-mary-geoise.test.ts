import { describe, expect, test } from "vite-plus/test";
import { op05MaryGeoise097, op13SaintJalmac085, op13StEthanbaronVNusjuro080 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-097 Mary Geoise", () => {
  test("discounts eligible Celestial Dragons in hand and lets the player pay the computed cost", () => {
    const unavailableEngine = OnePieceTestEngine.create({
      hand: [op13SaintJalmac085],
      activeDon: 1,
    });
    const unavailableId = unavailableEngine.findCardInZone("south", "hand", op13SaintJalmac085);
    const unavailableView = unavailableEngine.getView("south");
    const unavailableActionStep = unavailableView.decisions.find(
      (decision) => decision.kind === "chooseAction",
    )?.steps[0];
    expect(unavailableView.players.south.hand[0]?.cost).toBe(2);
    expect(unavailableActionStep?.kind).toBe("chooseAction");
    if (unavailableActionStep?.kind !== "chooseAction") {
      throw new Error("Expected an action decision without Mary Geoise.");
    }
    expect(
      unavailableActionStep.actions.some(
        (action) => action.commandType === "playCard" && action.source?.id === unavailableId,
      ),
    ).toBe(false);

    const engine = OnePieceTestEngine.create({
      stage: op05MaryGeoise097,
      hand: [op13SaintJalmac085, op13SaintJalmac085, op13StEthanbaronVNusjuro080],
      activeDon: 1,
    });
    const selectedId = engine.findCardInZone("south", "hand", op13SaintJalmac085);
    const hand = engine.getView("south").players.south.hand;
    const remainingId = hand.find(
      (card) => card.cardId === op13SaintJalmac085.id && card.instanceId !== selectedId,
    )?.instanceId;
    const compositeId = hand.find(
      (card) => card.cardId === op13StEthanbaronVNusjuro080.id,
    )?.instanceId;
    if (!remainingId || !compositeId) {
      throw new Error("Expected the discounted hand fixtures.");
    }
    expect(hand.map((card) => ({ id: card.instanceId, cost: card.cost }))).toEqual([
      { id: selectedId, cost: 1 },
      { id: remainingId, cost: 1 },
      { id: compositeId, cost: 5 },
    ]);

    const actionStep = engine
      .getView("south")
      .decisions.find((decision) => decision.kind === "chooseAction")?.steps[0];
    expect(actionStep?.kind).toBe("chooseAction");
    if (actionStep?.kind !== "chooseAction") {
      throw new Error("Expected Mary Geoise to publish the discounted play action.");
    }
    expect(
      actionStep.actions.some(
        (action) => action.commandType === "playCard" && action.source?.id === selectedId,
      ),
    ).toBe(true);

    engine.playCard(op13SaintJalmac085);

    let view = engine.getView("south");
    expect(view.players.south.restedDon).toBe(1);
    expect(view.players.south.activeDon).toBe(0);
    expect(view.players.south.characters[0]?.instanceId).toBe(selectedId);

    engine.endTurn("south");
    view = engine.getView("south");
    expect(view.players.south.hand.find((card) => card.instanceId === remainingId)?.cost).toBe(2);
    expect(view.players.south.hand.find((card) => card.instanceId === compositeId)?.cost).toBe(6);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
