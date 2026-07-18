import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op10Bellamy077 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-077 Bellamy", () => {
  test("blocks, rests two DON!! for On Block, then adds one active DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { character: [op10Bellamy077], activeDon: 2, donDeckCount: 1 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const bellamyId = engine.findCardInZone("north", "character", op10Bellamy077);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    const blocker = engine.pendingDecision("battleBlocker", "north").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Bellamy's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(bellamyId);
    engine.resolveDecision("battleBlocker", { selectedIds: [bellamyId] }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "north");

    const view = engine.getView("north");
    expect(view.players.north).toMatchObject({
      lifeCount: lifeBefore,
      activeDon: 1,
      restedDon: 2,
      donDeckCount: 0,
    });
    expect(view.prompts).toHaveLength(0);
  });
});
