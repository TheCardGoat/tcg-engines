import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op05Pell014,
  op09Lim022,
  op09SoulFrankySwingArmBoxingSolid041,
  op09Yasopp013,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP09-041 Soul Franky Swing Arm Boxing Solid", () => {
  test("Counter powers the defender before the conditional two-Character reactivation choice", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op09Yasopp013, playedOnTurn: 0 }] },
      {
        leaderCardId: op09Lim022,
        hand: [op09SoulFrankySwingArmBoxingSolid041],
        character: [
          { card: eb01Doma005, rested: true },
          { card: op05Pell014, rested: true },
        ],
        activeDon: 1,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", op09Yasopp013);
    const eventId = engine.findCardInZone("north", "hand", op09SoulFrankySwingArmBoxingSolid041);
    const firstId = engine.findCardInZone("north", "character", eb01Doma005);
    const secondId = engine.findCardInZone("north", "character", op05Pell014);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    const activeDecision = engine.pendingDecision("effectTargetSelection", "north");
    const activeStep = activeDecision.steps[0];
    expect(activeStep?.kind).toBe("selectEntity");
    if (activeStep?.kind !== "selectEntity") {
      throw new Error("Expected the up-to-two rested Character choice.");
    }
    expect(activeStep.candidates.map((candidate) => candidate.ref.id)).toEqual([firstId, secondId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [firstId, secondId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.filter(Boolean).every((card) => !card?.rested)).toBe(true);
    expect(view.players.north.lifeCount).toBe(lifeBefore);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger rests a cost-4 Character without the Counter condition", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, op05Pell014] },
      { life: [op09SoulFrankySwingArmBoxingSolid041] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const targetId = engine.findCardInZone("south", "character", op05Pell014);

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
