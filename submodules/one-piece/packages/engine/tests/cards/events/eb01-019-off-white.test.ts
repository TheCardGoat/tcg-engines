import { describe, expect, test } from "vite-plus/test";
import {
  eb01Izo002,
  eb01OffWhite019,
  eb02DonquixoteRosinante025,
  op04Baby5032,
  op13Higuma013,
  op13Otama043,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-019 Off-White", () => {
  test("resolves its ordered Counter power choice, search, reveal, and bottom ordering", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01Izo002, playedOnTurn: 0 }],
      },
      {
        hand: [eb01OffWhite019],
        deck: [op13Otama043, eb02DonquixoteRosinante025, op04Baby5032, op13Higuma013],
        character: [op13Otama043],
        activeDon: 2,
        life: 4,
      },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01Izo002);
    const eventId = engine.findCardInZone("north", "hand", eb01OffWhite019);
    const defendingCharacterId = engine.findCardInZone("north", "character", op13Otama043);
    const selectedSearchId = engine.findCardInZone("north", "deck", eb02DonquixoteRosinante025);
    const otherEligibleId = engine.findCardInZone("north", "deck", op04Baby5032);
    const wrongTypeId = engine.findCardInZone("north", "deck", op13Higuma013);

    engine.endTurn("south");
    engine.endTurn("north");
    const lifeBeforeAttack = engine.getView("north").players.north.lifeCount;
    engine.declareAttack(attackerId, engine.leader("north"), "south");

    const counterDecision = engine.pendingDecision("battleCounter", "north");
    const counterStep = counterDecision.steps[0];
    expect(counterStep?.kind).toBe("selectEntity");
    if (counterStep?.kind !== "selectEntity") {
      throw new Error("Expected the defending player to receive the Counter selection.");
    }
    expect(counterStep.candidates.find((candidate) => candidate.ref.id === eventId)).toMatchObject({
      legal: true,
    });
    const donBeforeCounter = engine.getView("north").players.north;

    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    const powerDecision = engine.pendingDecision("effectTargetSelection", "north");
    const powerStep = powerDecision.steps[0];
    expect(powerDecision.actorId).toBe("north");
    expect(powerStep?.kind).toBe("selectEntity");
    if (powerStep?.kind !== "selectEntity") {
      throw new Error("Expected Off-White to publish its power recipient choice.");
    }
    expect(powerStep).toMatchObject({ min: 0, max: 1 });
    expect(powerStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("north"),
      defendingCharacterId,
    ]);

    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    const searchDecision = engine.pendingDecision("effectSearchSelection", "north");
    const searchStep = searchDecision.steps[0];
    expect(searchDecision.actorId).toBe("north");
    expect(searchStep?.kind).toBe("selectEntity");
    if (searchStep?.kind !== "selectEntity") {
      throw new Error("Expected Off-White to publish its private search choice.");
    }
    expect(searchStep).toMatchObject({ min: 0, max: 1 });
    expect(
      searchStep.candidates.map((candidate) => ({
        id: candidate.ref.id,
        legal: candidate.legal,
      })),
    ).toEqual([
      { id: selectedSearchId, legal: true },
      { id: otherEligibleId, legal: true },
      { id: wrongTypeId, legal: false },
    ]);

    engine.resolveDecision("effectSearchSelection", { selectedIds: [selectedSearchId] }, "north");

    const orderDecision = engine.pendingDecision("effectSearchRemainderOrder", "north");
    expect(orderDecision.actorId).toBe("north");
    expect(orderDecision.steps[0]?.kind).toBe("orderItems");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: [wrongTypeId, otherEligibleId] },
      "north",
    );

    const view = engine.getView("north");
    expect(view.players.north.hand.some((card) => card.instanceId === selectedSearchId)).toBe(true);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.players.north).toMatchObject({
      activeDon: donBeforeCounter.activeDon - 2,
      restedDon: donBeforeCounter.restedDon + 2,
      lifeCount: lifeBeforeAttack,
    });
    expect(view.players.north.leader.power).toBe(5000);
    expect(engine.getState().players.north.deck).toEqual([wrongTypeId, otherEligibleId]);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
