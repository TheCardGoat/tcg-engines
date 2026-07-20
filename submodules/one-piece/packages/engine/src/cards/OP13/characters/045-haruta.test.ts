import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018 } from "@tcg/op-cards";
import { op13Haruta045 } from "../../../../../cards/src/cards/OP13/characters/045-haruta.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-045 Haruta", () => {
  test("when attacking with exactly four cards in hand draws the exact top card", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op13Haruta045, playedOnTurn: 0 }],
        hand: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        deck: [eb01MountainGod018, eb01Doma005],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const harutaId = engine.findCardInZone("south", "character", op13Haruta045);
    const drawnId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    expect(engine.getView("south").players.south.handCount).toBe(4);
    engine.declareAttack(harutaId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.south.handCount).toBe(5);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("when attacking with five cards in hand does not draw", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op13Haruta045, playedOnTurn: 0 }],
        hand: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        deck: [eb01MountainGod018, eb01Doma005],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const harutaId = engine.findCardInZone("south", "character", op13Haruta045);
    const untouchedId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.declareAttack(harutaId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.south.handCount).toBe(5);
    expect(view.players.south.deckCount).toBe(2);
    expect(view.players.south.hand.map((card) => card.instanceId)).not.toContain(untouchedId);
    expect(view.prompts).toHaveLength(0);
  });
});
