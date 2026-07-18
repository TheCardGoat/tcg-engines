import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op10Bian053, op10Leo057 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-053 Bian", () => {
  test("gains Blocker while another The Tontattas Character is present", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op10Bian053, op10Leo057] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const bianId = engine.findCardInZone("south", "character", op10Bian053);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Bian as a Blocker.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(bianId);
    engine.resolveDecision("battleBlocker", { selectedIds: [bianId] }, "south");
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      bianId,
    );
  });

  test("does not gain Blocker from itself alone", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op10Bian053] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    expect(() => engine.pendingDecision("battleBlocker", "south")).toThrow();
  });
});
