import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01RoronoaZoro001,
  op02EdwardNewgate001,
} from "@tcg/op-cards";
import { op13LittleoarsJr056 } from "../../../../../cards/src/cards/OP13/characters/056-littleoars-jr.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-056 LittleOars Jr.", () => {
  test("when attacking draws the exact top card with an included Whitebeard Pirates Leader trait", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op02EdwardNewgate001,
        character: [{ card: op13LittleoarsJr056, playedOnTurn: 0 }],
        deck: [eb01Doma005, eb01MountainGod018],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const littleOarsId = engine.findCardInZone("south", "character", op13LittleoarsJr056);
    const drawnId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.declareAttack(littleOarsId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.players.south).toMatchObject({ handCount: 1, deckCount: 1 });
    expect(view.prompts).toHaveLength(0);
  });

  test("when attacking does not draw without a Whitebeard Pirates Leader", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op01RoronoaZoro001,
        character: [{ card: op13LittleoarsJr056, playedOnTurn: 0 }],
        deck: [eb01Doma005, eb01MountainGod018],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const littleOarsId = engine.findCardInZone("south", "character", op13LittleoarsJr056);
    const untouchedId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.declareAttack(littleOarsId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).not.toContain(untouchedId);
    expect(view.players.south).toMatchObject({ handCount: 0, deckCount: 2 });
    expect(view.prompts).toHaveLength(0);
  });
});
