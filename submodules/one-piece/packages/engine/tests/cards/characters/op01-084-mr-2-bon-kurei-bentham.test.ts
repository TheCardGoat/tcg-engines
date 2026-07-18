import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op01DesertSpada088,
  op01Mr2BonKureiBentham084,
  op01MsAllSunday079,
  op01PunkGibson058,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-084 Mr.2.Bon.Kurei (Bentham)", () => {
  test("with DON!! attached finds an included Baroque Works Event and bottoms the ordered rest", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op01Mr2BonKureiBentham084, attachedDon: 1, playedOnTurn: 0 }],
        deck: [
          op01DesertSpada088,
          op01PunkGibson058,
          op01MsAllSunday079,
          eb01Doma005,
          eb01Fourtricks025,
        ],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const mr2Id = engine.findCardInZone("south", "character", op01Mr2BonKureiBentham084);
    const eventId = engine.findCardInZone("south", "deck", op01DesertSpada088);
    const wrongEventId = engine.findCardInZone("south", "deck", op01PunkGibson058);
    const wrongCategoryId = engine.findCardInZone("south", "deck", op01MsAllSunday079);

    engine.declareAttack(mr2Id, engine.leader("north"), "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Mr.2's Event search.");
    expect(search.min).toBe(0);
    expect(search.max).toBe(1);
    expect(search.candidates.find((candidate) => candidate.ref.id === eventId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === wrongEventId)?.legal).toBe(
      false,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === wrongCategoryId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [eventId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Mr.2's remainder order.");
    const chosenOrder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: chosenOrder }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(eventId);
    expect(engine.getState().players.south.deck.slice(-4)).toEqual(chosenOrder);
    expect(view.prompts).toHaveLength(0);
  });

  test("without attached DON!! does not search the deck when attacking", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op01Mr2BonKureiBentham084, playedOnTurn: 0 }],
        deck: [op01DesertSpada088, eb01Doma005],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const mr2Id = engine.findCardInZone("south", "character", op01Mr2BonKureiBentham084);
    const deckBefore = [...engine.getState().players.south.deck];

    engine.declareAttack(mr2Id, engine.leader("north"), "south");

    expect(engine.getState().players.south.deck).toEqual(deckBefore);
    expect(engine.getView("south").players.south.hand).toHaveLength(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
