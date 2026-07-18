import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op04WeaknessIsAnUnforgivableSin076, op10SenorPink067 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP10-067 Senor Pink", () => {
  test("may return one DON!!, recover an eligible purple Event, and set one DON!! active", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op10SenorPink067],
      trash: [op04WeaknessIsAnUnforgivableSin076, eb01Doma005],
      activeDon: op10SenorPink067.cost + 1,
      restedDon: 1,
    });
    const eventId = engine.findCardInZone("south", "trash", op04WeaknessIsAnUnforgivableSin076);
    const characterId = engine.findCardInZone("south", "trash", eb01Doma005);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op10SenorPink067, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const payment = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
    if (payment?.kind !== "payCost") throw new Error("Expected Senor Pink's DON!! return cost.");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Senor Pink's Event choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eventId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(characterId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eventId] }, "south");
    engine.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(eventId);
    expect(view.players.south).toMatchObject({ activeDon: 1, restedDon: 5 });
    expect(view.prompts).toHaveLength(0);
  });
});
