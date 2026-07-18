import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op01ScratchmenApoo103, op04Nami011 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-011 Nami", () => {
  test("reveals an exact-threshold Character, gains +3000 this turn, and moves it to deck bottom", () => {
    const engine = OnePieceTestEngine.create(
      {
        deck: [op01ScratchmenApoo103, eb01Doma005, eb01Fourtricks025],
        character: [{ card: op04Nami011, playedOnTurn: 0 }],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const namiId = engine.findCardInZone("south", "character", op04Nami011);
    const revealedId = engine.findCardInZone("south", "deck", op01ScratchmenApoo103);
    const firstRemainderId = engine.findCardInZone("south", "deck", eb01Doma005);
    const secondRemainderId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.declareAttack(namiId, engine.leader("north"), "south");

    let view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === namiId)?.power).toBe(
      6000,
    );
    for (const viewer of ["south", "north"] as const) {
      expect(
        engine
          .getView(viewer)
          .logs.some((entry) => entry.message.includes(op01ScratchmenApoo103.name)),
      ).toBe(true);
    }
    // Exact physical identity/order is intentionally asserted at the raw hidden-zone boundary.
    expect(engine.getState().players.south.deck).toEqual([
      firstRemainderId,
      secondRemainderId,
      revealedId,
    ]);

    engine.endTurn("south");
    view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === namiId)?.power).toBe(
      3000,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("still reveals and bottom-decks a Character below 6000 power without gaining power", () => {
    const engine = OnePieceTestEngine.create(
      {
        deck: [eb01Fourtricks025, eb01Doma005, op01ScratchmenApoo103],
        character: [{ card: op04Nami011, playedOnTurn: 0 }],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const namiId = engine.findCardInZone("south", "character", op04Nami011);
    const revealedId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.declareAttack(namiId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === namiId)?.power).toBe(
      3000,
    );
    // Exact physical identity is intentionally asserted at the raw hidden-zone boundary.
    expect(engine.getState().players.south.deck.at(-1)).toBe(revealedId);
    expect(view.prompts).toHaveLength(0);
  });
});
