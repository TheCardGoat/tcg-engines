import { eb01Doma005, eb01Fourtricks025, op01RoronoaZoro001, op03Arlong022 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Chew050 } from "../../../../../cards/src/cards/OP14EB04/characters/050-chew.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-050 Chew", () => {
  test("draws the exact top card when its Leader's compound type includes Fish-Man", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op03Arlong022,
      hand: [op14eb04Chew050],
      deck: [eb01Doma005, eb01Fourtricks025],
      activeDon: op14eb04Chew050.cost,
    });
    const drawnId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op14eb04Chew050, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.players.south).toMatchObject({ handCount: 1, deckCount: 1 });
    expect(view.prompts).toHaveLength(0);
  });

  test("does not draw when its Leader has no Fish-Man type", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op01RoronoaZoro001,
      hand: [op14eb04Chew050],
      deck: [eb01Doma005, eb01Fourtricks025],
      activeDon: op14eb04Chew050.cost,
    });
    const retainedTopId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op14eb04Chew050, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).not.toContain(retainedTopId);
    expect(view.players.south).toMatchObject({ handCount: 0, deckCount: 2 });
    expect(view.prompts).toHaveLength(0);
  });
});
