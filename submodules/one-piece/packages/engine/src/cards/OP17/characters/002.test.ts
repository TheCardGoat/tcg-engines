import { OnePieceTestEngine } from "../../../index.ts";

import { describe, expect, test } from "vite-plus/test";

describe("OP17-002", () => {
  test("[Blocker/ability] on-field state", () => {
    const engine = OnePieceTestEngine.create({ character: ["OP17-002"], activeDon: 3 }, {});
    expect(engine.findCardInZone("south", "character", "OP17-002")).toBeDefined();
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP17-002", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP17-002",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
