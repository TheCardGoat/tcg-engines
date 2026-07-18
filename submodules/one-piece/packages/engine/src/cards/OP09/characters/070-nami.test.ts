import { describe, expect, test } from "vite-plus/test";
import { op09Nami070 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-070 Nami", () => {
  test("returns a chosen number of DON!! and gives up to two rested DON!! to one own recipient", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op09Nami070],
      activeDon: 5,
    });
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op09Nami070, "south");
    const namiId = engine.findCardInZone("south", "character", op09Nami070);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const payment = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
    expect(payment).toMatchObject({ kind: "payCost", min: 1, max: 5 });
    if (payment?.kind !== "payCost") throw new Error("Expected Nami's variable DON!! cost.");
    const activeDonIds = payment.candidates
      .filter((candidate) => candidate.ref.id.startsWith("active-don:"))
      .slice(0, 2)
      .map((candidate) => candidate.ref.id);
    expect(activeDonIds).toHaveLength(2);
    engine.resolveDecision("effectCostReturnDon", { selectedIds: activeDonIds }, "south");

    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    expect(count?.kind).toBe("chooseOption");
    if (count?.kind !== "chooseOption") throw new Error("Expected Nami's DON!! count choice.");
    expect(count.options.map((option) => option.id)).toEqual(["0", "1", "2"]);
    engine.resolveDecision("effectGiveDonCount", { optionId: "2" }, "south");

    const recipient = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(recipient?.kind).toBe("selectEntity");
    if (recipient?.kind !== "selectEntity") throw new Error("Expected Nami's DON!! recipient.");
    expect(recipient.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("south"),
      namiId,
    ]);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 2);
    expect(view.players.south.leader.attachedDon).toBe(2);
    expect(view.players.south.restedDon).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });
});
