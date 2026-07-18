import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb01Sanji014,
  op01Overheat086,
  op01Otsuru036,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP01-086 Overheat", () => {
  test("maps Counter power before returning an active cost-3-or-less Character from either field", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, eb01Doma005],
      },
      {
        hand: [op01Overheat086],
        character: [op01Otsuru036, eb01MountainGod018],
        activeDon: 2,
        life: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const opposingEligibleId = engine.findCardInZone("south", "character", eb01Doma005);
    const ownSelectedId = engine.findCardInZone("north", "character", op01Otsuru036);
    const ownCostlyId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op01Overheat086);
    const lifeBeforeAttack = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    const returnDecision = engine.pendingDecision("effectTargetSelection", "north");
    const returnStep = returnDecision.steps[0];
    expect(returnStep?.kind).toBe("selectEntity");
    if (returnStep?.kind !== "selectEntity") {
      throw new Error("Expected the defender to choose an active low-cost Character to return.");
    }
    expect(returnStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      ownSelectedId,
      opposingEligibleId,
    ]);
    expect(returnStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(ownCostlyId);
    expect(returnStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(attackerId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownSelectedId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(lifeBeforeAttack);
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(ownSelectedId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("lets the Life Trigger return the controller's own cost-4 Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, eb01Doma005],
      },
      {
        life: [op01Overheat086],
        character: [eb01Sanji014],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const opposingEligibleId = engine.findCardInZone("south", "character", eb01Doma005);
    const ownSelectedId = engine.findCardInZone("north", "character", eb01Sanji014);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const returnDecision = engine.pendingDecision("effectTargetSelection", "north");
    const returnStep = returnDecision.steps[0];
    expect(returnStep?.kind).toBe("selectEntity");
    if (returnStep?.kind !== "selectEntity") {
      throw new Error("Expected the damaged player to choose a cost-4-or-less Character.");
    }
    expect(returnStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      ownSelectedId,
      opposingEligibleId,
    ]);
    expect(returnStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(attackerId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownSelectedId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(ownSelectedId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
