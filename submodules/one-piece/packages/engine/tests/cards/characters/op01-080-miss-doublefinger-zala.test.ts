import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01MissDoublefingerZala080,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-080 Miss Doublefinger(Zala)", () => {
  test("draws the exact top deck card when K.O.'d", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op01MissDoublefingerZala080, rested: true, playedOnTurn: 0 }],
        deck: [eb01Doma005, eb01Fourtricks025],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const doublefingerId = engine.findCardInZone("south", "character", op01MissDoublefingerZala080);
    const drawnId = engine.findCardInZone("south", "deck", eb01Doma005);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const handBefore = engine.getView("south").players.south.hand.length;
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.declareAttack(attackerId, doublefingerId, "north");

    const view = engine.getView("south");
    expect(view.players.south.hand).toHaveLength(handBefore + 1);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.players.south.deckCount).toBe(deckBefore - 1);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(doublefingerId);
    expect(view.prompts).toHaveLength(0);
  });
});
