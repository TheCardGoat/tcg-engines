import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb01Sanji014,
  eb02ThePeak008,
  op01InTwoYearsAtTheSabaodyArchipelago030,
  op01Sanji013,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP01-030 In Two Years!! At the Sabaody Archipelago!!", () => {
  test("maps exact and compound Straw Hat Crew Characters in the top-five search", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op01InTwoYearsAtTheSabaodyArchipelago030],
      deck: [op01Sanji013, eb01Sanji014, eb02ThePeak008, eb01Doma005, eb01MountainGod018],
      activeDon: 1,
    });
    const eventId = engine.findCardInZone(
      "south",
      "hand",
      op01InTwoYearsAtTheSabaodyArchipelago030,
    );
    const exactTraitId = engine.findCardInZone("south", "deck", op01Sanji013);
    const selectedCompoundTraitId = engine.findCardInZone("south", "deck", eb01Sanji014);
    const wrongCategoryId = engine.findCardInZone("south", "deck", eb02ThePeak008);
    const unrelatedId = engine.findCardInZone("south", "deck", eb01Doma005);
    const otherRemainderId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.playCard(op01InTwoYearsAtTheSabaodyArchipelago030);

    const searchDecision = engine.pendingDecision("effectSearchSelection", "south");
    const searchStep = searchDecision.steps[0];
    expect(searchStep?.kind).toBe("selectEntity");
    if (searchStep?.kind !== "selectEntity") {
      throw new Error("Expected the controller to receive the private top-five search choice.");
    }
    expect(
      searchStep.candidates.map((candidate) => ({
        id: candidate.ref.id,
        legal: candidate.legal,
      })),
    ).toEqual([
      { id: exactTraitId, legal: true },
      { id: selectedCompoundTraitId, legal: true },
      { id: wrongCategoryId, legal: false },
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
      throw new Error("Expected the controller to receive the bottom-deck ordering choice.");
    }
    const remainderOrder = [otherRemainderId, unrelatedId, wrongCategoryId, exactTraitId];
    expect(orderStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      exactTraitId,
      wrongCategoryId,
      unrelatedId,
      otherRemainderId,
    ]);
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: remainderOrder }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.hand.some((card) => card.instanceId === selectedCompoundTraitId),
    ).toBe(true);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.players.south.deckCount).toBe(4);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("activates the Main search from Life without paying the Event cost", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        deck: [op01Sanji013, eb01Sanji014, eb02ThePeak008, eb01Doma005, eb01MountainGod018],
        life: [op01InTwoYearsAtTheSabaodyArchipelago030],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const activeDonBeforeTrigger = engine.getView("north").players.north.activeDon;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "north");

    const orderDecision = engine.pendingDecision("effectSearchRemainderOrder", "north");
    const orderStep = orderDecision.steps[0];
    expect(orderStep?.kind).toBe("orderItems");
    if (orderStep?.kind !== "orderItems") {
      throw new Error("Expected the damaged player to receive the bottom-deck ordering choice.");
    }
    const remainderIds = orderStep.candidates.map((candidate) => candidate.ref.id);
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: [...remainderIds].reverse() },
      "north",
    );

    const view = engine.getView("north");
    expect(view.players.north.activeDon).toBe(activeDonBeforeTrigger);
    expect(view.players.north.trash.map((card) => card.cardId)).toContain(
      op01InTwoYearsAtTheSabaodyArchipelago030.id,
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
