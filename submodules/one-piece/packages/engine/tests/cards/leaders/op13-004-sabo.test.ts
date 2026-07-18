import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op12Shiki005, op13Sabo004 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP13-004 Sabo", () => {
  test("recomputes both permanent power clauses as Life and field state change", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op13Sabo004,
        life: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        character: [op12Shiki005],
        activeDon: 1,
      },
      { character: [{ card: op12Shiki005, playedOnTurn: 0 }] },
    );
    const attackerId = engine.findCardInZone("north", "character", op12Shiki005);

    engine.attachDon(engine.leader("south"), 1, "south");

    let view = engine.getView("south");
    expect(view.players.south.leader.power).toBe(8000);
    expect(view.players.south.characters[0]?.power).toBe(11000);

    engine.endTurn("south");
    engine.declareAttack(attackerId, engine.leader("south"), "north");

    view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(3);
    expect(view.players.south.leader.power).toBe(6000);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
