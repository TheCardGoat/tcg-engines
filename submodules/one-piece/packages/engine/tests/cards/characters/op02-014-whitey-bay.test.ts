import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op02WhiteyBay014 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-014 Whitey Bay", () => {
  test("with one DON!! attached, can attack an opposing active Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op02WhiteyBay014, attachedDon: 1, playedOnTurn: 0 }] },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const whiteyBayId = engine.findCardInZone("south", "character", op02WhiteyBay014);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(whiteyBayId, targetId, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(targetId);
    expect(view.prompts).toHaveLength(0);
  });

  test("without DON!! attached, cannot attack an opposing active Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op02WhiteyBay014, playedOnTurn: 0 }] },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const failure = engine.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId: engine.findCardInZone("south", "character", op02WhiteyBay014),
      targetId: engine.findCardInZone("north", "character", eb01Doma005),
    });

    expect(failure.accepted).toBe(false);
  });
});
