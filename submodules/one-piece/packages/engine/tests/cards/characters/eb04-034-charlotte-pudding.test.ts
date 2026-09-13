import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op01RoundTable027, op14eb04CharlottePudding034 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB04-034 Charlotte Pudding", () => {
  test("blocks an opponent's attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op14eb04CharlottePudding034] },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const puddingId = engine.findCardInZone("south", "character", op14eb04CharlottePudding034);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [puddingId] }, "south");

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });

  test("on an opponent attack, trashes one card and grants +2000 during that battle with four Events in trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op14eb04CharlottePudding034],
        hand: [eb01Doma005],
        trash: Array.from({ length: 4 }, () => op01RoundTable027),
      },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);
    const discardId = engine.findCardInZone("south", "hand", eb01Doma005);
    const leaderId = engine.leader("south");
    const leaderPower = engine.getView("south").players.south.leader.power;

    engine.declareAttack(attackerId, leaderId, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [leaderId] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      discardId,
    );
    expect(engine.getView("south").players.south.leader.power).toBe((leaderPower ?? 0) + 2000);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op14eb04CharlottePudding034],
        hand: [eb01Doma005],
        trash: Array.from({ length: 4 }, () => op01RoundTable027),
      },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);
    const discardId = engine.findCardInZone("south", "hand", eb01Doma005);
    const leaderId = engine.leader("south");
    const leaderPower = engine.getView("south").players.south.leader.power;
    const handBefore = engine.getView("south").players.south.hand.length;
    const trashBefore = engine.getView("south").players.south.trash.length;

    engine.declareAttack(attackerId, leaderId, "north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(discardId);
    expect(view.players.south.hand.length).toBe(handBefore);
    expect(view.players.south.trash.length).toBe(trashBefore);
    expect(view.players.south.leader.power).toBe(leaderPower);
  });
});
