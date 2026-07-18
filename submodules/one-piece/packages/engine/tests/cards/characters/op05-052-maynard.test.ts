import { describe, expect, test } from "vite-plus/test";
import { op05Conis104, op05Maynard052 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-052 Maynard", () => {
  test("may rest to become the target of an opposing attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op05Maynard052, playedOnTurn: 0 }] },
      { character: [{ card: op05Conis104, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const maynardId = engine.findCardInZone("south", "character", op05Maynard052);
    const attackerId = engine.findCardInZone("north", "character", op05Conis104);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Maynard as a Blocker.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(maynardId);
    engine.resolveDecision("battleBlocker", { selectedIds: [maynardId] }, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === maynardId)?.rested,
    ).toBe(true);
  });
});
