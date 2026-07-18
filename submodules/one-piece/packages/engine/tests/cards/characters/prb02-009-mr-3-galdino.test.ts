import { describe, expect, test } from "vite-plus/test";
import type { EventCard } from "@tcg/op-types";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01OffWhite019,
  prb02Mr3GaldinoPrb02009009,
} from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const restOpponent: EventCard = {
  ...eb01OffWhite019,
  id: "TEST-PRB02-009-REST",
  canonicalId: "TEST-PRB02-009-REST",
  name: "Mr.3 Rest Fixture",
  cost: 0,
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "rest",
            target: { player: "opponent", zones: ["character"], count: { amount: 1 } },
          },
        ],
      },
    ],
  },
};

registerCards([restOpponent]);

describe("PRB02-009 Mr.3(Galdino)", () => {
  test("when rested by an opponent effect may trash itself and draw 2", () => {
    const engine = OnePieceTestEngine.create(
      { character: [prb02Mr3GaldinoPrb02009009], deck: [eb01Doma005, eb01Fourtricks025] },
      { hand: [restOpponent] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const mr3Id = engine.findCardInZone("south", "character", prb02Mr3GaldinoPrb02009009);
    const drawnIds = engine.getState().players.south.deck.slice(0, 2);

    engine.playCard(restOpponent, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(mr3Id);
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(drawnIds),
    );
    expect(view.prompts).toHaveLength(0);
  });
});
