import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op04Ideo077 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-077 Ideo", () => {
  test("uses Blocker through the public battle decision", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op04Ideo077] },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const ideoId = engine.findCardInZone("south", "character", op04Ideo077);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Ideo's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(ideoId);
    engine.resolveDecision("battleBlocker", { selectedIds: [ideoId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(ideoId);
    expect(view.prompts).toHaveLength(0);
  });
});
