import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op02JudgmentOfHell089 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP02-089 Judgment of Hell", () => {
  test("maps DON!! -1 and up to 2 opposing Leader-or-Character power targets", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [op02JudgmentOfHell089],
        activeDon: 3,
        restedDon: 1,
        life: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op02JudgmentOfHell089);
    const lifeBefore = engine.getView("north").players.north.lifeCount;
    const donDeckBefore = engine.getView("north").players.north.donDeckCount;
    const leaderPowerBefore = engine.getView("south").players.south.leader.power;
    if (leaderPowerBefore === null) {
      throw new Error("Expected the attacking Leader to expose its current power.");
    }

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");

    const powerDecision = engine.pendingDecision("effectTargetSelection", "north");
    const powerStep = powerDecision.steps[0];
    expect(powerStep?.kind).toBe("selectEntity");
    if (powerStep?.kind !== "selectEntity") {
      throw new Error("Expected the defender to choose up to two opposing battle cards.");
    }
    expect(powerStep).toMatchObject({ min: 0, max: 2 });
    expect(powerStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("south"),
      attackerId,
    ]);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south"), attackerId] },
      "north",
    );

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(lifeBefore);
    expect(engine.getView("south").players.south.leader.power).toBe(leaderPowerBefore - 3000);
    expect(view.players.north.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);

    engine.endTurn("south");
    expect(engine.getView("south").players.south.leader.power).toBe(leaderPowerBefore);
  });

  test("at 6 opposing DON!!, the opponent chooses which field source returns to deck", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        activeDon: 5,
        restedDon: 1,
      },
      {
        life: [op02JudgmentOfHell089],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const before = engine.getView("south").players.south;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const returnDecision = engine.pendingDecision("effectOpponentReturnDon", "south");
    const returnStep = returnDecision.steps[0];
    expect(returnStep?.kind).toBe("payCost");
    if (returnStep?.kind !== "payCost") {
      throw new Error("Expected the opponent to choose their DON!! source.");
    }
    expect(returnStep.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining(["active-don:0", "rested-don:0"]),
    );
    engine.resolveDecision("effectOpponentReturnDon", { selectedIds: ["rested-don:0"] }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({
      activeDon: before.activeDon,
      restedDon: before.restedDon - 1,
      donDeckCount: before.donDeckCount + 1,
    });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
