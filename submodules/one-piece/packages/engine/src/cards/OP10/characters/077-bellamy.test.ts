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
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { character: [op10Bellamy077], activeDon: 2, donDeckCount: 1 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const bellamyId = engine.findCardInZone("north", "character", op10Bellamy077);
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    const blocker = engine.pendingDecision("battleBlocker", "north").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Bellamy's Blocker choice.");
    engine.resolveDecision("battleBlocker", { selectedIds: [bellamyId] }, "north");

    const before = engine.getView("north").players.north;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "north");
    const after = engine.getView("north").players.north;
    // Declined On Block: no rest 2 DON!! and no added active DON!! from the deck.
    expect(after.activeDon).toBe(2);
    expect(after.restedDon).toBe(0);
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});
