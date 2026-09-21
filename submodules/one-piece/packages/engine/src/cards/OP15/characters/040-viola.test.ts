import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025 } from "@tcg/op-cards";
import { op04Kyros082 } from "../../../../../cards/src/cards/characters/op04-082-kyros.ts";
import { op15Viola040 } from "../../../../../cards/src/cards/characters/op15-040-viola.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-040 Viola", () => {
  test("[On Play] reveals a Dressrosa card from the top 3 and orders the remainder to the bottom", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op15Viola040], activeDon: 3, deck: [op04Kyros082, eb01Doma005, eb01Fourtricks025] },
      {},
    );
    const kyrosId = engine.findCardInZone("south", "deck", op04Kyros082);

    engine.playCard(op15Viola040);

    const reveal = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (reveal?.kind !== "selectEntity") throw new Error("Expected Viola's reveal choice.");
    expect(reveal.candidates.map((candidate) => candidate.ref.id)).toContain(kyrosId);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [kyrosId] }, "south");

    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected the remainder order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      {
        selectedIds: [
          engine.findCardInZone("south", "deck", eb01Doma005),
          engine.findCardInZone("south", "deck", eb01Fourtricks025),
        ],
      },
      "south",
    );

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      kyrosId,
    );
    expect(engine.getView("south").players.south.deckCount).toBe(2);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
