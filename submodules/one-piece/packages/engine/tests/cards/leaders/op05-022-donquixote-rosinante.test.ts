import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op05DonquixoteRosinante022 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-022 Donquixote Rosinante", () => {
  test("blocks for another card and reactivates itself at the end of its turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      {
        leaderCardId: op05DonquixoteRosinante022,
        character: [{ card: eb01Doma005, rested: true, playedOnTurn: 0 }],
        life: [eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const protectedId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(
      engine.findCardInZone("south", "character", eb01Doma005),
      protectedId,
      "south",
    );
    const blocker = engine.pendingDecision("battleBlocker", "north").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected a Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(
      engine.leader("north"),
    );
    engine.resolveDecision("battleBlocker", { selectedIds: [engine.leader("north")] }, "north");

    engine.endTurn("south");
    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    expect(engine.getView("north").players.north.leader.rested).toBe(true);
    engine.endTurn("north");
    expect(engine.getView("north").players.north.leader.rested).toBe(false);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
