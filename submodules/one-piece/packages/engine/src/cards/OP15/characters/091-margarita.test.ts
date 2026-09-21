import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005 } from "@tcg/op-cards";
import { op15Margarita091 } from "../../../../../cards/src/cards/characters/op15-091-margarita.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-091 Margarita", () => {
  test("[On Play] places an opposing trash card at the bottom of the owner's deck", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op15Margarita091], activeDon: 2 },
      { trash: [eb01Doma005, eb01Doma005] },
    );
    const targetId = engine.findCardInZone("north", "trash", eb01Doma005);
    const deckBefore = engine.getView("south").players.north.deckCount;

    engine.playCard(op15Margarita091);

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Margarita's target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const north = engine.getView("south").players.north;
    expect(north.deckCount).toBe(deckBefore + 1);
    expect(north.trash).toHaveLength(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
