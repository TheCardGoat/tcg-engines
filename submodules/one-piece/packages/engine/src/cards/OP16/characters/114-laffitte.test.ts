import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-114 Laffitte", () => {
  test("[On K.O.] K.O.s up to 1 opposing Character of cost 4 or less", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-114", rested: true }] },
      { character: ["EB01-005", "OP16-003"], activeDon: 5 },
    );
    const domaId = engine.findCardInZone("north", "character", "EB01-005");

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", "OP16-114");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the K.O. target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [domaId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      domaId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-114", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP16-114",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
