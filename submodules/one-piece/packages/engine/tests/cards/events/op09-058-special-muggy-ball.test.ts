import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op05Pell014,
  op09SpecialMuggyBall058,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP09-058 Special Muggy Ball", () => {
  test("Main gives the opponent ownership of their mandatory cost-6-or-less return choice", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op09SpecialMuggyBall058],
        character: [op05Pell014],
        activeDon: 2,
      },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const selectedId = engine.findCardInZone("north", "character", eb01Doma005);
    const excludedOwnId = engine.findCardInZone("south", "character", op05Pell014);

    engine.playCard(op09SpecialMuggyBall058);

    const decision = engine.pendingDecision("effectTargetSelection", "north");
    expect(decision.actorId).toBe("north");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") {
      throw new Error("Expected the opponent-owned Character choice.");
    }
    expect(step.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedOwnId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "north");

    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      selectedId,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger offers cost-3 Characters from either field and returns the chosen card to its owner", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, eb01Doma005],
      },
      { life: [op09SpecialMuggyBall058], character: [op05Pell014] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const opposingId = engine.findCardInZone("south", "character", eb01Doma005);
    const ownId = engine.findCardInZone("north", "character", op05Pell014);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const decision = engine.pendingDecision("effectTargetSelection", "north");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") {
      throw new Error("Expected the owner-neutral Trigger target choice.");
    }
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([ownId, opposingId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownId] }, "north");

    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      ownId,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
