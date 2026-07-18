import { describe, expect, test } from "vite-plus/test";
import { op01Denjiro046, op01KouzukiOden031 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-046 Denjiro", () => {
  test("with DON!! attached and Kouzuki Oden, sets up to two rested DON!! active when attacking", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op01KouzukiOden031,
        character: [{ card: op01Denjiro046, attachedDon: 1, playedOnTurn: 0 }],
        restedDon: 2,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const denjiroId = engine.findCardInZone("south", "character", op01Denjiro046);

    engine.declareAttack(denjiroId, engine.leader("north"), "south");
    engine.resolveDecision("effectSetActiveDon", { optionId: "2" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.activeDon).toBe(2);
    expect(view.players.south.restedDon).toBe(0);
    expect(view.prompts).toHaveLength(0);
  });
});
