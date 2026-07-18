import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb03CharlotteFlampe032,
  op03CharlotteKatakuri099,
  op08CharlotteKatakuri063,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-032 Charlotte Flampe", () => {
  test("maps only its controller's Katakuri cards and grants the chosen card +2000 this turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03CharlotteKatakuri099,
        hand: [eb03CharlotteFlampe032],
        character: [op08CharlotteKatakuri063, eb01Doma005],
        activeDon: 1,
      },
      {
        leaderCardId: op03CharlotteKatakuri099,
        character: [op08CharlotteKatakuri063],
      },
    );
    const ownKatakuriId = engine.findCardInZone("south", "character", op08CharlotteKatakuri063);
    const unrelatedId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingKatakuriId = engine.findCardInZone(
      "north",
      "character",
      op08CharlotteKatakuri063,
    );

    engine.playCard(eb03CharlotteFlampe032, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") {
      throw new Error("Expected Flampe's Katakuri power target.");
    }
    expect(target.min).toBe(0);
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("south"),
      ownKatakuriId,
    ]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(unrelatedId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      opposingKatakuriId,
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownKatakuriId] }, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === ownKatakuriId)?.power,
    ).toBe(9000);
    expect(engine.getView("south").prompts).toHaveLength(0);

    engine.endTurn("south");
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === ownKatakuriId)?.power,
    ).toBe(7000);
  });
});
