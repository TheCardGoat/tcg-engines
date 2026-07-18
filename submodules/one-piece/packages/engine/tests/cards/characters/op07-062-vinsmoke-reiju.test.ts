import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op07VinsmokeReiju062, op07VinsmokeSanji061 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-062 Vinsmoke Reiju", () => {
  test("at equal DON!! returns up to one cost-1 Vinsmoke Family Character to its owner's hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op07VinsmokeReiju062],
        character: [op07VinsmokeSanji061, eb01Doma005],
        activeDon: op07VinsmokeReiju062.cost,
      },
      { activeDon: 1 },
    );
    const sanjiId = engine.findCardInZone("south", "character", op07VinsmokeSanji061);
    const excludedId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.playCard(op07VinsmokeReiju062, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south");
    expect(target.actorId).toBe("south");
    const step = target.steps[0];
    expect(step).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (step?.kind !== "selectEntity") throw new Error("Expected Reiju's Character choice.");
    expect(step.candidates.map((candidate) => candidate.ref.id)).toContain(sanjiId);
    expect(step.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [sanjiId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(sanjiId);
    expect(view.players.south.characters.some((card) => card?.instanceId === excludedId)).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("does not offer a return when its DON!! field count is greater", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op07VinsmokeReiju062],
        character: [op07VinsmokeSanji061],
        activeDon: op07VinsmokeReiju062.cost + 1,
      },
      { activeDon: 1 },
    );
    const sanjiId = engine.findCardInZone("south", "character", op07VinsmokeSanji061);

    engine.playCard(op07VinsmokeReiju062, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === sanjiId)).toBe(true);
    expect(view.players.south.handCount).toBe(0);
    expect(view.prompts).toHaveLength(0);
  });
});
