import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-044 Emporio.Ivankov", () => {
  test("[Blocker] may be rested to become the new attack target", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "EB01-005", attachedDon: 1 }], activeDon: 5 },
      { character: ["OP16-044"] },
    );
    const ivankovId = engine.findCardInZone("north", "character", "OP16-044");
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.asSouth().attack("EB01-005", engine.asNorth().leader());
    engine.asNorth().chooseBlocker("OP16-044");

    const north = engine.getView("south").players.north;
    expect(north.lifeCount).toBe(lifeBefore);
    // The blocker intercepted: it was rested off the field and K.O.'d.
    expect(north.trash.map((card) => card.instanceId)).toContain(ivankovId);
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-044", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP16-044",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
