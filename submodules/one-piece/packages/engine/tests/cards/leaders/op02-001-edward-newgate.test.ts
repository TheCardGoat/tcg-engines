import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op02EdwardNewgate001 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-001 Edward.Newgate", () => {
  test("moves the top Life card to hand at the end of its turn", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op02EdwardNewgate001,
      life: [eb01Doma005, eb01Fourtricks025],
    });
    const topLifeId = engine.findCardInZone("south", "life", eb01Doma005);

    engine.endTurn("south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(topLifeId);
    expect(view.players.south.lifeCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
