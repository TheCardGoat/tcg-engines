import { describe, expect, test } from "vite-plus/test";
import {
  eb01Fourtricks025,
  eb01Hamlet024,
  eb01JustShutUpAndComeWithUs009,
  eb01MountainGod018,
  op13Higuma013,
  op13Otama043,
  op13York094,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-009 Just Shut Up and Come with Us!!!!", () => {
  test("pays for its Counter, plays an eligible Animal Character, and orders the deck remainder", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op13Higuma013, playedOnTurn: 0 }],
        activeDon: 3,
      },
      {
        hand: [eb01JustShutUpAndComeWithUs009],
        deck: [
          op13York094,
          eb01Hamlet024,
          eb01Fourtricks025,
          eb01MountainGod018,
          op13Higuma013,
          op13Otama043,
        ],
        activeDon: 1,
      },
    );
    const attackerId = engine.findCardInZone("south", "character", op13Higuma013);
    const eventId = engine.findCardInZone("north", "hand", eb01JustShutUpAndComeWithUs009);
    const selectedId = engine.findCardInZone("north", "deck", eb01Hamlet024);
    const otherEligibleId = engine.findCardInZone("north", "deck", eb01Fourtricks025);
    const tooExpensiveId = engine.findCardInZone("north", "deck", eb01MountainGod018);
    const wrongTypeId = engine.findCardInZone("north", "deck", op13Higuma013);
    const otherRemainderId = engine.findCardInZone("north", "deck", op13Otama043);

    engine.endTurn("south");
    engine.endTurn("north");
    engine.attachDon(attackerId, 3, "south");
    engine.declareAttack(attackerId, engine.leader("north"), "south");

    const counterDecision = engine.pendingDecision("battleCounter", "north");
    const counterStep = counterDecision.steps[0];
    expect(counterDecision.actorId).toBe("north");
    expect(counterStep?.kind).toBe("selectEntity");
    if (counterStep?.kind !== "selectEntity") {
      throw new Error("Expected the defending player to receive the Counter selection.");
    }
    expect(counterStep.candidates.find((candidate) => candidate.ref.id === eventId)).toMatchObject({
      legal: true,
    });
    const donBeforeCounter = engine.getView("north").players.north;

    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    const searchDecision = engine.pendingDecision("effectSearchSelection", "north");
    const searchStep = searchDecision.steps[0];
    expect(searchDecision.actorId).toBe("north");
    expect(searchStep?.kind).toBe("selectEntity");
    if (searchStep?.kind !== "selectEntity") {
      throw new Error("Expected the Event controller to receive the Animal play choice.");
    }
    expect(searchStep).toMatchObject({ min: 0, max: 1 });
    expect(
      searchStep.candidates.map((candidate) => ({
        id: candidate.ref.id,
        legal: candidate.legal,
      })),
    ).toEqual([
      { id: selectedId, legal: true },
      { id: otherEligibleId, legal: true },
      { id: tooExpensiveId, legal: false },
      { id: wrongTypeId, legal: false },
      { id: otherRemainderId, legal: false },
    ]);

    engine.resolveDecision("effectSearchSelection", { selectedIds: [selectedId] }, "north");

    const orderDecision = engine.pendingDecision("effectSearchRemainderOrder", "north");
    expect(orderDecision.actorId).toBe("north");
    expect(orderDecision.steps[0]?.kind).toBe("orderItems");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      {
        selectedIds: [wrongTypeId, otherEligibleId, tooExpensiveId, otherRemainderId],
      },
      "north",
    );

    const view = engine.getView("north");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === selectedId),
    ).toMatchObject({ cardId: eb01Hamlet024.id, rested: false });
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.players.north).toMatchObject({
      activeDon: donBeforeCounter.activeDon - 1,
      restedDon: donBeforeCounter.restedDon + 1,
    });
    expect(engine.getState().players.north.deck).toEqual([
      wrongTypeId,
      otherEligibleId,
      tooExpensiveId,
      otherRemainderId,
    ]);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
