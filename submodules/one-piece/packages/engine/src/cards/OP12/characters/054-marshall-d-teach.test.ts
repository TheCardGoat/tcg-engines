import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op01DonquixoteDoflamingo060 } from "@tcg/op-cards";
import { op12MarshallDTeach054 } from "../../../../../cards/src/cards/OP12/characters/054-marshall-d-teach.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-054 Marshall.D.Teach", () => {
  test("with a Warlords Leader may return either owner's cost-1 Character but not itself", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op01DonquixoteDoflamingo060,
        hand: [op12MarshallDTeach054],
        character: [eb01Doma005],
        activeDon: op12MarshallDTeach054.cost,
      },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const ownTargetId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingTargetId = engine.findCardInZone("north", "character", eb01Doma005);
    const excludedId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op12MarshallDTeach054, "south");
    const teachId = engine.findCardInZone("south", "character", op12MarshallDTeach054);
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Teach's return target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([ownTargetId, opposingTargetId]),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(teachId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownTargetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(ownTargetId);
    expect(view.prompts).toHaveLength(0);
  });
});
