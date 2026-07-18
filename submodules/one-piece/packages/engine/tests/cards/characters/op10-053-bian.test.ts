import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op10Bian053, op10Cub044 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP10-053 Bian", () => {
  test("gains Blocker only with another compound-type The Tontattas Character", () => {
    const createEngine = (withOtherTontatta: boolean) =>
      OnePieceTestEngine.create(
        { character: withOtherTontatta ? [op10Bian053, op10Cub044] : [op10Bian053] },
        { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
        { firstPlayer: "south", activeSeat: "north" },
      );

    const unavailable = createEngine(false);
    const firstAttackerId = unavailable.findCardInZone("north", "character", eb01Doma005);
    unavailable.declareAttack(firstAttackerId, unavailable.leader("south"), "north");
    expect(unavailable.getView("south").prompts).toHaveLength(0);

    const engine = createEngine(true);
    const bianId = engine.findCardInZone("south", "character", op10Bian053);
    const secondAttackerId = engine.findCardInZone("north", "character", eb01Doma005);
    engine.declareAttack(secondAttackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Bian's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(bianId);
    engine.resolveDecision("battleBlocker", { selectedIds: [bianId] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      bianId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
