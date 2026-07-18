import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op01Shanks120, op07JewelryBonney019 } from "@tcg/op-cards";
import { op10Caribou104 } from "../../../../../cards/src/cards/OP10/characters/104-caribou.ts";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-104 Caribou", () => {
  test("with DON!! and a Supernovas Leader survives battle while opponent has three Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op07JewelryBonney019,
        character: [{ card: op10Caribou104, rested: true, attachedDon: 1 }],
        life: [eb01Doma005],
      },
      {
        character: [{ card: op01Shanks120, playedOnTurn: 0 }],
        life: [eb01Doma005, eb01Doma005, eb01Doma005],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const caribouId = engine.findCardInZone("south", "character", op10Caribou104);
    engine.declareAttack(
      engine.findCardInZone("north", "character", op01Shanks120),
      caribouId,
      "north",
    );
    expect(
      engine.getView("south").players.south.characters.map((card) => card?.instanceId),
    ).toContain(caribouId);
  });
});
