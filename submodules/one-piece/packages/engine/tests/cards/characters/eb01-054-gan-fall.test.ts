import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01GanFall054, eb01MountainGod018 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-054 Gan.Fall", () => {
  test("K.O.s only a low-cost Character at one opposing Life, then maps itself as Blocker", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [eb01GanFall054], activeDon: 3 },
      {
        life: [eb01Fourtricks025],
        character: [eb01Doma005, { card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const lowCostId = engine.findCardInZone("north", "character", eb01Doma005);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(eb01GanFall054);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [lowCostId] }, "south");
    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      lowCostId,
    );

    const ganFallId = engine.findCardInZone("south", "character", eb01GanFall054);
    engine.endTurn("south");
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") {
      throw new Error("Expected Gan.Fall's Blocker choice.");
    }
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toEqual(["skip", ganFallId]);
    engine.resolveDecision("battleBlocker", { selectedIds: [ganFallId] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      ganFallId,
    );
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
