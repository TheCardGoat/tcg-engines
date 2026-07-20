import { eb01Doma005, op03Kuro021, op04Kuro023 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Kuro025 } from "../../../../../cards/src/cards/OP14EB04/characters/025-kuro.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-025 Kuro", () => {
  test("with a Kuro Leader may play one cost-6-or-less included East Blue Character", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op03Kuro021,
      hand: [op14eb04Kuro025, op04Kuro023, op14eb04Kuro025, eb01Doma005],
      activeDon: op14eb04Kuro025.cost,
    });
    const eligibleId = engine.findCardInZone("south", "hand", op04Kuro023);
    const playedId = engine.findCardInZone("south", "hand", op14eb04Kuro025);
    const expensiveId = engine
      .getView("south")
      .players.south.hand.find(
        (card) => card.cardId === op14eb04Kuro025.id && card.instanceId !== playedId,
      )?.instanceId;
    if (!expensiveId) throw new Error("Expected the second cost-7 Kuro in hand.");
    const wrongTraitId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op14eb04Kuro025, "south");
    const decision = engine.pendingDecision("effectPlaySelection", "south");
    expect(decision.actorId).toBe("south");
    const play = decision.steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Kuro's hand-play choice.");
    expect(play).toMatchObject({ min: 0, max: 1 });
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(eligibleId);
    expect(view.prompts).toHaveLength(0);
  });

  test("without a Kuro Leader does not offer the hand play", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op14eb04Kuro025, op04Kuro023],
      activeDon: op14eb04Kuro025.cost,
    });
    const eligibleId = engine.findCardInZone("south", "hand", op04Kuro023);

    engine.playCard(op14eb04Kuro025, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).not.toContain(eligibleId);
    expect(view.prompts).toHaveLength(0);
  });
});
