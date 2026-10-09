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
  test("draws once for each of three Characters played by Moria's Life Trigger", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op14eb04BoaHancockOp14041041,
        life: ["OP16-105"],
        trash: ["OP14-100", "OP14-110", "OP10-036"],
        deck: Array(5).fill("ST02-002"),
      },
      { character: [{ cardId: "EB01-018", playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const ids = ["OP14-100", "OP14-110", "OP10-036"].map((id) =>
      engine.findCardInZone("south", "trash", id),
    );
    engine.declareAttack(
      engine.findCardInZone("north", "character", "EB01-018"),
      engine.leader("south"),
      "north",
    );
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");
    engine.resolveDecision("effectGroupedPlaySelection", { selectedIds: ids }, "south");
    while (engine.getView("south").prompts.length) {
      const step = engine.pendingDecision("readyEffectOrder", "south").steps[0];
      if (step?.kind !== "chooseOption") throw new Error("Expected simultaneous draw order");
      engine.resolveDecision("readyEffectOrder", { optionId: step.options[0]!.id }, "south");
    }
    expect(engine.getView("south").players.south.handCount).toBe(3);
    expect(engine.getView("south").players.south.deckCount).toBe(2);
    expect(engine.getView("south").players.south.characters.filter(Boolean)).toHaveLength(3);
  });
});
