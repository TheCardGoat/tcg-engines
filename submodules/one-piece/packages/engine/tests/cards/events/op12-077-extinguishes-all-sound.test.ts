import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb01TonyTonyChopper006,
  op01TrafalgarLaw047,
  op12TheExtinguishesAllSoundCreatedByYourInfluenceTechnique077,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe('OP12-077 The "Extinguishes All Sound Created by Your Influence" Technique', () => {
  test("Main selects only Trafalgar Law, grants +2000, and prevents blocking that attacker", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op12TheExtinguishesAllSoundCreatedByYourInfluenceTechnique077],
        character: [
          { card: op01TrafalgarLaw047, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
        activeDon: 2,
      },
      { character: [eb01TonyTonyChopper006], life: 2 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const lawId = engine.findCardInZone("south", "character", op01TrafalgarLaw047);
    const excludedId = engine.findCardInZone("south", "character", eb01Doma005);
    const blockerId = engine.findCardInZone("north", "character", eb01TonyTonyChopper006);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.playCard(op12TheExtinguishesAllSoundCreatedByYourInfluenceTechnique077);
    const decision = engine.pendingDecision("effectTargetSelection", "south");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected a Trafalgar Law choice.");
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([lawId]);
    expect(step.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [lawId] }, "south");
    engine.declareAttack(lawId, engine.leader("north"), "south");

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(lifeBefore - 1);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === blockerId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger draws one without resolving Main", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op12TheExtinguishesAllSoundCreatedByYourInfluenceTechnique077],
        deck: [eb01Doma005, eb01MountainGod018, eb01Doma005, eb01MountainGod018],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const drawId = engine.findCardInZone("north", "deck", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      drawId,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
