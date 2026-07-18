import { describe, expect, test } from "vite-plus/test";
import { op14eb04Diamante066, op14eb04DonquixoteDoflamingoOp14060060 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP14-060 Donquixote Doflamingo", () => {
  test("returns DON!! and changes an opposing attack to the selected Donquixote Pirates Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op14eb04DonquixoteDoflamingoOp14060060,
        character: [{ card: op14eb04Diamante066, playedOnTurn: 0 }],
        restedDon: 1,
        life: 2,
      },
      { character: [{ card: op14eb04Diamante066, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const defenderId = engine.findCardInZone("south", "character", op14eb04Diamante066);
    const attackerId = engine.findCardInZone("north", "character", op14eb04Diamante066);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity")
      throw new Error("Expected Doflamingo's battle target choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("south"),
      defenderId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [defenderId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(2);
    expect(view.players.south.characters.map((card) => card?.instanceId)).not.toContain(defenderId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(defenderId);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
