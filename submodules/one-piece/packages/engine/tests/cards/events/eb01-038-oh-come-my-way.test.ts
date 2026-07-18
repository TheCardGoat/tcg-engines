import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb01OhComeMyWay038,
  op13Higuma013,
  op13Otama043,
  op13York094,
  op14eb04CrocodileOp14079079,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-038 Oh Come My Way", () => {
  test("pays both Counter costs and lets the defender redirect the battle to a chosen Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        leaderCardId: op14eb04CrocodileOp14079079,
        hand: [eb01OhComeMyWay038],
        character: [eb01Doma005, eb01Fourtricks025],
        activeDon: 1,
        life: 4,
      },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const selectedTargetId = engine.findCardInZone("north", "character", eb01Doma005);
    const otherTargetId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const eventId = engine.findCardInZone("north", "hand", eb01OhComeMyWay038);

    engine.endTurn("south");
    engine.endTurn("north");
    const beforeCounter = engine.getView("north").players.north;
    const lifeBeforeAttack = beforeCounter.lifeCount;
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    const returnDonDecision = engine.pendingDecision("effectCostReturnDon", "north");
    const returnDonStep = returnDonDecision.steps[0];
    expect(returnDonStep?.kind).toBe("payCost");
    if (returnDonStep?.kind !== "payCost") {
      throw new Error("Expected the defender to choose which DON!! card to return.");
    }
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "north");
    const targetStep = targetDecision.steps[0];
    expect(targetDecision.actorId).toBe("north");
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected the defender to receive the attack redirection choice.");
    }
    expect(targetStep).toMatchObject({ min: 1, max: 1 });
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      selectedTargetId,
      otherTargetId,
    ]);

    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedTargetId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([eventId, selectedTargetId]),
    );
    expect(view.players.north.characters.some((card) => card?.instanceId === otherTargetId)).toBe(
      true,
    );
    expect(view.players.north.lifeCount).toBe(lifeBeforeAttack);
    expect(view.players.north.activeDon + view.players.north.restedDon).toBe(
      beforeCounter.activeDon + beforeCounter.restedDon - 1,
    );
    expect(view.players.north.donDeckCount).toBe(beforeCounter.donDeckCount + 1);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("still pays DON!! -1 without redirecting when the Leader is not Baroque Works", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [eb01OhComeMyWay038],
        character: [eb01Doma005],
        activeDon: 1,
        life: 4,
      },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const redirectCandidateId = engine.findCardInZone("north", "character", eb01Doma005);
    const eventId = engine.findCardInZone("north", "hand", eb01OhComeMyWay038);

    engine.endTurn("south");
    engine.endTurn("north");
    const beforeCounter = engine.getView("north").players.north;
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    const returnDonDecision = engine.pendingDecision("effectCostReturnDon", "north");
    expect(returnDonDecision.steps[0]?.kind).toBe("payCost");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(beforeCounter.lifeCount - 1);
    expect(
      view.players.north.characters.some((card) => card?.instanceId === redirectCandidateId),
    ).toBe(true);
    expect(view.players.north.activeDon + view.players.north.restedDon).toBe(
      beforeCounter.activeDon + beforeCounter.restedDon - 1,
    );
    expect(view.players.north.donDeckCount).toBe(beforeCounter.donDeckCount + 1);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("lets the damaged player pay DON!! -1 to draw 2 from its Life Trigger", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [eb01Doma005],
        deck: [op13Otama043, op13Higuma013, op13York094],
        life: [eb01OhComeMyWay038],
        activeDon: 1,
      },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const firstDrawId = engine.findCardInZone("north", "deck", op13Higuma013);
    const secondDrawId = engine.findCardInZone("north", "deck", op13York094);

    engine.endTurn("south");
    engine.endTurn("north");
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");

    const triggerDecision = engine.pendingDecision("lifeTrigger", "north");
    const beforeTrigger = engine.getView("north").players.north;
    expect(triggerDecision).toMatchObject({ actorId: "north", kind: "confirm" });
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstDrawId, secondDrawId]),
    );
    expect(view.players.north.handCount).toBe(beforeTrigger.handCount + 2);
    expect(view.players.north.activeDon + view.players.north.restedDon).toBe(
      beforeTrigger.activeDon + beforeTrigger.restedDon - 1,
    );
    expect(view.players.north.donDeckCount).toBe(beforeTrigger.donDeckCount + 1);
    expect(view.players.north.trash.map((card) => card.cardId)).toContain(eb01OhComeMyWay038.id);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
