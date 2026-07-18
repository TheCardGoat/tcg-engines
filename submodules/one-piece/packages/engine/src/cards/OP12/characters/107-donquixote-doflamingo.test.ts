import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op12DonquixoteDoflamingo107 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-107 Donquixote Doflamingo", () => {
  test("at two Life gains Rush and can attack the turn it is played", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op12DonquixoteDoflamingo107],
        life: [eb01Doma005, eb01Doma005],
        activeDon: op12DonquixoteDoflamingo107.cost,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    engine.playCard(op12DonquixoteDoflamingo107, "south");
    const id = engine.findCardInZone("south", "character", op12DonquixoteDoflamingo107);
    engine.declareAttack(id, engine.leader("north"), "south");
  });

  test("when K.O.'d on the opponent's turn may add the top deck card to Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op12DonquixoteDoflamingo107, rested: true }],
        deck: [eb01Doma005, eb01Doma005],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0, attachedDon: 2 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const doflamingoId = engine.findCardInZone("south", "character", op12DonquixoteDoflamingo107);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;
    engine.declareAttack(attackerId, doflamingoId, "north");
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");
    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore + 1);
  });
});
