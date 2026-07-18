import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op03CharlotteKatakuri099,
  op08CharlotteKatakuri062,
  op11CharlotteDaifuku068,
  prb02CharlottePuddingPrb02010010,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("PRB02-010 Charlotte Pudding", () => {
  test("returns 2 DON!!, draws 2, and plays only a 6000-8000 power Big Mom Pirates Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03CharlotteKatakuri099,
        hand: [
          prb02CharlottePuddingPrb02010010,
          op11CharlotteDaifuku068,
          op11CharlotteDaifuku068,
          op08CharlotteKatakuri062,
        ],
        deck: [eb01Doma005, eb01Fourtricks025],
        activeDon: 9,
      },
      { activeDon: 6 },
    );
    const eligibleIds = engine
      .getState()
      .players.south.hand.filter(
        (instanceId) => engine.getState().cards[instanceId]?.cardId === op11CharlotteDaifuku068.id,
      );
    const ineligibleId = engine.findCardInZone("south", "hand", op08CharlotteKatakuri062);
    const drawnIds = engine.getState().players.south.deck.slice(0, 2);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(prb02CharlottePuddingPrb02010010, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: ["active-don:0", "active-don:1"] },
      "south",
    );

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Pudding's play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual(eligibleIds);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(ineligibleId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleIds[0]!] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([ineligibleId, ...drawnIds]),
    );
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(eligibleIds[0]);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 2);
    expect(view.prompts).toHaveLength(0);
  });
});
