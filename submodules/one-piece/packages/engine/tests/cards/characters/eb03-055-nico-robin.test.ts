import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb03NicoRobin055,
  op01Kaido061,
  op01MonkeyDLuffy003,
  op01Shanks120,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-055 Nico Robin", () => {
  test("trashes top Life, then adds two deck cards to top Life with a Straw Hat Crew Leader", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op01MonkeyDLuffy003,
      hand: [eb03NicoRobin055],
      life: [eb01Doma005, eb01Fourtricks025],
      deck: [eb01MountainGod018, eb01Doma005, eb01Fourtricks025],
      activeDon: eb03NicoRobin055.cost,
    });
    const paidLifeId = engine.getState().players.south.life[0]!;
    const firstDeckId = engine.getState().players.south.deck[0]!;
    const secondDeckId = engine.getState().players.south.deck[1]!;

    engine.playCard(eb03NicoRobin055, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "2" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(paidLifeId);
    expect(engine.getState().players.south.life.slice(0, 2)).toEqual([firstDeckId, secondDeckId]);
    expect(view.players.south.lifeCount).toBe(3);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("pays the top-Life cost but does not add Life without a Straw Hat Crew Leader", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op01Kaido061,
      hand: [eb03NicoRobin055],
      life: [eb01Doma005, eb01Fourtricks025],
      deck: [eb01MountainGod018, eb01Doma005],
      activeDon: eb03NicoRobin055.cost,
    });
    const paidLifeId = engine.getState().players.south.life[0]!;

    engine.playCard(eb03NicoRobin055, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(paidLifeId);
    expect(view.players.south.lifeCount).toBe(1);
    expect(view.players.south.deckCount).toBe(2);
    expect(view.prompts).toHaveLength(0);
  });

  test("may deal one damage when K.O.'d during the opponent's turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb03NicoRobin055, rested: true }] },
      { character: [{ card: op01Shanks120, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const robinId = engine.findCardInZone("south", "character", eb03NicoRobin055);
    const attackerId = engine.findCardInZone("north", "character", op01Shanks120);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, robinId, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 1);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      robinId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
