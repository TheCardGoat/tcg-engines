import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-105 Gecko Moria", () => {
  test("[Trigger] with 1 or less Life plays Absalom, Hogback, and Perona from trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: ["OP16-005"],
        life: ["OP16-105"],
        trash: ["OP06-081", "OP06-090", "OP12-034"],
        activeDon: 5,
      },
      { character: ["OP16-003"], activeDon: 5 },
    );

    // The attack drains the last Life, revealing Moria for his [Trigger].
    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", engine.asSouth().leader());
    engine.asSouth().chooseBlocker(null);
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");

    // Resolve the per-name play choices until the queue empties.
    for (let i = 0; i < 3; i += 1) {
      const view = engine.getView("south");
      if (view.prompts.length === 0) break;
      const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
      if (play?.kind !== "selectEntity") break;
      engine.resolveDecision(
        "effectPlaySelection",
        { selectedIds: [play.candidates[0]!.ref.id] },
        "south",
      );
    }

    const south = engine.getView("south").players.south;
    expect(south.characters.map((card) => card?.cardId)).toContain("OP06-081");
    expect(south.characters.map((card) => card?.cardId)).toContain("OP06-090");
    expect(south.characters.map((card) => card?.cardId)).toContain("OP12-034");
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-105", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP16-105",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
