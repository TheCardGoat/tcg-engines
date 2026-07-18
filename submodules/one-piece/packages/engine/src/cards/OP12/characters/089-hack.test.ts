import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op01Shanks120, op12Koala081 } from "@tcg/op-cards";
import { op12Hack089 } from "../../../../../cards/src/cards/OP12/characters/089-hack.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-089 Hack", () => {
  test("with a Revolutionary Army Leader gains cost and can block", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op12Koala081, character: [op12Hack089] },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const hackId = engine.findCardInZone("south", "character", op12Hack089);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === hackId)
        ?.cost,
    ).toBe(op12Hack089.cost + 4);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [hackId] }, "south");

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });

  test("when K.O.'d targets only an opposing base-cost-4-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op12Koala081,
        character: [{ card: op12Hack089, rested: true, playedOnTurn: 0 }],
      },
      { character: [{ card: op01Shanks120, playedOnTurn: 0 }, eb01Doma005] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const hackId = engine.findCardInZone("south", "character", op12Hack089);
    const attackerId = engine.findCardInZone("north", "character", op01Shanks120);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(attackerId, hackId, "north");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Hack's On K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toContain(
      eligibleId,
    );
  });
});
