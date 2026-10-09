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
  test("may skip recovering an Event and still ready one DON", () => {
    const e = OnePieceTestEngine.create({ hand: ["OP10-067"], trash: ["OP10-079"], activeDon: 7 });
    e.asSouth().play("OP10-067");
    e.asSouth().acceptOptional();
    e.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");
    e.asSouth().chooseNoTargets();
    const before = e.getView("south").players.south.activeDon;
    e.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");
    expect(e.getView("south").players.south.activeDon).toBe(before + 1);
    expect(e.getView("south").players.south.trash.some((c) => c.cardId === "OP10-079")).toBe(true);
  });
  test("may decline the DON cost and neither recover the Event nor ready DON", () => {
    const e = OnePieceTestEngine.create({ hand: ["OP10-067"], trash: ["OP10-079"], activeDon: 7 });
    e.asSouth().play("OP10-067");
    const before = e.getView("south").players.south;
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.activeDon).toBe(before.activeDon);
    expect(e.getView("south").players.south.restedDon).toBe(before.restedDon);
    expect(e.getView("south").players.south.donDeckCount).toBe(before.donDeckCount);
    expect(e.getView("south").players.south.trash.some((c) => c.cardId === "OP10-079")).toBe(true);
  });
});
