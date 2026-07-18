import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op09Usopp024, op10Franky014, op10RadioKnife041 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP10-041 Radio Knife", () => {
  test("Main rests a cost-6 Character before independently K.O.ing a rested cost-5 Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op10RadioKnife041], activeDon: 4 },
      {
        character: [op10Franky014, { card: eb01MountainGod018, rested: true }],
      },
    );
    const restId = engine.findCardInZone("north", "character", op10Franky014);
    const koId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op10RadioKnife041);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [restId] }, "south");

    const koDecision = engine.pendingDecision("effectTargetSelection", "south");
    const koStep = koDecision.steps[0];
    expect(koStep?.kind).toBe("selectEntity");
    if (koStep?.kind !== "selectEntity") {
      throw new Error("Expected the independent rested cost-5 K.O. choice.");
    }
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).toEqual([koId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [koId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === restId)?.rested).toBe(
      true,
    );
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(koId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger rests the cost-4 boundary without resolving Main", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, op09Usopp024],
      },
      { life: [op10RadioKnife041] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const targetId = engine.findCardInZone("south", "character", op09Usopp024);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");

    expect(
      engine.getView("north").players.south.characters.find((card) => card?.instanceId === targetId)
        ?.rested,
    ).toBe(true);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
