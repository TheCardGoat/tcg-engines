import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op09NicoRobin071 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-071 Nico Robin", () => {
  test("rests as a Blocker and redirects an opposing attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op09NicoRobin071] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const robinId = engine.findCardInZone("south", "character", op09NicoRobin071);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Robin's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(robinId);
    engine.resolveDecision("battleBlocker", { selectedIds: [robinId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(robinId);
    expect(view.prompts).toHaveLength(0);
  });
});
