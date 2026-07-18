import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op01Shanks120 } from "@tcg/op-cards";
import { op12BartholomewKuma119 } from "../../../../../cards/src/cards/OP12/characters/119-bartholomew-kuma.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-119 Bartholomew Kuma", () => {
  test("may trash a chosen hand card to add top deck to Life and gain 2 cost through the opponent's next End Phase", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op12BartholomewKuma119, eb01Doma005],
      deck: [eb01MountainGod018, eb01Doma005],
      activeDon: op12BartholomewKuma119.cost,
    });
    const paidId = engine.findCardInZone("south", "hand", eb01Doma005);
    const topDeckId = engine.findCardInZone("south", "deck", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.playCard(op12BartholomewKuma119, "south");
    const kumaId = engine.findCardInZone("south", "character", op12BartholomewKuma119);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");

    let view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(paidId);
    expect(view.players.south.lifeCount).toBe(lifeBefore + 1);
    expect(engine.getState().players.south.life[0]).toBe(topDeckId);
    expect(view.players.south.characters.find((card) => card?.instanceId === kumaId)?.cost).toBe(
      op12BartholomewKuma119.cost + 2,
    );

    engine.endTurn("south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === kumaId)
        ?.cost,
    ).toBe(op12BartholomewKuma119.cost + 2);
    engine.endTurn("north");
    view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === kumaId)?.cost).toBe(
      op12BartholomewKuma119.cost,
    );
  });

  test("on K.O. during the opponent's turn may add the top deck card to Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op12BartholomewKuma119, rested: true }],
        deck: [eb01Doma005, eb01MountainGod018],
      },
      { character: [{ card: op01Shanks120, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const kumaId = engine.findCardInZone("south", "character", op12BartholomewKuma119);
    const topDeckId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.declareAttack(
      engine.findCardInZone("north", "character", op01Shanks120),
      kumaId,
      "north",
    );
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");

    expect(engine.getState().players.south.life[0]).toBe(topDeckId);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      kumaId,
    );
  });
});
