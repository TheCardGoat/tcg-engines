import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op09GolDRoger118, op10Scotch008 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

function blockRogerAttack(southLife: number, northLife: number) {
  const life = (count: number) => Array.from({ length: count }, () => eb01Doma005);
  const deck = (lifeCount: number) =>
    Array.from({ length: Math.max(5 - lifeCount, 1) }, () => eb01Doma005);
  const engine = OnePieceTestEngine.create(
    {
      character: [{ card: op09GolDRoger118, playedOnTurn: 0 }],
      life: life(southLife),
      deck: deck(southLife),
    },
    {
      character: [op10Scotch008],
      life: life(northLife),
      deck: deck(northLife),
    },
    { firstPlayer: "north", activeSeat: "south" },
  );
  const rogerId = engine.findCardInZone("south", "character", op09GolDRoger118);
  const blockerId = engine.findCardInZone("north", "character", op10Scotch008);
  engine.declareAttack(rogerId, engine.leader("north"), "south");
  engine.resolveDecision("battleBlocker", { selectedIds: [blockerId] }, "north");
  return engine;
}

describe("OP09-118 Gol.D.Roger", () => {
  test("wins when the opponent activates Blocker while Roger's controller has no Life", () => {
    expect(blockRogerAttack(0, 1).getState()).toMatchObject({
      status: "finished",
      winner: "south",
    });
  });

  test("wins when the opponent activates Blocker while that opponent has no Life", () => {
    expect(blockRogerAttack(1, 0).getState()).toMatchObject({
      status: "finished",
      winner: "south",
    });
  });

  test("does not win from Blocker while both players still have Life", () => {
    expect(blockRogerAttack(1, 1).getState()).toMatchObject({
      status: "active",
      winner: null,
    });
  });

  test("can attack on the turn it is played with Rush", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op09GolDRoger118], activeDon: op09GolDRoger118.cost },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(op09GolDRoger118, "south");
    const rogerId = engine.findCardInZone("south", "character", op09GolDRoger118);

    expect(() => engine.declareAttack(rogerId, engine.leader("north"), "south")).not.toThrow();
  });
});
