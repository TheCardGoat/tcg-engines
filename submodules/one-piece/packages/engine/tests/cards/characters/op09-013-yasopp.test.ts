import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op09Yasopp013 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP09-013 Yasopp", () => {
  test("on play gives its Leader 1000 power through the end of the opponent's next turn", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op09Yasopp013], activeDon: op09Yasopp013.cost },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const basePower = 5000;

    engine.playCard(op09Yasopp013, "south");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );
    expect(engine.getView("south").players.south.leader.power).toBe(basePower + 1000);

    engine.endTurn("south");
    expect(engine.getView("south").players.south.leader.power).toBe(basePower + 1000);
    engine.endTurn("north");
    expect(engine.getView("south").players.south.leader.power).toBe(basePower);
  });

  test("with DON!! x1 gives an opposing Character minus 1000 power when attacking", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op09Yasopp013, playedOnTurn: 0 }], activeDon: 1 },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const yasoppId = engine.findCardInZone("south", "character", op09Yasopp013);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.attachDon(yasoppId, 1, "south");
    engine.declareAttack(yasoppId, engine.leader("north"), "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      2000,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
