import { describe, expect, test } from "vite-plus/test";
import { op08Robson013 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-013 Robson", () => {
  test("gains Rush when two DON!! are attached", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op08Robson013], activeDon: op08Robson013.cost + 2 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(op08Robson013, "south");
    const robsonId = engine.findCardInZone("south", "character", op08Robson013);
    engine.attachDon(robsonId, 2, "south");
    engine.declareAttack(robsonId, engine.leader("north"), "south");

    const robson = engine
      .getView("south")
      .players.south.characters.find((card) => card?.instanceId === robsonId);
    expect(robson).toMatchObject({ rested: true, attachedDon: 2, power: 6000 });
  });

  test("cannot attack the turn it is played with only one attached DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op08Robson013], activeDon: op08Robson013.cost + 1 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(op08Robson013, "south");
    const robsonId = engine.findCardInZone("south", "character", op08Robson013);
    engine.attachDon(robsonId, 1, "south");

    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: robsonId,
        targetId: engine.leader("north"),
      }).accepted,
    ).toBe(false);
  });
});
