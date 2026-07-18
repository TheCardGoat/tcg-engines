import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, prb01CaponeGangBegeSt02004JollyRogerFoil004 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe('ST02-004 Capone"Gang"Bege', () => {
  test("rests to block an attack aimed at its Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [prb01CaponeGangBegeSt02004JollyRogerFoil004] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const begeId = engine.findCardInZone(
      "south",
      "character",
      prb01CaponeGangBegeSt02004JollyRogerFoil004,
    );
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Bege's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(begeId);
    engine.resolveDecision("battleBlocker", { selectedIds: [begeId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(begeId);
    expect(view.prompts).toHaveLength(0);
  });
});
