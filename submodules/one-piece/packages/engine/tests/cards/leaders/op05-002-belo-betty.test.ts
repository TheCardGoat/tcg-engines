import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op05BartholomewKuma011,
  op05BeloBetty002,
  op05Koala006,
  op05Satori105,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-002 Belo Betty", () => {
  test("filters its hand cost and accepts Revolutionary Army or Trigger Characters", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op05BeloBetty002,
      hand: [op05Koala006, op05BartholomewKuma011, eb01Doma005],
      character: [op05Koala006, op05Satori105, eb01Doma005],
    });
    const paymentId = engine.findCardInZone("south", "hand", op05Koala006);
    const revolutionaryId = engine.findCardInZone("south", "character", op05Koala006);
    const triggerId = engine.findCardInZone("south", "character", op05Satori105);

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const secondPaymentId = engine.findCardInZone("south", "hand", op05BartholomewKuma011);
    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected a filtered hand cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual([
      paymentId,
      secondPaymentId,
    ]);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [paymentId] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected power targets.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([
      revolutionaryId,
      triggerId,
    ]);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [revolutionaryId, triggerId] },
      "south",
    );

    const characters = engine.getView("south").players.south.characters;
    expect(characters.find((card) => card?.instanceId === revolutionaryId)?.power).toBe(6000);
    expect(characters.find((card) => card?.instanceId === triggerId)?.power).toBe(8000);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op05BeloBetty002,
      hand: [op05Koala006, op05BartholomewKuma011, eb01Doma005],
      character: [op05Koala006, op05Satori105, eb01Doma005],
    });
    engine.activateEffect(engine.leader("south"), "activateMain", "south");
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
