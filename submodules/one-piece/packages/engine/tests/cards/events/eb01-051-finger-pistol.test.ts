import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01FingerPistol051,
  eb01Fourtricks025,
  eb01Mr1DazBonez027,
  op13JewelryBonney108,
  op13Otama043,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-051 Finger Pistol", () => {
  test("trashes exactly the top 2 deck cards, then K.O.s only a chosen cost-5-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb01FingerPistol051],
        deck: [op13Otama043, eb01Doma005, eb01Fourtricks025],
        activeDon: 4,
      },
      {
        character: [eb01Mr1DazBonez027, op13JewelryBonney108],
      },
    );
    const eventId = engine.findCardInZone("south", "hand", eb01FingerPistol051);
    const firstTrashedId = engine.findCardInZone("south", "deck", op13Otama043);
    const secondTrashedId = engine.findCardInZone("south", "deck", eb01Doma005);
    const eligibleId = engine.findCardInZone("north", "character", eb01Mr1DazBonez027);
    const tooExpensiveId = engine.findCardInZone("north", "character", op13JewelryBonney108);

    engine.playCard(eb01FingerPistol051);

    const optionalDecision = engine.pendingDecision("effectOptional", "south");
    expect(optionalDecision).toMatchObject({ actorId: "south", kind: "confirm" });
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "south");
    const targetStep = targetDecision.steps[0];
    expect(targetDecision.actorId).toBe("south");
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected Finger Pistol to publish its opposing Character choice.");
    }
    expect(targetStep).toMatchObject({ min: 0, max: 1 });
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      tooExpensiveId,
    );
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstTrashedId, secondTrashedId]),
    );

    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.some((card) => card?.instanceId === tooExpensiveId)).toBe(
      true,
    );
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([eventId, firstTrashedId, secondTrashedId]),
    );
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 4 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("does not offer the optional payment with fewer than 2 cards in deck", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb01FingerPistol051],
      deck: [op13Otama043],
      activeDon: 4,
    });
    const eventId = engine.findCardInZone("south", "hand", eb01FingerPistol051);

    engine.playCard(eb01FingerPistol051);

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(1);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual([eventId]);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 4 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("activates its Main effect from Life without paying the Event cost", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01Fourtricks025, playedOnTurn: 0 },
          { card: eb01Mr1DazBonez027, playedOnTurn: 0 },
        ],
      },
      {
        deck: [op13Otama043, eb01Doma005, eb01Fourtricks025, op13Otama043, eb01Doma005],
        life: [eb01FingerPistol051],
      },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const targetId = engine.findCardInZone("south", "character", eb01Mr1DazBonez027);

    engine.endTurn("south");
    engine.endTurn("north");
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const beforePayment = engine.getView("north").players.north;
    expect(engine.pendingDecision("effectOptional", "north")).toMatchObject({
      actorId: "north",
      kind: "confirm",
    });
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "north");
    const targetStep = targetDecision.steps[0];
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected Finger Pistol's Trigger to activate its Main target choice.");
    }
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    expect(engine.getView("north").players.north.deckCount).toBe(beforePayment.deckCount - 2);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");

    const view = engine.getView("north");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(targetId);
    expect(view.players.north.trash.map((card) => card.cardId)).toContain(eb01FingerPistol051.id);
    expect(view.players.north).toMatchObject({
      activeDon: beforePayment.activeDon,
      restedDon: beforePayment.restedDon,
    });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
