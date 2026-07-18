import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op10Sanji005 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-005 Sanji", () => {
  test("has +3000 power only during its turn and draws when K.O.'d", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op10Sanji005, rested: true, playedOnTurn: 0 }],
        deck: [eb01Doma005, eb01Doma005],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "south" },
    );
    const sanjiId = engine.findCardInZone("south", "character", op10Sanji005);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const drawnId = engine.findCardInZone("south", "deck", eb01Doma005);
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === sanjiId)
        ?.power,
    ).toBe(6000);

    engine.endTurn("south");
    expect(
      engine.getView("north").players.south.characters.find((card) => card?.instanceId === sanjiId)
        ?.power,
    ).toBe(3000);
    engine.declareAttack(attackerId, sanjiId, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(sanjiId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.prompts).toHaveLength(0);
  });
});
