import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op01DraculeMihawk070 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-070 Dracule Mihawk", () => {
  test("bottom-decks either player's cost-7-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op01DraculeMihawk070],
        character: [eb01Doma005],
        activeDon: op01DraculeMihawk070.cost,
      },
      { character: [eb01Fourtricks025, op01DraculeMihawk070] },
    );
    const ownTargetId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingTargetId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const highCostId = engine.findCardInZone("north", "character", op01DraculeMihawk070);

    engine.playCard(op01DraculeMihawk070, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Mihawk's deck-bottom target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([ownTargetId, opposingTargetId]),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(highCostId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownTargetId] }, "south");

    expect(engine.getState().players.south.deck.at(-1)).toBe(ownTargetId);
    expect(engine.getView("south").players.south.characters).not.toContainEqual(
      expect.objectContaining({ instanceId: ownTargetId }),
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
