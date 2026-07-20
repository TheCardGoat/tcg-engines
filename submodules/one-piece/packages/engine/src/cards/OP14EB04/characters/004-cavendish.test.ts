import { eb01Doma005 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Cavendish004 } from "../../../../../cards/src/cards/OP14EB04/characters/004-cavendish.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-004 Cavendish", () => {
  test("dynamically gains Rush at 5000 power and attacks on its play turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04Cavendish004],
        activeDon: op14eb04Cavendish004.cost + 3,
      },
      { character: [{ card: eb01Doma005, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op14eb04Cavendish004, "south");
    const cavendishId = engine.findCardInZone("south", "character", op14eb04Cavendish004);
    engine.attachDon(cavendishId, 3, "south");
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === cavendishId)?.power,
    ).toBe(5000);
    engine.declareAttack(cavendishId, targetId, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === cavendishId)?.rested,
    ).toBe(true);
  });

  test("below 5000 power cannot attack on its play turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04Cavendish004],
        activeDon: op14eb04Cavendish004.cost + 2,
      },
      { character: [{ card: eb01Doma005, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op14eb04Cavendish004, "south");
    const cavendishId = engine.findCardInZone("south", "character", op14eb04Cavendish004);
    engine.attachDon(cavendishId, 2, "south");

    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: cavendishId,
        targetId,
      }).reason,
    ).toBe("The selected attacker cannot attack.");
  });
});
