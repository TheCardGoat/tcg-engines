import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01GumGumChampionRifle028,
  eb01Hamlet024,
  eb01MountainGod018,
  eb01Sanji014,
  op01Bellamy076,
  op01Hajrudin018,
  op02EmporioIvankov049,
  op13Otama043,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-028 Gum-Gum Champion Rifle", () => {
  test("maps its Counter power choice to the defender and active return choice to the opponent", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op01Hajrudin018, playedOnTurn: 0 },
          eb01Fourtricks025,
          eb01Hamlet024,
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      {
        leaderCardId: op02EmporioIvankov049,
        hand: [eb01GumGumChampionRifle028],
        character: [op13Otama043],
        activeDon: 1,
        life: 4,
      },
    );
    const attackerId = engine.findCardInZone("south", "character", op01Hajrudin018);
    const firstActiveId = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const selectedReturnId = engine.findCardInZone("south", "character", eb01Hamlet024);
    const restedId = engine.findCardInZone("south", "character", eb01Doma005);
    const defendingCharacterId = engine.findCardInZone("north", "character", op13Otama043);
    const eventId = engine.findCardInZone("north", "hand", eb01GumGumChampionRifle028);

    engine.endTurn("south");
    engine.endTurn("north");
    engine.declareAttack(restedId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
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
      throw new Error("Expected the defender to receive the power recipient choice.");
    }
    expect(powerStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("north"),
      defendingCharacterId,
    ]);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    const returnDecision = engine.pendingDecision("effectTargetSelection", "south");
    const returnStep = returnDecision.steps[0];
    expect(returnDecision.actorId).toBe("south");
    expect(returnStep?.kind).toBe("selectEntity");
    if (returnStep?.kind !== "selectEntity") {
      throw new Error("Expected the attacking opponent to receive their active return choice.");
    }
    expect(returnStep).toMatchObject({ min: 1, max: 1 });
    expect(returnStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      firstActiveId,
      selectedReturnId,
    ]);
    expect(returnStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(restedId);

    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedReturnId] }, "south");

    const view = engine.getView("north");
    expect(
      engine
        .getView("south")
        .players.south.hand.some((card) => card.instanceId === selectedReturnId),
    ).toBe(true);
    expect(view.players.south.characters.some((card) => card?.instanceId === firstActiveId)).toBe(
      true,
    );
    expect(view.players.south.characters.some((card) => card?.instanceId === restedId)).toBe(true);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.players.north).toMatchObject({
      activeDon: donBeforeCounter.activeDon - 1,
      restedDon: donBeforeCounter.restedDon + 1,
      lifeCount: lifeBeforeAttack,
    });
    expect(view.players.north.leader.power).toBe(5000);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("lets the damaged player use its Life Trigger to bottom-deck a low-cost Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        deck: [op13Otama043, eb01Doma005],
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          op01Bellamy076,
          eb01Fourtricks025,
          eb01Sanji014,
        ],
      },
      {
        hand: [eb01Doma005],
        life: [eb01GumGumChampionRifle028],
        character: [op13Otama043],
      },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const firstEligibleId = engine.findCardInZone("south", "character", op01Bellamy076);
    const selectedId = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const tooExpensiveId = engine.findCardInZone("south", "character", eb01Sanji014);
    const ownEligibleId = engine.findCardInZone("north", "character", op13Otama043);

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
      throw new Error("Expected the damaged player to receive the Trigger target choice.");
    }
    expect(targetStep).toMatchObject({ min: 0, max: 1 });
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      ownEligibleId,
      firstEligibleId,
      selectedId,
    ]);
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      tooExpensiveId,
    );

    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "north");

    const view = engine.getView("north");
    expect(engine.getState().players.south.deck.at(-1)).toBe(selectedId);
    expect(view.players.south.characters.some((card) => card?.instanceId === firstEligibleId)).toBe(
      true,
    );
    expect(view.players.south.characters.some((card) => card?.instanceId === tooExpensiveId)).toBe(
      true,
    );
    expect(view.players.north.trash.map((card) => card.cardId)).toContain(
      eb01GumGumChampionRifle028.id,
    );
    expect(view.players.north.activeDon).toBe(activeDonBeforeTrigger);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
