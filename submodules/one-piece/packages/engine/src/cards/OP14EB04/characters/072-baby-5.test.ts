import { eb01Doma005, eb01Fourtricks025, op02Vista011 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Baby5072 } from "../../../../../cards/src/cards/OP14EB04/characters/072-baby-5.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-072 Baby 5", () => {
  test("on play may add one DON from the DON deck active", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op14eb04Baby5072],
      activeDon: op14eb04Baby5072.cost,
      donDeckCount: 1,
    });

    engine.playCard(op14eb04Baby5072, "south");
    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    if (addDon?.kind !== "chooseOption") throw new Error("Expected Baby 5's active DON choice.");
    expect(addDon.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 1, donDeckCount: 0 });
    expect(view.prompts).toHaveLength(0);
  });

  test("on K.O. may return one DON and move the exact top deck card to top Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op14eb04Baby5072],
        deck: [eb01Doma005, eb01Fourtricks025],
        activeDon: 1,
      },
      { hand: [op02Vista011], activeDon: op02Vista011.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const babyId = engine.findCardInZone("south", "character", op14eb04Baby5072);
    const topDeckId = engine.findCardInZone("south", "deck", eb01Doma005);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.playCard(op02Vista011, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [babyId] }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const addLife = engine.pendingDecision("effectAddToLifeFromDeck", "south").steps[0];
    if (addLife?.kind !== "chooseOption") throw new Error("Expected Baby 5's Life count choice.");
    expect(addLife.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, lifeCount: lifeBefore + 1 });
    expect(engine.getState().players.south.life[0]).toBe(topDeckId);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline the On K.O. DON return and Life addition", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op14eb04Baby5072], deck: [eb01Doma005], activeDon: 1 },
      { hand: [op02Vista011], activeDon: op02Vista011.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const babyId = engine.findCardInZone("south", "character", op14eb04Baby5072);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.playCard(op02Vista011, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [babyId] }, "north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 1, lifeCount: lifeBefore, deckCount: 1 });
    expect(view.prompts).toHaveLength(0);
  });
});
