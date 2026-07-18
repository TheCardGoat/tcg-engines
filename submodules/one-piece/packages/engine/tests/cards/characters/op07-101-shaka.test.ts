import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op07Shaka101, op07Vegapunk097 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-101 Shaka", () => {
  test("plays the resolving physical Trigger card with a Vegapunk Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { leaderCardId: op07Vegapunk097, life: [op07Shaka101], deck: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const shakaId = engine.findCardInZone("north", "life", op07Shaka101);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(shakaId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(shakaId);
  });

  test("uses Blocker through the public battle decision", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op07Shaka101] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const shakaId = engine.findCardInZone("south", "character", op07Shaka101);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Shaka's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(shakaId);
    engine.resolveDecision("battleBlocker", { selectedIds: [shakaId] }, "south");

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });
});
