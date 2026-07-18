import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01BaroqueWorks090,
  op01CrescentCutlass089,
  op01Mr1DazBonez083,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-090 Baroque Works", () => {
  test("maps exact and compound Baroque Works cards, excludes itself, and orders the remainder", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op01BaroqueWorks090],
      deck: [
        op01Mr1DazBonez083,
        op01CrescentCutlass089,
        op01BaroqueWorks090,
        eb01Doma005,
        eb01MountainGod018,
      ],
      activeDon: 1,
    });
    const eventId = engine.findCardInZone("south", "hand", op01BaroqueWorks090);
    const exactTraitId = engine.findCardInZone("south", "deck", op01Mr1DazBonez083);
    const selectedCompoundTraitId = engine.findCardInZone("south", "deck", op01CrescentCutlass089);
    const excludedSelfId = engine.findCardInZone("south", "deck", op01BaroqueWorks090);
    const unrelatedId = engine.findCardInZone("south", "deck", eb01Doma005);
    const otherRemainderId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.playCard(op01BaroqueWorks090);

    const searchDecision = engine.pendingDecision("effectSearchSelection", "south");
    const searchStep = searchDecision.steps[0];
    expect(searchStep?.kind).toBe("selectEntity");
    if (searchStep?.kind !== "selectEntity") {
      throw new Error("Expected the controller to receive the private Baroque Works search.");
    }
    expect(
      searchStep.candidates.map((candidate) => ({
        id: candidate.ref.id,
        legal: candidate.legal,
      })),
    ).toEqual([
      { id: exactTraitId, legal: true },
      { id: selectedCompoundTraitId, legal: true },
      { id: excludedSelfId, legal: false },
      { id: unrelatedId, legal: false },
      { id: otherRemainderId, legal: false },
    ]);
    engine.resolveDecision(
      "effectSearchSelection",
      { selectedIds: [selectedCompoundTraitId] },
      "south",
    );

    const orderDecision = engine.pendingDecision("effectSearchRemainderOrder", "south");
    const orderStep = orderDecision.steps[0];
    expect(orderStep?.kind).toBe("orderItems");
    if (orderStep?.kind !== "orderItems") {
      throw new Error("Expected the controller to order the four remaining cards.");
    }
    const remainderOrder = [otherRemainderId, unrelatedId, excludedSelfId, exactTraitId];
    expect(orderStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      exactTraitId,
      excludedSelfId,
      unrelatedId,
      otherRemainderId,
    ]);
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: remainderOrder }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(
      selectedCompoundTraitId,
    );
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.players.south.deckCount).toBe(4);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
