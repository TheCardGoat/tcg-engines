import { describe, expect, test } from "vite-plus/test";
import {
  op06ButIWillNeverDoubtAWomanSTears057,
  op14eb04BoaHancockOp14041041,
  op14eb04GloriosaGrandmaNyon103,
  op14eb04Mr9095,
  op14eb04Ran114,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP14-041 Boa Hancock", () => {
  test("draws when its controller plays a Character on the opponent's turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op14eb04BoaHancockOp14041041,
        hand: [op14eb04GloriosaGrandmaNyon103],
        life: [op06ButIWillNeverDoubtAWomanSTears057],
        deck: [op14eb04Mr9095, op14eb04Mr9095, op14eb04Mr9095, op14eb04Mr9095, op14eb04Mr9095],
      },
      { character: [{ card: op14eb04Mr9095, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackerId = engine.findCardInZone("north", "character", op14eb04Mr9095);
    const playedId = engine.findCardInZone("south", "hand", op14eb04GloriosaGrandmaNyon103);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");
    engine.resolveDecision("effectPlaySelection", { selectedIds: [playedId] }, "south");

    expect(
      engine.getView("south").players.south.characters.map((card) => card?.instanceId),
    ).toContain(playedId);
    expect(engine.getView("south").players.south.hand).toHaveLength(1);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("removes opposing Life when a qualifying Kuja Pirates Character is K.O.'d", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op14eb04BoaHancockOp14041041,
        character: [{ card: op14eb04Ran114, rested: true, playedOnTurn: 0 }],
        activeDon: 1,
      },
      {
        character: [{ card: op14eb04Mr9095, playedOnTurn: 0 }],
        life: [op14eb04Mr9095, op14eb04Mr9095],
      },
    );
    const ranId = engine.findCardInZone("south", "character", op14eb04Ran114);
    const attackerId = engine.findCardInZone("north", "character", op14eb04Mr9095);

    engine.attachDon(engine.leader("south"), 1, "south");
    engine.endTurn("south");
    engine.declareAttack(attackerId, ranId, "north");
    engine.resolveDecision("effectRemoveFromLifeCount", { optionId: "1" }, "south");

    expect(engine.getView("south").players.north.lifeCount).toBe(1);
    expect(engine.getView("south").players.north.hand).toHaveLength(2);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
