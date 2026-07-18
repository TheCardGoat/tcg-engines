import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01KouzukiOden001, op14eb04KouzukiSukiyaki014 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB04-014 Kouzuki Sukiyaki", () => {
  test("gives one rested DON!! to a compound Land of Wano Leader and is once per turn", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: eb01KouzukiOden001,
      character: [op14eb04KouzukiSukiyaki014],
      restedDon: 1,
    });
    const sukiyakiId = engine.findCardInZone("south", "character", op14eb04KouzukiSukiyaki014);

    engine.activateEffect(sukiyakiId, "activateMain", "south");
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.restedDon).toBe(0);
    expect(view.players.south.leader.attachedDon).toBe(1);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: sukiyakiId,
        trigger: "activateMain",
      }).reason,
    ).toContain("already been used this turn");
  });

  test("blocks an opponent's attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op14eb04KouzukiSukiyaki014] },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const sukiyakiId = engine.findCardInZone("south", "character", op14eb04KouzukiSukiyaki014);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [sukiyakiId] }, "south");

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });
});
