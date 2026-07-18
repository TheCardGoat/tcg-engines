import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op05FireFist019, op05Hack012, op05Pell014 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP05-019 Fire Fist", () => {
  test("Main applies its reduction before the low-Life effective-power K.O. choice", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op05FireFist019],
        activeDon: 2,
        life: 2,
      },
      {
        character: [op05Pell014, op05Hack012],
      },
    );
    const reducedId = engine.findCardInZone("north", "character", op05Pell014);
    const positivePowerId = engine.findCardInZone("north", "character", op05Hack012);

    engine.playCard(op05FireFist019);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [reducedId] }, "south");

    const koDecision = engine.pendingDecision("effectTargetSelection", "south");
    const koStep = koDecision.steps[0];
    expect(koStep?.kind).toBe("selectEntity");
    if (koStep?.kind !== "selectEntity") {
      throw new Error("Expected the zero-power Character K.O. choice after reduction.");
    }
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).toEqual([reducedId]);
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(positivePowerId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [reducedId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      reducedId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger activates Main without DON!! payment and uses post-damage Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: op05Pell014, playedOnTurn: 0 },
        ],
      },
      {
        life: [op05FireFist019, op05Hack012, op05Pell014],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const targetId = engine.findCardInZone("south", "character", op05Pell014);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");

    expect(engine.getView("north").players.south.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
    expect(engine.getView("north").players.north.activeDon).toBe(0);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
