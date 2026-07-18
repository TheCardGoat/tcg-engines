import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01KouzukiOden001, eb03KouzukiHiyori016 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-016 Kouzuki Hiyori", () => {
  test("draws for Kouzuki Oden, then trashes itself to give rested DON!! to that Leader", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: eb01KouzukiOden001,
      hand: [eb03KouzukiHiyori016],
      deck: [eb01Doma005, eb01Doma005],
      activeDon: 1,
    });
    const drawnId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(eb03KouzukiHiyori016, "south");
    const hiyoriId = engine.findCardInZone("south", "character", eb03KouzukiHiyori016);
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      drawnId,
    );

    engine.activateEffect(hiyoriId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(hiyoriId);
    expect(view.players.south.leader.attachedDon).toBe(1);
    expect(view.players.south.restedDon).toBe(0);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
