import { describe, expect, test } from "vite-plus/test";
import { op11Doll008, op11PrinceGrus013, op10Trebol070 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-013 Prince Grus", () => {
  test("when attacking prevents only power-2000-or-less Characters from blocking", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op11PrinceGrus013, playedOnTurn: 0 }] },
      { character: [op11Doll008, op10Trebol070] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const grusId = engine.findCardInZone("south", "character", op11PrinceGrus013);
    const lowBlockerId = engine.findCardInZone("north", "character", op11Doll008);
    const highBlockerId = engine.findCardInZone("north", "character", op10Trebol070);

    engine.declareAttack(grusId, engine.leader("north"), "south");
    const blocker = engine.pendingDecision("battleBlocker", "north").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected legal Blocker choices.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).not.toContain(lowBlockerId);
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(highBlockerId);
    engine.resolveDecision("battleBlocker", { selectedIds: [highBlockerId] }, "north");

    expect(
      engine
        .getView("north")
        .players.north.characters.find((card) => card?.instanceId === highBlockerId)?.rested,
    ).toBe(true);
  });
});
