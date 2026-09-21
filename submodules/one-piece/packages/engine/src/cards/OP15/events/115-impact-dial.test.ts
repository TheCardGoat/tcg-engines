import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-115 Impact Dial", () => {
  test("[Main] K.O.s a cost-4-or-less Character and adds the top Life card to hand", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP15-115"], activeDon: 2 },
      { character: ["OP16-002", "OP16-003"], activeDon: 5 },
    );
    const izoId = engine.findCardInZone("north", "character", "OP16-002");
    const lifeBefore = engine.getView("south").players.south.lifeCount;
    const state = engine.getState();
    const topLifeId = state.players.south.life[0]!;
    const topLifeCard = state.cards[topLifeId]!.cardId;

    engine.playCard("OP15-115");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the K.O. target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [izoId] }, "south");

    const south = engine.getView("south").players.south;
    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      izoId,
    );
    expect(south.lifeCount).toBe(lifeBefore - 1);
    expect(south.hand.map((card) => card.cardId)).toContain(topLifeCard);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
