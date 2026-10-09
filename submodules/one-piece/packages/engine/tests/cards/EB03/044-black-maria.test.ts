import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb03BlackMaria044,
  eb03NefeltariVivi001,
  st04OnigashimaIsland017,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

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
      deck: [
        st04OnigashimaIsland017,
        eb01Doma005,
        eb01Doma005,
        eb01Doma005,
        eb01Doma005,
        eb01Doma005,
      ],
      activeDon: eb03BlackMaria044.cost,
    });
    const islandId = engine.findCardInZone("south", "deck", st04OnigashimaIsland017);

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

test("Black Maria cannot block with a single-color Leader", () => {
  const e = OnePieceTestEngine.create(
    { leaderCardId: "ST01-001", character: ["EB03-044"] },
    { character: [{ cardId: "EB01-018", playedOnTurn: 0 }] },
    { firstPlayer: "south", activeSeat: "north" },
  );
  const life = e.getView("south").players.south.lifeCount;
  e.asNorth().attack(e.findCardInZone("north", "character", "EB01-018"), e.leader("south"));
  expect(e.getView("south").players.south.lifeCount).toBe(life - 1);
  expect(e.getView("south").players.south.characters.some((c) => c?.cardId === "EB03-044")).toBe(
    true,
  );
  expect(e.getView("south").prompts).toHaveLength(0);
});
