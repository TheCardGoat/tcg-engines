import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op05Bastille048, op05Buffalo031, op05Maynard052 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-048 Bastille", () => {
  test("with DON!! x1, attacks and offers current-cost-2 Characters from either field", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op05Bastille048, attachedDon: 1, playedOnTurn: 0 }, eb01Doma005],
      },
      { character: [op05Maynard052, op05Buffalo031] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const bastilleId = engine.findCardInZone("south", "character", op05Bastille048);
    const ownId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingId = engine.findCardInZone("north", "character", op05Maynard052);
    const expensiveId = engine.findCardInZone("north", "character", op05Buffalo031);

    engine.declareAttack(bastilleId, engine.leader("north"), "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Bastille's Character target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([ownId, opposingId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownId] }, "south");

    expect(engine.getState().players.south.deck.at(-1)).toBe(ownId);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may choose zero, while attacking without attached DON!! offers no effect", () => {
    const zeroEngine = OnePieceTestEngine.create(
      { character: [{ card: op05Bastille048, attachedDon: 1, playedOnTurn: 0 }] },
      { character: [op05Maynard052] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const zeroBastilleId = zeroEngine.findCardInZone("south", "character", op05Bastille048);
    const untouchedId = zeroEngine.findCardInZone("north", "character", op05Maynard052);
    zeroEngine.declareAttack(zeroBastilleId, zeroEngine.leader("north"), "south");
    zeroEngine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    expect(
      zeroEngine
        .getView("south")
        .players.north.characters.some((card) => card?.instanceId === untouchedId),
    ).toBe(true);
    expect(zeroEngine.getView("south").prompts).toHaveLength(0);

    const gatedEngine = OnePieceTestEngine.create(
      { character: [{ card: op05Bastille048, playedOnTurn: 0 }] },
      { character: [op05Maynard052] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const gatedBastilleId = gatedEngine.findCardInZone("south", "character", op05Bastille048);
    const gatedTargetId = gatedEngine.findCardInZone("north", "character", op05Maynard052);
    gatedEngine.declareAttack(gatedBastilleId, gatedEngine.leader("north"), "south");
    expect(
      gatedEngine
        .getView("south")
        .players.north.characters.some((card) => card?.instanceId === gatedTargetId),
    ).toBe(true);
    expect(gatedEngine.getView("south").prompts).toHaveLength(0);
  });
});
