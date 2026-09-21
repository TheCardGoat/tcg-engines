import { describe, expect, test } from "vite-plus/test";
import { op15Enel060 } from "../../../../../cards/src/cards/characters/op15-060-enel.ts";
import { op15Nami108 } from "../../../../../cards/src/cards/characters/op15-108-nami.ts";
import { op15GanFall102 } from "../../../../../cards/src/cards/characters/op15-102-gan-fall.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-108 Nami", () => {
  test("[On Play] reveals a Sky Island card from the top 3 and orders the remainder", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op15Nami108], activeDon: 2, deck: [op15Enel060, op15GanFall102, op15GanFall102] },
      {},
    );
    const enelId = engine.findCardInZone("south", "deck", op15Enel060);

    engine.playCard(op15Nami108);

    const reveal = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (reveal?.kind !== "selectEntity") throw new Error("Expected Nami's reveal choice.");
    expect(reveal.candidates.map((candidate) => candidate.ref.id)).toContain(enelId);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [enelId] }, "south");

    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected the remainder order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: order.candidates.map((candidate) => candidate.ref.id) },
      "south",
    );

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      enelId,
    );
    expect(engine.getView("south").players.south.deckCount).toBe(2);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
