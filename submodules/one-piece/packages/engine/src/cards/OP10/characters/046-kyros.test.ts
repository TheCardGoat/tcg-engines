import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005 } from "@tcg/op-cards";
import { op10Kyros046 } from "../../../../../cards/src/cards/OP10/characters/046-kyros.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-046 Kyros", () => {
  test("may return either player's cost-5-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op10Kyros046], character: [eb01Doma005], activeDon: op10Kyros046.cost },
      { character: [eb01Doma005] },
    );
    const ownId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingId = engine.findCardInZone("north", "character", eb01Doma005);
    engine.playCard(op10Kyros046, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Kyros's return target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([ownId, opposingId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownId] }, "south");
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      ownId,
    );
  });
});
