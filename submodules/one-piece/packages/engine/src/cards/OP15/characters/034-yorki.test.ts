import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005 } from "@tcg/op-cards";
import { op15Brook032 } from "../../../../../cards/src/cards/characters/op15-032-brook.ts";
import { op15Yorki034 } from "../../../../../cards/src/cards/characters/op15-034-yorki.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-034 Yorki", () => {
  test("[Your Turn] [On Play] boosts only a named Brook card", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op15Yorki034],
        character: [op15Brook032, eb01Doma005],
        activeDon: 2,
      },
      {},
    );
    const brookId = engine.findCardInZone("south", "character", op15Brook032);

    engine.playCard(op15Yorki034);

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Yorki's boost target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([brookId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [brookId] }, "south");

    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === brookId)
        ?.power,
    ).toBe(8000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP15-034", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP15-034",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
