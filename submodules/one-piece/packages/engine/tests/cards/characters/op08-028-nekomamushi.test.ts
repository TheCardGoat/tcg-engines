import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op08Nekomamushi028 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function createThresholdEngine(restedDon: number) {
  return OnePieceTestEngine.create(
    { hand: [op08Nekomamushi028], activeDon: op08Nekomamushi028.cost },
    {
      character: Array.from({ length: 5 }, () => ({ card: eb01Doma005, rested: true })),
      restedDon,
    },
    { firstPlayer: "north", activeSeat: "south" },
  );
}

describe("OP08-028 Nekomamushi", () => {
  test("gains Rush on play when the opponent has exactly 7 rested cards", () => {
    const engine = createThresholdEngine(2);

    engine.playCard(op08Nekomamushi028, "south");
    const nekomamushiId = engine.findCardInZone("south", "character", op08Nekomamushi028);

    engine.declareAttack(nekomamushiId, engine.leader("north"), "south");
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === nekomamushiId)?.rested,
    ).toBe(true);
  });

  test("does not gain Rush when the opponent has only 6 rested cards", () => {
    const engine = createThresholdEngine(1);

    engine.playCard(op08Nekomamushi028, "south");
    const nekomamushiId = engine.findCardInZone("south", "character", op08Nekomamushi028);

    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: nekomamushiId,
        targetId: engine.leader("north"),
      }).reason,
    ).toBe("The selected attacker cannot attack.");
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === nekomamushiId)?.rested,
    ).toBe(false);
  });
});
