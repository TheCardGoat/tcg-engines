import { describe, expect, test } from "vite-plus/test";
import { op01Inuarashi034 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-034 Inuarashi", () => {
  test("with two DON!! attached, sets one rested DON!! active when attacking", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op01Inuarashi034, attachedDon: 2, playedOnTurn: 0 }],
        restedDon: 1,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const inuarashiId = engine.findCardInZone("south", "character", op01Inuarashi034);

    engine.declareAttack(inuarashiId, engine.leader("north"), "south");
    engine.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.activeDon).toBe(1);
    expect(view.players.south.restedDon).toBe(0);
  });
});
