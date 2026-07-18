import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op02EdwardNewgate001,
  op02Seaquake021,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP02-021 Seaquake", () => {
  test("with a compound Whitebeard Pirates Leader, K.O.s only a power-3000-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op02EdwardNewgate001,
        hand: [op02Seaquake021],
        activeDon: 1,
      },
      {
        character: [eb01Doma005, eb01Fourtricks025],
      },
    );
    const eventId = engine.findCardInZone("south", "hand", op02Seaquake021);
    const selectedId = engine.findCardInZone("north", "character", eb01Doma005);
    const excludedId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.playCard(op02Seaquake021);

    const koDecision = engine.pendingDecision("effectTargetSelection", "south");
    const koStep = koDecision.steps[0];
    expect(koStep?.kind).toBe("selectEntity");
    if (koStep?.kind !== "selectEntity") {
      throw new Error("Expected the controller to choose a low-power opposing Character.");
    }
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).toEqual([selectedId]);
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(selectedId);
    expect(view.players.north.characters.some((card) => card?.instanceId === excludedId)).toBe(
      true,
    );
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("maps the Life Trigger's opposing Leader-or-Character power choice and turn expiration", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        life: [op02Seaquake021],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const targetLeaderId = engine.leader("south");
    const leaderPowerBefore = engine.getView("south").players.south.leader.power;
    if (leaderPowerBefore === null) {
      throw new Error("Expected the opposing Leader to expose its current power.");
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
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetLeaderId] }, "north");
    expect(engine.getView("south").players.south.leader.power).toBe(leaderPowerBefore - 3000);

    engine.endTurn("south");
    expect(engine.getView("south").players.south.leader.power).toBe(leaderPowerBefore);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
