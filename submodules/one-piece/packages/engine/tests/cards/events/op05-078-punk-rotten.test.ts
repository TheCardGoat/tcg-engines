import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op05PunkRotten078, op06HitokiriKamazo076 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP05-078 Punk Rotten", () => {
  test("Main pays DON!! -1 before powering a compound Kid Pirates Character for the turn", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op05PunkRotten078],
      character: [op06HitokiriKamazo076],
      activeDon: 3,
    });
    const targetId = engine.findCardInZone("south", "character", op06HitokiriKamazo076);
    const powerBefore = engine.getView("south").players.south.characters[0]?.power;

    engine.playCard(op05PunkRotten078);
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "south");
    const targetStep = targetDecision.steps[0];
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected the compound Kid Pirates recipient choice.");
    }
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(engine.getView("south").players.south.characters[0]?.power).toBe(
      (powerBefore ?? 0) + 5000,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger optionally adds 1 active DON!! without Main payment", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        life: [op05PunkRotten078],
        donDeckCount: 1,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "north");

    expect(engine.getView("north").players.north).toMatchObject({
      activeDon: 1,
      restedDon: 0,
      donDeckCount: 0,
    });
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
