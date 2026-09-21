import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-019 Color of Arms Haki", () => {
  test("[Main] give-DON cost boosts a card +1000; [Counter] saves a Character by +2000", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP13-066", rested: true }], hand: ["OP12-019"], activeDon: 5 },
      { character: ["OP16-012"], activeDon: 5 },
    );
    const rayleighId = engine.findCardInZone("south", "character", "OP13-066");
    const rayleighBase =
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === rayleighId)
        ?.power ?? 0;

    engine.playCard("OP12-019");
    engine.acceptLeadingOptional("south");
    const donCost = engine.pendingDecision("effectCostGiveDon", "south").steps[0];
    if (donCost?.kind !== "payCost") throw new Error("Expected the DON cost.");
    const rayleighCostId = donCost.candidates.find(
      (candidate) => candidate.publicInfo?.cardId === "OP13-066",
    );
    if (!rayleighCostId) throw new Error("Expected Rayleigh recipient.");
    engine.resolveDecision("effectCostGiveDon", { selectedIds: [rayleighCostId.ref.id!] }, "south");
    const boost = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (boost?.kind !== "selectEntity") throw new Error("Expected the boost target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [rayleighId] }, "south");

    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === rayleighId)
        ?.power,
    ).toBe(rayleighBase + 2000);
  });

  test("[Counter] declined boosts nothing", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP13-066", rested: true }], hand: ["OP12-019"], activeDon: 5 },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const rayleighId = engine.findCardInZone("south", "character", "OP13-066");

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", rayleighId);
    engine.asSouth().chooseCounter("OP12-019");
    engine.acceptLeadingOptional("south");
    const boost = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (boost?.kind !== "selectEntity") throw new Error("Expected the boost target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    expect(engine.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(
      rayleighId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
