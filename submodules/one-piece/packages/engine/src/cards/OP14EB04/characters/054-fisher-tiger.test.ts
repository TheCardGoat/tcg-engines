import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01RoronoaZoro001,
  op01Shanks120,
  op02Vista011,
  op03Arlong022,
  op13Koby025,
  op13Otama043,
  op14eb04EdwardNewgate044,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04FisherTiger054 } from "../../../../../cards/src/cards/OP14EB04/characters/054-fisher-tiger.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-054 Fisher Tiger", () => {
  test("a compound Fish-Man Leader draws three exact cards, then End Phase trashes selected physical cards down to five", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op03Arlong022,
      hand: [
        op14eb04FisherTiger054,
        op13Otama043,
        op13Koby025,
        op14eb04EdwardNewgate044,
        op02Vista011,
        eb01Doma005,
      ],
      deck: [eb01Fourtricks025, eb01MountainGod018, op01Shanks120, eb01Doma005],
      activeDon: op14eb04FisherTiger054.cost,
    });
    const firstDrawId = engine.findCardInZone("south", "deck", eb01Fourtricks025);
    const secondDrawId = engine.findCardInZone("south", "deck", eb01MountainGod018);
    const thirdDrawId = engine.findCardInZone("south", "deck", op01Shanks120);

    engine.playCard(op14eb04FisherTiger054, "south");

    let view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstDrawId, secondDrawId, thirdDrawId]),
    );
    expect(view.players.south).toMatchObject({ handCount: 8, deckCount: 1 });
    expect(view.players.south.trash).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);

    engine.endTurn("south");
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (trash?.kind !== "selectEntity") {
      throw new Error("Expected Fisher Tiger's End Phase hand-trash choice.");
    }
    expect(trash).toMatchObject({ min: 3, max: 3 });
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([firstDrawId, secondDrawId, thirdDrawId]),
    );
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [firstDrawId, secondDrawId, thirdDrawId] },
      "south",
    );

    view = engine.getView("south");
    expect(view.players.south.handCount).toBe(5);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstDrawId, secondDrawId, thirdDrawId]),
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("a non-Fish-Man Leader does not draw on play", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op01RoronoaZoro001,
      hand: [op14eb04FisherTiger054],
      deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op01Shanks120],
      activeDon: op14eb04FisherTiger054.cost,
    });
    const retainedTopId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op14eb04FisherTiger054, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ handCount: 0, deckCount: 4 });
    expect(view.players.south.hand.map((card) => card.instanceId)).not.toContain(retainedTopId);
    expect(view.prompts).toHaveLength(0);
  });

  test("at exactly five cards in hand the End Phase effect trashes nothing", () => {
    const engine = OnePieceTestEngine.create({
      character: [op14eb04FisherTiger054],
      hand: [op13Otama043, op13Koby025, op02Vista011, eb01Doma005, eb01Fourtricks025],
    });
    const handIds = engine.getView("south").players.south.hand.map((card) => card.instanceId);

    engine.endTurn("south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(handIds);
    expect(view.players.south.trash).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });
});
