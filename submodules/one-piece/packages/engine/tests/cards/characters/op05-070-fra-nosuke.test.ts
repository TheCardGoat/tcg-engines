import { describe, expect, test } from "vite-plus/test";
import { op05FraNosuke070 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-070 Fra-Nosuke", () => {
  test("with DON!! x1 and eight DON!! on the field, gains Rush for an immediate attack", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op05FraNosuke070], activeDon: 8 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(op05FraNosuke070, "south");
    const fraNosukeId = engine.findCardInZone("south", "character", op05FraNosuke070);
    engine.attachDon(fraNosukeId, 1, "south");
    engine.declareAttack(fraNosukeId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === fraNosukeId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not gain Rush below eight DON!! or without DON!! x1", () => {
    const sevenDon = OnePieceTestEngine.create(
      { hand: [op05FraNosuke070], activeDon: 7 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    sevenDon.playCard(op05FraNosuke070, "south");
    const sevenDonId = sevenDon.findCardInZone("south", "character", op05FraNosuke070);
    sevenDon.attachDon(sevenDonId, 1, "south");
    expect(
      sevenDon.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: sevenDonId,
        targetId: sevenDon.leader("north"),
      }).accepted,
    ).toBe(false);

    const noAttachedDon = OnePieceTestEngine.create(
      { hand: [op05FraNosuke070], activeDon: 8 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    noAttachedDon.playCard(op05FraNosuke070, "south");
    const noAttachedId = noAttachedDon.findCardInZone("south", "character", op05FraNosuke070);
    expect(
      noAttachedDon.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: noAttachedId,
        targetId: noAttachedDon.leader("north"),
      }).accepted,
    ).toBe(false);
  });
});
