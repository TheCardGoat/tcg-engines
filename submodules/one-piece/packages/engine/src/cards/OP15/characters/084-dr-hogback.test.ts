import { describe, expect, test } from "vite-plus/test";
import {
  eb01ConquererOfThreeWorldsRagnaraku039,
  eb01Doma005,
  op06GeckoMoria080,
} from "@tcg/op-cards";
import { op15DrHogback084 } from "../../../../../cards/src/cards/characters/op15-084-dr-hogback.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-084 Dr. Hogback", () => {
  test("[On Play] trashes 5 deck cards with a Thriller Bark Pirates Leader", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op06GeckoMoria080, hand: [op15DrHogback084], activeDon: 3, deck: 8 },
      {},
    );
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(op15DrHogback084);

    expect(engine.getView("south").players.south.deckCount).toBe(deckBefore - 5);
  });

  test("[On K.O.] draws with 6 or fewer cards in hand", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15DrHogback084], activeDon: 2, deck: [eb01Doma005, eb01Doma005] },
      { hand: [eb01ConquererOfThreeWorldsRagnaraku039], activeDon: 5, restedDon: 1 },
    );
    const hogbackId = engine.findCardInZone("south", "character", op15DrHogback084);

    engine.endTurn("south");
    engine.playCard(eb01ConquererOfThreeWorldsRagnaraku039, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [hogbackId] }, "north");

    expect(engine.getView("south").players.south.hand).toHaveLength(1);
  });
});
