import { describe, expect, test } from "vite-plus/test";
import { op06Raki113 } from "../../../../../cards/src/cards/characters/op06-113-raki.ts";
import { op15Raki112 } from "../../../../../cards/src/cards/characters/op15-112-raki.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-112 Raki", () => {
  test("[On Play] plays a Shandian Warrior with cost 3 or less from hand", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op15Raki112, op06Raki113], activeDon: 4 },
      {},
    );

    engine.playCard(op15Raki112);

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Raki's play choice.");
    const rakiId = engine.findCardInZone("south", "hand", op06Raki113);
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([rakiId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [rakiId] }, "south");

    expect(
      engine.getView("south").players.south.characters.some((card) => card?.instanceId === rakiId),
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[On Play] declined leaves the Shandian Warrior in hand", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op15Raki112, op06Raki113], activeDon: 4 },
      {},
    );

    engine.playCard(op15Raki112);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [] }, "south");

    const south = engine.getView("south").players.south;
    expect(south.hand.map((card) => card.cardId)).toContain("OP06-113");
    expect(south.characters.map((card) => card?.cardId)).not.toContain("OP06-113");
    expect(south.characters.map((card) => card?.cardId)).toContain("OP15-112");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
