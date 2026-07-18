import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op06Taralan089 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-089 Taralan", () => {
  test("trashes three cards from the top of its controller's deck on play", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op06Taralan089],
      deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
      activeDon: op06Taralan089.cost,
    });

    engine.playCard(op06Taralan089, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(1);
    expect(view.players.south.trash).toHaveLength(3);
    expect(view.prompts).toHaveLength(0);
  });

  test("trashes three cards from the top of its controller's deck after a battle K.O.", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        character: [{ card: op06Taralan089, rested: true }],
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const taralanId = engine.findCardInZone("north", "character", op06Taralan089);

    engine.declareAttack(attackerId, taralanId, "south");

    const view = engine.getView("north");
    expect(view.players.north.deckCount).toBe(1);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(taralanId);
    expect(view.players.north.trash).toHaveLength(4);
    expect(view.prompts).toHaveLength(0);
  });
});
