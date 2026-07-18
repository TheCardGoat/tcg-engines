import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb03MissValentineMikita047,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-047 Miss.Valentine(Mikita)", () => {
  test("trashes 3 cards from the top of its controller's deck on play", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb03MissValentineMikita047],
      deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
      activeDon: 2,
    });

    engine.playCard(eb03MissValentineMikita047, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(1);
    expect(view.players.south.trash).toHaveLength(3);
    expect(view.prompts).toHaveLength(0);
  });

  test("draws 1 card after being K.O.'d", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb03MissValentineMikita047, rested: true }],
        deck: [eb01Doma005, eb01Fourtricks025],
      },
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const mikitaId = engine.findCardInZone("south", "character", eb03MissValentineMikita047);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, mikitaId, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(mikitaId);
    expect(view.players.south.hand).toHaveLength(1);
    expect(view.players.south.hand[0]?.cardId).toBe(eb01Doma005.id);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });
});
