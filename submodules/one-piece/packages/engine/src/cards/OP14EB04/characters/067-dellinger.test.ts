import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op02Vista011,
  op05Vergo023,
  op10Monet016,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Dellinger067 } from "../../../../../cards/src/cards/OP14EB04/characters/067-dellinger.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-067 Dellinger", () => {
  test("on K.O. may add one rested DON then search the top five for an included Donquixote Pirates card", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op14eb04Dellinger067],
        deck: [
          op05Vergo023,
          eb01Doma005,
          op10Monet016,
          eb01Fourtricks025,
          eb01MountainGod018,
          eb01Doma005,
        ],
        donDeckCount: 1,
      },
      { hand: [op02Vista011], activeDon: op02Vista011.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const dellingerId = engine.findCardInZone("south", "character", op14eb04Dellinger067);
    const selectedId = engine.findCardInZone("south", "deck", op05Vergo023);
    const otherEligibleId = engine.findCardInZone("south", "deck", op10Monet016);
    const ineligibleId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op02Vista011, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [dellingerId] }, "north");
    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    if (addDon?.kind !== "chooseOption") throw new Error("Expected Dellinger's DON choice.");
    expect(addDon.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected Dellinger's search choice.");
    expect(search).toMatchObject({ min: 0, max: 1 });
    expect(search.candidates.find((candidate) => candidate.ref.id === selectedId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === otherEligibleId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === ineligibleId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [selectedId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected Dellinger's remainder order.");
    const order = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: order }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ restedDon: 1, donDeckCount: 0 });
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(selectedId);
    expect(engine.getState().players.south.deck.slice(-4)).toEqual(order);
    expect(view.prompts).toHaveLength(0);
  });
});
