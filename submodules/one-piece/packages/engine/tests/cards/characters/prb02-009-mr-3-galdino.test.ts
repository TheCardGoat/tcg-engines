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
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      { character: [prb02Mr3GaldinoPrb02009009], deck: [eb01Doma005, eb01Fourtricks025] },
      { hand: [restOpponent], character: [{ card: eb01Fourtricks025, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const mr3Id = engine.findCardInZone("south", "character", prb02Mr3GaldinoPrb02009009);
    const attackerId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const deckBefore = engine.getView("south").players.south.deckCount;
    const handBefore = engine.getView("south").players.south.hand.length;
    const trashBefore = engine.getView("south").players.south.trash.length;

    engine.playCard(restOpponent, "north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(mr3Id);
    expect(view.players.south.trash.map((card) => card.instanceId)).not.toContain(mr3Id);
    expect(view.players.south.deckCount).toBe(deckBefore);
    expect(view.players.south.hand.length).toBe(handBefore);
    expect(view.players.south.trash.length).toBe(trashBefore);
    expect(view.players.south.characters.find((card) => card?.instanceId === mr3Id)?.rested).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);

    // whenBecomesRested openers include attack; keep subject-bound declareAttack visible.
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === mr3Id)
        ?.rested,
    ).toBe(true);
  });
});
