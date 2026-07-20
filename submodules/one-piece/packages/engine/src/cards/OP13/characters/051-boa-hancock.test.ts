import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01Kaido094,
  op01RoronoaZoro001,
  op06Uta001,
  op07BoaHancock038,
} from "@tcg/op-cards";
import { op13BoaHancock051 } from "../../../../../cards/src/cards/OP13/characters/051-boa-hancock.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-051 Boa Hancock", () => {
  test("on battle K.O. draws two exact cards with a Boa Hancock Leader", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op07BoaHancock038,
        character: [{ card: op13BoaHancock051, rested: true, playedOnTurn: 0 }],
        deck: [eb01Doma005, eb01MountainGod018, eb01Doma005],
      },
      { character: [{ card: op01Kaido094, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const hancockId = engine.findCardInZone("south", "character", op13BoaHancock051);
    const attackerId = engine.findCardInZone("north", "character", op01Kaido094);
    const firstDrawnId = engine.findCardInZone("south", "deck", eb01Doma005);
    const secondDrawnId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.declareAttack(attackerId, hancockId, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(hancockId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstDrawnId, secondDrawnId]),
    );
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("also draws two when its Leader is multicolored but not Boa Hancock", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op06Uta001,
        character: [{ card: op13BoaHancock051, rested: true, playedOnTurn: 0 }],
        deck: [eb01Doma005, eb01MountainGod018, eb01Doma005],
      },
      { character: [{ card: op01Kaido094, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const hancockId = engine.findCardInZone("south", "character", op13BoaHancock051);
    const attackerId = engine.findCardInZone("north", "character", op01Kaido094);
    const firstDrawnId = engine.findCardInZone("south", "deck", eb01Doma005);
    const secondDrawnId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.declareAttack(attackerId, hancockId, "north");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstDrawnId, secondDrawnId]),
    );
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not draw with a monocolored Leader not named Boa Hancock", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op01RoronoaZoro001,
        character: [{ card: op13BoaHancock051, rested: true, playedOnTurn: 0 }],
        deck: [eb01Doma005, eb01MountainGod018, eb01Doma005],
      },
      { character: [{ card: op01Kaido094, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const hancockId = engine.findCardInZone("south", "character", op13BoaHancock051);
    const attackerId = engine.findCardInZone("north", "character", op01Kaido094);
    const untouchedId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.declareAttack(attackerId, hancockId, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(hancockId);
    expect(view.players.south.hand.map((card) => card.instanceId)).not.toContain(untouchedId);
    expect(view.players.south.deckCount).toBe(3);
    expect(view.prompts).toHaveLength(0);
  });
});
