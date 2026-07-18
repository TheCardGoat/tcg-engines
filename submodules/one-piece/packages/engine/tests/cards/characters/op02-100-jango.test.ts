import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op02Fullbody111, op02Jango100 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-100 Jango", () => {
  test("cannot be K.O.'d in battle while its controller has Fullbody", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      {
        character: [
          { card: op02Jango100, rested: true },
          { card: op02Fullbody111, rested: true },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01Doma005);
    const jangoId = engine.findCardInZone("north", "character", op02Jango100);

    engine.declareAttack(attackerId, jangoId, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.some((card) => card?.instanceId === jangoId)).toBe(true);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(jangoId);
    expect(view.prompts).toHaveLength(0);
  });

  test("is K.O.'d in battle without Fullbody", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { character: [{ card: op02Jango100, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01Doma005);
    const jangoId = engine.findCardInZone("north", "character", op02Jango100);

    engine.declareAttack(attackerId, jangoId, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(jangoId);
    expect(view.prompts).toHaveLength(0);
  });
});
