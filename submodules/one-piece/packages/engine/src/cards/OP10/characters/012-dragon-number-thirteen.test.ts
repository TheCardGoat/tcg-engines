import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op10DragonNumberThirteen012 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-012 Dragon Number Thirteen", () => {
  test("rests as a Blocker and prevents Leader damage", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op10DragonNumberThirteen012] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const dragonId = engine.findCardInZone("south", "character", op10DragonNumberThirteen012);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Dragon's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(dragonId);
    engine.resolveDecision("battleBlocker", { selectedIds: [dragonId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(dragonId);
    expect(view.prompts).toHaveLength(0);
  });
});
