import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-055 There's No Authority in the World That Lasts Forever", () => {
  test("[Main] resting 1 DON!! gives a [Rocks.D.Xebec] [Unblockable]", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP17-039",
        character: ["OP17-118"],
        hand: ["OP17-055"],
        activeDon: 5,
      },
      {},
    );
    const xebecId = engine.findCardInZone("south", "character", "OP17-118");

    engine.playCard("OP17-055");
    engine.acceptLeadingOptional("south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the unblockable target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [xebecId] }, "south");

    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Counter] saves a Rocks Pirates card with +2000", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP17-039", hand: ["OP17-055"], activeDon: 5 },
      { character: ["OP16-012"], activeDon: 5 },
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.endTurn("south");
    engine.asNorth().attack("OP16-012", engine.asSouth().leader());
    engine.asSouth().chooseCounter("OP17-055");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the boost target.");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.getView("south").players.south.leader!.instanceId!] },
      "south",
    );

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });
});
