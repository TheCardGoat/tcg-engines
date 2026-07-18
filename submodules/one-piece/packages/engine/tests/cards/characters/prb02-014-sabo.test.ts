import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, prb02SaboPrb02014014 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("PRB02-014 Sabo", () => {
  test("costs 3 with fifteen trash cards, then acts as a Blocker", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [prb02SaboPrb02014014],
        trash: Array.from({ length: 15 }, () => eb01Doma005),
        activeDon: 3,
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "south" },
    );

    engine.playCard(prb02SaboPrb02014014, "south");
    const saboId = engine.findCardInZone("south", "character", prb02SaboPrb02014014);
    expect(engine.getView("south").players.south.activeDon).toBe(0);

    engine.endTurn("south");
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Sabo's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(saboId);
    engine.resolveDecision("battleBlocker", { selectedIds: [saboId] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      saboId,
    );
  });
});
