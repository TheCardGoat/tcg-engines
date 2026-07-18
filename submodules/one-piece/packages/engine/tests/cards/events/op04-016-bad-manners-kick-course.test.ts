import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op04BadMannersKickCourse016,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

function opposingCharacterPower(engine: OnePieceTestEngine, instanceId: string) {
  const power = engine
    .getView("north")
    .players.south.characters.find((card) => card?.instanceId === instanceId)?.power;
  if (power === undefined || power === null) {
    throw new Error("Expected the opposing Character to expose its current power.");
  }
  return power;
}

describe("OP04-016 Bad Manners Kick Course", () => {
  test("maps its optional hand cost and Counter recipient into the battle result", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [op04BadMannersKickCourse016, eb01Doma005],
        character: [eb01Fourtricks025],
        life: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op04BadMannersKickCourse016);
    const costId = engine.findCardInZone("north", "hand", eb01Doma005);
    const characterId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "north");
    const targetStep = targetDecision.steps[0];
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected the defender to choose their Leader or Character recipient.");
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

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(lifeBefore);
    expect(view.players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([eventId, costId]),
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger maps the opponent-owned recipient and expires -3000 at turn end", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Fourtricks025, playedOnTurn: 0 },
        ],
      },
      {
        life: [op04BadMannersKickCourse016],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const otherCharacterId = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const powerBefore = opposingCharacterPower(engine, attackerId);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "north");
    const targetStep = targetDecision.steps[0];
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected the damaged player to choose an opponent-owned recipient.");
    }
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("south"),
      attackerId,
      otherCharacterId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [attackerId] }, "north");

    expect(opposingCharacterPower(engine, attackerId)).toBe(powerBefore - 3000);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);

    engine.endTurn("south");
    expect(opposingCharacterPower(engine, attackerId)).toBe(powerBefore);
  });
});
