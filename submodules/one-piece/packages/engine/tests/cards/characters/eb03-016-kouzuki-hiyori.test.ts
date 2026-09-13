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

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: eb01KouzukiOden001,
      hand: [eb03KouzukiHiyori016],
      deck: [eb01Doma005, eb01Doma005],
      activeDon: 1,
    });

    engine.playCard(eb03KouzukiHiyori016, "south");
    const hiyoriId = engine.findCardInZone("south", "character", eb03KouzukiHiyori016);
    engine.activateEffect(hiyoriId, "activateMain", "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
