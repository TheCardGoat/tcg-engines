import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op12Karasu085, op12Mizerka092, op13BrilliantPunk059 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP13-059 Brilliant Punk", () => {
  test("Main returns one own Character as cost, then offers either field's cost-6 Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op13BrilliantPunk059],
        character: [{ card: eb01Doma005, attachedDon: 2 }, op12Karasu085],
        activeDon: 4,
      },
      { character: [op12Mizerka092] },
    );
    const paymentId = engine.findCardInZone("south", "character", eb01Doma005);
    const ownTargetId = engine.findCardInZone("south", "character", op12Karasu085);
    const opposingTargetId = engine.findCardInZone("north", "character", op12Mizerka092);

    engine.playCard(op13BrilliantPunk059);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnCharacter", { selectedIds: [paymentId] }, "south");
    const decision = engine.pendingDecision("effectTargetSelection", "south");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected an either-field return choice.");
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([
      ownTargetId,
      opposingTargetId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opposingTargetId] }, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      paymentId,
    );
    expect(engine.getState().cards[paymentId]?.attachedDon).toBe(0);
    expect(engine.getView("south").players.south.restedDon).toBe(6);
    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      opposingTargetId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op13BrilliantPunk059],
        character: [{ card: eb01Doma005, attachedDon: 2 }, op12Karasu085],
        activeDon: 4,
      },
      { character: [op12Mizerka092] },
    );
    engine.playCard(op13BrilliantPunk059, "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
