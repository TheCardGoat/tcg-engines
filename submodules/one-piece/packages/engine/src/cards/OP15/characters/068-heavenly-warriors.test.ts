import { describe, expect, test } from "vite-plus/test";
import { op15HeavenlyWarriors068 } from "../../../../../cards/src/cards/characters/op15-068-heavenly-warriors.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-068 Heavenly Warriors", () => {
  test("gains Blocker with 6 or less DON!! on the field", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15HeavenlyWarriors068], activeDon: 3 },
      { activeDon: 2 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const warriorId = engine.findCardInZone("south", "character", op15HeavenlyWarriors068);

    engine.endTurn("south");
    engine.attachDon(engine.leader("north"), 2, "north");
    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");

    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected a Blocker decision.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(warriorId);
    engine.resolveDecision("battleBlocker", { selectedIds: [warriorId] }, "south");
  });

  test("has no Blocker above 6 DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15HeavenlyWarriors068], activeDon: 7 },
      { activeDon: 2 },
      { firstPlayer: "north", activeSeat: "south" },
    );

    const lifeBefore = engine.getView("south").players.south.lifeCount;
    engine.endTurn("south");
    engine.attachDon(engine.leader("north"), 2, "north");
    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");

    // No Blocker: the battle resolves and the Leader takes the damage.
    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore - 1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
