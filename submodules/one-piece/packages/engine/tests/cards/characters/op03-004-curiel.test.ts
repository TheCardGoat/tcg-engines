import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op03Curiel004 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-004 Curiel", () => {
  test("can attack a Character but not a Leader on the turn it is played", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op03Curiel004], activeDon: op03Curiel004.cost },
      { character: [{ card: eb01Doma005, rested: true, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op03Curiel004, "south");
    const curielId = engine.findCardInZone("south", "character", op03Curiel004);

    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: curielId,
        targetId: engine.leader("north"),
      }).reason,
    ).toContain("cannot be attacked");
    engine.declareAttack(curielId, targetId, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
  });

  test("with DON!! attached, gains full Rush and can attack a Leader on the turn it is played", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op03Curiel004], activeDon: op03Curiel004.cost + 1 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.playCard(op03Curiel004, "south");
    const curielId = engine.findCardInZone("south", "character", op03Curiel004);
    engine.attachDon(curielId, 1, "south");
    engine.declareAttack(curielId, engine.leader("north"), "south");

    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 1);
  });
});
