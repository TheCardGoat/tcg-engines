import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op05Maynard052,
  op05RobLucci093,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-093 Rob Lucci", () => {
  test("orders three trash cards, then resolves its two independent K.O. choices", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op05RobLucci093],
        trash: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
        activeDon: 4,
      },
      { character: [op05Maynard052, eb01Doma005, eb01Fourtricks025] },
    );
    const cost2Id = engine.findCardInZone("north", "character", op05Maynard052);
    const cost1Id = engine.findCardInZone("north", "character", eb01Doma005);
    const cost3Id = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.playCard(op05RobLucci093, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const payment = engine.pendingDecision("effectCostReturnTrashToDeck", "south").steps[0];
    expect(payment?.kind).toBe("payCost");
    if (payment?.kind !== "payCost") throw new Error("Expected Lucci's ordered trash cost.");
    const paymentOrder = payment.candidates.slice(0, 3).map((candidate) => candidate.ref.id);
    engine.resolveDecision("effectCostReturnTrashToDeck", { selectedIds: paymentOrder }, "south");

    const first = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(first?.kind).toBe("selectEntity");
    if (first?.kind !== "selectEntity") throw new Error("Expected Lucci's cost-2 K.O.");
    expect(first.candidates.map((candidate) => candidate.ref.id)).toEqual([cost2Id, cost1Id]);
    expect(first.candidates.map((candidate) => candidate.ref.id)).not.toContain(cost3Id);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [cost2Id] }, "south");

    const second = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(second?.kind).toBe("selectEntity");
    if (second?.kind !== "selectEntity") throw new Error("Expected Lucci's cost-1 K.O.");
    expect(second.candidates.map((candidate) => candidate.ref.id)).toEqual([cost1Id]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [cost1Id] }, "south");

    expect(engine.getState().players.south.deck.slice(-3)).toEqual(paymentOrder);
    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([cost2Id, cost1Id]),
    );
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline the cost or choose zero independently", () => {
    const declined = OnePieceTestEngine.create({
      hand: [op05RobLucci093],
      trash: [eb01Doma005, eb01Doma005, eb01Doma005],
      activeDon: 4,
    });
    const trashBefore = [...declined.getState().players.south.trash];
    declined.playCard(op05RobLucci093, "south");
    declined.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(declined.getState().players.south.trash).toEqual(trashBefore);

    const zero = OnePieceTestEngine.create(
      {
        hand: [op05RobLucci093],
        trash: [eb01Doma005, eb01Doma005, eb01Doma005],
        activeDon: 4,
      },
      { character: [eb01Doma005] },
    );
    zero.playCard(op05RobLucci093, "south");
    zero.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    zero.resolveDecision(
      "effectCostReturnTrashToDeck",
      { selectedIds: [...zero.getState().players.south.trash] },
      "south",
    );
    zero.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    zero.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    expect(zero.getView("south").players.north.characters.filter(Boolean)).toHaveLength(1);
  });

  test("does not offer the effect with fewer than three trash cards", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op05RobLucci093],
      trash: [eb01Doma005, eb01Doma005],
      activeDon: 4,
    });
    engine.playCard(op05RobLucci093, "south");
    expect(
      engine
        .getState()
        .promptQueue.some(
          (prompt) =>
            prompt.status === "pending" && prompt.resolutionContext?.intent === "effectOptional",
        ),
    ).toBe(false);
  });
});
