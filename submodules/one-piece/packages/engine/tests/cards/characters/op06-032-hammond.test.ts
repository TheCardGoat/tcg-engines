import { describe, expect, test } from "vite-plus/test";
import { op05Conis104, op06Hammond032 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-032 Hammond", () => {
  test("may rest to become the target of an opposing attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op06Hammond032] },
      { character: [{ card: op05Conis104, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const hammondId = engine.findCardInZone("south", "character", op06Hammond032);
    const attackerId = engine.findCardInZone("north", "character", op05Conis104);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Hammond's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(hammondId);
    engine.resolveDecision("battleBlocker", { selectedIds: [hammondId] }, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === hammondId)?.rested,
    ).toBe(true);
  });
});
