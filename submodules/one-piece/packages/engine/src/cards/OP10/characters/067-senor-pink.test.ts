import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op10GodThread079, op10SenorPink067 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-067 Senor Pink", () => {
  test("may return DON!!, recover an eligible purple Event, then set a DON!! active", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op10SenorPink067],
      trash: [op10GodThread079, eb01Doma005],
      activeDon: 7,
    });
    const eventId = engine.findCardInZone("south", "trash", op10GodThread079);
    const characterId = engine.findCardInZone("south", "trash", eb01Doma005);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op10SenorPink067, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const payment = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
    expect(payment).toMatchObject({ kind: "payCost", min: 1, max: 1 });
    if (payment?.kind !== "payCost") throw new Error("Expected Senor Pink's DON!! cost.");
    engine.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: [payment.candidates[0]!.ref.id] },
      "south",
    );

    const eventTarget = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(eventTarget?.kind).toBe("selectEntity");
    if (eventTarget?.kind !== "selectEntity") throw new Error("Expected an Event choice.");
    expect(eventTarget.candidates.map((candidate) => candidate.ref.id)).toContain(eventId);
    expect(eventTarget.candidates.map((candidate) => candidate.ref.id)).not.toContain(characterId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eventId] }, "south");

    const setActive = engine.pendingDecision("effectSetActiveDon", "south").steps[0];
    expect(setActive?.kind).toBe("chooseOption");
    engine.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(eventId);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.players.south.activeDon).toBe(2);
    expect(view.prompts).toHaveLength(0);
  });
});
