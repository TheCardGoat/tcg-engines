import { describe, expect, test } from "vite-plus/test";
import { op01KurozumiHigurashi100, op01Otama006 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-100 Kurozumi Higurashi", () => {
  test("rests as a Blocker and becomes the attack target instead of the Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op01KurozumiHigurashi100] },
      { character: [{ card: op01Otama006, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const blockerId = engine.findCardInZone("south", "character", op01KurozumiHigurashi100);
    const attackerId = engine.findCardInZone("north", "character", op01Otama006);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Higurashi's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toEqual(["skip", blockerId]);
    engine.resolveDecision("battleBlocker", { selectedIds: [blockerId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === blockerId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
