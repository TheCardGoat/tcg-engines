import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op03FieryDoll019 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP03-019 Fiery Doll", () => {
  test("gives the controller's Leader +4000 and expires it at turn end", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op03FieryDoll019],
      activeDon: 2,
    });
    const powerBefore = engine.getView("south").players.south.leader.power;
    if (powerBefore === null) {
      throw new Error("Expected the Leader to expose its current power.");
    }

    engine.playCard(op03FieryDoll019);

    expect(engine.getView("south").players.south.leader.power).toBe(powerBefore + 4000);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);

    engine.endTurn("south");
    expect(engine.getView("south").players.south.leader.power).toBe(powerBefore);
  });

  test("Life Trigger maps the opponent's Leader-or-Character choice for -10000 power", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        life: [op03FieryDoll019],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const targetLeaderId = engine.leader("south");
    const attackerPowerBefore = engine
      .getView("north")
      .players.south.characters.find((card) => card?.instanceId === attackerId)?.power;
    if (attackerPowerBefore === undefined || attackerPowerBefore === null) {
      throw new Error("Expected the attacker to expose its current power.");
    }

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const powerDecision = engine.pendingDecision("effectTargetSelection", "north");
    const powerStep = powerDecision.steps[0];
    expect(powerStep?.kind).toBe("selectEntity");
    if (powerStep?.kind !== "selectEntity") {
      throw new Error("Expected the damaged player to choose an opposing Leader or Character.");
    }
    expect(powerStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      targetLeaderId,
      attackerId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [attackerId] }, "north");

    const view = engine.getView("north");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === attackerId)?.power,
    ).toBe(attackerPowerBefore - 10000);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
