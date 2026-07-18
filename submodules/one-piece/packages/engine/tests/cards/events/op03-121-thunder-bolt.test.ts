import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01Hajrudin018,
  op03RobLucci092,
  op03ThunderBolt121,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP03-121 Thunder Bolt", () => {
  test("Main trashes top Life before mapping the opposing effective cost-5 K.O. boundary", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op03ThunderBolt121],
        life: [eb01Doma005, op01Hajrudin018],
        activeDon: 2,
      },
      {
        character: [eb01MountainGod018, op03RobLucci092],
      },
    );
    const topLifeId = engine.getState().players.south.life[0]!;
    const selectedId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const excludedId = engine.findCardInZone("north", "character", op03RobLucci092);

    engine.playCard(op03ThunderBolt121);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      topLifeId,
    );
    const koDecision = engine.pendingDecision("effectTargetSelection", "south");
    const koStep = koDecision.steps[0];
    expect(koStep?.kind).toBe("selectEntity");
    if (koStep?.kind !== "selectEntity") {
      throw new Error("Expected the controller to choose an opposing low-cost Character.");
    }
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).toEqual([selectedId]);
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(1);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(selectedId);
    expect(view.players.north.characters.some((card) => card?.instanceId === excludedId)).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger maps the same K.O. boundary without paying the Main Life cost", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: op03RobLucci092, playedOnTurn: 0 },
        ],
      },
      {
        life: [op03ThunderBolt121],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const excludedId = engine.findCardInZone("south", "character", op03RobLucci092);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const koDecision = engine.pendingDecision("effectTargetSelection", "north");
    const koStep = koDecision.steps[0];
    expect(koStep?.kind).toBe("selectEntity");
    if (koStep?.kind !== "selectEntity") {
      throw new Error("Expected the damaged player to choose an opposing low-cost Character.");
    }
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).toEqual([attackerId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [attackerId] }, "north");

    const view = engine.getView("north");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(attackerId);
    expect(view.players.south.characters.some((card) => card?.instanceId === excludedId)).toBe(
      true,
    );
    expect(view.players.north).toMatchObject({ lifeCount: 0, activeDon: 0, restedDon: 0 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
