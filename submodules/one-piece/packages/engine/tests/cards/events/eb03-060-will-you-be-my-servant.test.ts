import { describe, expect, test } from "vite-plus/test";
import {
  eb01Blueno017,
  eb01Doma005,
  eb01MountainGod018,
  eb02DonAccino004,
  eb03WillYouBeMyServant060,
  op01DraculeMihawk070,
  op03Nami040,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-060 Will You Be My Servant?", () => {
  test("lets Nami reveal a chosen cost-2-to-8 card and order the bottom-deck remainder", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op03Nami040,
      hand: [eb03WillYouBeMyServant060],
      deck: [eb01Doma005, eb01Blueno017, eb02DonAccino004, op01DraculeMihawk070],
      activeDon: 1,
    });
    const eventId = engine.findCardInZone("south", "hand", eb03WillYouBeMyServant060);
    const tooCheapId = engine.findCardInZone("south", "deck", eb01Doma005);
    const lowerBoundId = engine.findCardInZone("south", "deck", eb01Blueno017);
    const selectedId = engine.findCardInZone("south", "deck", eb02DonAccino004);
    const tooExpensiveId = engine.findCardInZone("south", "deck", op01DraculeMihawk070);

    engine.playCard(eb03WillYouBeMyServant060);

    const searchDecision = engine.pendingDecision("effectSearchSelection", "south");
    const searchStep = searchDecision.steps[0];
    expect(searchStep?.kind).toBe("selectEntity");
    if (searchStep?.kind !== "selectEntity") {
      throw new Error("Expected Nami's controller to receive the private top-4 search choice.");
    }
    expect(
      searchStep.candidates.map((candidate) => ({
        id: candidate.ref.id,
        legal: candidate.legal,
      })),
    ).toEqual([
      { id: tooCheapId, legal: false },
      { id: lowerBoundId, legal: true },
      { id: selectedId, legal: true },
      { id: tooExpensiveId, legal: false },
    ]);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [selectedId] }, "south");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: [tooExpensiveId, lowerBoundId, tooCheapId] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.hand.some((card) => card.instanceId === selectedId)).toBe(true);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(engine.getState().players.south.deck).toEqual([
      tooExpensiveId,
      lowerBoundId,
      tooCheapId,
    ]);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("activates Nami's Main search from Life without paying the Event cost", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        leaderCardId: op03Nami040,
        deck: [
          eb01MountainGod018,
          eb01Doma005,
          eb01Blueno017,
          eb02DonAccino004,
          op01DraculeMihawk070,
        ],
        life: [eb03WillYouBeMyServant060],
      },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.endTurn("south");
    engine.endTurn("north");
    const lookedIds = [...engine.getState().players.north.deck];
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    const activeDonBeforeTrigger = engine.getView("north").players.north.activeDon;
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "north");
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: lookedIds }, "north");

    const view = engine.getView("north");
    expect(view.players.north.activeDon).toBe(activeDonBeforeTrigger);
    expect(view.players.north.trash.map((card) => card.cardId)).toContain(
      eb03WillYouBeMyServant060.id,
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
