import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-016 To Never Doubt That Is Power", () => {
  test("[Main] giving 2 DON!! to a [Silvers Rayleigh] resolves the blocker denial", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP13-066"], hand: ["OP12-016"], activeDon: 5 },
      {},
    );

    engine.playCard("OP12-016");
    engine.acceptLeadingOptional("south");
    const donCost = engine.pendingDecision("effectCostGiveDon", "south").steps[0];
    if (donCost?.kind !== "payCost") throw new Error("Expected the DON cost.");
    const rayleighCostId = donCost.candidates.find(
      (candidate) => candidate.publicInfo?.cardId === "OP13-066",
    );
    if (!rayleighCostId) throw new Error("Expected Rayleigh recipient.");
    engine.resolveDecision("effectCostGiveDon", { selectedIds: [rayleighCostId.ref.id!] }, "south");
    const denial = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (denial?.kind !== "selectEntity") throw new Error("Expected the denial target.");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [denial.candidates[0]!.ref.id] },
      "south",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Counter] boosts a Character by 2000 during the battle", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP12-016"], character: [{ cardId: "OP13-066", rested: true }], activeDon: 5 },
      { character: ["OP16-012"], activeDon: 5 },
    );
    const rayleighId = engine.findCardInZone("south", "character", "OP13-066");
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.endTurn("south");
    // Benn attacks Rayleigh; the counter boost saves him.
    engine.asNorth().attack("OP16-012", "OP13-066");
    engine.asSouth().chooseCounter("OP12-016");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the boost target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [rayleighId] }, "south");

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
    expect(engine.getView("south").players.south.characters.map((c) => c?.instanceId)).toContain(
      rayleighId,
    );
  });
});
