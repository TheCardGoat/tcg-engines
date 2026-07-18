import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op05Hack012,
  op05Pell014,
  op06BlueDragonSealWaterStream019,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP06-019 Blue Dragon Seal Water Stream", () => {
  test("Main K.O.s the opposing effective power-5000 boundary", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op06BlueDragonSealWaterStream019],
        activeDon: 3,
      },
      {
        character: [op05Hack012, eb01MountainGod018],
      },
    );
    const selectedId = engine.findCardInZone("north", "character", op05Hack012);
    const excludedId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op06BlueDragonSealWaterStream019);

    const koDecision = engine.pendingDecision("effectTargetSelection", "south");
    const koStep = koDecision.steps[0];
    expect(koStep?.kind).toBe("selectEntity");
    if (koStep?.kind !== "selectEntity") {
      throw new Error("Expected the Main power-5000 K.O. choice.");
    }
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).toEqual([selectedId]);
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      selectedId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger uses its narrower power-4000 K.O. boundary without Main payment", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, op05Pell014, op05Hack012],
      },
      {
        life: [op06BlueDragonSealWaterStream019],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const selectedId = engine.findCardInZone("south", "character", op05Pell014);
    const excludedId = engine.findCardInZone("south", "character", op05Hack012);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const koDecision = engine.pendingDecision("effectTargetSelection", "north");
    const koStep = koDecision.steps[0];
    expect(koStep?.kind).toBe("selectEntity");
    if (koStep?.kind !== "selectEntity") {
      throw new Error("Expected the Trigger power-4000 K.O. choice.");
    }
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).toEqual([selectedId]);
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "north");

    expect(engine.getView("north").players.south.trash.map((card) => card.instanceId)).toContain(
      selectedId,
    );
    expect(engine.getView("north").players.north.activeDon).toBe(0);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
