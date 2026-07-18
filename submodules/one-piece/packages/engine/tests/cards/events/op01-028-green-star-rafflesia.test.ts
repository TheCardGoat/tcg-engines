import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb01Sanji014,
  op01GreenStarRafflesia028,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP01-028 Green Star Rafflesia", () => {
  test("lets the defender reduce an opposing Leader or Character during the Counter Step", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01Sanji014, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      {
        hand: [op01GreenStarRafflesia028],
        activeDon: 1,
        life: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01Sanji014);
    const otherCharacterId = engine.findCardInZone("south", "character", eb01Doma005);
    const eventId = engine.findCardInZone("north", "hand", op01GreenStarRafflesia028);
    const lifeBeforeAttack = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "north");
    const targetStep = targetDecision.steps[0];
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected the defender to receive the opposing power-reduction choice.");
    }
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("south"),
      attackerId,
      otherCharacterId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [attackerId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(lifeBeforeAttack);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("activates the Counter effect from Life and expires the reduction at turn end", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      {
        life: [op01GreenStarRafflesia028],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const selectedId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const otherCharacterId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.declareAttack(selectedId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "north");
    const targetStep = targetDecision.steps[0];
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error(
        "Expected the damaged player to receive the triggered Counter target choice.",
      );
    }
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("south"),
      selectedId,
      otherCharacterId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "north");

    expect(
      engine
        .getView("north")
        .players.south.characters.find((card) => card?.instanceId === selectedId)?.power,
    ).toBe(5000);
    engine.endTurn("south");
    expect(
      engine
        .getView("north")
        .players.south.characters.find((card) => card?.instanceId === selectedId)?.power,
    ).toBe(7000);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
