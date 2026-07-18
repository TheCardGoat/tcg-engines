import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op06Sakazuki046 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-046 Sakazuki", () => {
  test("on play may bottom either player's cost-2-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op06Sakazuki046],
        character: [eb01Doma005],
        activeDon: op06Sakazuki046.cost,
      },
      { character: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018] },
    );
    const ownId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingId = engine.findCardInZone("north", "character", eb01Doma005);
    const tooExpensiveIds = [
      engine.findCardInZone("north", "character", eb01Fourtricks025),
      engine.findCardInZone("north", "character", eb01MountainGod018),
    ];

    engine.playCard(op06Sakazuki046, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Sakazuki's target choice.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([ownId, opposingId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toEqual(
      expect.arrayContaining(tooExpensiveIds),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opposingId] }, "south");

    expect(engine.getState().players.north.deck.at(-1)).toBe(opposingId);
    expect(engine.getView("south").players.south.characters[0]?.instanceId).toBe(ownId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
