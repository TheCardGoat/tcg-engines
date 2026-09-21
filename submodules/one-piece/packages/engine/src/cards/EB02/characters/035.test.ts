import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("EB02-035", () => {
  test("[On Play] with equal DON!! counts draws 1 card", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["EB02-035"], activeDon: 5 },
      { character: ["OP13-013"], activeDon: 5 },
    );

    engine.playCard("EB02-035");

    expect(engine.getView("south").players.south.handCount).toBe(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Your Turn] returning 2 DON!! lets it add an active DON!! from the DON!! deck", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "EB02-035", attachedDon: 0 }], hand: ["OP09-077"], activeDon: 5 },
      { character: ["OP13-013"], activeDon: 5 },
    );

    engine.playCard("OP09-077");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    // Gum-Gum Lightning's DON!! -2 cost returns 2 of our DON!! cards.
    const pay = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
    if (pay?.kind !== "payCost") throw new Error("Expected the DON!! payment.");
    engine.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: pay.candidates.slice(0, 2).map((c) => c.ref.id) },
      "south",
    );
    // Gum-Gum Lightning's own K.O. selection comes first: decline it.
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    const add = engine.pendingDecision("effectAddDon", "south").steps[0];
    if (add?.kind !== "chooseOption") throw new Error("Expected the DON!! count choice.");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getView("south").players.south.activeDon).toBeGreaterThan(0);
  });
});
