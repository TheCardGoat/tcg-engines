import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op02Domino081 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-081 Domino", () => {
  test("may block an opposing attack and protect its Leader's Life", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op02Domino081] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const blocker = engine.findCardInZone("south", "character", op02Domino081);
    const attacker = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attacker, engine.leader("south"), "north");
    const decision = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(decision?.kind).toBe("selectEntity");
    if (decision?.kind !== "selectEntity") throw new Error("Expected Domino's Blocker choice.");
    expect(decision.candidates.map((candidate) => candidate.ref.id)).toEqual(["skip", blocker]);
    engine.resolveDecision("battleBlocker", { selectedIds: [blocker] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(blocker);
    expect(view.prompts).toHaveLength(0);
  });
});
