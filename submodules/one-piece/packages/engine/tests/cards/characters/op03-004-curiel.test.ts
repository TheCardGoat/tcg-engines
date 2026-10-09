import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op03Curiel004 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-004 Curiel", () => {
  test("can attack a Leader after its played turn ends", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op03Curiel004], activeDon: op03Curiel004.cost },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    engine.playCard(op03Curiel004);
    const curielId = engine.findCardInZone("south", "character", op03Curiel004);
    engine.endTurn("south");
    engine.endTurn("north");
    engine.attachDon(curielId, 1);
    const lifeBefore = engine.getView("south").players.north.lifeCount;
    engine.declareAttack(curielId, engine.leader("north"));
    // No usable Counter remains, so the Counter Step ends automatically.
    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 1);
  });

  test("without DON!! cannot attack even a Character on the turn it is played", () => {
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
    ).toContain("cannot attack");
    expect(
      engine.expectFailure({ type: "declareAttack", seat: "south", attackerId: curielId, targetId })
        .reason,
    ).toContain("cannot attack");
    expect(engine.getView("south").players.north.trash).toHaveLength(0);
  });

  test("with DON!! can attack a Character but still cannot attack a Leader on its played turn", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op03Curiel004], activeDon: op03Curiel004.cost + 1 },
      { character: [{ card: eb01Doma005, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.playCard(op03Curiel004, "south");
    const curielId = engine.findCardInZone("south", "character", op03Curiel004);
    engine.attachDon(curielId, 1, "south");
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: curielId,
        targetId: engine.leader("north"),
      }).reason,
    ).toContain("cannot be attacked");
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);
    engine.declareAttack(curielId, targetId, "south");
    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );

    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore);
  });
});
