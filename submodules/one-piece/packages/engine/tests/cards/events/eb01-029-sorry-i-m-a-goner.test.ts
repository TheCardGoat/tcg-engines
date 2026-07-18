import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01Hamlet024,
  eb01Sanji014,
  eb01SorryIMAGoner029,
  op01Crocodile067,
  op01Hajrudin018,
  op01Kaido094,
  op05JohnGiant044,
  op13Otama043,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-029 Sorry. I'm a Goner.", () => {
  test("reveals a high-cost top card, maps the conditional return, and moves that card to the bottom", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op01Hajrudin018, playedOnTurn: 0 }],
      },
      {
        hand: [eb01SorryIMAGoner029],
        deck: [op13Otama043, eb01Sanji014, eb01Hamlet024],
        character: [eb01Doma005, eb01Fourtricks025],
        activeDon: 1,
        life: 4,
      },
    );
    const attackerId = engine.findCardInZone("south", "character", op01Hajrudin018);
    const eventId = engine.findCardInZone("north", "hand", eb01SorryIMAGoner029);
    const revealedId = engine.findCardInZone("north", "deck", eb01Sanji014);
    const untouchedDeckId = engine.findCardInZone("north", "deck", eb01Hamlet024);
    const returnedId = engine.findCardInZone("north", "character", eb01Doma005);
    const otherReturnId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.endTurn("south");
    engine.endTurn("north");
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    const donBeforeCounter = engine.getView("north").players.north;
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    const returnDecision = engine.pendingDecision("effectTargetSelection", "north");
    const returnStep = returnDecision.steps[0];
    expect(returnDecision.actorId).toBe("north");
    expect(returnStep?.kind).toBe("selectEntity");
    if (returnStep?.kind !== "selectEntity") {
      throw new Error("Expected the Event controller to receive the conditional return choice.");
    }
    expect(returnStep).toMatchObject({ min: 0, max: 1 });
    expect(returnStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      returnedId,
      otherReturnId,
    ]);
    for (const viewer of ["north", "south"] as const) {
      expect(
        engine.getView(viewer).logs.some((entry) => entry.message.includes(eb01Sanji014.name)),
      ).toBe(true);
    }

    engine.resolveDecision("effectTargetSelection", { selectedIds: [returnedId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.hand.some((card) => card.instanceId === returnedId)).toBe(true);
    expect(view.players.north.characters.some((card) => card?.instanceId === otherReturnId)).toBe(
      true,
    );
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.players.north).toMatchObject({
      activeDon: donBeforeCounter.activeDon - 1,
      restedDon: donBeforeCounter.restedDon + 1,
    });
    expect(engine.getState().players.north.deck).toEqual([untouchedDeckId, revealedId]);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("lets the damaged player use its Life Trigger to return a cost-8-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op01Kaido094, playedOnTurn: 0 }, op01Crocodile067, op05JohnGiant044],
      },
      {
        life: [eb01SorryIMAGoner029],
        character: [eb01Doma005],
      },
    );
    const attackerId = engine.findCardInZone("south", "character", op01Kaido094);
    const firstEligibleId = engine.findCardInZone("south", "character", op01Crocodile067);
    const selectedId = engine.findCardInZone("south", "character", op05JohnGiant044);
    const ownEligibleId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.endTurn("south");
    engine.endTurn("north");
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");

    const triggerDecision = engine.pendingDecision("lifeTrigger", "north");
    const activeDonBeforeTrigger = engine.getView("north").players.north.activeDon;
    expect(triggerDecision).toMatchObject({ actorId: "north", kind: "confirm" });
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "north");
    const targetStep = targetDecision.steps[0];
    expect(targetDecision.actorId).toBe("north");
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected the damaged player to receive the Trigger return choice.");
    }
    expect(targetStep).toMatchObject({ min: 0, max: 1 });
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      ownEligibleId,
      firstEligibleId,
      selectedId,
    ]);
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(attackerId);

    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "north");

    const view = engine.getView("north");
    expect(
      engine.getView("south").players.south.hand.some((card) => card.instanceId === selectedId),
    ).toBe(true);
    expect(view.players.south.characters.some((card) => card?.instanceId === firstEligibleId)).toBe(
      true,
    );
    expect(view.players.south.characters.some((card) => card?.instanceId === attackerId)).toBe(
      true,
    );
    expect(view.players.north.trash.map((card) => card.cardId)).toContain(eb01SorryIMAGoner029.id);
    expect(view.players.north.activeDon).toBe(activeDonBeforeTrigger);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
