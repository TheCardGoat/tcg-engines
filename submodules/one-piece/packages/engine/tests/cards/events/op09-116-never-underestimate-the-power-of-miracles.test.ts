import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op09BartholomewKuma108,
  op09NeverUnderestimateThePowerOfMiracles116,
  op09Sabo027,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP09-116 Never Underestimate the Power of Miracles!!", () => {
  test("Counter gives the chosen defender +2000 power for the battle", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { hand: [op09NeverUnderestimateThePowerOfMiracles116], activeDon: 1 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone(
      "north",
      "hand",
      op09NeverUnderestimateThePowerOfMiracles116,
    );

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    expect(
      engine.getView("north").logs.some((entry) => entry.message.includes("+2000 power")),
    ).toBe(true);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger offers the included Revolutionary Army cost-4 boundary from hand", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        hand: [op09BartholomewKuma108, op09Sabo027, eb01Doma005],
        life: [op09NeverUnderestimateThePowerOfMiracles116],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eligibleId = engine.findCardInZone("north", "hand", op09BartholomewKuma108);
    const costlyId = engine.findCardInZone("north", "hand", op09Sabo027);
    const wrongTypeId = engine.findCardInZone("north", "hand", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const decision = engine.pendingDecision("effectPlaySelection", "north");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") {
      throw new Error("Expected the Revolutionary Army hand-play choice.");
    }
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(step.candidates.map((candidate) => candidate.ref.id)).not.toEqual(
      expect.arrayContaining([costlyId, wrongTypeId]),
    );
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "north");

    expect(
      engine
        .getView("north")
        .players.north.characters.some((card) => card?.instanceId === eligibleId),
    ).toBe(true);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
