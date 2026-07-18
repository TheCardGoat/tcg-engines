import { describe, expect, test } from "vite-plus/test";
import { eb01Blueno017, eb01Doma005 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-017 Blueno", () => {
  test("uses Blocker through the public battle decision", () => {
    const engine = OnePieceTestEngine.create(
      { character: [eb01Blueno017] },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const bluenoId = engine.findCardInZone("south", "character", eb01Blueno017);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("south"), "north");

    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Blueno's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toEqual(["skip", bluenoId]);

    engine.resolveDecision("battleBlocker", { selectedIds: [bluenoId] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      bluenoId,
    );
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
