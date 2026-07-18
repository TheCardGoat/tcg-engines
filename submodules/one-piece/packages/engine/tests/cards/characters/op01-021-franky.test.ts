import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op01Franky021 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-021 Franky", () => {
  test("with DON!! attached, attacks an opposing active Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op01Franky021, attachedDon: 1, playedOnTurn: 0 }] },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const frankyId = engine.findCardInZone("south", "character", op01Franky021);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(frankyId, targetId, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
  });

  test("without DON!! attached, cannot attack an opposing active Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op01Franky021, playedOnTurn: 0 }] },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const frankyId = engine.findCardInZone("south", "character", op01Franky021);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: frankyId,
        targetId,
      }).accepted,
    ).toBe(false);
  });
});
