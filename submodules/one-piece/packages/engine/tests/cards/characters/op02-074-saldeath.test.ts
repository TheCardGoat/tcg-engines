import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op02Blugori084, op02Saldeath074 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-074 Saldeath", () => {
  test("grants Blocker to every own Blugori only while Saldeath is in play", () => {
    const createEngine = (withSaldeath: boolean) =>
      OnePieceTestEngine.create(
        { character: [...(withSaldeath ? [op02Saldeath074] : []), op02Blugori084] },
        { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
        { firstPlayer: "south", activeSeat: "north" },
      );

    const withoutSaldeath = createEngine(false);
    const firstAttacker = withoutSaldeath.findCardInZone("north", "character", eb01MountainGod018);
    withoutSaldeath.declareAttack(firstAttacker, withoutSaldeath.leader("south"), "north");
    expect(withoutSaldeath.getView("south").prompts).toHaveLength(0);

    const engine = createEngine(true);
    const attacker = engine.findCardInZone("north", "character", eb01MountainGod018);
    const blugori = engine.findCardInZone("south", "character", op02Blugori084);
    const saldeath = engine.findCardInZone("south", "character", op02Saldeath074);
    engine.declareAttack(attacker, engine.leader("south"), "north");

    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Blugori's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toEqual(["skip", blugori]);
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).not.toContain(saldeath);
    engine.resolveDecision("battleBlocker", { selectedIds: [blugori] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      blugori,
    );
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
