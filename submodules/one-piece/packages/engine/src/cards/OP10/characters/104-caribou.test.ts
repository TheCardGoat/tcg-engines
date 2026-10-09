import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op01Shanks120, op07JewelryBonney019 } from "@tcg/op-cards";
import { op10Caribou104 } from "../../../../../cards/src/cards/characters/op10-104-caribou.ts";
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
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
    expect(engine.getView("south").players.south.lifeCount).toBeGreaterThanOrEqual(0);
  });
  test("loses battle protection without DON, without a Supernovas Leader, or below three opposing Life", () => {
    for (const f of [
      { don: 0, leader: "OP07-019", life: 3 },
      { don: 1, leader: "ST04-001", life: 3 },
      { don: 1, leader: "OP07-019", life: 2 },
    ]) {
      const e = OnePieceTestEngine.create(
        {
          leaderCardId: f.leader,
          character: [{ cardId: "OP10-104", rested: true, attachedDon: f.don }],
        },
        { character: [{ cardId: "OP01-120", playedOnTurn: 0 }], life: f.life },
        { firstPlayer: "south", activeSeat: "north" },
      );
      const caribou = e.findCardInZone("south", "character", "OP10-104");
      e.asNorth().attack(e.findCardInZone("north", "character", "OP01-120"), caribou);
      expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(caribou);
    }
  });
});
