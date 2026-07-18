import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op05Sabo007,
  op05StickStickemMeteora039,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP05-039 Stick-Stickem Meteora", () => {
  test("Counter protects before K.O.ing only an opposing rested cost-3-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0, rested: true },
          { card: eb01Doma005, playedOnTurn: 0 },
          { card: op05Sabo007, playedOnTurn: 0, rested: true },
        ],
      },
      {
        hand: [op05StickStickemMeteora039],
        activeDon: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const selectedId = engine
      .getState()
      .players.south.characterArea.find(
        (id) =>
          id &&
          engine.getState().cards[id]?.cardId === eb01Doma005.id &&
          engine.getState().cards[id]?.rested,
      )!;
    const highCostId = engine.findCardInZone("south", "character", op05Sabo007);
    const eventId = engine.findCardInZone("north", "hand", op05StickStickemMeteora039);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    const koDecision = engine.pendingDecision("effectTargetSelection", "north");
    const koStep = koDecision.steps[0];
    expect(koStep?.kind).toBe("selectEntity");
    if (koStep?.kind !== "selectEntity") {
      throw new Error("Expected a rested low-cost opposing Character choice.");
    }
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).toEqual([selectedId]);
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(highCostId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "north");

    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore);
    expect(engine.getView("north").players.south.trash.map((card) => card.instanceId)).toContain(
      selectedId,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger K.O.s the newly rested attacking effective cost-5 boundary", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: op05Sabo007, playedOnTurn: 0, rested: true },
        ],
      },
      {
        life: [op05StickStickemMeteora039],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const selectedId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const excludedId = engine.findCardInZone("south", "character", op05Sabo007);

    engine.declareAttack(selectedId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const koDecision = engine.pendingDecision("effectTargetSelection", "north");
    const koStep = koDecision.steps[0];
    expect(koStep?.kind).toBe("selectEntity");
    if (koStep?.kind !== "selectEntity") {
      throw new Error("Expected a rested cost-5-or-less opposing Character choice.");
    }
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).toEqual([selectedId]);
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "north");

    expect(engine.getView("north").players.south.trash.map((card) => card.instanceId)).toContain(
      selectedId,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
