import { describe, expect, test } from "vite-plus/test";
import {
  op03CharlotteKatakuri099,
  op03CharlotteKatakuri123,
  op08CharlotteKatakuri062,
  op08CharlotteKatakuri063,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-062 Charlotte Katakuri", () => {
  test("plays the cost-6 boundary but excludes cost 2 and cost 8 against 6 opposing DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03CharlotteKatakuri099,
        hand: [op08CharlotteKatakuri062, op08CharlotteKatakuri063, op03CharlotteKatakuri123],
        character: [op08CharlotteKatakuri062],
      },
      { activeDon: 6 },
    );
    const sourceId = engine.findCardInZone("south", "character", op08CharlotteKatakuri062);
    const costTwoId = engine.findCardInZone("south", "hand", op08CharlotteKatakuri062);
    const costSixId = engine.findCardInZone("south", "hand", op08CharlotteKatakuri063);
    const costEightId = engine.findCardInZone("south", "hand", op03CharlotteKatakuri123);

    engine.activateEffect(sourceId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Katakuri's play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([costSixId]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(costTwoId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(costEightId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [costSixId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(sourceId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(costSixId);
    expect(view.prompts).toHaveLength(0);
  });

  test("uses the live opposing DON!! count so cost 8 becomes eligible at 8 DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03CharlotteKatakuri099,
        hand: [op03CharlotteKatakuri123],
        character: [op08CharlotteKatakuri062],
      },
      { activeDon: 8 },
    );
    const sourceId = engine.findCardInZone("south", "character", op08CharlotteKatakuri062);
    const costEightId = engine.findCardInZone("south", "hand", op03CharlotteKatakuri123);

    engine.activateEffect(sourceId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Katakuri's dynamic play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([costEightId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(sourceId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(costEightId);
    expect(view.prompts).toHaveLength(0);
  });
});
