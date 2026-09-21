import { describe, expect, test } from "vite-plus/test";
import { op04Kyros082 } from "../../../../../cards/src/cards/characters/op04-082-kyros.ts";
import { op15Enel060 } from "../../../../../cards/src/cards/characters/op15-060-enel.ts";
import { op15Gin007 } from "../../../../../cards/src/cards/characters/op15-007-gin.ts";
import { op15Krieg001 } from "../../../../../cards/src/cards/leaders/op15-001-krieg.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-007 Gin", () => {
  test("[On Play] plays a cost-5-or-less Character from hand with an East Blue Leader", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op15Krieg001,
        hand: [op15Gin007, op04Kyros082, op15Enel060],
        activeDon: 7,
      },
      {},
    );

    engine.playCard(op15Gin007);

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Gin's play choice.");
    const cheapId = engine.findCardInZone("south", "hand", op04Kyros082);
    const expensiveId = engine.findCardInZone("south", "hand", op15Enel060);
    const candidates = play.candidates.map((candidate) => candidate.ref.id);
    expect(candidates).toEqual([cheapId]);
    expect(candidates).not.toContain(expensiveId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [cheapId] }, "south");

    expect(
      engine.getView("south").players.south.characters.some((card) => card?.instanceId === cheapId),
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("plays nothing without an East Blue Leader", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op15Gin007, op04Kyros082], activeDon: 7 },
      {},
    );

    engine.playCard(op15Gin007);

    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getView("south").players.south.hand.map((card) => card.cardId)).toContain(
      "OP04-082",
    );
  });
});
