import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op12JaguarDSaul050 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-050 Jaguar.D.Saul", () => {
  test("is a legal Blocker", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op12JaguarDSaul050] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const saulId = engine.findCardInZone("south", "character", op12JaguarDSaul050);

    engine.declareAttack(
      engine.findCardInZone("north", "character", eb01MountainGod018),
      engine.leader("south"),
      "north",
    );
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Saul's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(saulId);
  });
});
