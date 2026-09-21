import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-001 Portgas.D.Ace", () => {
  test("[Activate:Main] [Once Per Turn] grants [Rush] to a WB 8000-power Character", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP16-001", character: ["OP16-004"], activeDon: 5 },
      {},
    );
    const aceId = engine.leader("south");
    engine.activateEffect(aceId, "activateMain", "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the rush target.");
    const curielId = target.candidates.find((c) => c.publicInfo?.cardId === "OP16-004")?.ref.id;
    if (!curielId) throw new Error("Expected Curiel candidate.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [curielId] }, "south");

    // [Rush]: the Character can attack even though it just gained the keyword.
    const lifeBefore = engine.getView("south").players.north.lifeCount;
    engine.asSouth().attack("OP16-004", engine.asNorth().leader());
    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 1);
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-001", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP16-001",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
