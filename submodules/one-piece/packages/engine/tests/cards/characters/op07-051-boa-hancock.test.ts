import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op01MonkeyDLuffy024,
  op07BoaHancock051,
  op07GloriosaGrandmaNyon041,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-051 Boa Hancock", () => {
  test("restricts a non-Luffy opponent through their next turn, then may bottom-deck either player's Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op07BoaHancock051],
        character: [op07GloriosaGrandmaNyon041],
        activeDon: op07BoaHancock051.cost,
      },
      {
        character: [
          { card: eb01Doma005, playedOnTurn: 0 },
          { card: op01MonkeyDLuffy024, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const restrictedId = engine.findCardInZone("north", "character", eb01Doma005);
    const luffyId = engine.findCardInZone("north", "character", op01MonkeyDLuffy024);
    const ownLowCostId = engine.findCardInZone("south", "character", op07GloriosaGrandmaNyon041);
    const ownDeckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(op07BoaHancock051, "south");
    const restriction = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(restriction).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (restriction?.kind !== "selectEntity")
      throw new Error("Expected Hancock's attack restriction.");
    expect(restriction.candidates.map((candidate) => candidate.ref.id)).toEqual([restrictedId]);
    expect(restriction.candidates.map((candidate) => candidate.ref.id)).not.toContain(luffyId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [restrictedId] }, "south");

    const bottomDeck = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(bottomDeck).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (bottomDeck?.kind !== "selectEntity") throw new Error("Expected Hancock's deck choice.");
    expect(bottomDeck.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([ownLowCostId, restrictedId]),
    );
    expect(bottomDeck.candidates.map((candidate) => candidate.ref.id)).not.toContain(luffyId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownLowCostId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(ownDeckBefore + 1);
    expect(view.players.south.characters.map((card) => card?.instanceId)).not.toContain(
      ownLowCostId,
    );

    engine.endTurn("south");
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "north",
        attackerId: restrictedId,
        targetId: engine.leader("south"),
      }).reason,
    ).toBe("The selected attacker cannot attack.");

    engine.endTurn("north");
    engine.endTurn("south");
    engine.declareAttack(restrictedId, engine.leader("south"), "north");
    view = engine.getView("north");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === restrictedId)?.rested,
    ).toBe(true);
  });
});
