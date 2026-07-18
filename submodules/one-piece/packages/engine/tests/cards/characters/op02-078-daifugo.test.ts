import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op02Daifugo078, op02Solitaire077 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-078 Daifugo", () => {
  test("may return 2 DON!! to play only another cost-3-or-less [SMILE] type Character", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op02Daifugo078, op02Solitaire077, op02Daifugo078, eb01Doma005],
      activeDon: op02Daifugo078.cost + 2,
    });
    const daifugoIds = engine
      .getState()
      .players.south.hand.filter(
        (instanceId) => engine.getState().cards[instanceId]?.cardId === op02Daifugo078.id,
      );
    expect(daifugoIds).toHaveLength(2);
    const [playedDaifugoId, remainingDaifugoId] = daifugoIds;
    if (!playedDaifugoId || !remainingDaifugoId) {
      throw new Error("Expected two distinct Daifugo instances in hand.");
    }
    const smileId = engine.findCardInZone("south", "hand", op02Solitaire077);
    const nonSmileId = engine.findCardInZone("south", "hand", eb01Doma005);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op02Daifugo078, "south");
    expect(
      engine
        .getView("south")
        .players.south.characters.some((card) => card?.instanceId === playedDaifugoId),
    ).toBe(true);
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      remainingDaifugoId,
    );
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: ["active-don:0", "active-don:1"] },
      "south",
    );

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Daifugo's SMILE play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(smileId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(remainingDaifugoId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(nonSmileId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [smileId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === smileId)).toBe(true);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 2);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without returning DON!! or playing a [SMILE] Character", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op02Daifugo078, op02Solitaire077],
      activeDon: op02Daifugo078.cost + 2,
    });
    const smileId = engine.findCardInZone("south", "hand", op02Solitaire077);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op02Daifugo078, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(smileId);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore);
    expect(view.prompts).toHaveLength(0);
  });
});
