import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op10Ryuma094 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-094 Ryuma", () => {
  test("with DON!! x1 deals Double Attack damage", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op10Ryuma094, playedOnTurn: 0 }], activeDon: 1 },
      {
        life: [eb01Doma005, eb01Doma005],
        deck: [eb01Doma005, eb01Doma005, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const ryumaId = engine.findCardInZone("south", "character", op10Ryuma094);
    engine.attachDon(ryumaId, 1, "south");
    engine.declareAttack(ryumaId, engine.leader("north"), "south");
    expect(engine.getView("north").players.north.lifeCount).toBe(0);
  });

  test("without attached DON!! deals only 1 damage", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op10Ryuma094, playedOnTurn: 0 }] },
      {
        life: [eb01Doma005, eb01Doma005],
        deck: [eb01Doma005, eb01Doma005, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const ryumaId = engine.findCardInZone("south", "character", op10Ryuma094);
    engine.declareAttack(ryumaId, engine.leader("north"), "south");
    expect(engine.getView("north").players.north.lifeCount).toBe(1);
  });
});
