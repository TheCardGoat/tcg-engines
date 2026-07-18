import { describe, expect, test } from "vite-plus/test";
import type { StageCard } from "@tcg/op-types";
import {
  eb01Doma005,
  eb03BlackMaria044,
  eb03NefeltariVivi001,
  op06ThrillerBark098,
} from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const onigashimaIsland: StageCard = {
  ...op06ThrillerBark098,
  id: "TEST-EB03-044-ONIGASHIMA-ISLAND",
  canonicalId: "TEST-EB03-044-ONIGASHIMA-ISLAND",
  name: "Onigashima Island",
  i18n: {
    ...op06ThrillerBark098.i18n,
    en: {
      ...op06ThrillerBark098.i18n.en,
      name: "Onigashima Island",
    },
  },
};

registerCards([onigashimaIsland]);

describe("EB03-044 Black Maria", () => {
  test("gains Blocker with a multicolored Leader", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: eb03NefeltariVivi001, character: [eb03BlackMaria044] },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const blackMariaId = engine.findCardInZone("south", "character", eb03BlackMaria044);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Black Maria's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toEqual(["skip", blackMariaId]);
    engine.resolveDecision("battleBlocker", { selectedIds: [blackMariaId] }, "south");

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });

  test("searches, orders the remainder, and plays Onigashima Island from hand", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb03BlackMaria044],
      deck: [onigashimaIsland, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
      activeDon: eb03BlackMaria044.cost,
    });
    const islandId = engine.findCardInZone("south", "deck", onigashimaIsland);

    engine.playCard(eb03BlackMaria044, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Black Maria's Island search.");
    expect(search.candidates.find((candidate) => candidate.ref.id === islandId)?.legal).toBe(true);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [islandId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems")
      throw new Error("Expected Black Maria's deck-bottom order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id).reverse() },
      "south",
    );

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity")
      throw new Error("Expected Black Maria's Island play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([islandId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [islandId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.stage?.instanceId).toBe(islandId);
    expect(view.players.south.deckCount).toBe(5);
    expect(view.prompts).toHaveLength(0);
  });
});
