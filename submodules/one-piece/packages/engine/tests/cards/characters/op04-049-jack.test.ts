import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op04Jack049,
  op04Trebol030,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-049 Jack", () => {
  test("draws the exact top card when battle K.O.'d", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op04Jack049, rested: true, playedOnTurn: 0 }],
        deck: [eb01Doma005, eb01Fourtricks025],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const jackId = engine.findCardInZone("south", "character", op04Jack049);
    const drawnId = engine.findCardInZone("south", "deck", eb01Doma005);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const handBefore = engine.getView("south").players.south.hand.length;
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.declareAttack(attackerId, jackId, "north");

    const view = engine.getView("south");
    expect(view.players.south.hand).toHaveLength(handBefore + 1);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.players.south.deckCount).toBe(deckBefore - 1);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(jackId);
    expect(view.players.south.characters.some((card) => card?.instanceId === jackId)).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });

  test("also draws when K.O.'d by an opponent's effect", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op04Trebol030], activeDon: op04Trebol030.cost },
      {
        character: [{ card: op04Jack049, rested: true }],
        deck: [eb01Doma005, eb01Fourtricks025],
      },
    );
    const jackId = engine.findCardInZone("north", "character", op04Jack049);
    const drawnId = engine.findCardInZone("north", "deck", eb01Doma005);

    engine.playCard(op04Trebol030, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [jackId] }, "south");

    const northView = engine.getView("north");
    expect(northView.players.north.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(northView.players.north.trash.map((card) => card.instanceId)).toContain(jackId);
    expect(northView.players.north.deckCount).toBe(1);
    expect(northView.prompts).toHaveLength(0);
  });
});
