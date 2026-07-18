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
});
