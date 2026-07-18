import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op05MonkeyDLuffy060 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-060 Monkey.D.Luffy", () => {
  test("pays the top-Life cost before adding active DON!! at the qualifying boundary", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op05MonkeyDLuffy060,
      life: [eb01Doma005],
      activeDon: 3,
    });
    const lifeId = engine.findCardInZone("south", "life", eb01Doma005);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(lifeId);
    expect(view.players.south).toMatchObject({ lifeCount: 0, activeDon: 4 });
    expect(view.players.south.donDeckCount).toBe(donDeckBefore - 1);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("still pays the Life cost when the post-colon DON!! condition fails", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op05MonkeyDLuffy060,
      life: [eb01Doma005],
      activeDon: 2,
    });

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    expect(engine.getView("south").players.south).toMatchObject({ lifeCount: 0, activeDon: 2 });
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
