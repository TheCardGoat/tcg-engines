import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01CavendishBoxTopper008,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-008 Cavendish (Box Topper)", () => {
  test("optionally adds one Life card to hand before gaining Rush for the turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op01CavendishBoxTopper008],
        life: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        activeDon: op01CavendishBoxTopper008.cost,
      },
      { character: [{ card: eb01Doma005, rested: true, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;
    const topLifeId = engine.findCardInZone("south", "life", eb01Doma005);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op01CavendishBoxTopper008, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cavendishId = engine.findCardInZone("south", "character", op01CavendishBoxTopper008);
    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore - 1);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(topLifeId);

    engine.declareAttack(cavendishId, targetId, "south");
    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
  });

  test("may decline the Life cost and does not gain Rush", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op01CavendishBoxTopper008],
        life: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        activeDon: op01CavendishBoxTopper008.cost,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.playCard(op01CavendishBoxTopper008, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const cavendishId = engine.findCardInZone("south", "character", op01CavendishBoxTopper008);

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: cavendishId,
        targetId: engine.leader("north"),
      }).accepted,
    ).toBe(false);
  });
});
