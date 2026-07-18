import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op02ImpelDown092,
  op07DragonBreath017,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP07-017 Dragon Breath", () => {
  test("Main independently maps the power-3000 Character and cost-1 Stage K.O. choices", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op07DragonBreath017],
        activeDon: 2,
      },
      {
        character: [eb01Doma005],
        stage: op02ImpelDown092,
      },
    );
    const characterId = engine.findCardInZone("north", "character", eb01Doma005);
    const stageId = engine.findCardInZone("north", "stage", op02ImpelDown092);

    engine.playCard(op07DragonBreath017);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [characterId] }, "south");

    const stageDecision = engine.pendingDecision("effectTargetSelection", "south");
    const stageStep = stageDecision.steps[0];
    expect(stageStep?.kind).toBe("selectEntity");
    if (stageStep?.kind !== "selectEntity") {
      throw new Error("Expected the separate opposing Stage K.O. choice.");
    }
    expect(stageStep.candidates.map((candidate) => candidate.ref.id)).toEqual([stageId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [stageId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([characterId, stageId]),
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger activates both Main K.O. choices without Event payment", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, eb01Doma005],
        stage: op02ImpelDown092,
      },
      {
        life: [op07DragonBreath017],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const characterId = engine.findCardInZone("south", "character", eb01Doma005);
    const stageId = engine.findCardInZone("south", "stage", op02ImpelDown092);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [characterId] }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [stageId] }, "north");

    expect(engine.getView("north").players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([characterId, stageId]),
    );
    expect(engine.getView("north").players.north.activeDon).toBe(0);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
