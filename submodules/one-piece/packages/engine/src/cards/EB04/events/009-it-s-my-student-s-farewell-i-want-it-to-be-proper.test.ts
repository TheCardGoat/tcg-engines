import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("EB04-009 It's My Student's Farewell! I Want It to Be Proper", () => {
  test("[Main] give-DON cost drops an opposing Character -2000", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP13-066"], hand: ["EB04-009"], activeDon: 5 },
      { character: ["OP16-012"], activeDon: 5 },
    );
    const bennId = engine.findCardInZone("north", "character", "OP16-012");

    engine.playCard("EB04-009");
    engine.acceptLeadingOptional("south");
    const donCost = engine.pendingDecision("effectCostGiveDon", "south").steps[0];
    if (donCost?.kind !== "payCost") throw new Error("Expected the DON cost.");
    const rayleighCostId = donCost.candidates.find(
      (candidate) => candidate.publicInfo?.cardId === "OP13-066",
    );
    engine.resolveDecision(
      "effectCostGiveDon",
      { selectedIds: [rayleighCostId!.ref.id!] },
      "south",
    );
    const drop = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (drop?.kind !== "selectEntity") throw new Error("Expected the drop target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [bennId] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === bennId)?.power,
    ).toBe(4000);
  });

  test("[Optional] declined leaves the board unchanged", () => {
    const engine = OnePieceTestEngine.create({ hand: ["EB04-009"], activeDon: 3 }, {});

    engine.playCard("EB04-009");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getView("south").players.south.trash.map((c) => c.cardId)).toContain("EB04-009");
    expect(engine.getView("south").players.south.characters.filter(Boolean)).toHaveLength(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
