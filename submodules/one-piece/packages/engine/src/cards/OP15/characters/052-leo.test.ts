import { describe, expect, test } from "vite-plus/test";
import { eb01ConquererOfThreeWorldsRagnaraku039, eb01Doma005 } from "@tcg/op-cards";
import { op15Leo052 } from "../../../../../cards/src/cards/characters/op15-052-leo.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-052 Leo", () => {
  test("saves a threatened Character by placing it at the deck bottom", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15Leo052, eb01Doma005], activeDon: 2 },
      { hand: [eb01ConquererOfThreeWorldsRagnaraku039], activeDon: 5, restedDon: 1 },
    );
    const domaId = engine.findCardInZone("south", "character", eb01Doma005);
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.endTurn("south");
    engine.playCard(eb01ConquererOfThreeWorldsRagnaraku039, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [domaId] }, "north");
    engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Leo's deck placement.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(domaId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [domaId] }, "south");

    const south = engine.getView("south").players.south;
    expect(south.trash.map((card) => card.instanceId)).not.toContain(domaId);
    expect(south.deckCount).toBe(deckBefore + 1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
