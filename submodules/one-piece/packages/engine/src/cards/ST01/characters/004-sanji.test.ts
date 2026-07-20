import { describe, expect, test } from "vite-plus/test";
import { st01Sanji004 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("ST01-004 Sanji", () => {
  test("with two attached DON!! gains Rush and attacks on its play turn", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [st01Sanji004], activeDon: st01Sanji004.cost + 2 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(st01Sanji004, "south");
    const sanjiId = engine.findCardInZone("south", "character", st01Sanji004);
    engine.attachDon(sanjiId, 2, "south");
    engine.declareAttack(sanjiId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === sanjiId)?.rested).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("with only one attached DON!! cannot attack on its play turn", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [st01Sanji004], activeDon: st01Sanji004.cost + 1 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(st01Sanji004, "south");
    const sanjiId = engine.findCardInZone("south", "character", st01Sanji004);
    engine.attachDon(sanjiId, 1, "south");
    const failure = engine.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId: sanjiId,
      targetId: engine.leader("north"),
    });

    expect(failure.reason).toContain("cannot attack");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
