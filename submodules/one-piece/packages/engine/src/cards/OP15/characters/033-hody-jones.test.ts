import { describe, expect, test } from "vite-plus/test";
import { op11Jinbe021 } from "@tcg/op-cards";
import { op15Brook032 } from "../../../../../cards/src/cards/characters/op15-032-brook.ts";
import { op15HodyJones033 } from "../../../../../cards/src/cards/characters/op15-033-hody-jones.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-033 Hody Jones", () => {
  test("[On Play] activates the Fish-Man Leader and moves top Life to hand", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op11Jinbe021, hand: [op15HodyJones033], activeDon: 4 },
      { hand: [op15Brook032], activeDon: 6 },
    );
    const leaderId = engine.leader("south");
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    // Turn 3: south passes; turn 4: north's Brook rests the Fish-Man Leader.
    engine.endTurn("south");
    engine.playCard(op15Brook032);
    const rest = engine.pendingDecision("effectMixedRestSelection", "north").steps[0];
    if (rest?.kind !== "payCost") throw new Error("Expected Brook's rest choice.");
    engine.resolveDecision("effectMixedRestSelection", { selectedIds: [leaderId] }, "north");
    expect(engine.getView("south").players.south.leader?.rested).toBe(true);

    // Turn 5: Hody Jones reactivates the Leader and pays with top Life.
    const topLifeId = engine.getState().players.south.life[0];
    engine.endTurn("north");
    engine.playCard(op15HodyJones033);

    const south = engine.getView("south").players.south;
    expect(south.leader?.rested).toBe(false);
    expect(south.lifeCount).toBe(lifeBefore - 1);
    expect(south.hand.map((card) => card.instanceId)).toContain(topLifeId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
