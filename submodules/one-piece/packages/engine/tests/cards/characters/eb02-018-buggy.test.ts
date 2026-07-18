import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb02Buggy018 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "../events/battle-fixture.shared.ts";

describe("EB02-018 Buggy", () => {
  test("ignores itself for the no-other-Buggy check and gives the Leader Double Attack", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [eb02Buggy018], activeDon: 4 },
      { life: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );

    engine.playCard(eb02Buggy018, "south");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );

    const lifeBefore = engine.getView("south").players.north.lifeCount;
    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");

    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 2);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("does not grant Double Attack while another Buggy Character is present", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb02Buggy018],
        character: [{ card: eb02Buggy018, playedOnTurn: 0 }],
        activeDon: 4,
      },
      { life: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );

    engine.playCard(eb02Buggy018, "south");
    const lifeBefore = engine.getView("south").players.north.lifeCount;
    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");

    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 1);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger rests only an opposing cost-4-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      { life: [eb02Buggy018] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eligibleId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const rest = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(rest?.kind).toBe("selectEntity");
    if (rest?.kind !== "selectEntity") throw new Error("Expected Buggy's Trigger target.");
    expect(rest.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "north");

    expect(
      engine
        .getView("north")
        .players.south.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
