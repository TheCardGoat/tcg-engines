import { describe, expect, test } from "vite-plus/test";
import { eb01ConquererOfThreeWorldsRagnaraku039 } from "@tcg/op-cards";
import { op04Kyros082 } from "../../../../../cards/src/cards/characters/op04-082-kyros.ts";
import { op15CharlotteLola082 } from "../../../../../cards/src/cards/characters/op15-082-charlotte-lola.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-082 Charlotte Lola", () => {
  test("[On Play] trashes 3 deck cards; [On K.O.] returns a low-cost Character from trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op15CharlotteLola082],
        trash: [op04Kyros082],
        activeDon: 2,
        deck: 5,
      },
      { hand: [eb01ConquererOfThreeWorldsRagnaraku039], activeDon: 5, restedDon: 1 },
    );
    const lolaId = engine.findCardInZone("south", "character", op15CharlotteLola082);
    const kyrosId = engine.findCardInZone("south", "trash", op04Kyros082);
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.endTurn("south");
    engine.playCard(eb01ConquererOfThreeWorldsRagnaraku039, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [lolaId] }, "north");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Lola's return target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(kyrosId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [kyrosId] }, "south");

    const south = engine.getView("south").players.south;
    expect(south.hand.map((card) => card.instanceId)).toContain(kyrosId);
    expect(south.deckCount).toBe(deckBefore);
  });

  test("[On Play] trashes 3 deck cards when played", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op15CharlotteLola082], activeDon: 5, deck: 6 },
      {},
    );
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(op15CharlotteLola082);

    expect(engine.getView("south").players.south.deckCount).toBe(deckBefore - 3);
  });
});
