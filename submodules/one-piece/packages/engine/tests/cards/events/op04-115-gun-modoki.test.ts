import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op04GunModoki115,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

function leaderPower(engine: OnePieceTestEngine, seat: "south" | "north") {
  const power = engine.getView(seat).players[seat].leader.power;
  if (power === undefined || power === null) {
    throw new Error("Expected the Leader to expose its current power.");
  }
  return power;
}

describe("OP04-115 Gun Modoki", () => {
  test("privately pays from bottom Life before granting Double Attack to compound Land of Wano", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op04GunModoki115],
        life: [eb01Doma005, eb01Fourtricks025],
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        activeDon: 1,
      },
      {
        life: [eb01Doma005, eb01Fourtricks025],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const characterId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const bottomLifeId = engine.getState().players.south.life.at(-1)!;

    engine.playCard(op04GunModoki115);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const costDecision = engine.pendingDecision("effectCostAddLifeToHand", "south");
    const costStep = costDecision.steps[0];
    expect(costStep?.kind).toBe("chooseOption");
    if (costStep?.kind !== "chooseOption") {
      throw new Error(
        "Expected the controller to choose top or bottom Life without a card reveal.",
      );
    }
    expect(costStep.options.map((option) => option.id)).toEqual(["top", "bottom"]);
    expect(JSON.stringify(engine.getView("north").decisions)).not.toContain(eb01Fourtricks025.name);
    engine.resolveDecision("effectCostAddLifeToHand", { optionId: "bottom" }, "south");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "south");
    const targetStep = targetDecision.steps[0];
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected the controller to choose their compound Land of Wano Character.");
    }
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([characterId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [characterId] }, "south");

    const beforeAttack = engine.getView("south");
    expect(beforeAttack.players.south.hand.map((card) => card.instanceId)).toContain(bottomLifeId);
    expect(beforeAttack.players.south.lifeCount).toBe(1);
    const opponentLifeBefore = beforeAttack.players.north.lifeCount;
    engine.declareAttack(characterId, engine.leader("north"), "south");
    expect(engine.getView("south").players.north.lifeCount).toBe(opponentLifeBefore - 2);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger maps Leader-or-Character power without paying the Main Life cost", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        life: [op04GunModoki115],
        character: [eb01Doma005],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const characterId = engine.findCardInZone("north", "character", eb01Doma005);
    const powerBefore = leaderPower(engine, "north");

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "north");
    const targetStep = targetDecision.steps[0];
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected the damaged player to choose their Leader or Character recipient.");
    }
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("north"),
      characterId,
    ]);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    expect(leaderPower(engine, "north")).toBe(powerBefore + 1000);
    expect(engine.getView("north").players.north.lifeCount).toBe(0);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);

    engine.endTurn("south");
    expect(leaderPower(engine, "north")).toBe(powerBefore);
  });
});
